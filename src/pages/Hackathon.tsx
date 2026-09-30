import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Calendar,
  IndianRupee,
  Info,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { usePortalContent } from "@/contexts/PortalContentContext";
import Seo from "@/components/Seo";

const ROUNDS_SUMMARY = [
  {
    title: "Round 1 — PPT Submission",
    detail: "Online presentation submission. 40 teams shortlisted.",
  },
  {
    title: "Round 2 — Online Round",
    detail: "40 shortlisted teams compete online. 25 teams shortlisted.",
  },
  {
    title: "Round 3 — Offline Hackathon",
    detail: "25 teams at Cyber Wolf HQ. ₹250 per head.",
  },
];

export default function HackathonPage() {
  const content = usePortalContent();
  const info = content.hackathonInfo;
  const whatsapp = content.whatsappUrl || "#";

  const details = [
    { Icon: Building2, label: "Organizer", value: info.organizer },
    { Icon: Users, label: "Team Size", value: info.teamSize },
    { Icon: Users, label: "Team Types", value: info.teamTypes },
    { Icon: MapPin, label: "Round 3 Venue", value: info.round3Venue },
    { Icon: IndianRupee, label: "Round 3 Participation Fee", value: info.round3Fee },
    { Icon: Calendar, label: "Shortlisting", value: info.shortlisting },
    { Icon: MessageCircle, label: "Communication", value: info.communication },
  ];

  return (
    <SectionWrapper className="pt-12 md:pt-16">
      <Seo
        title="Hackathon"
        description="A2Z Academy Tech-Based Hackathon overview — team size, team types, rounds, venue, and participation fee."
        path="/hackathon"
      />
      <SectionTitle
        title="A2Z Academy Tech-Based Hackathon"
        as="h1"
        subtitle="Explore technology. Solve real-world problems. Build innovative solutions."
      />

      <div className="mx-auto max-w-4xl space-y-8">
        <Reveal>
          <GlassCard className="p-6 sm:p-8">
            <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {details.map(({ Icon, label, value }) => (
                <RevealItem key={label}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-green-soft text-brand-green-ink">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-brand-muted">{label}</p>
                      <p className="font-medium text-brand-ink">{value}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </GlassCard>
        </Reveal>

        {/* Rounds summary */}
        <h2 className="sr-only">Hackathon rounds</h2>
        <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {ROUNDS_SUMMARY.map((round, index) => (
            <RevealItem key={round.title} className="h-full">
              <GlassCard className="h-full p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-green-ink">
                  Round {index + 1}
                </span>
                <h3 className="mt-2 mb-2 text-base font-bold text-brand-ink">{round.title}</h3>
                <p className="text-sm text-brand-muted">{round.detail}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Notice */}
        <Reveal>
          <GlassCard className="border-amber-300 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div className="text-sm text-amber-900">
                <p className="mb-2 font-semibold text-amber-700">
                  Dates &amp; timings are communicated via WhatsApp
                </p>
                <p className="mb-3">
                  We do not publish unconfirmed dates. All three round dates, timings, PPT submission
                  instructions, problem-related instructions, shortlisting announcements, schedule
                  changes, and further hackathon updates will be communicated through the official
                  WhatsApp group.
                </p>
                <p>
                  Hackathon rounds, PPT evaluation, judging, presentations, and offline activities
                  happen outside this website.
                </p>
              </div>
            </div>
          </GlassCard>
        </Reveal>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-6 py-3 font-semibold text-brand-ink-strong shadow-brand transition-transform hover:scale-105"
          >
            Start Registration
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-6 py-3 font-semibold text-brand-ink-strong shadow-brand transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            Join Official WhatsApp Group
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
