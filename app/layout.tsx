import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppCheckProvider } from "@/contexts/AppCheckContext";
import { metadata as siteMetadata } from "./metadata";
import { puvi } from "./fonts";
import StructuredData from "@/components/StructuredData";

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={puvi.variable}>
      <head>
        {/* Reveal animations start hidden; without JS they must never stay hidden. */}
        <noscript>
          <style>{`.reveal-item,.hero-enter-item{opacity:1!important;transform:none!important;animation:none!important}.reveal-root{opacity:1!important;transform:none!important}.underline-draw{animation:none!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="bg-brand-surface font-sans">
        <StructuredData />
        {/* Background grid pattern overlay */}
        <div
          className="fixed inset-0 z-0 pointer-events-none grid-pattern opacity-[0.5]"
          aria-hidden="true"
        />
        <AppCheckProvider>
          <div className="relative z-10 flex min-h-screen flex-col bg-white/0">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppCheckProvider>
      </body>
    </html>
  );
}

