import Link from "next/link";
import { Github, Linkedin, Mail, MapPin, Phone, Zap } from "lucide-react";

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
    <footer className="w-full border-t border-white/[0.06] bg-[#0a0f24] py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                A2Z <span className="text-cyan-400">Academy</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Empowering Institutes with Tech-Based Training
            </p>
            <p className="text-xs text-gray-500">
              © {year} A2Z Academy. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-300">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-cyan-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-300">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>hello@a2zacademy.co.in</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-cyan-400" />
                <span>+91 9999999999</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span>India</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-300">Connect</h3>
            <div className="flex gap-3">
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-gray-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-400"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-gray-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-400"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-gray-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-400"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-white/[0.06] pt-4 text-center text-xs text-gray-500">
          <p>
            This website is for information & registration only. Hackathon rounds,
            PPT evaluation, judging, and offline activities are conducted outside this platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
