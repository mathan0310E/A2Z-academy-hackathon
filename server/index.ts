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
app.use(compression());
app.use(express.json({ limit: "1mb" }));

// ---- Security + caching headers (ported from next.config.mjs) ----
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "on");
  next();
});

// ---- API ----
// CORS mirrors the `Access-Control-*` block in the Next app's next.config.mjs.
app.use("/api", (_req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, authorization, X-A2Z-HMAC"
  );
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
  changeFrequency: "daily" | "weekly" | "monthly";
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
