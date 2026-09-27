import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the A2Z Academy hackathon organisers by email, phone, or the official WhatsApp group.",
};

export default function ContactPage() {
  const whatsAppUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "";
  const { email, phone, location } = siteConfig.contact;

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
      <SectionTitle
        title="Contact Us"
        subtitle="Questions about registration, rounds, or institutional participation? Reach out through any of the channels below."
      />

      <div className="mx-auto max-w-4xl">
        <RevealGroup className="grid gap-4 sm:grid-cols-3">
          {channels.map(({ Icon, label, value, href, hint }) => (
            <RevealItem key={label}>
              <GlassCard className="h-full">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 text-cyan-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {label}
                </h3>
                {href ? (
                  <Link
                    href={href}
                    className="mt-1 block break-words text-base font-semibold text-white transition-colors hover:text-cyan-300"
                  >
                    {value}
                  </Link>
                ) : (
                  <p className="mt-1 text-base font-semibold text-white">{value}</p>
                )}
                <p className="mt-2 text-xs leading-relaxed text-gray-500">{hint}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup className="mt-6">
          <RevealItem>
            <GlassCard className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Official WhatsApp Group
                  </h3>
                  <p className="text-sm text-gray-400">
                    All round instructions, dates, and shortlisting announcements happen here first.
                  </p>
                </div>
              </div>
              {whatsAppUrl ? (
                <Link
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/25"
                >
                  Join the group
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="shrink-0 rounded-lg border border-white/[0.12] px-4 py-2.5 text-xs text-gray-400">
                  Group link shared after registration
                </span>
              )}
            </GlassCard>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="mt-6">
          <RevealItem>
            <GlassCard>
              <h3 className="mb-3 text-base font-semibold text-white">Before you write to us</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  Include your <span className="text-cyan-300">Registration ID</span> (format
                  AZZ-{new Date().getFullYear()}-00001) so we can find your team quickly.
                </li>
                <li>
                  Looking for the rules? Check the{" "}
                  <Link href="/guidelines" className="text-cyan-300 hover:underline">
                    guidelines
                  </Link>
                  .
                </li>
                <li>
                  Curious about the format? See the{" "}
                  <Link href="/rounds" className="text-cyan-300 hover:underline">
                    rounds
                  </Link>{" "}
                  page.
                </li>
                <li>
                  Not registered yet?{" "}
                  <Link href="/register" className="text-cyan-300 hover:underline">
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
              <h3 className="text-lg font-semibold text-white">Send us a message</h3>
              <p className="mb-5 mt-1 text-sm text-gray-400">
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
