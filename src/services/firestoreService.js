import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot, 
  serverTimestamp, 
  arrayUnion,
  arrayRemove,
  increment,
  getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

/**
 * ─────────────────────────────────────────────────────────────
 * 0. LEADS COLLECTION (Public Consultation Inquiries)
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Save lead submission to Firestore `leads` collection.
 * Captures: name, phone, service, message, source, status, createdAt, whatsappSent
 */
export async function saveLead({
  name,
  phone,
  service,
  message = '',
  source = 'consultation_page',
  status = 'new',
  whatsappSent = true,
  userId = null,
}) {
  if (!name || !phone || !service) {
    throw new Error('Name, phone, and service are required fields.');
  }

  const leadData = {
    name: name.trim(),
    phone: phone.trim(),
    service: service.trim(),
    message: (message || '').trim(),
    source: source || 'consultation_page',
    status: status || 'new',
    createdAt: serverTimestamp(),
    whatsappSent: Boolean(whatsappSent),
  };

  if (userId) {
    leadData.userId = userId;
  }

  console.log('[Firestore] Saving lead document to "leads" collection:', leadData);
  const docRef = await addDoc(collection(db, 'leads'), leadData);
  console.log('[Firestore] Lead document created with ID:', docRef.id);
  return { id: docRef.id, ...leadData };
}

/**
 * Listen to all leads (for Admin Panel / Console sync)
 */
export function subscribeAllLeads(callback) {
  const leadsRef = collection(db, 'leads');
  return onSnapshot(
    leadsRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
      callback(list);
    },
    (error) => {
      console.error('[Firestore] Error subscribing to leads:', error);
      callback([]);
    }
  );
}

/**
 * ─────────────────────────────────────────────────────────────
 * 1. USERS COLLECTION (Profile data & Roles)
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Synchronize authenticated user profile to Firestore `users` collection.
 * Creates document with role: 'client' if new.
 * If already exists, preserves existing role (so manually assigned 'admin' is never overwritten).
 */
export async function syncUserProfile(user, additionalData = {}) {
  if (!user || !user.uid) return null;

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUserData = {
        uid: user.uid,
        name: additionalData.name || user.displayName || user.email?.split('@')[0] || 'Client',
        email: user.email || '',
        phone: additionalData.phone || user.phoneNumber || '',
        role: 'client', // Default role
        createdAt: serverTimestamp(),
      };
      await setDoc(userRef, newUserData);
      return newUserData;
    } else {
      const existingData = userSnap.data();
      // Only patch name/phone if missing
      const updates = {};
      if (!existingData.name && (additionalData.name || user.displayName)) {
        updates.name = additionalData.name || user.displayName;
      }
      if (!existingData.phone && (additionalData.phone || user.phoneNumber)) {
        updates.phone = additionalData.phone || user.phoneNumber;
      }
      if (Object.keys(updates).length > 0) {
        await updateDoc(userRef, updates);
      }
      return { ...existingData, ...updates };
    }
  } catch (error) {
    console.error('Error syncing user profile to Firestore:', error);
    return null;
  }
}

/**
 * Listen to real-time changes on the current user's profile (including role changes)
 */
export function subscribeUserProfile(uid, callback) {
  if (!uid) {
    console.warn('[Firestore] subscribeUserProfile called with empty uid');
    return () => {};
  }
  const userRef = doc(db, 'users', uid);
  console.log(`[Firestore] Subscribing to collection "users" at document path: "users/${uid}"`);
  return onSnapshot(
    userRef,
    (snapshot) => {
      const exists = snapshot.exists();
      const data = exists ? snapshot.data() : null;
      console.log(`[Firestore] Snapshot for "users/${uid}":`, {
        exists,
        role: data?.role,
        documentId: snapshot.id,
        rawFields: data,
      });
      if (exists) {
        callback({ id: snapshot.id, ...data });
      } else {
        console.warn(`[Firestore] Document "users/${uid}" does not exist in Firestore!`);
        callback(null);
      }
    },
    (error) => {
      console.error(`[Firestore] Error subscribing to "users/${uid}":`, error.code, error.message, error);
      callback(null);
    }
  );
}

/**
 * Update user's personal profile data in Firestore `users/{uid}`
 * Preserves system fields: role, uid, createdAt are never overwritten by client
 */
export async function updateUserProfile(uid, profileData) {
  if (!uid) throw new Error('User ID is required');

  const userRef = doc(db, 'users', uid);
  
  // Clean safe fields
  const safeData = {};
  if (profileData.name !== undefined) safeData.name = String(profileData.name).trim();
  if (profileData.phone !== undefined) safeData.phone = String(profileData.phone).trim();
  if (profileData.photoURL !== undefined) safeData.photoURL = profileData.photoURL;
  if (profileData.city !== undefined) safeData.city = String(profileData.city).trim();
  if (profileData.state !== undefined) safeData.state = String(profileData.state).trim();
  if (profileData.preferredLanguage !== undefined) safeData.preferredLanguage = profileData.preferredLanguage;
  if (profileData.communicationPreference !== undefined) safeData.communicationPreference = profileData.communicationPreference;
  if (profileData.dateOfBirth !== undefined) safeData.dateOfBirth = profileData.dateOfBirth;

  safeData.updatedAt = serverTimestamp();

  // Use setDoc with merge to ensure doc exists and updates seamlessly
  await setDoc(userRef, safeData, { merge: true });
  return safeData;
}

