import { preview } from "vite";
import puppeteer, { type Browser } from "puppeteer-core";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");

/** Routes that get a static HTML file. "/" also becomes dist/index.html. */
const ROUTES = [
  "/",
  "/about",
  "/hackathon",
  "/rounds",
  "/problem-statements",
  "/team-formation",
  "/guidelines",
  "/what-we-provide",
  "/faq",
  "/contact",
  "/register",
  "/privacy",
  "/terms",
  "/cookies",
];

/** A path that matches no route, used to capture the 404 page. */
const NOT_FOUND_PROBE = "/__prerender-not-found__";

const CHROMIUM_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
].filter(Boolean) as string[];

function findChromium(): string {
  const found = CHROMIUM_CANDIDATES.find((c) => existsSync(c));
  if (!found) {
    throw new Error(
      `No Chromium binary found. Set PUPPETEER_EXECUTABLE_PATH. Looked in: ${CHROMIUM_CANDIDATES.join(", ")}`
    );
  }
  return found;
}

function writeHtml(routePath: string, html: string) {
  const outFile =
    routePath === "/"
      ? path.join(DIST, "index.html")
      : path.join(DIST, routePath.replace(/^\//, ""), "index.html");
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  console.log("prerendered", routePath, "→", path.relative(DIST, outFile));
}

/** Render the branded 1200×630 social card to dist/og-image.png. */
async function generateOgImage(browser: Browser, origin: string) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  const tags = ["Cyber Security", "Cloud Security", "IoT Security", "Full Stack"];
  const html = `<!doctype html><html><head><meta charset="utf-8" /><style>
    * { margin: 0; box-sizing: border-box; }
    body {
      width: 1200px; height: 630px; display: flex; flex-direction: column;
      justify-content: space-between; padding: 72px;
      background: linear-gradient(135deg, #ffffff 0%, #f7f7f7 55%, #eaf6e1 100%);
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    }
    .brand { display: flex; align-items: center; gap: 16px; }
    .mark {
      width: 56px; height: 56px; border-radius: 14px; background: #71bf43;
      color: #1a1a1a; font-size: 30px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }
    .name { font-size: 30px; font-weight: 700; color: #1a335a; }
    .headline { display: flex; flex-direction: column; gap: 20px; }
    .headline h1 { font-size: 68px; font-weight: 800; color: #1a335a; line-height: 1.1; }
    .headline h1 .accent { color: #71bf43; }
    .headline p { font-size: 30px; color: #666; max-width: 900px; }
    .tags { display: flex; gap: 12px; }
    .tag {
      font-size: 22px; font-weight: 600; color: #1a335a; background: #ffffff;
      border: 1px solid rgba(26,51,90,0.12); border-radius: 999px; padding: 10px 22px;
    }
  </style></head><body>
    <div class="brand"><div class="mark">A2Z</div><div class="name">A2Z Academy</div></div>
    <div class="headline">
      <h1>Tech-Based<br /><span class="accent">Hackathon</span></h1>
      <p>Empowering institutes with tech-based training — build real solutions and get certified.</p>
    </div>
    <div class="tags">${tags.map((t) => `<div class="tag">${t}</div>`).join("")}</div>
  </body></html>`;

  await page.setContent(html, { waitUntil: "networkidle0" });
  const buffer = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
  writeFileSync(path.join(DIST, "og-image.png"), buffer as Buffer);
  console.log("generated og-image.png");
  await page.close();
  void origin;
}

async function main() {
  const server = await preview({
    preview: { port: 4319, strictPort: true },
    logLevel: "warn",
  });
  const origin = `http://localhost:4319`;

  const browser = await puppeteer.launch({
    executablePath: findChromium(),
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      // Client-only UI (the cookie banner) checks this flag and stays out of the
      // captured HTML, so hydration matches.
      await page.evaluateOnNewDocument(() => {
        (window as unknown as { __A2Z_PRERENDER__?: boolean }).__A2Z_PRERENDER__ = true;
      });
      await page.goto(origin + route, { waitUntil: "networkidle0", timeout: 60000 });
      // Let helmet flush the document head and the entrance animations settle.
      await new Promise((r) => setTimeout(r, 700));
      const html = await page.content();
      writeHtml(route, html);
      await page.close();
    }

    const probe = await browser.newPage();
    await probe.setViewport({ width: 1280, height: 900 });
    // The 404 page renders inside the same providers, so it needs the flag too —
    // otherwise the portal opens a Firestore stream and networkidle0 never settles.
    await probe.evaluateOnNewDocument(() => {
      (window as unknown as { __A2Z_PRERENDER__?: boolean }).__A2Z_PRERENDER__ = true;
    });
    await probe.goto(origin + NOT_FOUND_PROBE, { waitUntil: "networkidle0", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 500));
    writeFileSync(path.join(DIST, "404.html"), await probe.content());
    console.log("prerendered 404 → 404.html");
    await probe.close();

    await generateOgImage(browser, origin);
  } finally {
    await browser.close();
    await server.close();
  }

  console.log("\nPrerender complete.");
}

main().catch((error) => {
  console.error("Prerender failed:", error);
  process.exit(1);
});
