import Link from "next/link";
import { ArrowRight, Compass, Home, Trophy } from "lucide-react";
import { SectionWrapper, GlassCard } from "@/components/ui/Section";

const HELPFUL_LINKS = [
  { href: "/hackathon", label: "Hackathon overview", Icon: Trophy },
  { href: "/rounds", label: "Rounds & format", Icon: Compass },
  { href: "/register", label: "Register your team", Icon: ArrowRight },
];

export default function NotFound() {
  return (
    <SectionWrapper className="pt-16 md:pt-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-300">
          404 — Page not found
        </span>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          This page has left the circuit
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-400">
          The link you followed does not exist on the A2Z Academy hackathon portal. It may have been
          moved, or the URL might be mistyped.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.15] bg-white/[0.04] px-6 py-3 text-sm font-medium text-gray-200 transition-colors hover:border-cyan-500/40 hover:text-white"
          >
            Contact the organisers
          </Link>
        </div>

        <GlassCard className="mt-12 text-left">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Popular pages
          </h2>
          <ul className="space-y-2">
            {HELPFUL_LINKS.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:underline"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </SectionWrapper>
  );
}
