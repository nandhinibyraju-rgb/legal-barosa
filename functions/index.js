import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
initializeApp();

/**
 * Health check / starter Cloud Function for LegalBharosa
 * Accessible via HTTP GET/POST once deployed or in emulators
 */
export const apiHealth = onRequest({ cors: true }, (request, response) => {
  logger.info("LegalBharosa Cloud Functions health check invoked", { structuredData: true });
  response.status(200).json({
    status: "ok",
    service: "LegalBharosa Cloud Functions",
    timestamp: new Date().toISOString()
  });
});
