import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "A2Z Academy empowers institutes with tech-based training. Explore the A2Z Academy Tech-Based Hackathon — solve real-world problems, register your team of 2–4 members, and build innovative solutions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "A2Z Academy | Empowering Institutes with Tech-Based Training",
    template: "%s | A2Z Academy",
  },
  description: DESCRIPTION,
  applicationName: "A2Z Academy",
  keywords: [
    "A2Z Academy",
    "hackathon",
    "tech-based training",
    "problem statements",
    "team registration",
    "innovation",
    "coding",
    "certificates",
  ],
  authors: [{ name: "A2Z Academy", url: SITE_URL }],
  creator: "A2Z Academy",
  publisher: "A2Z Academy",
  category: "education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "A2Z Academy — Empowering Institutes with Tech-Based Training",
    description: DESCRIPTION,
    siteName: "A2Z Academy",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "A2Z Academy — Empowering Institutes with Tech-Based Training",
    description:
      "A2Z Academy Tech-Based Hackathon. Explore problem statements and register your team.",
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "32x32" }],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "theme-color": "#71bf43",
  },
};
