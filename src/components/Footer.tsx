import { Link } from "react-router-dom";
import { InstagramIcon, LinkedinIcon, WhatsAppIcon } from "@/components/icons/Brand";
import { Mail, MapPin, Phone } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { siteConfig } from "@/lib/content";

/**
 * Footer mirrors the reference site: a #222 charcoal panel with a lighter
 * #2A2A2A footnote strip, a wordmark + social row, three link columns, and a
 * legal bar carrying Terms, Privacy, Cookie Policy and Data Protection.
 */
const columns = [
  {
    links: [
      { href: "/hackathon", label: "Hackathon" },
      { href: "/rounds", label: "Rounds" },
      { href: "/problem-statements", label: "Problem Statements" },
      { href: "/guidelines", label: "Guidelines" },
    ],
  },
  {
    links: [
      { href: "/what-we-provide", label: "What We Provide" },
      { href: "/team-formation", label: "Team Formation" },
      { href: "/about", label: "About Us" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    links: [
      { href: "/contact", label: "Support" },
      { href: "/register", label: "Register Now" },
    ],
  },
];

const legalLinks = [
  { href: "/terms", label: "Terms and Conditions" },
  { href: "/privacy", label: "Privacy Statement" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/contact", label: "Data Protection" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-[#222222] text-white" data-testid="site-footer">
      <div className="border-b border-white/10 bg-[#2A2A2A] px-6 py-3">
        <p className="mx-auto max-w-7xl text-center text-[11px] italic text-white/80 sm:text-left">
          ¹ Registration is the entry path to the A2Z Academy Tech-Based Hackathon. Rounds, PPT
          evaluation, judging, and offline activities are conducted outside this platform.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-white" aria-label="A2Z Academy home">
            <BrandLogo variant="footer" />
          </Link>

          <div className="flex items-center gap-3" data-testid="footer-social-links">
            <a
              href="https://www.instagram.com/a2zacademy.in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D0D0D0] text-[#222222] transition-colors hover:bg-brand-green"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/a2z-academy-in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D0D0D0] text-[#222222] transition-colors hover:bg-brand-green"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.whatsappUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D0D0D0] text-[#222222] transition-colors hover:bg-brand-green"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {columns.map((col, i) => (
              <ul key={i} className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-white transition-colors hover:text-brand-green"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-6 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2 text-white/80">
              <Mail className="h-4 w-4 shrink-0 text-brand-green" />
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="transition-colors hover:text-brand-green"
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <Phone className="h-4 w-4 shrink-0 text-brand-green" />
              <span className="flex flex-wrap items-center gap-x-2">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-brand-green"
                >
                  {siteConfig.contact.phone}
                </a>
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
                <a
                  href={`tel:${siteConfig.contact.phoneAlt.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-brand-green"
                >
                  {siteConfig.contact.phoneAlt}
                </a>
              </span>
            </li>
            <li className="flex items-center gap-2 text-white/80">
              <MapPin className="h-4 w-4 shrink-0 text-brand-green" />
              <span>{siteConfig.contact.location}</span>
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/90 sm:flex-row sm:items-center sm:justify-between">
          <span data-testid="footer-copyright">
            © {year} A2Z Academy. All rights reserved.
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-semibold">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-white transition-colors hover:text-brand-green"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
