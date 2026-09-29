import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/Button";

/**
 * Header mirrors the reference site: a sticky 4.25rem white bar with a
 * border-bottom, muted nav links that darken on hover, a square "Login"
 * outline button, and a green pill CTA.
 *
 * The nav labels stay hackathon-specific (the portal's own information
 * architecture) while the visual treatment follows the brand header.
 */
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/hackathon", label: "Hackathon" },
  { href: "/rounds", label: "Rounds" },
  { href: "/problem-statements", label: "Problem Statements" },
  { href: "/team-formation", label: "Teams" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = useLocation().pathname;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-slate-200 bg-white transition-shadow",
        scrolled && "shadow-[0_1px_16px_rgba(15,35,64,0.07)]"
      )}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-brand-green transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link to="/" className="flex items-center" aria-label="A2Z Academy home">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "academy-nav-link relative whitespace-nowrap text-[13px] font-semibold transition-colors xl:text-[15px]",
                isActive(href) ? "text-brand-green" : "text-brand-muted hover:text-brand-ink"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/guidelines"
            className="rounded-full border-2 border-brand-ink px-5 py-2 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-surface"
          >
            Guidelines
          </Link>
          <Button asChild variant="pill" size="pill">
            <Link to="/register">Register Now</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-full p-2 text-brand-ink transition-colors hover:bg-brand-surface lg:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer — a CSS grid-rows transition keeps the markup static. */}
      <div
        className={cn(
          "grid overflow-hidden border-slate-200 bg-white transition-all duration-300 lg:hidden",
          mobileOpen ? "grid-rows-[1fr] border-t opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {navLinks.map(({ href, label }, i) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileOpen(false)}
                style={mobileOpen ? { animationDelay: `${i * 40}ms` } : undefined}
                className={cn(
                  "rounded-none px-3 py-2.5 text-sm font-semibold transition-colors",
                  mobileOpen && "drawer-item",
                  isActive(href)
                    ? "bg-brand-green-soft text-brand-green-hover"
                    : "text-brand-ink hover:bg-brand-surface hover:text-brand-green"
                )}
              >
                {label}
              </Link>
            ))}
            <Button asChild variant="pill" size="pill" className="mt-2 w-full">
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                Register Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
