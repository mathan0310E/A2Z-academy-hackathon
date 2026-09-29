import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, ScrollText } from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import ImportantNotice from "@/components/ImportantNotice";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/guidelines" },
  title: "Guidelines & Rules",
  description:
    "Official guidelines and rules for the A2Z Academy Tech-Based Hackathon — eligibility, team composition, rounds, fees, and conduct.",
};

export default function GuidelinesPage() {
  return (
    <>
      <SectionWrapper className="pt-12 md:pt-16">
        <div className="mb-10 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 bg-brand-green-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-green-hover">
            <ScrollText className="h-3.5 w-3.5" />
            Read before you register
          </span>
        </div>

        <SectionTitle
          title="Guidelines & Rules"
          subtitle="These guidelines keep the competition fair for every team. By registering, each team confirms that all information submitted is accurate."
        />

        <div className="mx-auto max-w-3xl">
          <RevealGroup className="space-y-3">
            {siteConfig.guidelines.map((rule, index) => (
              <RevealItem key={rule}>
                <GlassCard className="flex items-start gap-4 !p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-green/15 to-brand-green/15 text-sm font-bold text-brand-green-hover">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-brand-ink">{rule}</p>
                </GlassCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <RevealGroup className="grid gap-4 sm:grid-cols-2">
            <RevealItem>
              <GlassCard className="h-full border-amber-300">
                <div className="mb-3 flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="text-base font-semibold text-brand-navy">Important</h3>
                </div>
                <ul className="space-y-2 text-sm text-brand-muted">
                  <li>
                    Round 3 is offline at{" "}
                    <span className="text-brand-ink">{siteConfig.hackathonInfo.round3Venue}</span> and
                    requires <span className="text-brand-ink">{siteConfig.hackathonInfo.round3Fee}</span>{" "}
                    per head.
                  </li>
                  <li>
                    Shortlisting follows: {siteConfig.hackathonInfo.shortlisting}.
                  </li>
                  <li>Never share your Registration ID with anyone outside your team.</li>
                </ul>
              </GlassCard>
            </RevealItem>

            <RevealItem>
              <GlassCard className="h-full">
                <div className="mb-3 flex items-center gap-2 text-brand-green-hover">
                  <CheckCircle2 className="h-5 w-5" />
                  <h3 className="text-base font-semibold text-brand-navy">What to do next</h3>
                </div>
                <ol className="space-y-2 text-sm text-brand-muted">
                  <li>1. Form your team and agree on a team type.</li>
                  <li>2. Collect every member&apos;s college, department, and year.</li>
                  <li>3. Register once — a single submission per team.</li>
                  <li>4. Join the official WhatsApp group for instructions.</li>
                </ol>
                <Link
                  href="/register"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-5 py-2.5 text-sm font-semibold text-brand-ink-strong shadow-brand transition-transform hover:scale-105"
                >
                  Start Registration
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </GlassCard>
            </RevealItem>
          </RevealGroup>
        </div>
      </SectionWrapper>

      <ImportantNotice />
    </>
  );
}
