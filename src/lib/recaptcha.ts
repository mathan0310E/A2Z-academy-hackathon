/**
 * reCAPTCHA v3 tokens for the public write endpoints.
 *
 * The server verifies whatever token we send; when RECAPTCHA_SECRET_KEY is not
 * configured server-side it skips verification, so a missing site key here is
 * only a development concern. The script is injected on demand the first time a
 * form is submitted, keeping it off the critical path.
 */
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

interface Grecaptcha {
  ready(cb: () => void): void;
  execute(key: string, opts: { action: string }): Promise<string>;
}

let scriptPromise: Promise<void> | undefined;

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    // Firebase App Check loads the same reCAPTCHA script with the same site
    // key. If it is already present, wait for it instead of adding a second tag.
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src^="https://www.google.com/recaptcha/api.js"]'
    );
    if (existing) {
      if ((window as unknown as { grecaptcha?: unknown }).grecaptcha) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("reCAPTCHA script failed to load")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("reCAPTCHA script failed to load"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export async function getRecaptchaToken(action: string): Promise<string | undefined> {
  if (!siteKey) return undefined;
  try {
    await loadScript();
    const grecaptcha = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
    if (!grecaptcha) return undefined;
    await new Promise<void>((resolve) => grecaptcha.ready(() => resolve()));
    return await grecaptcha.execute(siteKey, { action });
  } catch (error) {
    console.warn("reCAPTCHA unavailable:", (error as Error)?.message);
    return undefined;
  }
}