/**
 * Upload user profile picture to Firebase Storage
 */
export async function uploadUserProfilePhoto(userId, file) {
  if (!userId) throw new Error('User ID required');
  if (!file) throw new Error('No image file provided');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image exceeds 5MB size limit');

  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const storagePath = `profile-photos/${userId}/avatar_${timestamp}.${fileExt}`;
  const fileRef = ref(storage, storagePath);

  const snapshot = await uploadBytes(fileRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);

  return {
    success: true,
    url: downloadUrl,
    path: storagePath,
  };
}

/**
 * Delete or deactivate the authenticated user's profile document
 */
export async function deleteUserProfileDoc(uid) {
  if (!uid) throw new Error('User ID is required');
  const userRef = doc(db, 'users', uid);
  try {
    await deleteDoc(userRef);
  } catch (err) {
    console.warn('[Firestore] Hard delete of user doc failed, soft deleting:', err);
    await updateDoc(userRef, {
      status: 'deactivated',
      deletedAt: serverTimestamp(),
    });
  }
}

/**
 * Listen to consultation requests submitted by this user
 */
export function subscribeUserConsultations(userId, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'consultations'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
      callback(list);
    },
    (err) => {
      console.warn('[Firestore] Error subscribing to user consultations:', err);
      callback([]);
    }
  );
}

/**
 * Listen to articles authored by this user
 */
export function subscribeUserArticles(userId, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'articles'), where('authorId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
      callback(list);
    },
    (err) => {
      console.warn('[Firestore] Error subscribing to user articles:', err);
      callback([]);
    }
  );
}

/**
 * Listen to articles bookmarked by this user
 */
export function subscribeUserBookmarks(userId, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'articles'), where('bookmarks', 'array-contains', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
      callback(list);
    },
    (err) => {
      console.warn('[Firestore] Error subscribing to user bookmarks:', err);
      callback([]);
    }
  );
}

/**
 * Get all registered clients (for Admin Panel)
 */
export function subscribeAllClients(callback) {
  const usersRef = collection(db, 'users');
  return onSnapshot(
    usersRef,
    (snapshot) => {
      const clients = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback(clients);
    },
    (error) => {
      console.error('Error fetching all clients for admin:', error);
      callback([]);
    }
  );
}

/**
 * ─────────────────────────────────────────────────────────────
 * 2. CONSULTATIONS COLLECTION
 * ─────────────────────────────────────────────────────────────
 */

export const PROBLEM_CATEGORIES = [
  { value: 'Harassment', label: 'Harassment — Recovery Agent & RBI Violations' },
  { value: 'Settlement', label: 'Settlement — One-Time Settlement (OTS) & Waivers' },
  { value: 'LegalNotice', label: 'Legal Notice — Court Summons & Advocate Replies' },
  { value: 'NPA', label: 'NPA — Commercial & Secured Loan Restructuring' },
  { value: 'Business', label: 'Business — MSME Debt & Cheque Bounce (Sec 138)' },
  { value: 'CreditRecovery', label: 'Credit Recovery — CIBIL Dispute & Record Cleanse' },
  { value: 'Other', label: 'Other — General Legal Dispute / Consultation' },
];

/**
 * Submit consultation request (Public lead capture)
 */
export async function submitConsultation({ name, email = '', phone, problemCategory, message, userId = null }) {
  if (!name || !phone || !problemCategory) {
    throw new Error('Please fill in all required fields.');
  }

  const consultationData = {
    name: name.trim(),
    email: (email || '').trim().toLowerCase(),
    phone: phone.trim(),
    problemCategory,
    message: (message || '').trim(),
    status: 'new', // default status
    createdAt: serverTimestamp(),
    userId: userId || null,
  };

  console.log('[Firestore] Adding document to "consultations" collection:', consultationData);
  const docRef = await addDoc(collection(db, 'consultations'), consultationData);
  console.log('[Firestore] Consultation document created with ID:', docRef.id);
  return { id: docRef.id, ...consultationData };
}

/**
 * Listen to all consultations (for Admin Panel)
 */
export function subscribeAllConsultations(callback) {
  const consultRef = collection(db, 'consultations');
  return onSnapshot(
    consultRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      // Sort newest first by createdAt
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
      callback(list);
    },
    (error) => {
      console.error('Error subscribing to consultations:', error);
      callback([]);
    }
  );
}

/**
 * Update consultation status (Admin only)
 * status: "new" | "contacted" | "in-progress" | "resolved"
 */
