
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getFirebaseApp } from "@/lib/firebase";

const AppCheckContext = createContext<{ initialized: boolean; error: string | null } | undefined>(undefined);

export function AppCheckProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ initialized: boolean; error: string | null }>({ initialized: false, error: null });

  useEffect(() => {
    if (!import.meta.env.VITE_FIREBASE_API_KEY) {
      setState({ initialized: false, error: "Firebase not configured" });
      return;
    }
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      // App Check is optional locally; registration still works without it.
      setState({ initialized: false, error: "reCAPTCHA site key not configured" });
      return;
    }
    let cancelled = false;
    // Deferred import keeps firebase/app-check out of the initial bundle.
    import("firebase/app-check")
      .then(async ({ initializeAppCheck, ReCaptchaV3Provider }) => {
        if (cancelled) return;
        const app = await getFirebaseApp();
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(siteKey),
          isTokenAutoRefreshEnabled: true,
        });
        setState({ initialized: true, error: null });
      })
      .catch((error: any) => {
        console.warn("App Check initialization failed:", error?.message);
        if (!cancelled) setState({ initialized: false, error: error?.message || "Failed to init App Check" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <AppCheckContext.Provider value={state}>{children}</AppCheckContext.Provider>;
}

export function useAppCheck() {
  const ctx = useContext(AppCheckContext);
  if (!ctx) throw new Error("useAppCheck must be used within AppCheckProvider");
  return ctx;
}
