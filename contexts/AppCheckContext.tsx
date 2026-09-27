"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from "firebase/app-check";
import { getFirebaseApp } from "@/firebase/client";

const AppCheckContext = createContext<{ initialized: boolean; error: string | null } | undefined>(undefined);

export function AppCheckProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ initialized: boolean; error: string | null }>({ initialized: false, error: null });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setState({ initialized: false, error: "Firebase not configured" });
      return;
    }
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      // App Check is optional locally; registration still works without it.
      setState({ initialized: false, error: "reCAPTCHA site key not configured" });
      return;
    }
    try {
      const app = getFirebaseApp();
      const appCheck: AppCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
      void appCheck;
      setState({ initialized: true, error: null });
    } catch (error: any) {
      console.warn("App Check initialization failed:", error?.message);
      setState({ initialized: false, error: error?.message || "Failed to init App Check" });
    }
  }, []);

  return <AppCheckContext.Provider value={state}>{children}</AppCheckContext.Provider>;
}

export function useAppCheck() {
  const ctx = useContext(AppCheckContext);
  if (!ctx) throw new Error("useAppCheck must be used within AppCheckProvider");
  return ctx;
}
