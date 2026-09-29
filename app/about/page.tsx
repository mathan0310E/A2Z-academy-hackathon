import type { Metadata } from "next";
import { Eye, Target, TrendingUp } from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "A2Z Academy empowers educational institutions with tech-based training, practical learning, project development, and innovation-driven hackathons.",
};

const FOCUSES = [
  "Technology training",
  "Practical learning",
  "Skill development",
  "Project development",
  "Innovation",
  "Institutional training",
  "Industry-oriented learning",
  "Hackathons",
];

export default function AboutPage() {
  const { whoWeAre, mission, vision } = siteConfig.about;

  const pillars = [
    { title: "Who We Are", Icon: Eye, body: whoWeAre },
    { title: "Mission", Icon: Target, body: mission },
    { title: "Vision", Icon: TrendingUp, body: vision },
  ];

  return (
    <SectionWrapper id="about" className="pt-12 md:pt-16">
      <SectionTitle title="About A2Z Academy" subtitle="Who we are and what we stand for." />

      <div className="mx-auto max-w-4xl space-y-6">
        {pillars.map(({ title, Icon, body }, index) => (
          <Reveal key={title} delay={index * 0.1}>
            <GlassCard className="p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-green/10 to-brand-green/5 text-brand-green">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-brand-navy">{title}</h3>
              <p className="leading-relaxed text-brand-ink">{body}</p>
            </GlassCard>
          </Reveal>
        ))}

        <Reveal delay={0.3}>
          <GlassCard className="p-8">
            <h3 className="mb-4 text-xl font-semibold text-brand-navy">Our Focus</h3>
            <ul className="grid grid-cols-2 gap-3 text-sm text-brand-ink sm:grid-cols-4">
              {FOCUSES.map((focus) => (
                <li key={focus} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                  {focus}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>

        <p className="pt-4 text-center text-xs text-brand-muted">
          Content is managed and can be updated via the A2Z Academy admin panel.
        </p>
      </div>
    </SectionWrapper>
  );
}
