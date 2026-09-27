import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppCheckProvider } from "@/contexts/AppCheckContext";
import { metadata as siteMetadata } from "./metadata";

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0f24]">
        {/* Background grid/circuit pattern overlay */}
        <div
          className="fixed inset-0 z-0 pointer-events-none grid-pattern opacity-[0.04]"
          aria-hidden="true"
        />
        <AppCheckProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppCheckProvider>
      </body>
    </html>
  );
}