export async function updateConsultationStatus(consultationId, newStatus) {
  const consultRef = doc(db, 'consultations', consultationId);
  await updateDoc(consultRef, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
}

/**
 * ─────────────────────────────────────────────────────────────
 * 3. CASES COLLECTION (Case records linked to a client)
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Listen to cases belonging to a specific client
 */
export function subscribeUserCases(userId, callback) {
  if (!userId) return () => {};
  const casesRef = collection(db, 'cases');
  const q = query(casesRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const casesList = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      // Sort newest updated or created first
      casesList.sort((a, b) => {
        const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0);
        const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0);
        return timeB - timeA;
      });
      callback(casesList);
    },
    (error) => {
      console.error('Error subscribing to user cases:', error);
      callback([]);
    }
  );
}

/**
 * Listen to all cases across all clients (Admin Panel)
 */
export function subscribeAllCases(callback) {
  const casesRef = collection(db, 'cases');
  return onSnapshot(
    casesRef,
    (snapshot) => {
      const casesList = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      casesList.sort((a, b) => {
        const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0);
        const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0);
        return timeB - timeA;
      });
      callback(casesList);
    },
    (error) => {
      console.error('Error subscribing to all cases:', error);
      callback([]);
    }
  );
}

/**
 * Create a new case linked to a client (Admin or Client init)
 */
export async function createCase({ userId, caseType, status = 'Under Review', initialNote = 'Case initiated and assigned for legal review.' }) {
  if (!userId || !caseType) {
    throw new Error('userId and caseType are required to create a case.');
  }

  const initialTimeline = [
    {
      date: new Date().toISOString(),
      note: initialNote,
      status: status,
    },
  ];

  const caseData = {
    userId,
    caseType,
    status, // "Under Review" | "In Progress" | "Resolved"
    timeline: initialTimeline,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'cases'), caseData);
  return { id: docRef.id, ...caseData };
}

/**
 * Update case status and add an optional timeline note
 */
export async function updateCaseStatus(caseId, newStatus, note = '') {
  const caseRef = doc(db, 'cases', caseId);
  const updates = {
    status: newStatus,
    updatedAt: serverTimestamp(),
  };

  if (note && note.trim()) {
    updates.timeline = arrayUnion({
      date: new Date().toISOString(),
      note: note.trim(),
      status: newStatus,
    });
  }

  await updateDoc(caseRef, updates);
}

/**
 * Add a timeline event to an existing case
 */
export async function addCaseTimelineEntry(caseId, { note, status, date }) {
  if (!note) throw new Error('Note is required for timeline entry.');
  const caseRef = doc(db, 'cases', caseId);

  const entry = {
    date: date || new Date().toISOString(),
    note: note.trim(),
    status: status || 'In Progress',
  };

  await updateDoc(caseRef, {
    timeline: arrayUnion(entry),
    status: status || undefined,
    updatedAt: serverTimestamp(),
  });
}

/**
 * ─────────────────────────────────────────────────────────────
 * 4. MESSAGES COLLECTION (Message thread per case)
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Listen to messages for a specific case
 */
export function subscribeCaseMessages(caseId, callback) {
  if (!caseId) return () => {};
  const msgRef = collection(db, 'messages');
  const q = query(msgRef, where('caseId', '==', caseId));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      // Sort chronologically ascending
      messages.sort((a, b) => {
        const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : (a.timestamp?.seconds ? a.timestamp.seconds * 1000 : 0);
        const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : (b.timestamp?.seconds ? b.timestamp.seconds * 1000 : 0);
        return timeA - timeB;
      });
      callback(messages);
    },
    (error) => {
      console.error('Error subscribing to case messages:', error);
      callback([]);
    }
  );
}

/**
 * Send a message within a case thread
 */
export async function sendMessage({ caseId, senderId, senderRole = 'client', text }) {
  if (!caseId || !senderId || !text || !text.trim()) {
    throw new Error('Missing required message parameters.');
  }

  const msgData = {
    caseId,
    senderId,
    senderRole, // "client" | "admin"
    text: text.trim(),
    timestamp: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'messages'), msgData);

  // Update case `updatedAt`
  try {
    const caseRef = doc(db, 'cases', caseId);
    await updateDoc(caseRef, { updatedAt: serverTimestamp() });
  } catch (err) {
    console.warn('Could not update case updatedAt timestamp:', err);
  }

  return { id: docRef.id, ...msgData };
}

/**
 * ─────────────────────────────────────────────────────────────
 * 5. ARTICLES & COMMUNITY COLLECTION
 * ─────────────────────────────────────────────────────────────
 */

export const ARTICLE_CATEGORIES = [
  'EMI & Loans',
  'Debt Management',
  'Legal Support',
  'Anti-Harassment',
  'Property',
  'NPA & Secured Loans',
  'Credit Recovery',
  'Business / MSME',
  'General Legal Awareness',
];

/**
 * Estimate reading time in minutes based on word count
 */
export function calculateReadingTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Generate a URL-friendly slug
 */
export function generateSlug(title = '') {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Local cache helpers for resilient offline & development operation
 */
const LOCAL_ARTICLES_KEY = 'lb_community_articles';
const LOCAL_COMMENTS_KEY = 'lb_community_comments';
const LOCAL_REPORTS_KEY = 'lb_community_reports';

function getLocalArticles() {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_ARTICLES_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalArticles(list) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('lb_articles_updated'));
    }
  } catch (e) {
    console.warn('Could not save local articles:', e);
  }
}

