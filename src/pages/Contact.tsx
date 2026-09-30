import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/content";
import Seo from "@/components/Seo";

export default function ContactPage() {
  const whatsAppUrl = import.meta.env.VITE_WHATSAPP_GROUP_URL || "";
  const { email, phone, phoneAlt, location } = siteConfig.contact;

  const channels = [
    {
      Icon: Mail,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      hint: "Best for registration, team, and certificate queries.",
    },
    {
      Icon: Phone,
      label: "Phone",
      value: phone,
      href: `tel:${phone.replace(/\s+/g, "")}`,
      valueAlt: phoneAlt,
      hrefAlt: `tel:${phoneAlt.replace(/\s+/g, "")}`,
      hint: "Mon–Sat, 10:00 AM – 6:00 PM IST.",
    },
    {
      Icon: MapPin,
      label: "Location",
      value: location,
      href: undefined,
      hint: `Round 3 (offline) is hosted at ${siteConfig.hackathonInfo.round3Venue}.`,
    },
  ];

  return (
    <SectionWrapper className="pt-12 md:pt-16">
      <Seo
        title="Contact"
        description="Contact the A2Z Academy hackathon organisers by email, phone, or the official WhatsApp group."
        path="/contact"
      />
      <SectionTitle
        title="Contact Us"
        as="h1"
        subtitle="Questions about registration, rounds, or institutional participation? Reach out through any of the channels below."
      />

      <div className="mx-auto max-w-4xl">
        <RevealGroup className="grid gap-4 sm:grid-cols-3">
          {channels.map(({ Icon, label, value, href, valueAlt, hrefAlt, hint }) => (
            <RevealItem key={label}>
              <GlassCard className="h-full">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-green/10 to-brand-green/10 text-brand-green-ink">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                  {label}
                </h2>
                {href ? (
                  <a
                    href={href}
                    className="mt-1 block break-words text-base font-semibold text-brand-ink transition-colors hover:text-brand-green-ink"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 text-base font-semibold text-brand-ink">{value}</p>
                )}
                {valueAlt && hrefAlt && (
                  <a
                    href={hrefAlt}
                    className="mt-0.5 block break-words text-base font-semibold text-brand-ink transition-colors hover:text-brand-green-ink"
                  >
                    {valueAlt}
                  </a>
                )}
                <p className="mt-2 text-xs leading-relaxed text-brand-muted">{hint}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup className="mt-6">
          <RevealItem>
            <GlassCard className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-soft text-brand-green-ink">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-brand-ink">
                    Official WhatsApp Group
                  </h2>
                  <p className="text-sm text-brand-muted">
                    All round instructions, dates, and shortlisting announcements happen here first.
                  </p>
                </div>
              </div>
              {whatsAppUrl ? (
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-5 py-2.5 text-sm font-semibold text-brand-ink-strong shadow-brand"
                >
                  Join the group
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <span className="shrink-0 rounded-lg border border-brand-navy/15 px-4 py-2.5 text-xs text-brand-muted">
                  Group link shared after registration
                </span>
              )}
            </GlassCard>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="mt-6">
          <RevealItem>
            <GlassCard>
              <h2 className="mb-3 text-base font-bold text-brand-ink">Before you write to us</h2>
              <ul className="space-y-2 text-sm text-brand-muted">
                <li>
                  Include your <span className="text-brand-green-ink">Registration ID</span> (format
                  AZZ-{new Date().getFullYear()}-00001) so we can find your team quickly.
                </li>
                <li>
                  Looking for the rules? Check the{" "}
                  <Link to="/guidelines" className="text-brand-green-ink underline underline-offset-2 hover:decoration-2">
                    guidelines
                  </Link>
                  .
                </li>
                <li>
                  Curious about the format? See the{" "}
                  <Link to="/rounds" className="text-brand-green-ink underline underline-offset-2 hover:decoration-2">
                    rounds
                  </Link>{" "}
                  page.
                </li>
                <li>
                  Not registered yet?{" "}
                  <Link to="/register" className="text-brand-green-ink underline underline-offset-2 hover:decoration-2">
                    Register your team
                  </Link>{" "}
                  — it takes about two minutes.
                </li>
              </ul>
            </GlassCard>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="mt-10">
          <RevealItem>
            <GlassCard>
              <h2 className="text-lg font-bold text-brand-ink">Send us a message</h2>
              <p className="mb-5 mt-1 text-sm text-brand-muted">
                Registration changes, round questions, or institutional participation — send a
                message below and the A2Z Academy team will reply by email.
              </p>
              <ContactForm />
            </GlassCard>
          </RevealItem>
        </RevealGroup>
      </div>
    </SectionWrapper>
  );
}
