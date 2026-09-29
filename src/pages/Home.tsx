import Hero from "@/components/Hero";
import ImportantNotice from "@/components/ImportantNotice";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/content";
import { Award, Code, Globe, Laptop, Lightbulb, ShieldCheck, Trophy, Users } from "lucide-react";
import Seo from "@/components/Seo";

const PROVIDE_ICONS: Record<string, any> = { Laptop, Code, Award, Lightbulb, Trophy, Globe };

const WHY_PARTICIPATE = [
  { title: "Learn", description: "Master new technologies through hands-on problem-solving and real-world challenges.", Icon: Award },
  { title: "Innovate", description: "Push boundaries and create breakthrough solutions to complex, open-ended problems.", Icon: Lightbulb },
  { title: "Build", description: "Transform ideas into working prototypes with full-stack development and deployment.", Icon: Code },
  { title: "Collaborate", description: "Work in diverse teams, share knowledge, and learn from fellow innovators.", Icon: Users },
  { title: "Present", description: "Showcase your solutions to industry experts and peers in a professional setting.", Icon: ShieldCheck },
];

const JOURNEY = [
  { label: "REGISTRATION", detail: "Register your team of 2–4 members" },
  { label: "ROUND 1 — PPT SUBMISSION", detail: "Online presentation submission · 40 teams shortlisted" },
  { label: "ROUND 2 — ONLINE ROUND", detail: "40 shortlisted teams compete online · 25 teams shortlisted" },
  { label: "ROUND 3 — OFFLINE HACKATHON", detail: "25 teams at Cyber Wolf HQ · ₹250 per head" },
  { label: "WINNER + RUNNER-UP", detail: "Recognition & prizes" },
];

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-brand-muted">{label}</span>
      <span className="font-medium text-brand-navy">{value}</span>
    </div>
  );
}


export default function Home() {
  const info = siteConfig.hackathonInfo;

  return (
    <>
      <Seo
        title="A2Z Academy | Empowering Institutes with Tech-Based Training"
        description="A2Z Academy Tech-Based Hackathon — explore problem statements, register your team of 2–4 members, and build innovative solutions."
        path="/"
      />
      <Hero />
      <div className="border-t border-brand-navy/10">
        <ImportantNotice />
      </div>

      {/* What A2Z Academy Provides */}
      <SectionWrapper id="provides" className="bg-white">
        <SectionTitle title="What A2Z Academy Provides" subtitle="End-to-end technology education and innovation programs for institutes and students." />
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.provides.map(({ title, description, icon }) => {
            const Icon = PROVIDE_ICONS[icon] ?? ShieldCheck;
            return (
              <RevealItem key={title}>
                <GlassCard className="group flex h-full flex-col items-center text-center transition-all duration-300 hover:border-brand-green/40">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-green/10 to-brand-green/5 text-brand-green transition-colors group-hover:from-brand-green/20">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-brand-navy">{title}</h3>
                  <p className="flex-1 text-sm text-brand-muted">{description}</p>
                </GlassCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </SectionWrapper>

      {/* Why Participate */}
      <SectionWrapper className="border-t border-brand-navy/10">
        <SectionTitle title="Why Participate" subtitle="More than a competition — it's a launchpad for your career in technology." />
        <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {WHY_PARTICIPATE.map(({ title, description, Icon }) => (
            <RevealItem key={title} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-green/10 to-brand-green/5 text-brand-green">
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="mb-1 font-semibold text-brand-navy">{title}</h4>
              <p className="text-xs text-brand-muted">{description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </SectionWrapper>

      {/* Hackathon Overview */}
      <SectionWrapper id="hackathon" className="border-t border-brand-navy/10">
        <SectionTitle title="A2Z Academy Tech-Based Hackathon" subtitle="Empowering Institutes with Tech-Based Training" />
        <Reveal className="mx-auto max-w-3xl">
          <GlassCard className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InfoItem label="Organizer" value={info.organizer} />
              <InfoItem label="Team Size" value={info.teamSize} />
              <InfoItem label="Team Types" value={info.teamTypes} />
              <InfoItem label="Round 3 Venue" value={info.round3Venue} />
              <InfoItem label="Round 3 Fee" value={info.round3Fee} />
              <InfoItem label="Shortlisting" value={info.shortlisting} />
              <InfoItem label="Communication" value={info.communication} />
            </div>
            <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <strong className="font-semibold text-amber-700">Note:</strong> Round dates, timings, and exact instructions are communicated through the official WhatsApp group.
            </div>
          </GlassCard>
        </Reveal>
      </SectionWrapper>

      {/* Hackathon Journey */}
      <SectionWrapper className="border-t border-brand-navy/10">
        <SectionTitle title="Hackathon Journey" subtitle="Your path from registration to victory" />
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-1/2 -ml-px h-full w-0.5 -translate-x-1/2 -translate-y-6 bg-gradient-to-b from-brand-green to-brand-green-hover" />
          <div className="space-y-10">
            {JOURNEY.map((step, idx) => (
              <Reveal key={step.label} direction={idx % 2 === 0 ? "left" : "right"} delay={idx * 0.05}>
                <div className="relative flex items-center">
                  <div className="w-full pl-16 md:ml-8 md:w-5/12 md:pl-0">
                    <GlassCard className="p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-brand-ink">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-brand-green">{step.label}</span>
                      </div>
                      <p className="text-sm text-brand-muted">{step.detail}</p>
                    </GlassCard>
                  </div>
                  <div className="absolute left-4 -ml-6 md:left-1/2 md:ml-0 md:-translate-x-1/2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-green/40 bg-brand-surface">
                      <div className="h-3 w-3 rounded-full bg-brand-green" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}



