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
import { db } from '../firebase';

/**
 * Call the secure serverless AI API endpoint.
 * Works both in local development (via Vite middleware) and on Vercel deployment.
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
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
 * FIRESTORE AI CASE OPERATIONS
 * Path: users/{userId}/aiCases/{caseId}
 * ─────────────────────────────────────────────────────────────
 */

export async function createAICase(userId, initialData = {}) {
  if (!userId) throw new Error('User ID is required to create a persistent case.');
  
  const casesRef = collection(db, 'users', userId, 'aiCases');
  const newCaseDoc = doc(casesRef);
  
  const casePayload = {
    caseId: newCaseDoc.id,
    userId,
    title: initialData.title || 'Legal Case Analysis',
    caseType: initialData.caseType || 'General Legal Enquiry',
    caseSubType: initialData.caseSubType || '',
    stage: initialData.stage || 'Intake / Initial Assessment',
    urgency: initialData.urgency || 'Normal',
    summary: initialData.summary || '',
    facts: initialData.facts || [],
    missingInformation: initialData.missingInformation || [],
    importantDates: initialData.importantDates || [],
    documents: initialData.documents || [],
    concerns: initialData.concerns || [],
    possibleOptions: initialData.possibleOptions || [],
    recommendedNextStep: initialData.recommendedNextStep || '',
    expertEscalation: initialData.expertEscalation || false,
    actionPlan: initialData.actionPlan || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(newCaseDoc, casePayload);
  return { id: newCaseDoc.id, ...casePayload };
}

export async function getUserAICases(userId) {
  if (!userId) return [];
  try {
    const casesRef = collection(db, 'users', userId, 'aiCases');
    const q = query(casesRef, orderBy('updatedAt', 'desc'), limit(25));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('[AI Service] Failed to fetch user cases:', error);
    return [];
  }
}

export async function getAICaseById(userId, caseId) {
  if (!userId || !caseId) return null;
  const docRef = doc(db, 'users', userId, 'aiCases', caseId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function updateAICaseData(userId, caseId, updates = {}) {
  if (!userId || !caseId) return;
  const docRef = doc(db, 'users', userId, 'aiCases', caseId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAICase(userId, caseId) {
  if (!userId || !caseId) return;
  const docRef = doc(db, 'users', userId, 'aiCases', caseId);
  await deleteDoc(docRef);
}

/**
 * Message storage for audit trail & conversation persistence
 */
export async function saveAICaseMessage(userId, caseId, message) {
  if (!userId || !caseId) return null;
  const messagesRef = collection(db, 'users', userId, 'aiCases', caseId, 'messages');
  const docRef = await addDoc(messagesRef, {
    ...message,
    timestamp: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAICaseMessages(userId, caseId) {
  if (!userId || !caseId) return [];
  try {
    const messagesRef = collection(db, 'users', userId, 'aiCases', caseId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn('[AI Service] Failed to load messages:', err);
    return [];
  }
}

/**
 * Document record metadata storage
 */
export async function saveAICaseDocument(userId, caseId, docMeta) {
  if (!userId || !caseId) return null;
  const docsRef = collection(db, 'users', userId, 'aiCases', caseId, 'documents');
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
// Final submission update
