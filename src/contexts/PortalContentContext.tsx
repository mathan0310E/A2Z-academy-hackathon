import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { siteConfig } from "@/lib/content";
import { fetchPublicContent, type PublicContent } from "@/lib/firestore";

/**
 * Content published by the A2Z admin panel.
 *
 * The public site is prerendered, so the HTML shipped to crawlers carries the
 * baseline values from `siteConfig`. Operator edits are layered on top of that
 * baseline **after hydration**, so the server HTML and the first client render
 * always agree and hydration stays clean. Until the fetch resolves — and if
 * Firebase is unconfigured or offline — the baseline stands, which is exactly
 * the pre-integration behaviour.
 */
export interface PortalFaq {
  question: string;
  answer: string;
}

export interface PortalRound {
  title: string;
  format: string;
  shortlisting: string;
  description: string;
}

export interface PortalContent {
  faqs: PortalFaq[];
  rounds: PortalRound[];
  guidelines: string[];
  hackathonInfo: typeof siteConfig.hackathonInfo;
  /** Admin-managed link, falling back to the build-time env var. */
  whatsappUrl: string;
}

const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;

const baseline: PortalContent = {
  faqs: siteConfig.faqs,
  rounds: siteConfig.rounds,
  guidelines: siteConfig.guidelines,
  hackathonInfo: siteConfig.hackathonInfo,
  whatsappUrl: siteConfig.whatsappUrl || viteEnv?.VITE_WHATSAPP_GROUP_URL || "",
};

const PortalContentContext = createContext<PortalContent>(baseline);

function nonEmpty(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Only overwrite a baseline field when the admin panel actually has a value. */
function overlayHackathonInfo(
  stored: PublicContent["hackathon"]
): typeof siteConfig.hackathonInfo {
  if (!stored) return siteConfig.hackathonInfo;
  const base = siteConfig.hackathonInfo;
  return {
    organizer: nonEmpty(stored.organizer) ?? base.organizer,
    teamSize: nonEmpty(stored.teamSize) ?? base.teamSize,
    teamTypes: nonEmpty(stored.teamTypes) ?? base.teamTypes,
    round3Venue: nonEmpty(stored.venue) ?? base.round3Venue,
    round3Fee: nonEmpty(stored.round3Fee) ?? base.round3Fee,
    shortlisting: nonEmpty(stored.shortlisting) ?? base.shortlisting,
    communication: base.communication,
  };
}

function toRounds(stored: PublicContent["rounds"]): PortalRound[] {
  const rounds = stored
    ?.map((round) => ({
      title: round.title?.trim() ?? "",
      format: round.format?.trim() ?? "",
      shortlisting: round.shortlisting?.trim() ?? "",
      description: round.description?.trim() ?? "",
    }))
    .filter((round) => round.title || round.description);
  return rounds?.length ? rounds : siteConfig.rounds;
}

function toGuidelines(stored: PublicContent["guidelines"]): string[] {
  const lines = stored?.content
    ?.split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines?.length ? lines : siteConfig.guidelines;
}

function toFaqs(stored: PublicContent["faq"]): PortalFaq[] {
  const faqs = stored
    ?.map((item) => ({ question: item.question?.trim() ?? "", answer: item.answer?.trim() ?? "" }))
    .filter((item) => item.question && item.answer);
  return faqs?.length ? faqs : siteConfig.faqs;
}

/** Merge the admin-managed documents over the checked-in baseline. */
export function mergePortalContent(content: PublicContent): PortalContent {
  return {
    faqs: toFaqs(content.faq),
    rounds: toRounds(content.rounds),
    guidelines: toGuidelines(content.guidelines),
    hackathonInfo: overlayHackathonInfo(content.hackathon),
    whatsappUrl:
      nonEmpty(content.hackathon?.whatsappUrl) ||
      nonEmpty(content.whatsapp?.url) ||
      baseline.whatsappUrl,
  };
}

/**
 * Run `task` once the browser is idle. Deferring the content fetch keeps the
 * ~470 kB Firebase chunk off the critical path on every page, including those
 * that only need the baseline values.
 */
function whenIdle(task: () => void): () => void {
  const idle = (
    window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    }
  ).requestIdleCallback;
  if (idle) {
    const handle = idle(task, { timeout: 2000 });
    return () => (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(handle);
  }
  const handle = window.setTimeout(task, 200);
  return () => window.clearTimeout(handle);
}

/**
 * The prerenderer captures HTML after the network settles. Fetching published
 * content there would bake admin values into the static HTML, which the first
 * client render — starting from the baseline — would then contradict. Skipping
 * the fetch while prerendering keeps the captured markup identical to a fresh
 * client render, so hydration matches. Same flag convention as CookieConsent.
 */
function isPrerendering(): boolean {
  return typeof window !== "undefined" && (window as { __A2Z_PRERENDER__?: boolean }).__A2Z_PRERENDER__ === true;
}

/**
 * Fetches admin-managed content once for the whole tree. The FAQ subcollection
 * is the canonical published list; the `faq` document is the admin's fallback.
 */
export function PortalContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PortalContent>(baseline);

  useEffect(() => {
    if (isPrerendering()) return;
    let active = true;

    const cancel = whenIdle(() => {
      fetchPublicContent()
        .then((stored) => {
          if (!active) return;
          const merged = mergePortalContent(stored);
          setContent((previous) =>
            JSON.stringify(previous) === JSON.stringify(merged) ? previous : merged
          );
        })
        .catch(() => {
          // fetch* already degrades to empty values; keep the baseline on failure.
        });
    });

    return () => {
      active = false;
      cancel();
    };
  }, []);

  const value = useMemo(() => content, [content]);
  return <PortalContentContext.Provider value={value}>{children}</PortalContentContext.Provider>;
}

/** Read the published content. Safe outside the provider — returns the baseline. */
export function usePortalContent(): PortalContent {
  return useContext(PortalContentContext);
}
