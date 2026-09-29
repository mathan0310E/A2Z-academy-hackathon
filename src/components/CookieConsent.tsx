import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "a2z-cookie-consent";

/**
 * The prerender harness renders each route in a real browser to capture static
 * HTML. This banner is client-only UI, so the harness sets a flag and we skip
 * rendering it — otherwise the captured HTML would contain the banner while the
 * client's first render would not, producing a hydration mismatch.
 */
function isPrerendering(): boolean {
  return typeof window !== "undefined" && (window as { __A2Z_PRERENDER__?: boolean }).__A2Z_PRERENDER__ === true;
}

function readConsent(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private mode / storage disabled: treat as "no choice yet" so the banner
    // is shown rather than silently assuming consent.
    return null;
  }
}

/**
 * First-visit cookie consent banner, mirroring the reference site's
 * bottom-anchored card: 🍪 heading, short explainer, and Decline / Accept all.
 *
 * The choice lives in localStorage. It is read lazily during the first render
 * so the prerendered markup and the client's first render agree — otherwise
 * the banner would be absent from the static HTML and appear only after an
 * effect, which is a hydration mismatch. `mounted` defers it by one frame so
 * it animates in rather than flashing with the page.
 */
export default function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(readConsent);
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!consent && !isPrerendering()) setMounted(true);
  }, [consent]);

  const decide = (choice: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
      window.localStorage.setItem(`${STORAGE_KEY}-at`, new Date().toISOString());
    } catch {
      // Ignore write failures — the banner just reappears on the next visit.
    }
    setConsent(choice);
    setLeaving(true);
    setTimeout(() => setMounted(false), 280);
  };

  if (consent || !mounted) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
      data-testid="cookie-consent"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
    >
      <div
        className={
          "relative mx-auto flex max-w-4xl flex-col gap-4 rounded-none border border-slate-200 bg-white p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between " +
          (leaving ? "consent-leave" : "consent-enter")
        }
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              🍪
            </span>
            <h3
              id="cookie-consent-title"
              className="font-display text-base font-bold text-slate-900"
            >
              We use cookies
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            We use cookies to improve your experience, analyze traffic, and personalize content.
            Read our{" "}
            <Link to="/privacy" className="font-semibold text-brand-green hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button variant="outline" onClick={() => decide("declined")} data-testid="cookie-decline">
            Decline
          </Button>
          <Button
            variant="pill"
            size="pill"
            onClick={() => decide("accepted")}
            data-testid="cookie-accept"
          >
            Accept all
          </Button>
        </div>

        <button
          type="button"
          aria-label="Close"
          onClick={() => decide("declined")}
          className="absolute right-3 top-3 text-slate-400 transition-colors hover:text-slate-600 sm:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
