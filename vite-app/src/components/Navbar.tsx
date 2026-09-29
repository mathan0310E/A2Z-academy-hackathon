
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/BrandLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About A2Z" },
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
    <nav
      className={cn(
        "sticky top-0 z-40 w-full border-b border-brand-navy/10 bg-white/95 backdrop-blur-md transition-shadow",
        scrolled && "shadow-card"
      )}
    >
      {/* Reading progress indicator */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-0.5 origin-left bg-brand-green transition-transform duration-150 ease-out"
        style={{ width: "100%", transform: `scaleX(${progress})` }}
      />
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-18 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center" aria-label="A2Z Academy home">
          <BrandLogo wordmarkClassName="text-brand-navy" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                isActive(href) ? "text-brand-green" : "text-brand-ink hover:text-brand-green"
              )}
            >
              {label}
              {isActive(href) && (
                <span className="absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full bg-brand-green" />
              )}
            </Link>
          ))}
          <Link to="/register" className="btn-pill-primary ml-3 !px-5 !py-2.5">
            Register Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-brand-navy hover:bg-brand-green-soft"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — CSS grid-rows transition keeps this server-renderable markup */}
      <div
        className={cn(
          "grid overflow-hidden border-brand-navy/10 bg-white transition-all duration-200 lg:hidden",
          mobileOpen ? "grid-rows-[1fr] border-t opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-semibold transition-colors",
                  isActive(href)
                    ? "bg-brand-green-soft text-brand-green"
                    : "text-brand-ink hover:bg-brand-green-soft hover:text-brand-green"
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="btn-pill-primary mt-2 w-full"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}