import { Users, Trophy, MessageCircle } from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import RegistrationForm from "@/components/register/RegistrationForm";
import { siteConfig } from "@/lib/content";
import Seo from "@/components/Seo";

export default function RegisterPage() {
  const facts = [
    {
      Icon: Users,
      label: "Team size",
      value: siteConfig.hackathonInfo.teamSize,
    },
    {
      Icon: Trophy,
      label: "Round 3 (offline)",
      value: `${siteConfig.hackathonInfo.round3Venue} · ${siteConfig.hackathonInfo.round3Fee}`,
    },
    {
      Icon: MessageCircle,
      label: "All updates via",
      value: siteConfig.hackathonInfo.communication,
    },
  ];

  return (
    <SectionWrapper className="pt-12 md:pt-16">
      <Seo
        title="Register Your Team"
        description="Register your team for the A2Z Academy Tech-Based Hackathon. Duo, Tri, and Squad team types, instant Registration ID, and email confirmation for every member."
        path="/register"
      />
      <SectionTitle
        title="Register Your Team"
        subtitle="Complete the three steps below. You will receive a unique Registration ID instantly and a confirmation email for every member."
      />

      <div className="mx-auto max-w-3xl">
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {facts.map(({ Icon, label, value }) => (
            <GlassCard key={label} className="!p-4">
              <div className="mb-2 flex items-center gap-2 text-brand-green">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  {label}
                </span>
              </div>
              <p className="text-sm font-medium text-brand-ink">{value}</p>
            </GlassCard>
          ))}
        </div>

        <RegistrationForm />

        <p className="mt-6 text-center text-xs leading-relaxed text-brand-muted">
          Registration is the only entry path to the hackathon. Team names and member emails must be
          unique — duplicates are rejected automatically. Changes after submitting can be requested
          through the{" "}
          <a href="/contact" className="text-brand-green hover:underline">
            contact page
          </a>
          .
        </p>
      </div>
    </SectionWrapper>
  );
}
