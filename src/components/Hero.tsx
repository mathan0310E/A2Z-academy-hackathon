import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Trophy } from "lucide-react";
import MatrixRain from "@/components/MatrixRain";

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
 * Hero. Composition mirrors the reference site: a two-column grid with the
 * headline/copy/CTAs on the left and a card grid on the right, collapsing to a
 * single column below `lg`. Entrance animation is pure CSS (see `.hero-enter`
 * in globals.css) so this ships no animation runtime.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      {/* Matrix rain sits at the back of the stack; the gradient wash and the
          drifting blobs layer over it, and all of it is decorative. */}
      <MatrixRain className="pointer-events-none absolute inset-0 h-full w-full" />
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

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div className="hero-enter space-y-6">
          {/* Badge */}
          <div className="hero-enter-item">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 bg-brand-green-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-green-ink">
              <Trophy className="h-3.5 w-3.5" />
              Tech-Based Hackathon
            </span>
          </div>

          <h1 className="hero-enter-item font-display text-5xl font-bold leading-[1.05] text-brand-ink sm:text-6xl">
            Build your skills.
            <br />
            <span className="text-brand-green-ink">Build your future.</span>
          </h1>

          <p className="hero-enter-item max-w-xl text-base leading-relaxed text-brand-muted sm:text-lg">
            A2Z Academy empowers institutes with tech-based training. Join the{" "}
            <span className="font-semibold text-brand-ink">A2Z Academy Tech-Based Hackathon</span> —
            explore technology, solve real-world problems, and build innovative solutions.
          </p>

          <div className="hero-enter-item flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="btn-pill-primary group h-11 text-base"
            >
              Start Registration
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/hackathon" className="btn-pill-outline h-11 text-base">
              <BookOpen className="h-4 w-4" />
              Explore Hackathon
            </Link>
          </div>

          <div className="hero-enter-item flex flex-wrap gap-2 pt-2">
            {DOMAINS.map((domain) => (
              <span
                key={domain}
                className="rounded-full border border-brand-navy/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-ink shadow-card"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>

        {/* Card grid — mirrors the reference's right-hand visual column */}
        <div className="hero-enter grid grid-cols-2 gap-3 sm:gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="hero-enter-item">
              <div className="glass-card h-full p-5">
                <p className="text-2xl font-extrabold text-brand-green-ink md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-brand-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
