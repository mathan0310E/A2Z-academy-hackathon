import { Link } from "react-router-dom";
import { ArrowRight, Crown, Users, UserCheck, Users2 } from "../components/icons/Icons";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import ImportantNotice from "@/components/ImportantNotice";
import { usePortalContent } from "@/contexts/PortalContentContext";
import { TEAM_TYPES } from "@/types";
import Seo from "@/components/Seo";

const TEAM_TYPE_ICONS = {
  duo: Users2,
  tri: Users,
  squad: Users2,
} as const;

const TEAM_ROLE_NOTES: Record<string, string> = {
  duo: "Balanced pair — pick complementary strengths, for example one builder and one presenter.",
  tri: "Small but versatile — a good fit when you have a developer, a designer, and an analyst.",
  squad: "Full squad — best for larger builds that need dedicated backend, frontend, and research roles.",
};

export default function TeamFormationPage() {
  const { hackathonInfo } = usePortalContent();

  return (
    <>
      <Seo
        title="Team Formation"
        description="How teams work in the A2Z Academy Tech-Based Hackathon: Duo, Tri, and Squad sizes, the team leader role, and cross-institution rules."
        path="/team-formation"
      />
      <SectionWrapper className="pt-12 md:pt-16">
        <SectionTitle
          as="h1"
          title="Team Formation"
          subtitle={`Every team must have ${hackathonInfo.teamSize} and pick exactly one team type during registration. One registration per team.`}
        />

        <div className="mx-auto max-w-5xl">
          {/* Team types */}
          <RevealGroup className="grid gap-4 md:grid-cols-3">
            {TEAM_TYPES.map((type) => {
              const Icon = TEAM_TYPE_ICONS[type.value] ?? Users;
              return (
                <RevealItem key={type.value}>
                  <GlassCard className="h-full">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-green/10 to-brand-green/10 text-brand-green-ink">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-brand-green/40 bg-brand-green-soft px-3 py-1 text-xs font-semibold text-brand-green-ink">
                        {type.members} members
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-brand-ink">
                      {type.value.charAt(0).toUpperCase() + type.value.slice(1)}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                      {TEAM_ROLE_NOTES[type.value]}
                    </p>
                  </GlassCard>
                </RevealItem>
              );
            })}
          </RevealGroup>

          {/* How it works */}
          <div className="mt-14">
            <SectionTitle
              title="How team registration works"
              subtitle="The registration form adapts itself to the team type you choose."
            />
            <RevealGroup className="grid gap-4 sm:grid-cols-2">
              <RevealItem>
                <GlassCard className="h-full">
                  <div className="mb-3 flex items-center gap-2 text-brand-green-ink">
                    <Users className="h-5 w-5" />
                    <h2 className="text-base font-bold text-brand-ink">Member details</h2>
                  </div>
                  <ul className="space-y-2 text-sm text-brand-muted">
                    <li>Every member needs their own name, phone, and email.</li>
                    <li>
                      Emails must be unique across the team — one email can only appear in one team.
                    </li>
                    <li>Each member also provides college, department, and year of study.</li>
                  </ul>
                </GlassCard>
              </RevealItem>

              <RevealItem>
                <GlassCard className="h-full">
                  <div className="mb-3 flex items-center gap-2 text-brand-green-ink">
                    <Crown className="h-5 w-5" />
                    <h2 className="text-base font-bold text-brand-ink">The team leader</h2>
                  </div>
                  <ul className="space-y-2 text-sm text-brand-muted">
                    <li>Exactly one member is marked as leader during registration.</li>
                    <li>
                      The leader is the single point of contact and receives the confirmation email.
                    </li>
                    <li>Every other member also receives their own confirmation email.</li>
                  </ul>
                </GlassCard>
              </RevealItem>

              <RevealItem>
                <GlassCard className="h-full">
                  <div className="mb-3 flex items-center gap-2 text-brand-green-ink">
                    <UserCheck className="h-5 w-5" />
                    <h2 className="text-base font-bold text-brand-ink">Cross-institution teams</h2>
                  </div>
                  <ul className="space-y-2 text-sm text-brand-muted">
                    <li>Members may come from the same college or from different institutions.</li>
                    <li>
                      Each member enters their own college and department — mixed teams are
                      supported.
                    </li>
                  </ul>
                </GlassCard>
              </RevealItem>

              <RevealItem>
                <GlassCard className="h-full">
                  <div className="mb-3 flex items-center gap-2 text-brand-green-ink">
                    <Users2 className="h-5 w-5" />
                    <h2 className="text-base font-bold text-brand-ink">Once submitted</h2>
                  </div>
                  <ul className="space-y-2 text-sm text-brand-muted">
                    <li>
                      Your team gets a unique Registration ID — save it, it is needed for all future
                      communication.
                    </li>
                    <li>
                      Need a change afterwards? Message the organisers via the{" "}
                      <Link to="/contact" className="text-brand-green-ink underline underline-offset-2 hover:decoration-2">
                        contact page
                      </Link>
                      .
                    </li>
                  </ul>
                </GlassCard>
              </RevealItem>
            </RevealGroup>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-8 py-3.5 text-base font-semibold text-brand-ink-strong shadow-brand-lg transition-transform hover:scale-105"
            >
              Register your team
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-xs text-brand-muted">
              Team types: {hackathonInfo.teamTypes}
            </p>
          </div>
        </div>
      </SectionWrapper>

      <ImportantNotice />
    </>
  );
}