function getLocalComments() {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_COMMENTS_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalComments(list) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('lb_comments_updated'));
    }
  } catch (e) {
    console.warn('Could not save local comments:', e);
  }
}

/**
 * Create a new article (published or draft)
 */
export async function createArticle({
  title,
  category,
  content,
  excerpt = '',
  coverImage = '',
  tags = [],
  authorId,
  authorName = 'LegalBharosa Member',
  authorEmail = '',
  authorPhoto = '',
  status = 'published',
}) {
  if (!title || !title.trim()) throw new Error('Article title is required.');
  if (!content || !content.trim()) throw new Error('Article content is required.');
  if (!category) throw new Error('Article category is required.');
  if (!authorId) throw new Error('User authentication is required to post an article.');

  const cleanContent = content.trim();
  const cleanTitle = title.trim();
  const autoExcerpt = excerpt.trim() || cleanContent.slice(0, 180) + (cleanContent.length > 180 ? '...' : '');

  const articleData = {
    title: cleanTitle,
    slug: generateSlug(cleanTitle),
    category,
    content: cleanContent,
    excerpt: autoExcerpt,
    coverImage: coverImage.trim() || null,
    tags: Array.isArray(tags) ? tags.map((t) => t.trim().toLowerCase()).filter(Boolean) : [],
    authorId,
    authorName: authorName.trim() || 'Community Contributor',
    authorEmail: authorEmail || '',
    authorPhoto: authorPhoto || null,
    status: status === 'draft' ? 'draft' : 'published',
    views: 0,
    likes: [],
    bookmarks: [],
    commentsCount: 0,
    readingTime: calculateReadingTime(cleanContent),
  };

  try {
    const docRef = await addDoc(collection(db, 'articles'), {
      ...articleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...articleData };
  } catch (firestoreErr) {
    console.warn('[Firestore] Falling back to local storage for article:', firestoreErr);
    const localId = 'art_' + Date.now();
    const fallbackArticle = {
      id: localId,
      ...articleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const current = getLocalArticles();
    saveLocalArticles([fallbackArticle, ...current]);
    return fallbackArticle;
  }
}

/**
 * Update an existing article
 */
export async function updateArticle(articleId, updates) {
  if (!articleId) throw new Error('Article ID is required');

  const cleanUpdates = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (updates.title) {
    cleanUpdates.title = updates.title.trim();
    cleanUpdates.slug = generateSlug(cleanUpdates.title);
  }
  if (updates.content) {
    cleanUpdates.content = updates.content.trim();
    cleanUpdates.readingTime = calculateReadingTime(cleanUpdates.content);
    if (!updates.excerpt) {
      cleanUpdates.excerpt = cleanUpdates.content.slice(0, 180) + (cleanUpdates.content.length > 180 ? '...' : '');
    }
  }

  // Also update local cache
  const localList = getLocalArticles();
  const idx = localList.findIndex((a) => a.id === articleId);
  if (idx !== -1) {
    localList[idx] = { ...localList[idx], ...cleanUpdates };
    saveLocalArticles(localList);
  }

  try {
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, {
      ...cleanUpdates,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[Firestore] updateDoc fallback:', err);
  }

  return { id: articleId, ...cleanUpdates };
}

/**
 * Delete an article
 */
export async function deleteArticle(articleId) {
  if (!articleId) throw new Error('Article ID is required');

  const localList = getLocalArticles();
  saveLocalArticles(localList.filter((a) => a.id !== articleId));

  try {
    const articleRef = doc(db, 'articles', articleId);
    await deleteDoc(articleRef);
  } catch (err) {
    console.warn('[Firestore] deleteDoc fallback:', err);
  }

  return true;
}

/**
 * Get a single article by ID
 */
export async function getArticle(articleId) {
  if (!articleId) return null;

  try {
    const articleRef = doc(db, 'articles', articleId);
    const snap = await getDoc(articleRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn('[Firestore] getArticle fallback:', err);
  }

  // Fallback to local storage
  const found = getLocalArticles().find((a) => a.id === articleId);
  return found || null;
}

/**
 * Real-time subscription to published articles
 */
export function subscribeArticles(callback) {
  const articlesRef = collection(db, 'articles');
  let firestoreArticles = [];

  const notify = () => {
    const local = getLocalArticles().filter((a) => a.status === 'published');
    const map = new Map();
    // Prioritize firestore
    firestoreArticles.forEach((a) => map.set(a.id, a));
    // Merge local
    local.forEach((a) => {
      if (!map.has(a.id)) map.set(a.id, a);
    });

    const combined = Array.from(map.values());
    combined.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime());
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime());
      return timeB - timeA;
    });

    callback(combined);
  };

  const handleLocalUpdate = () => notify();
  if (typeof window !== 'undefined') {
    window.addEventListener('lb_articles_updated', handleLocalUpdate);
  }

  // Immediately notify with initial local if any
  notify();

  let unsubFirestore = () => {};
  try {
    unsubFirestore = onSnapshot(
      articlesRef,
      (snapshot) => {
        firestoreArticles = snapshot.docs
          .map((d) => ({
            id: d.id,
            ...d.data(),
          }))
          .filter((a) => a.status === 'published');
        notify();
      },
      (error) => {
        console.warn('[Firestore] Error subscribing to articles, serving local:', error);
        notify();
      }
    );
  } catch (err) {
    console.warn('[Firestore] onSnapshot failed, serving local:', err);
    notify();
  }

  return () => {
    unsubFirestore();
    if (typeof window !== 'undefined') {
      window.removeEventListener('lb_articles_updated', handleLocalUpdate);
    }
  };
}

