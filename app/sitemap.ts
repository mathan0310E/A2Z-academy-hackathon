import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Public, crawlable pages of the hackathon portal.
 * `/register` is included because registration is the entry path to the event.
 */
const ROUTES: Array<{ path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/register", priority: 0.9, changeFrequency: "weekly" },
  { path: "/hackathon", priority: 0.8, changeFrequency: "weekly" },
  { path: "/rounds", priority: 0.8, changeFrequency: "weekly" },
  { path: "/problem-statements", priority: 0.7, changeFrequency: "daily" },
  { path: "/team-formation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/guidelines", priority: 0.6, changeFrequency: "monthly" },
  { path: "/what-we-provide", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
