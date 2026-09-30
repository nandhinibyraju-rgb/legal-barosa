import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  arrayUnion,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

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
