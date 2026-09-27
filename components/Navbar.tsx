"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#0a0f24]/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 8 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500"
          >
            <Zap className="h-5 w-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold text-white">
            A2Z <span className="text-cyan-400">Academy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                isActive(href)
                  ? "text-cyan-300"
                  : "text-gray-300 hover:text-white"
              )}
            >
              {label}
              {isActive(href) && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                />
              )}
            </Link>
          ))}
          <Link
            href="/register"
            className="ml-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105"
          >
            Register Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-gray-300 hover:bg-white/5 hover:text-white"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/[0.06] bg-[#0a0f24]/90 backdrop-blur-xl"
          >
            <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(href)
                      ? "bg-cyan-500/10 text-cyan-300"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="mt-1 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Register Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
