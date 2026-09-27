import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Crown, Users, UserCheck, Users2 } from "lucide-react";
import { SectionWrapper, SectionTitle, GlassCard } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import ImportantNotice from "@/components/ImportantNotice";
import { siteConfig } from "@/lib/content";
import { TEAM_TYPES } from "@/types";

export const metadata: Metadata = {
  title: "Team Formation",
  description:
    "How teams work in the A2Z Academy Tech-Based Hackathon: Duo, Tri, and Squad sizes, the team leader role, and cross-institution rules.",
};

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
  return (
    <>
      <SectionWrapper className="pt-12 md:pt-16">
        <SectionTitle
          title="Team Formation"
          subtitle={`Every team must have ${siteConfig.hackathonInfo.teamSize} and pick exactly one team type during registration. One registration per team.`}
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
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 text-cyan-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        {type.members} members
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {type.value.charAt(0).toUpperCase() + type.value.slice(1)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
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
                  <div className="mb-3 flex items-center gap-2 text-cyan-300">
                    <Users className="h-5 w-5" />
                    <h3 className="text-base font-semibold text-white">Member details</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
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
                  <div className="mb-3 flex items-center gap-2 text-cyan-300">
                    <Crown className="h-5 w-5" />
                    <h3 className="text-base font-semibold text-white">The team leader</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
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
                  <div className="mb-3 flex items-center gap-2 text-cyan-300">
                    <UserCheck className="h-5 w-5" />
                    <h3 className="text-base font-semibold text-white">Cross-institution teams</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
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
                  <div className="mb-3 flex items-center gap-2 text-cyan-300">
                    <Users2 className="h-5 w-5" />
                    <h3 className="text-base font-semibold text-white">Once submitted</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                      Your team gets a unique Registration ID — save it, it is needed for all future
                      communication.
                    </li>
                    <li>
                      Need a change afterwards? Message the organisers via the{" "}
                      <Link href="/contact" className="text-cyan-300 hover:underline">
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
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-2xl shadow-cyan-500/25 transition-transform hover:scale-105"
            >
              Register your team
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-xs text-gray-500">
              Team types: {siteConfig.hackathonInfo.teamTypes}
            </p>
          </div>
        </div>
      </SectionWrapper>

      <ImportantNotice />
    </>
  );
}