/**
 * Real-time subscription to user drafts
 */
export function subscribeUserDrafts(userId, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }
  const articlesRef = collection(db, 'articles');
  const q = query(articlesRef, where('authorId', '==', userId), where('status', '==', 'draft'));

  return onSnapshot(
    q,
    (snapshot) => {
      const drafts = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(drafts);
    },
    (error) => {
      console.warn('[Firestore] Error subscribing to drafts:', error);
      callback([]);
    }
  );
}

/**
 * Atomically increment views count on an article
 */
export async function incrementArticleViews(articleId) {
  if (!articleId) return;

  // Local fallback
  const localList = getLocalArticles();
  const idx = localList.findIndex((a) => a.id === articleId);
  if (idx !== -1) {
    localList[idx].views = (localList[idx].views || 0) + 1;
    saveLocalArticles(localList);
  }

  try {
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, {
      views: increment(1),
    });
  } catch (err) {
    console.warn('[Firestore] Could not increment article views:', err);
  }
}

/**
 * Toggle like/unlike on an article
 */
export async function toggleArticleLike(articleId, userId) {
  if (!articleId || !userId) throw new Error('Missing articleId or userId');

  // Local update
  const localList = getLocalArticles();
  const idx = localList.findIndex((a) => a.id === articleId);
  let localResult = { liked: true, likesCount: 1 };
  if (idx !== -1) {
    const currentLikes = localList[idx].likes || [];
    const hasLiked = currentLikes.includes(userId);
    if (hasLiked) {
      localList[idx].likes = currentLikes.filter((id) => id !== userId);
      localResult = { liked: false, likesCount: localList[idx].likes.length };
    } else {
      localList[idx].likes = [...currentLikes, userId];
      localResult = { liked: true, likesCount: localList[idx].likes.length };
    }
    saveLocalArticles(localList);
  }

  try {
    const articleRef = doc(db, 'articles', articleId);
    const snap = await getDoc(articleRef);
    if (snap.exists()) {
      const currentLikes = snap.data().likes || [];
      const hasLiked = currentLikes.includes(userId);
      if (hasLiked) {
        await updateDoc(articleRef, {
          likes: arrayRemove(userId),
        });
        return { liked: false, likesCount: Math.max(0, currentLikes.length - 1) };
      } else {
        await updateDoc(articleRef, {
          likes: arrayUnion(userId),
        });
        return { liked: true, likesCount: currentLikes.length + 1 };
      }
    }
  } catch (err) {
    console.warn('[Firestore] toggleArticleLike fallback:', err);
  }

  return localResult;
}

/**
 * Toggle bookmark/unbookmark on an article
 */
export async function toggleArticleBookmark(articleId, userId) {
  if (!articleId || !userId) throw new Error('Missing articleId or userId');

  // Local update
  const localList = getLocalArticles();
  const idx = localList.findIndex((a) => a.id === articleId);
  let localResult = { bookmarked: true };
  if (idx !== -1) {
    const currentBookmarks = localList[idx].bookmarks || [];
    const isBookmarked = currentBookmarks.includes(userId);
    if (isBookmarked) {
      localList[idx].bookmarks = currentBookmarks.filter((id) => id !== userId);
      localResult = { bookmarked: false };
    } else {
      localList[idx].bookmarks = [...currentBookmarks, userId];
      localResult = { bookmarked: true };
    }
    saveLocalArticles(localList);
  }

  try {
    const articleRef = doc(db, 'articles', articleId);
    const snap = await getDoc(articleRef);
    if (snap.exists()) {
      const currentBookmarks = snap.data().bookmarks || [];
      const isBookmarked = currentBookmarks.includes(userId);
      if (isBookmarked) {
        await updateDoc(articleRef, {
          bookmarks: arrayRemove(userId),
        });
        return { bookmarked: false };
      } else {
        await updateDoc(articleRef, {
          bookmarks: arrayUnion(userId),
        });
        return { bookmarked: true };
      }
    }
  } catch (err) {
    console.warn('[Firestore] toggleArticleBookmark fallback:', err);
  }

  return localResult;
}

/**
 * Subscribe to comments for a specific article
 */
