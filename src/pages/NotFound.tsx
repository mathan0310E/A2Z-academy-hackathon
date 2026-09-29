import { Link } from "react-router-dom";
import { ArrowRight, Compass, Home, Trophy } from "lucide-react";
import { SectionWrapper, GlassCard } from "@/components/ui/Section";
import Seo from "@/components/Seo";

const HELPFUL_LINKS = [
  { href: "/hackathon", label: "Hackathon overview", Icon: Trophy },
  { href: "/rounds", label: "Rounds & format", Icon: Compass },
  { href: "/register", label: "Register your team", Icon: ArrowRight },
];

export default function NotFound() {
  return (
    <SectionWrapper className="pt-16 md:pt-24">
      <Seo
        title="Page Not Found"
        description="The link you followed does not exist on the A2Z Academy hackathon portal. It may have been moved, or the URL might be mistyped."
        path="/404"
        noIndex
      />
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 bg-brand-green-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-green-hover">
          404 — Page not found
        </span>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
          This page has left the circuit
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-brand-muted">
          The link you followed does not exist on the A2Z Academy hackathon portal. It may have been
          moved, or the URL might be mistyped.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green hover:bg-brand-green-hover px-6 py-3 text-sm font-semibold text-brand-ink-strong shadow-brand transition-transform hover:scale-105"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-green bg-white px-6 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-green-soft"
          >
            Contact the organisers
          </Link>
        </div>

        <GlassCard className="mt-12 text-left">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-muted">
            Popular pages
          </h2>
          <ul className="space-y-2">
            {HELPFUL_LINKS.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  to={href}
                  className="inline-flex items-center gap-2 text-sm text-brand-green-hover hover:underline"
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
