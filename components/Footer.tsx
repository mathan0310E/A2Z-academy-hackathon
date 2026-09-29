import Link from "next/link";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const year = new Date().getFullYear();

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

  return (
    <footer className="mt-auto w-full border-t-4 border-brand-green bg-brand-navy py-12 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BrandLogo
                wordmarkClassName="text-white"
                className="[&_span:first-child]:ring-white/15"
              />
            </div>
            <p className="text-sm text-white/70">
              Empowering Institutes with Tech-Based Training
            </p>
            <p className="text-xs text-white/50">
              © {year} A2Z Academy. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-brand-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 text-brand-green" />
                <span>hello@a2zacademy.co.in</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 text-brand-green" />
                <span>+91 9999999999</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 text-brand-green" />
                <span>India</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Connect</h3>
            <div className="flex gap-3">
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white/70 transition-colors hover:border-brand-green hover:bg-brand-green hover:text-brand-navy"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white/70 transition-colors hover:border-brand-green hover:bg-brand-green hover:text-brand-navy"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white/70 transition-colors hover:border-brand-green hover:bg-brand-green hover:text-brand-navy"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-white/50">
          <p>
            This website is for information &amp; registration only. Hackathon rounds, PPT
            evaluation, judging, and offline activities are conducted outside this platform.
          </p>
        </div>
      </div>
    </footer>
  );
}