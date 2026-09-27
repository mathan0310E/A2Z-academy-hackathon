import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import ImportantNotice from "@/components/ImportantNotice";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about the A2Z Academy Tech-Based Hackathon — registration, team size, rounds, and communication.",
};

export default function FaqPage() {
  return (
    <>
      <SectionWrapper className="pt-12 md:pt-16">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before you register. Still unsure? The official WhatsApp group and contact page are always open."
        />

        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={siteConfig.faqs} />
        </div>

        <RevealGroup className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          <RevealItem>
            <GlassCard className="h-full">
              <h3 className="mb-2 text-lg font-semibold text-white">Ready to compete?</h3>
              <p className="mb-4 text-sm text-gray-400">
                Registration takes about two minutes. You will receive a unique Registration ID on
                success.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105"
              >
                Register your team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </GlassCard>
          </RevealItem>

          <RevealItem>
            <GlassCard className="h-full">
              <h3 className="mb-2 text-lg font-semibold text-white">Something not covered?</h3>
              <p className="mb-4 text-sm text-gray-400">
                Reach the organisers directly — questions about rounds, eligibility, and schedules are
                answered there.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.15] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:border-cyan-500/40 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Contact A2Z Academy
              </Link>
            </GlassCard>
          </RevealItem>
        </RevealGroup>
      </SectionWrapper>

      <ImportantNotice />
    </>
  );
}
