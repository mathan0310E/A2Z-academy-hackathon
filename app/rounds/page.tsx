import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Info, MapPin, MessageCircle, Users } from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
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
    <div className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
      <div>
        <p className="text-[11px] uppercase tracking-wider text-gray-500">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
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
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    {meta.badge}
                  </span>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">{round.title}</h2>
                </div>

                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <MetaItem Icon={Users} label="Participants" value={meta.participants} />
                  <MetaItem Icon={CheckCircle2} label="Shortlisting" value={meta.shortlist} />
                  <MetaItem Icon={Clock} label="Format" value={meta.mode} />
                </div>

                <p className="leading-relaxed text-gray-300">{round.description}</p>

                {meta.extra && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-2.5 text-sm text-indigo-200">
                    <MapPin className="h-4 w-4 shrink-0 text-indigo-300" />
                    <span>{meta.extra}</span>
                  </div>
                )}
              </GlassCard>
            </Reveal>
          );
        })}

        <Reveal>
          <GlassCard className="border-amber-500/20 bg-amber-500/5 p-6">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div className="text-sm text-amber-100">
                <p className="mb-2 font-semibold text-amber-300">What this website does NOT do</p>
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
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/25 transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            Join Official WhatsApp Group
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