export function subscribeArticleComments(articleId, callback) {
  if (!articleId) {
    callback([]);
    return () => {};
  }
  const commentsRef = collection(db, 'articleComments');
  const q = query(commentsRef, where('articleId', '==', articleId));
  let firestoreComments = [];

  const notify = () => {
    const local = getLocalComments().filter((c) => c.articleId === articleId);
    const map = new Map();
    firestoreComments.forEach((c) => map.set(c.id, c));
    local.forEach((c) => {
      if (!map.has(c.id)) map.set(c.id, c);
    });
    const combined = Array.from(map.values());
    combined.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime());
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime());
      return timeA - timeB;
    });
    callback(combined);
  };

  const handleUpdate = () => notify();
  if (typeof window !== 'undefined') {
    window.addEventListener('lb_comments_updated', handleUpdate);
  }

  notify();

  let unsub = () => {};
  try {
    unsub = onSnapshot(
      q,
      (snapshot) => {
        firestoreComments = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        notify();
      },
      (error) => {
        console.warn('[Firestore] Error subscribing to article comments:', error);
        notify();
      }
    );
  } catch (err) {
    console.warn('[Firestore] Comments onSnapshot failed:', err);
    notify();
  }

  return () => {
    unsub();
    if (typeof window !== 'undefined') {
      window.removeEventListener('lb_comments_updated', handleUpdate);
    }
  };
}

/**
 * Add a comment to an article
 */
export async function addArticleComment({
  articleId,
  authorId,
  authorName = 'Community Member',
  authorPhoto = null,
  content,
}) {
  if (!articleId || !authorId || !content || !content.trim()) {
    throw new Error('All comment fields are required.');
  }

  const commentData = {
    articleId,
    authorId,
    authorName: authorName.trim(),
    authorPhoto: authorPhoto || null,
    content: content.trim(),
  };

  // Local save
  const localId = 'comment_' + Date.now();
  const localComment = {
    id: localId,
    ...commentData,
    createdAt: new Date().toISOString(),
  };
  saveLocalComments([...getLocalComments(), localComment]);

  // Increment local article comments count
  const localList = getLocalArticles();
  const idx = localList.findIndex((a) => a.id === articleId);
  if (idx !== -1) {
    localList[idx].commentsCount = (localList[idx].commentsCount || 0) + 1;
    saveLocalArticles(localList);
  }

  try {
    const docRef = await addDoc(collection(db, 'articleComments'), {
      ...commentData,
      createdAt: serverTimestamp(),
    });
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, {
      commentsCount: increment(1),
    });
    return { id: docRef.id, ...commentData };
  } catch (err) {
    console.warn('[Firestore] Failed to post comment to Firestore, using local fallback:', err);
    return localComment;
  }
}

/**
 * Delete a comment
 */
export async function deleteArticleComment(commentId, articleId) {
  if (!commentId) throw new Error('Comment ID required');

  const localComments = getLocalComments();
  saveLocalComments(localComments.filter((c) => c.id !== commentId));

  if (articleId) {
    const localArticles = getLocalArticles();
    const idx = localArticles.findIndex((a) => a.id === articleId);
    if (idx !== -1) {
      localArticles[idx].commentsCount = Math.max(0, (localArticles[idx].commentsCount || 1) - 1);
      saveLocalArticles(localArticles);
    }
  }

  try {
    const commentRef = doc(db, 'articleComments', commentId);
    await deleteDoc(commentRef);
    if (articleId) {
      const articleRef = doc(db, 'articles', articleId);
      await updateDoc(articleRef, {
        commentsCount: increment(-1),
      });
    }
  } catch (err) {
    console.warn('[Firestore] deleteComment fallback:', err);
  }

  return true;
}

/**
 * Report an article or comment for moderation review
 */
export async function reportContent({
  targetType = 'article', // 'article' | 'comment'
  targetId,
  articleId,
  reportedBy = 'anonymous',
  reason,
  details = '',
}) {
  if (!targetId || !reason) throw new Error('Target ID and reason are required.');

  const reportData = {
    targetType,
    targetId,
    articleId: articleId || targetId,
    reportedBy,
    reason,
    details: details.trim(),
    status: 'pending', // 'pending' | 'reviewed' | 'dismissed'
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'reports'), reportData);
  return { id: docRef.id, ...reportData };
}

/**
 * Get count of published articles authored by a user
 */
export async function getUserArticlesCount(userId) {
  if (!userId) return 0;
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, where('authorId', '==', userId), where('status', '==', 'published'));
    const snap = await getDocs(q);
    return snap.size;
  } catch (err) {
    console.warn('[Firestore] Error fetching user articles count:', err);
    return 0;
  }
}

/**
 * ─────────────────────────────────────────────────────────────
 * 8. WEBSITE SETTINGS (Home Page Content, Contact, Booking)
 * ─────────────────────────────────────────────────────────────
 */

