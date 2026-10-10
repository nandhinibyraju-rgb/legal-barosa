import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase';

/**
 * Call the secure serverless AI API endpoint.
 * Works both in local development (via Vite middleware) and on Vercel deployment.
 * Strictly sends authenticated Firebase user's ID token in Authorization header.
 */
export async function callAIApi({ 
  action = 'chat', 
  payload = {}, 
  messages = [], 
  currentCase = null, 
  caseProfile = null,
  document = null,
  language = 'en',
  timeoutMs = 30000,
  maxRetries = 2
}) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timerId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      // Build headers with authenticated Firebase bearer token
      const headers = {
        'Content-Type': 'application/json',
      };

      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          if (idToken) {
            headers['Authorization'] = `Bearer ${idToken}`;
          }
        } catch (tokenErr) {
          console.warn('[AI Service] Failed to retrieve fresh auth token:', tokenErr);
        }
      }

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          action,
          messages,
          caseProfile: caseProfile || currentCase,
          document,
          language,
          ...payload,
        }),
      });

      clearTimeout(timerId);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const status = res.status;
        if (attempt < maxRetries && (status === 429 || status === 503 || status === 504 || status === 502)) {
          await new Promise(r => setTimeout(r, 1200 * attempt));
          continue;
        }
        throw new Error(errJson.error || errJson.message || `AI Request Failed with status ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      clearTimeout(timerId);
      const isAbort = err.name === 'AbortError';
      lastError = isAbort ? new Error('Request timed out. Please try again.') : err;

      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1200 * attempt));
        continue;
      }
    }
  }

  console.error('[AI Service Error]:', lastError);
  throw lastError;
}

/**
 * ─────────────────────────────────────────────────────────────
 * STRICT PER-USER FIRESTORE AI CHAT STORAGE
 * Structure: users/{uid}/aiChats/{chatId}
 * Enforced by Firestore Security Rules:
 * request.auth != null && request.auth.uid == uid
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Helper to convert various Firestore timestamp / date formats to millisecond epoch
 */
function getTimestampEpoch(val) {
  if (!val) return 0;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val.toDate === 'function') return val.toDate().getTime();
  if (val.seconds) return val.seconds * 1000;
  if (typeof val === 'number') return val;
  const parsed = new Date(val).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Save or update an authenticated user's AI Chat.
 * Saves:
 * - chatId
 * - userId
 * - title
 * - messages
 * - case context
 * - createdAt
 * - updatedAt
 */
export async function saveAIChat({
  userId,
  chatId = null,
  title = '',
  messages = [],
  caseContext = null,
  caseProfile = null,
}) {
  const currentUid = auth.currentUser?.uid || userId;
  if (!currentUid) {
    throw new Error('Authentication is required to save an AI conversation.');
  }

  const effectiveChatId = chatId || 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  const chatRef = doc(db, 'users', currentUid, 'aiChats', effectiveChatId);

  const nowIso = new Date().toISOString();
  const contextData = caseContext || caseProfile || {};

  // Check if doc exists to preserve original createdAt
  let existingCreatedAt = null;
  try {
    const existingSnap = await getDoc(chatRef);
    if (existingSnap.exists()) {
      existingCreatedAt = existingSnap.data()?.createdAt;
    }
  } catch {
    // If not readable yet, proceed with new
  }

  const firestorePayload = {
    chatId: effectiveChatId,
    userId: currentUid,
    title: title || contextData.title || 'Legal Case Analysis',
    caseType: contextData.caseType || 'General Legal Case',
    messages: Array.isArray(messages) ? messages : [],
    caseContext: contextData,
    caseProfile: contextData, // dual-key for backward compatibility
    updatedAt: serverTimestamp(),
  };

  if (!existingCreatedAt) {
    firestorePayload.createdAt = serverTimestamp();
  }

  await setDoc(chatRef, firestorePayload, { merge: true });

  // Return clean in-memory representation with valid ISO dates for instant UI reactivity
  return {
    id: effectiveChatId,
    chatId: effectiveChatId,
    userId: currentUid,
    title: firestorePayload.title,
    caseType: firestorePayload.caseType,
    messages: firestorePayload.messages,
    caseContext: contextData,
    caseProfile: contextData,
    createdAt: existingCreatedAt ? existingCreatedAt : nowIso,
    updatedAt: nowIso,
  };
}

/**
 * Query recent chats for the authenticated user, sorted by updatedAt descending.
 * Strictly queries only users/{uid}/aiChats.
 */
export async function getUserAIChats(userId) {
  const currentUid = auth.currentUser?.uid || userId;
  if (!currentUid) return [];

  try {
    const chatsRef = collection(db, 'users', currentUid, 'aiChats');
    let snapshot;
    try {
      const q = query(chatsRef, orderBy('updatedAt', 'desc'), limit(50));
      snapshot = await getDocs(q);
    } catch (orderErr) {
      // If index is pending or missing single-field ordering, fallback to plain query
      console.warn('[AI Service] Order query fallback:', orderErr?.message || orderErr);
      snapshot = await getDocs(chatsRef);
    }

    let chats = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        chatId: data.chatId || docSnap.id,
        userId: data.userId || currentUid,
        title: data.title || data.caseProfile?.title || data.caseType || 'Legal Case Analysis',
        caseType: data.caseType || data.caseProfile?.caseType || 'General Legal Case',
        messages: Array.isArray(data.messages) ? data.messages : [],
        caseContext: data.caseContext || data.caseProfile || data,
        caseProfile: data.caseProfile || data.caseContext || data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });

    // If aiChats is empty, check legacy aiCases collection and migrate
    if (chats.length === 0) {
      try {
        const legacyRef = collection(db, 'users', currentUid, 'aiCases');
        const legacySnap = await getDocs(legacyRef);
        if (!legacySnap.empty) {
          chats = legacySnap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              chatId: d.id,
              userId: currentUid,
              title: data.title || 'Legal Case Analysis',
              caseType: data.caseType || 'General Legal Case',
              messages: Array.isArray(data.messages) ? data.messages : [],
              caseContext: data,
              caseProfile: data,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
          });
        }
      } catch {
        // legacy check optional
      }
    }

    // Sort strictly in memory by updatedAt descending
    chats.sort((a, b) => {
      const timeB = getTimestampEpoch(b.updatedAt || b.createdAt);
      const timeA = getTimestampEpoch(a.updatedAt || a.createdAt);
      return timeB - timeA;
    });

    return chats;
  } catch (error) {
    console.error('[AI Service] Failed to fetch user chats:', error);
    return [];
  }
}

/**
 * Get a specific chat by ID
 */
export async function getAIChatById(userId, chatId) {
  const currentUid = auth.currentUser?.uid || userId;
  if (!currentUid || !chatId) return null;

  try {
    const chatRef = doc(db, 'users', currentUid, 'aiChats', chatId);
    const snap = await getDoc(chatRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }

    // Legacy fallback check
    const legacyRef = doc(db, 'users', currentUid, 'aiCases', chatId);
    const legacySnap = await getDoc(legacyRef);
    if (legacySnap.exists()) {
      return { id: legacySnap.id, ...legacySnap.data() };
    }
  } catch (err) {
    console.warn('[AI Service] Error loading chat:', err);
  }
  return null;
}

/**
 * Delete a specific chat by ID
 */
export async function deleteAIChat(userId, chatId) {
  const currentUid = auth.currentUser?.uid || userId;
  if (!currentUid || !chatId) return;

  try {
    const chatRef = doc(db, 'users', currentUid, 'aiChats', chatId);
    await deleteDoc(chatRef);

    // Also remove from legacy aiCases if present
    const legacyRef = doc(db, 'users', currentUid, 'aiCases', chatId);
    await deleteDoc(legacyRef).catch(() => {});
  } catch (err) {
    console.warn('[AI Service] Could not delete chat:', err);
    throw err;
  }
}

// ============================================================================
// BACKWARD-COMPATIBLE ALIASES FOR EXISTING COMPONENTS
// ============================================================================

export async function createAICase(userId, initialData = {}) {
  return saveAIChat({
    userId,
    chatId: initialData.caseId || null,
    title: initialData.title,
    messages: initialData.messages || [],
    caseContext: initialData,
    caseProfile: initialData,
  });
}

export async function getUserAICases(userId) {
  return getUserAIChats(userId);
}

export async function getAICaseById(userId, caseId) {
  return getAIChatById(userId, caseId);
}

export async function updateAICaseData(userId, caseId, updates = {}) {
  const currentUid = auth.currentUser?.uid || userId;
  if (!currentUid || !caseId) return;

  const chatRef = doc(db, 'users', currentUid, 'aiChats', caseId);
  await updateDoc(chatRef, {
    caseContext: updates,
    caseProfile: updates,
    ...(updates.title ? { title: updates.title } : {}),
    ...(updates.caseType ? { caseType: updates.caseType } : {}),
    updatedAt: serverTimestamp(),
  }).catch(async () => {
    // If not found in aiChats, try aiCases
    const legacyRef = doc(db, 'users', currentUid, 'aiCases', caseId);
    await updateDoc(legacyRef, { ...updates, updatedAt: serverTimestamp() }).catch(() => {});
  });
}

export async function deleteAICase(userId, caseId) {
  return deleteAIChat(userId, caseId);
}

export async function saveAICaseMessage(userId, caseId, message) {
  const currentUid = auth.currentUser?.uid || userId;
  if (!currentUid || !caseId) return null;

  try {
    // Append to messages subcollection for audit trail
    const messagesRef = collection(db, 'users', currentUid, 'aiChats', caseId, 'messages');
    const docRef = await addDoc(messagesRef, {
      ...message,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch {
    return null;
  }
}

export async function getAICaseMessages(userId, caseId) {
  const currentUid = auth.currentUser?.uid || userId;
  if (!currentUid || !caseId) return [];

  try {
    // First check chat doc itself
    const chat = await getAIChatById(currentUid, caseId);
    if (chat?.messages && chat.messages.length > 0) {
      return chat.messages;
    }

    // Fallback to subcollection
    const messagesRef = collection(db, 'users', currentUid, 'aiChats', caseId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn('[AI Service] Failed to load messages:', err);
  }
  return [];
}

export async function saveAICaseDocument(userId, caseId, docMeta) {
  const currentUid = auth.currentUser?.uid || userId;
  if (!currentUid || !caseId) return null;
  const docsRef = collection(db, 'users', currentUid, 'aiChats', caseId, 'documents');
  const docRef = await addDoc(docsRef, {
    ...docMeta,
    uploadedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Guest Session Persistence Helpers (stores in sessionStorage so guest queries are never lost)
 */
const GUEST_STORAGE_KEY = 'lb_ai_guest_session';

export function getGuestAISession() {
  try {
    const raw = sessionStorage.getItem(GUEST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveGuestAISession(sessionData) {
  try {
    sessionStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(sessionData));
  } catch (e) {
    console.warn('[AI Service] Failed to save guest session:', e);
  }
}

export function clearGuestAISession() {
  try {
    sessionStorage.removeItem(GUEST_STORAGE_KEY);
  } catch {}
}
