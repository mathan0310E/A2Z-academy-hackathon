import express from "express";
import compression from "compression";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import registerRoutes from "./routes/register";
import contactRoutes from "./routes/contact";
import { SITE_URL } from "../src/lib/site";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");
const PORT = Number(process.env.PORT || 12000);

const app = express();
app.disable("x-powered-by");
// Behind nginx (one proxy hop), so `req.ip` is the real client and a
// client-supplied X-Forwarded-For cannot choose its own rate-limit bucket.
app.set("trust proxy", 1);
app.use(compression());
app.use(express.json({ limit: "1mb" }));

// ---- Security + caching headers (ported from next.config.mjs) ----
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "on");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // Vite emits one inline module script; reCAPTCHA + Firebase need the rest.
      "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://apis.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net https://www.google.com wss://*.firebaseio.com",
      "frame-src https://www.google.com https://a2z-acadamey-hackathon.firebaseapp.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ")
  );
  next();
});

// ---- API ----
// CORS is an explicit allow-list. `Access-Control-Allow-Origin: *` is never sent
// alongside credentials, and only known site origins may call the API.
const PUBLIC_ORIGINS = (process.env.PUBLIC_ORIGIN || "")
  .split(",")
  .map((value) => value.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use("/api", (req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    const allowed = PUBLIC_ORIGINS.includes(origin.replace(/\/$/, ""));
    if (allowed) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Vary", "Origin");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  next();
});
// Preflight: Next responded to OPTIONS automatically; Express needs it explicit.
app.options("/api/*", (_req, res) => res.sendStatus(204));
app.use("/api/register", registerRoutes);
app.use("/api/contact", contactRoutes);

// ---- Crawler files ----
const CRAWLABLE_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
}> = [
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
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

function absoluteUrl(p: string): string {
  if (!p || p === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${p.startsWith("/") ? p : `/${p}`}`;
}

app.get("/sitemap.xml", (_req, res) => {
  const lastmod = new Date().toISOString();
  const urls = CRAWLABLE_ROUTES.map(
    ({ path: p, priority, changeFrequency }) =>
      `  <url>\n    <loc>${absoluteUrl(p)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changeFrequency}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  ).join("\n");
  res
    .type("application/xml")
    .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
});

app.get("/robots.txt", (_req, res) => {
  res
    .type("text/plain")
    .send(`User-Agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\nHost: ${absoluteUrl("/")}\n`);
});

// ---- Static assets ----
// Content-hashed build output is safe to cache forever.
app.use(
  "/assets",
  express.static(path.join(DIST, "assets"), {
    immutable: true,
    maxAge: "1y",
  })
);
app.use(
  "/logo",
  express.static(path.join(DIST, "logo"), {
    maxAge: "30d",
    setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=2592000, stale-while-revalidate=86400"),
  })
);
app.use(
  "/fonts",
  express.static(path.join(DIST, "fonts"), { maxAge: "30d" })
);
app.use(express.static(DIST, { index: false, redirect: false, maxAge: "1h" }));

// ---- SPA fallback: serve the prerendered HTML for the matching route ----
function sendRoute(req: express.Request, res: express.Response) {
  const routePath = req.path.replace(/\/+$/, "") || "/";
  const candidates = [
    path.join(DIST, routePath, "index.html"),
    path.join(DIST, `${routePath}.html`),
    path.join(DIST, "index.html"),
  ];
  const found = candidates.find((c) => existsSync(c));
  if (!found) {
    return res.status(404).sendFile(path.join(DIST, "404.html"));
  }
  return res.sendFile(found);
}

app.get("*", (req, res) => {
  // Unknown paths should return a real 404 status for crawlers.
  const routePath = req.path.replace(/\/+$/, "") || "/";
  const known = CRAWLABLE_ROUTES.some((r) => r.path === routePath);
  if (!known) {
    const notFound = path.join(DIST, "404.html");
    if (existsSync(notFound)) return res.status(404).sendFile(notFound);
  }
  return sendRoute(req, res);
});

app.listen(PORT, () => {
  console.log(`A2Z Academy portal listening on http://localhost:${PORT}`);
});