export const DEFAULT_HOMEPAGE_SETTINGS = {
  heroBadge: 'DIRECT CASE RESOLUTION • EVIDENCE RECORDING',
  heroHeadline: 'Stop Illegal Recovery Harassment & Resolve Overdue Loans',
  heroSubtitle: 'LegalBharosa connects distressed borrowers with qualified legal counsel and advocate networks for statutory notice replies, RBI fair-practice complaint filings, and structured dispute advisory.',
  heroPrimaryBtnText: 'Consult an Advocate',
  heroSecondaryBtnText: 'Explore Legal Services',
  videoSectionBadge: 'PRACTICAL BORROWER ADVISORY • STEP-BY-STEP GUIDANCE',
  videoSectionTitle: 'REAL DEFENSE. GENUINE RELIEF.',
  videoSectionSubtitle: 'Practical, step-by-step guidance to help you navigate loan notices, understand recovery protocols, and access qualified advocate support.',
  guidanceCards: [
    {
      id: 'situation',
      title: 'Understand Your Situation',
      description: 'Learn what your loan notice, repayment status, or recovery communication may mean and identify the information you need to review.'
    },
    {
      id: 'options',
      title: 'Explore Your Options',
      description: 'Understand possible repayment arrangements, lender discussions, or settlement options where applicable, including potential consequences.'
    },
    {
      id: 'rights',
      title: 'Know Your Rights',
      description: 'Learn about relevant borrower protections and responsible ways to respond to recovery communications.'
    },
    {
      id: 'nextstep',
      title: 'Find the Right Next Step',
      description: 'Understand when professional legal advice may be appropriate and what documents you should prepare before seeking help.'
    }
  ]
};

export const DEFAULT_CONTACT_SETTINGS = {
  phone: '7386444186',
  email: 'Legalbharosa.orga@gmail.com',
  whatsappNumber: '917386444186',
  whatsappMessage: 'Hello LegalBharosa, I would like to consult regarding my case.',
  mapsUrl: 'https://maps.app.goo.gl/AUEVoh3Y6EPQoV5n6?g_st=ac',
  address: 'VV Vintage Boulevard, Raj Bhavan Rd, Somajiguda, Hyderabad, Telangana 500082',
  hours: 'Mon - Sat: 9:30 AM - 7:00 PM IST'
};

export const DEFAULT_BOOKING_SETTINGS = {
  autoPopupEnabled: true,
  autoPopupDelaySeconds: 10,
  popupTitle: 'Get Immediate Advocate Consultation',
  popupSubtitle: 'Speak directly with experienced legal advisors regarding recovery harassment, loan settlement, and statutory notice defense.',
  submitButtonText: 'Request Legal Consultation',
  consentText: 'I consent to receive legal advisory communication, case assessment updates, and confidential documentation review via phone, WhatsApp, and email.'
};

/**
 * Subscribe to a website setting document in Firestore (e.g. 'homepage', 'contact', 'booking')
 */
export function subscribeSetting(settingKey, callback, defaultValue = {}) {
  const settingRef = doc(db, 'settings', settingKey);
  return onSnapshot(
    settingRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({ ...defaultValue, ...snapshot.data() });
      } else {
        callback(defaultValue);
      }
    },
    (err) => {
      console.warn(`[Firestore] Failed to subscribe to setting "${settingKey}", using fallback:`, err);
      callback(defaultValue);
    }
  );
}

/**
 * Save / Update a website setting document in Firestore
 */
export async function saveSetting(settingKey, data) {
  if (!settingKey) throw new Error('Setting key required.');
  const settingRef = doc(db, 'settings', settingKey);
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  await setDoc(settingRef, payload, { merge: true });
  return payload;
}

/**
 * ─────────────────────────────────────────────────────────────
 * 9. DYNAMIC SERVICES (Management for Admin & Public Directory)
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Subscribe to all services (Admin - includes drafts & published)
 */
export function subscribeAllServices(callback) {
  const servicesRef = collection(db, 'services');
  return onSnapshot(
    servicesRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      callback(list);
    },
    (error) => {
      console.warn('[Firestore] Error subscribing to all services:', error);
      callback([]);
    }
  );
}

/**
 * Subscribe to published services only (For Public Pages)
 */
export function subscribePublishedServices(callback) {
  const servicesRef = collection(db, 'services');
  const q = query(servicesRef, where('status', '==', 'published'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      callback(list);
    },
    (error) => {
      console.warn('[Firestore] Error subscribing to published services:', error);
      callback([]);
    }
  );
}

/**
 * Create a new service document
 */
export async function createService({
  title,
  slug,
  tag = 'Legal Advisory',
  description,
  longDescription = '',
  iconName = 'ShieldCheck',
  status = 'published',
  order = 0,
}) {
  if (!title || !title.trim()) throw new Error('Service title is required.');
  if (!description || !description.trim()) throw new Error('Service description is required.');

  const cleanSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')).trim();

  const serviceData = {
    title: title.trim(),
    slug: cleanSlug,
    path: `/services/${cleanSlug}`,
    tag: (tag || 'Legal Advisory').trim(),
    description: description.trim(),
    longDescription: (longDescription || '').trim(),
    iconName: iconName || 'ShieldCheck',
    status: status === 'draft' ? 'draft' : 'published',
    order: Number(order) || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'services'), serviceData);
  return { id: docRef.id, ...serviceData };
}

