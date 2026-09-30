import { Award, Code, Globe, Laptop, Lightbulb, ShieldCheck, Trophy } from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/content";
import Seo from "@/components/Seo";

const PROVIDE_ICONS: Record<string, any> = {
  Laptop,
  Code,
  Award,
  Lightbulb,
  Trophy,
  Globe,
};

export default function WhatWeProvidePage() {
  const { provides } = siteConfig;

  return (
    <SectionWrapper className="pt-12 md:pt-16">
      <Seo
        title="What We Provide"
        description="Technology training, workshops, skill development, project development, hackathons, and institutional programs from A2Z Academy."
        path="/what-we-provide"
      />
      <SectionTitle
        title="What A2Z Academy Provides"
        as="h1"
        subtitle="Comprehensive technology education and innovation services for institutes and students."
      />

      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {provides.map((item) => {
          const Icon = PROVIDE_ICONS[item.icon] ?? ShieldCheck;

          return (
            <RevealItem key={item.title} className="h-full">
              <GlassCard className="group flex h-full flex-col text-center transition-all duration-300 hover:border-brand-green/40">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-green/10 to-brand-green/5 text-brand-green-ink transition-colors group-hover:from-brand-green/20">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="mb-2 text-lg font-bold text-brand-ink">{item.title}</h2>
                <p className="flex-1 text-sm text-brand-muted">{item.description}</p>
              </GlassCard>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </SectionWrapper>
  );
}
