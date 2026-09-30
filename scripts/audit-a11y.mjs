import puppeteer from "puppeteer-core";
import { readFileSync } from "node:fs";

const axeSource = readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const BASE = process.env.AUDIT_BASE_URL || "http://localhost:12000";

const ROUTES = [
  "/", "/about", "/hackathon", "/rounds", "/problem-statements", "/team-formation",
  "/guidelines", "/what-we-provide", "/faq", "/contact", "/register",
  "/privacy", "/terms", "/cookies",
];

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
const VIEWPORTS = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 375, height: 812, isMobile: true, hasTouch: true },
};

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

async function runAxe(page, label) {
  await page.evaluate(axeSource);
  const res = await page.evaluate(async (tags) =>
    await window.axe.run(document, { runOnly: { type: "tag", values: tags }, resultTypes: ["violations"] }),
    TAGS);
  const out = [];
  for (const v of res.violations) {
    for (const n of v.nodes) {
      const d = n.any?.[0]?.data || n.all?.[0]?.data || {};
      out.push({
        label, id: v.id, impact: v.impact,
        target: n.target.join(" "),
        html: (n.html || "").slice(0, 110),
        fg: d.fgColor, bg: d.bgColor, ratio: d.contrastRatio, expected: d.expectedContrastRatio,
        fontSize: d.fontSize, fontWeight: d.fontWeight,
        summary: (n.failureSummary || "").replace(/\n+/g, " ").slice(0, 150),
      });
    }
  }
  return out;
}

async function visit(route, vp) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 600));
  return page;
}

async function stateAudit(name, route, vp, prep) {
  const page = await visit(route, vp);
  try { await prep(page); await new Promise((r) => setTimeout(r, 700)); }
  catch (e) { console.log(`ERROR ${name}: ${e.message}`); }
  const v = await runAxe(page, name);
  await page.close();
  return v;
}

const all = [];
for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  for (const route of ROUTES) {
    const page = await visit(route, vp);
    all.push(...(await runAxe(page, `${vpName} ${route}`)));
    await page.close();
  }
}

const FILL = (sel, val) => `(() => {
  const el = document.querySelector(${JSON.stringify(sel)});
  if (!el) return false;
  const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  set.call(el, ${JSON.stringify(val)});
  el.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
})()`;
const CLICK_TEXT = (re) => `(() => {
  const b = [...document.querySelectorAll("button")].find((x) => ${re}.test(x.textContent || ""));
  if (!b) return false; b.click(); return true;
})()`;

all.push(...(await stateAudit("state mobile-nav-open", "/", VIEWPORTS.mobile, (p) =>
  p.click('button[aria-label="Open menu"]'))));
all.push(...(await stateAudit("state cookie-banner", "/about", VIEWPORTS.desktop, async () => {})));
all.push(...(await stateAudit("state faq-open", "/faq", VIEWPORTS.desktop, async (p) => {
  await p.evaluate(`document.querySelector("button[aria-expanded]")?.click()`);
})));
all.push(...(await stateAudit("state contact-errors", "/contact", VIEWPORTS.desktop, async (p) => {
  await p.evaluate(CLICK_TEXT("/Send/i"));
})));
// The wizard's advance button reads "Continue"; its team-type inputs are sr-only,
// so click the wrapping label. Member fields must pass zod validation to reach
// step 3, so fill every member input/select with schema-valid values.
const FILL_MEMBERS = `(() => {
  const setI = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  const setS = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
  const vals = { name: "Audit Member", phone: "9876543210", email: "audit@example.com",
                 college: "Audit Institute of Technology", department: "Computer Science & Engineering" };
  let n = 0;
  for (const el of document.querySelectorAll('input[name^="members."]')) {
    const f = el.name.split(".").pop();
    if (!(f in vals)) continue;
    setI.call(el, f === "email" ? n + vals[f] : vals[f]);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    n++;
  }
  for (const el of document.querySelectorAll('select[name^="members."]')) {
    setS.call(el, "2nd Year");
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }
  return n;
})()`;

async function toWizardStep(page, target) {
  for (let i = 0; i < 4; i++) {
    const step = await page.evaluate(() =>
      document.querySelector('[class*="step-enter"]')?.textContent?.slice(0, 40) || "");
    if (i === target) return step;
    await page.evaluate(`(() => { document.querySelector('div[role="radiogroup"] label')?.click(); })()`);
    if (i === 1) await page.evaluate(FILL_MEMBERS);
    await new Promise((r) => setTimeout(r, 250));
    await page.evaluate(CLICK_TEXT("/continue/i"));
    await new Promise((r) => setTimeout(r, 700));
  }
  return "";
}

all.push(...(await stateAudit("state register-step2", "/register", VIEWPORTS.desktop, async (p) => {
  await p.evaluate(FILL("#teamName", "Accessibility Audit Team"));
  await toWizardStep(p, 1);
})));
all.push(...(await stateAudit("state register-step3", "/register", VIEWPORTS.desktop, async (p) => {
  await p.evaluate(FILL("#teamName", "Accessibility Audit Team"));
  await toWizardStep(p, 2);
})));

await browser.close();

const byId = new Map();
for (const v of all) {
  if (!byId.has(v.id)) byId.set(v.id, []);
  byId.get(v.id).push(v);
}
if (!all.length) console.log("\nNo axe violations across any route or state.");
for (const [id, nodes] of [...byId].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n===== ${id} [${nodes[0].impact}]  total nodes=${nodes.length} =====`);
  const seen = new Set();
  for (const n of nodes) {
    const key = `${n.target}|${n.fg}|${n.bg}`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`  ${n.label}  ${n.target}`);
    console.log(`    html: ${n.html}`);
    console.log(`    fg=${n.fg} bg=${n.bg} ratio=${n.ratio} need=${n.expected} size=${n.fontSize}/${n.fontWeight}`);
    if (n.summary) console.log(`    ${n.summary}`);
  }
}
console.log(`\ntotal violation nodes: ${all.length}`);

if (all.length > 0) process.exit(1);
