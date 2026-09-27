import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "A2Z Academy | Empowering Institutes with Tech-Based Training",
    template: `%s | A2Z Academy`,
  },
  description:
    "A2Z Academy empowers institutes with tech-based training. Explore the A2Z Academy Tech-Based Hackathon — explore problem statements, register your team, and build innovative solutions.",
  keywords: [
    "A2Z Academy",
    "hackathon",
    "tech-based training",
    "problem statements",
    "team registration",
    "innovation",
    "coding",
  ],
  authors: [{ name: "A2Z Academy" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "A2Z Academy — Empowering Institutes with Tech-Based Training",
    description:
      "A2Z Academy Tech-Based Hackathon. Explore problem statements and register your team.",
    locale: "en_IN",
  },
  icons: {
    icon: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};
