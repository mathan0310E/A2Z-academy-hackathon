import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { SectionWrapper } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Seo from "@/components/Seo";
import { siteConfig } from "@/lib/content";

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

/**
 * Shared layout for the legal pages (Privacy, Terms, Cookies), matching the
 * reference site's "LEGAL" eyebrow + effective-date header treatment.
 */
export default function LegalPage({
  title,
  description,
  path,
  effective,
  sections,
}: {
  title: string;
  description: string;
  path: string;
  effective: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <Seo title={title} description={description} path={path} />

      <SectionWrapper className="pt-12 md:pt-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green-ink">
            Legal
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-brand-muted">Effective: {effective}</p>

          <div className="mt-8 space-y-8">
            {sections.map((section, i) => (
              <Reveal key={section.heading} delay={i * 0.05}>
                <section>
                  <h2 className="font-display text-lg font-bold text-brand-ink">
                    {section.heading}
                  </h2>
                  <div className="mt-2 space-y-3 text-sm leading-relaxed text-brand-ink">
                    {section.body}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="glass-card mt-12 p-6">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-ink" />
                <div>
                  <h2 className="font-display text-base font-bold text-brand-ink">
                    Questions about {siteConfig.name}?
                  </h2>
                  <p className="mt-1 text-sm text-brand-ink">
                    Send us a message through our contact form and our team will get back to you.
                  </p>
                  <Link
                    to="/contact"
                    className="group mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-green-ink hover:underline"
                  >
                    Go to contact form
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionWrapper>
    </>
  );
}
