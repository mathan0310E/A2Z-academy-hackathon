import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";

let firebaseApp: FirebaseApp | undefined;
let db: Firestore | undefined;

/**
 * Firebase is very heavy (~200 kB), so the SDK is imported dynamically and only
 * when a caller actually needs it. That keeps Firestore and App Check out of
 * every page's initial JavaScript payload.
 */
async function loadSdk() {
  return import("firebase/app");
}

export async function getFirebaseApp(): Promise<FirebaseApp> {
  if (!firebaseApp) {
    const { initializeApp, getApps } = await loadSdk();
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    if (!config.apiKey) {
      throw new Error("Firebase API key is not configured");
    }
    firebaseApp = getApps().length ? getApps()[0] : initializeApp(config);
  }
  return firebaseApp;
}

export async function getDb(): Promise<Firestore> {
  if (!db) {
    const { getFirestore } = await import("firebase/firestore");
    db = getFirestore(await getFirebaseApp());
  }
  return db;
}