/**
 * Update an existing service document
 */
export async function updateService(serviceId, updates) {
  if (!serviceId) throw new Error('Service ID is required.');
  const serviceRef = doc(db, 'services', serviceId);

  const cleanUpdates = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  if (updates.title && !updates.slug) {
    cleanUpdates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    cleanUpdates.path = `/services/${cleanUpdates.slug}`;
  } else if (updates.slug) {
    cleanUpdates.path = `/services/${updates.slug}`;
  }

  await updateDoc(serviceRef, cleanUpdates);
  return { id: serviceId, ...cleanUpdates };
}

/**
 * Delete a service document
 */
export async function deleteService(serviceId) {
  if (!serviceId) throw new Error('Service ID is required.');
  const serviceRef = doc(db, 'services', serviceId);
  await deleteDoc(serviceRef);
  return true;
}

/**
 * ─────────────────────────────────────────────────────────────
 * 10. CLIENT STORIES (Verified Real Testimonials & Case Studies)
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Subscribe to all client stories (Admin - includes drafts & published)
 */
export function subscribeAllClientStories(callback) {
  const storiesRef = collection(db, 'clientStories');
  return onSnapshot(
    storiesRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
      callback(list);
    },
    (error) => {
      console.warn('[Firestore] Error subscribing to all client stories:', error);
      callback([]);
    }
  );
}

/**
 * Subscribe to published client stories only (For Public Pages)
 */
export function subscribePublishedClientStories(callback) {
  const storiesRef = collection(db, 'clientStories');
  const q = query(storiesRef, where('status', '==', 'published'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
      callback(list);
    },
    (error) => {
      console.warn('[Firestore] Error subscribing to published client stories:', error);
      callback([]);
    }
  );
}

/**
 * Create a new client story (strictly verified information)
 */
export async function createClientStory({
  clientName,
  city = '',
  caseTopic,
  category = 'OTS',
  reviewText,
  caseSummary = { exposure: '', resolution: '', timeline: '' },
  status = 'published',
}) {
  if (!clientName || !clientName.trim()) throw new Error('Client name is required.');
  if (!caseTopic || !caseTopic.trim()) throw new Error('Case topic is required.');
  if (!reviewText || !reviewText.trim()) throw new Error('Review/Testimonial text is required.');

  const storyData = {
    clientName: clientName.trim(),
    city: (city || '').trim(),
    caseTopic: caseTopic.trim(),
    category: category || 'OTS',
    reviewText: reviewText.trim(),
    caseSummary: {
      exposure: caseSummary?.exposure ? caseSummary.exposure.trim() : '',
      resolution: caseSummary?.resolution ? caseSummary.resolution.trim() : '',
      timeline: caseSummary?.timeline ? caseSummary.timeline.trim() : '',
    },
    status: status === 'draft' ? 'draft' : 'published',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'clientStories'), storyData);
  return { id: docRef.id, ...storyData };
}

/**
 * Update an existing client story
 */
export async function updateClientStory(storyId, updates) {
  if (!storyId) throw new Error('Story ID is required.');
  const storyRef = doc(db, 'clientStories', storyId);

  const cleanUpdates = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(storyRef, cleanUpdates);
  return { id: storyId, ...cleanUpdates };
}

/**
 * Delete a client story
 */
export async function deleteClientStory(storyId) {
  if (!storyId) throw new Error('Story ID is required.');
  const storyRef = doc(db, 'clientStories', storyId);
  await deleteDoc(storyRef);
  return true;
}

/**
 * ─────────────────────────────────────────────────────────────
 * 11. ADMIN ARTICLES SUBSCRIPTION (Drafts & Published)
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Subscribe to all articles in Firestore for Admin Console
 */
export function subscribeAllArticlesForAdmin(callback) {
  const articlesRef = collection(db, 'articles');
  return onSnapshot(
    articlesRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
      callback(list);
    },
    (error) => {
      console.warn('[Firestore] Error subscribing to all articles for admin:', error);
      callback([]);
    }
  );
}

/**
 * ─────────────────────────────────────────────────────────────
 * 12. STORAGE MEDIA UPLOAD HELPER
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Upload an image or document to Firebase Storage
 * Returns { url, path, success: true } or { error, success: false }
 */
export async function uploadAdminMedia(file, folder = 'uploads') {
  if (!file) throw new Error('No file provided for upload.');

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File exceeds the 10MB maximum upload limit.');
  }

  try {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${folder}/${timestamp}_${sanitizedName}`;
    const fileRef = ref(storage, storagePath);

    console.log(`[Storage] Uploading file to path: ${storagePath}...`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    console.log(`[Storage] Upload successful! URL: ${downloadUrl}`);
    return {
      success: true,
      url: downloadUrl,
      path: storagePath,
    };
  } catch (err) {
    console.error('[Storage] Upload error:', err);
    return {
      success: false,
      error: err.message || 'Storage upload failed. Please verify Firebase Storage configuration and bucket permissions.',
    };
  }
}


