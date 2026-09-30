import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";

let firebaseApp: FirebaseApp | undefined;
let db: Firestore | undefined;

// `import.meta.env` only exists in the Vite client bundle; server-side scripts
// fall back to `process.env`, mirroring `src/lib/site.ts`.
const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
const nodeEnv = typeof process !== "undefined" ? process.env : undefined;
const readEnv = (key: string): string | undefined => viteEnv?.[key] || nodeEnv?.[key];

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
      apiKey: readEnv("VITE_FIREBASE_API_KEY"),
      authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
      projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
      storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
      messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
      appId: readEnv("VITE_FIREBASE_APP_ID"),
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
