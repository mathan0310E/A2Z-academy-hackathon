import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, Trophy } from "lucide-react";

const STATS = [
  { value: "2–4", label: "Members per team" },
  { value: "3", label: "Competitive rounds" },
  { value: "40 → 25", label: "Teams shortlisted" },
  { value: "₹250", label: "Round 3 fee / head" },
];

const DOMAINS = [
  "Cyber Security",
  "Cloud Security",
  "IoT Security",
  "Full Stack",
  "Ethical Hacking",
];

/**
 * Static hero. Entrance animation is pure CSS (see `.hero-enter` in globals.css)
 * so this stays a Server Component with zero animation runtime.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 15% 20%, rgba(113,191,67,0.12) 0%, transparent 55%), radial-gradient(900px circle at 85% 75%, rgba(26,51,90,0.08) 0%, transparent 55%)",
        }}
      />
      {/* Ambient drifting shapes — decorative only */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-24 h-40 w-40 animate-float-slow rounded-full bg-brand-green/10 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 bottom-20 h-56 w-56 animate-float rounded-full bg-brand-navy/5 blur-3xl"
      />

      <div className="relative container mx-auto px-4 md:px-6">
        <div className="hero-enter mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="hero-enter-item mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 bg-brand-green-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-green-hover">
              <Trophy className="h-3.5 w-3.5" />
              Tech-Based Hackathon
            </span>
          </div>

          <h1 className="hero-enter-item text-4xl font-extrabold leading-tight tracking-tight text-brand-navy sm:text-5xl md:text-6xl">
            Build your skills.
            <br />
            <span className="text-brand-green">Build your future.</span>
          </h1>

          <p className="hero-enter-item mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-muted sm:text-lg">
            A2Z Academy empowers institutes with tech-based training. Join the{" "}
            <span className="font-semibold text-brand-navy">A2Z Academy Tech-Based Hackathon</span> —
            explore technology, solve real-world problems, and build innovative solutions.
          </p>

          <div className="hero-enter-item mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="btn-pill-primary group w-full sm:w-auto">
              Start Registration
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/hackathon" className="btn-pill-outline w-full sm:w-auto">
              <BookOpen className="h-4 w-4" />
              Explore Hackathon
            </Link>
          </div>

          <div className="hero-enter-item mt-10 flex flex-wrap justify-center gap-2">
            {DOMAINS.map((domain) => (
              <span
                key={domain}
                className="rounded-full border border-brand-navy/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-navy shadow-card"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>

        {/* Stats strip — mirrors the reference site's metric row */}
        <div className="hero-enter mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="hero-enter-item">
              <div className="hover-lift h-full rounded-xl border border-brand-navy/10 bg-white p-5 text-center shadow-card">
                <p className="text-2xl font-extrabold text-brand-green md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-brand-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-14 flex justify-center">
        <span className="flex items-center gap-2 text-xs font-medium text-brand-muted">
          Scroll to explore
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </span>
      </div>
    </section>
  );
}
