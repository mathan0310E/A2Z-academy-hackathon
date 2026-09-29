import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import ImportantNotice from "@/components/ImportantNotice";
import { siteConfig } from "@/lib/content";
import Seo from "@/components/Seo";

/** FAQPage structured data so search engines can surface the Q&A directly. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: siteConfig.faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <Seo
        title="FAQ"
        description="Frequently asked questions about the A2Z Academy Tech-Based Hackathon — registration, team size, rounds, and communication."
        path="/faq"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
              <h3 className="mb-2 text-lg font-semibold text-brand-navy">Ready to compete?</h3>
              <p className="mb-4 text-sm text-brand-muted">
                Registration takes about two minutes. You will receive a unique Registration ID on
                success.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-5 py-2.5 text-sm font-semibold text-brand-ink-strong shadow-brand transition-transform hover:scale-105"
              >
                Register your team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </GlassCard>
          </RevealItem>

          <RevealItem>
            <GlassCard className="h-full">
              <h3 className="mb-2 text-lg font-semibold text-brand-navy">Something not covered?</h3>
              <p className="mb-4 text-sm text-brand-muted">
                Reach the organisers directly — questions about rounds, eligibility, and schedules are
                answered there.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-green bg-white px-5 py-2.5 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-green-soft"
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
