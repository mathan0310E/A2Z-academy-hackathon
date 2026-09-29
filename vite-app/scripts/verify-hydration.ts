import puppeteer from "puppeteer-core";

const ORIGIN = process.env.ORIGIN || "http://localhost:12000";
const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
const errors: string[] = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(ORIGIN + "/", { waitUntil: "networkidle0" });
console.log("home title:", await page.title());

// Client-side navigation: click the "About" nav link.
await page.evaluate(() => {
  const link = [...document.querySelectorAll("a")].find((a) => a.textContent?.trim() === "About A2Z");
  (link as HTMLAnchorElement)?.click();
});
await new Promise((r) => setTimeout(r, 900));
console.log("after nav title:", await page.title());
console.log("after nav url:", page.url());

// Reveal animation: an element that started hidden should be visible after scroll.
await page.goto(ORIGIN + "/hackathon", { waitUntil: "networkidle0" });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise((r) => setTimeout(r, 1200));
const revealOpacity = await page.evaluate(() => {
  const el = document.querySelector(".reveal-item") as HTMLElement | null;
  return el ? getComputedStyle(el).opacity : "none";
});
console.log("reveal-item opacity after scroll:", revealOpacity);

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
