import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App | undefined;
let adminDb: Firestore | undefined;
let adminAuth: Auth | undefined;

export function getAdminApp(): App {
  if (!adminApp) {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      throw new Error("Firebase Admin credentials are not configured");
    }

    // Handle escaped newlines in private key
    privateKey = privateKey.replace(/\\n/g, "\n");

    if (getApps().length === 0) {
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      adminApp = getApps()[0];
    }
  }
  return adminApp!;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    getAdminApp();
    adminDb = getFirestore();
    // Optional fields (e.g. email errorMessage, sentAt) are omitted when absent
    // rather than being rejected as invalid document data.
    adminDb.settings({ ignoreUndefinedProperties: true });
  }
  return adminDb!;
}

export function getAdminAuth(): Auth {
  if (!adminAuth) {
    getAdminApp();
    adminAuth = getAuth();
  }
  return adminAuth!;
}
