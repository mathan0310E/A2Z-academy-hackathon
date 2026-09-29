import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Info, MapPin, MessageCircle, Users } from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/rounds" },
  title: "Rounds",
  description:
    "A2Z Academy Tech-Based Hackathon rounds — Round 1 PPT Submission, Round 2 Online Round, Round 3 Offline Hackathon.",
};

const ROUND_META = [
  {
    badge: "Round 1",
    participants: "All registered teams",
    shortlist: "40 teams",
    mode: "Online",
    extra: null,
  },
  {
    badge: "Round 2",
    participants: "40 shortlisted teams",
    shortlist: "25 teams",
    mode: "Online",
    extra: null,
  },
  {
    badge: "Round 3",
    participants: "25 shortlisted teams",
    shortlist: "Winner + Runner-up",
    mode: "Offline",
    extra: "Venue: Cyber Wolf HQ · ₹250 per head",
  },
];

function MetaItem({ Icon, label, value }: { Icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-brand-navy/10 bg-brand-surface p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
      <div>
        <p className="text-[11px] uppercase tracking-wider text-brand-muted">{label}</p>
        <p className="text-sm font-medium text-brand-navy">{value}</p>
      </div>
    </div>
  );
}

export default function RoundsPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "#";

  return (
    <SectionWrapper className="pt-12 md:pt-16">
      <SectionTitle title="Hackathon Rounds" subtitle="Three rounds. One journey from idea to impact." />

      <div className="mx-auto max-w-4xl space-y-8">
        {siteConfig.rounds.map((round, index) => {
          const meta = ROUND_META[index];
          if (!meta) return null;

          return (
            <Reveal key={round.title} delay={index * 0.1}>
              <GlassCard className="p-6 sm:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-brand-green/40 bg-brand-green-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-green-hover">
                    {meta.badge}
                  </span>
                  <h2 className="text-xl font-bold text-brand-navy sm:text-2xl">{round.title}</h2>
                </div>

                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <MetaItem Icon={Users} label="Participants" value={meta.participants} />
                  <MetaItem Icon={CheckCircle2} label="Shortlisting" value={meta.shortlist} />
                  <MetaItem Icon={Clock} label="Format" value={meta.mode} />
                </div>

                <p className="leading-relaxed text-brand-ink">{round.description}</p>

                {meta.extra && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-brand-navy/20 bg-brand-navy/5 px-4 py-2.5 text-sm text-brand-navy">
                    <MapPin className="h-4 w-4 shrink-0 text-brand-navy" />
                    <span>{meta.extra}</span>
                  </div>
                )}
              </GlassCard>
            </Reveal>
          );
        })}

        <Reveal>
          <GlassCard className="border-amber-300 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div className="text-sm text-amber-900">
                <p className="mb-2 font-semibold text-amber-700">What this website does NOT do</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>No PPT upload or submission system</li>
                  <li>No online judging, scoring, or evaluation</li>
                  <li>No round registration or problem selection</li>
                  <li>No live presentations or offline activity management</li>
                </ul>
                <p className="mt-3">
                  The exact submission instructions, platform, timings, and evaluation details are
                  communicated through the official WhatsApp group.
                </p>
              </div>
            </div>
          </GlassCard>
        </Reveal>

        <div className="flex justify-center">
          <Link
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-6 py-3 font-semibold text-brand-ink-strong shadow-brand transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            Join Official WhatsApp Group
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
