# AGENTS.md

## Project

A2Z Academy public website + hackathon portal. **Vite 5 + React 18 + React Router 6 + Express**,
TypeScript, Tailwind CSS. Deployed from the repo root on a VPS as a long-running Node process.

The app was migrated from Next.js 14 (App Router). The Next app is gone — `app/`, `components/`,
`lib/`, `contexts/`, `firebase/`, `types/`, `next.config.mjs` no longer exist. If you see a
reference to them, it is stale.

## Commands

- `npm install` — install dependencies
- `npm run dev` — Vite dev server on `:12001` (proxies `/api` to `:12000`)
- `npm run build` — `tsc --noEmit && vite build`
- `npm run build:all` — build + prerender; **this is what deploys**
- `npm start` — Express server on `:12000` serving `dist/` and the API
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint over `src/` and `server/`
- `npm test` — Node test runner over `tests/` (the admin→portal content contract)
- `npx tsx scripts/verify-hydration.ts` — hydration/console check against a running server

## Design system (A2Z brand theme)

The visual language mirrors the official brand site <https://www.a2zacademy.co.in/>: a **light**
theme with a green primary, navy ink, and pill-shaped buttons.

Brand tokens are defined in `tailwind.config.js` under the `brand` colour group:

| Token | Hex | Use |
| --- | --- | --- |
| `brand-green` | `#71bf43` | Primary buttons, accents, active nav |
| `brand-green-hover` | `#5fa536` | Hover state for green |
| `brand-green-soft` | `#eaf6e1` | Soft green surfaces/highlights |
| `brand-navy` | `#1a335a` | Headings and primary text |
| `brand-navy-deep` | `#0f2340` | Footer / deep navy surfaces |
| `brand-red` | `#d92d20` | Errors / destructive |
| `brand-ink` | `#333333` | Body text on light surfaces |
| `brand-ink-strong` | `#1a1a1a` | Text on green buttons (matches reference) |
| `brand-muted` | `#666666` | Secondary text |
| `brand-surface` | `#f7f7f7` | Page background |

Helper classes live in `src/globals.css`:

- `.btn-pill-primary` — solid green pill button with dark ink text (matches the reference site's contrast)
- `.btn-pill-outline` — white pill with green border
- `.btn-pill-navy` — navy pill, white text
- `.glass-card` — light card surface (white + soft border + subtle shadow)
- `.grid-pattern`, `.gradient-text` — background/text accents

Font: **Puvi** (the brand typeface), self-hosted from `public/fonts/` and declared with
`@font-face` in `src/globals.css` for weights 400/600/700, exposing `--font-puvi`. Tailwind
`font-sans`/`font-display` resolve to it. `index.html` preloads the regular and bold faces.
There is no `next/font` — do not add raw `@font-face` blocks outside `globals.css`.

## Brand assets

The official A2Z Academy logo and app icons are mirrored from the brand site and live in `public/`:

- `public/logo/logo.jpeg` — official wordmark (1254×1254), the source artwork
- `public/logo/logo-mark-{128,256}.{webp,png}` — tightly cropped, re-encoded square mark used by
  `src/components/BrandLogo.tsx` (WebP first, PNG fallback). Prefer these over the raw JPEG.
- `public/icon-{192,512}.png`, `public/icon-maskable-{192,512}.png` — PWA icons
- `public/favicon.png` — 32×32 favicon
- `public/apple-touch-icon.png` — 180×180 iOS icon
- `public/manifest.json` — web app manifest (`theme_color: #71BF43`)

Icons come from a local module under `src/components/icons/`: `Icons.tsx` holds the shared 24×24
outline set, `Brand.tsx` the social marks, and `Extra.tsx`/`Decor.tsx` the brand and decorative
motifs. There is no icon runtime dependency (`lucide-react` was removed).

## Accessibility

`npm run audit:a11y` runs axe-core (WCAG 2.0/2.1/2.2 A + AA + best-practice) over every route at
desktop and mobile widths plus the interactive states — mobile nav, cookie banner, FAQ accordion,
contact validation errors, and register wizard steps 2 and 3. It needs the server running
(`npm start`, or set `AUDIT_BASE_URL`) and **exits non-zero on any violation**, so it can gate CI.
The target is zero violations; treat a new one as a regression.

Two colour rules exist purely to satisfy contrast and are easy to "tidy" away by mistake:

- **Green text needs the darker token.** `text-brand-green` (#71bf43) is only 2.27:1 on white, so
  body/label/icon text on light surfaces uses `text-brand-green-ink` (#417a1e — 5.2:1 on white,
  4.7:1 on `green-soft`). Keep the bright green for **fills, borders, and gradient stops**, and for
  text on **dark** backgrounds (footer `#222` = 7:1, navy band = 5.6:1). `green-ink` must never be
  a fill: near-black on it is only 3.34:1.
- **Inline links in prose are underlined, not colour-only** (`underline underline-offset-2`), and
  error text uses `text-brand-red` (#d92d20, 4.8:1) rather than `text-red-400` (2.8:1).

## SEO & structured data

`src/components/StructuredData.tsx` emits one JSON-LD `@graph` (Organization + WebSite + WebPage
+ a Hackathon `Event`) in the root layout; `src/components/Seo.tsx` sets per-page title,
description, keywords, canonical, geo, and Open Graph/Twitter tags. `SITE_URL` in `src/lib/site.ts`
defaults to `https://www.a2zacademy.co.in` and drives canonicals, `robots.txt`, and `sitemap.xml`
(served from `server/index.ts`). All routes are prerendered, so do not add a static
`<meta name="description">` to `index.html` — it would duplicate Helmet's per-page tag.

- `src/components/Seo.tsx` — per-page head (title template, description, canonical, OpenGraph,
  Twitter, robots) via `react-helmet-async`. The suffix `| A2Z Academy` is appended automatically,
  so page titles must **not** already include the site name (that bug produced
  `About A2Z Academy | A2Z Academy`).
- `src/components/StructuredData.tsx` — site-wide `Organization` + `WebSite` JSON-LD graph.
- `src/pages/Faq.tsx` — adds a `FAQPage` JSON-LD block built from `siteConfig.faqs`.
- `server/index.ts` serves `/sitemap.xml` and `/robots.txt` from the `CRAWLABLE_ROUTES` table —
  add a route there when you add a page.
- `scripts/prerender.ts` renders each route to `dist/<route>/index.html` and generates
  `dist/og-image.png` (1200×630).

## Performance & motion conventions

- Motion is CSS-only. Global keyframes/utilities live in `src/globals.css`: `reveal-item` +
  `data-revealed` (scroll stagger), `hero-enter-item` (hero entrance), `hover-lift` (card lift),
  `animate-float` / `animate-float-slow` (ambient decoration), `page-enter` (route transition),
  `step-enter` (registration wizard steps), and `underline-draw` (section headline underline).
  Do not add an animation runtime — `framer-motion` was removed.
- Scroll reveals use the `IntersectionObserver` helpers in `src/components/ui/Reveal.tsx`
  (`Reveal`, `RevealGroup`, `RevealItem`); they only toggle attributes/classes. `Reveal` renders a
  `reveal-root` wrapper so the `<noscript>` fallback can un-hide it.
- The route transition is applied in `App.tsx` by keying `<main className="page-enter …">` on
  `useLocation().pathname` — this is the replacement for Next's `app/template.tsx`.
- Every animation has a `prefers-reduced-motion: reduce` branch — add one for new motion.
- **Code splitting.** `ProblemStatements`, `Contact`, and `Register` are `React.lazy` routes so
  `react-hook-form`/`zod` (forms chunk) and Firebase (~477 kB) never enter the home page payload.
  `vite.config.ts` `manualChunks` keeps React and Firebase in separate chunks. Firebase is also
  imported dynamically through `src/lib/firebase.ts` and `src/lib/firestore.ts` — keep it that way.
- Prerendered HTML is served directly; `server/index.ts` applies immutable caching for
  `/assets/*`, `/logo/*`, `/fonts/*`, plus baseline security headers.

### Conventions

- Headings inherit navy and bold display weight from the `@layer base` rule in `globals.css`.
- Primary buttons drop `rounded-lg` in favour of the pill utilities; keep the dark ink text so
  green stays legible.
- `text-white` is only correct on navy/green/dark surfaces — use `text-brand-navy` /
  `text-brand-ink` on light backgrounds.
- Keep decorative icons on white cards in `text-brand-green`; semantic status colours use the
  standalone `red`/`amber`/`indigo` Tailwind scales with light (`*-50`) backgrounds.
- **Hydration matters.** Pages are prerendered, so keep non-deterministic work (clock, `window`,
  random) inside effects. Compare server HTML with the hydrated DOM when in doubt.

## Backend

- **Contact details are real, not placeholders.** `src/lib/content.ts` `siteConfig.contact` holds
  the verified A2Z Academy details (phones `+91 63798 69678` / `+91 78259 88139`, address
  Tiruvannamalai, Tamil Nadu 606601). `Footer`, `Contact`, and `StructuredData` all read from it —
  do not reintroduce dummy values like `+91 9999999999`. The `hello@a2zacademy.co.in` mailbox is
  on-domain; no verified alternative exists, so it is left as-is.
- `server/routes/register.ts` and `server/routes/contact.ts` (Firestore + Nodemailer). Firebase/App
  Check may be unconfigured locally; every failure path degrades gracefully (problem statements
  resolve to an empty state, emails are best-effort).
- **Abuse protection on the public write endpoints.** `/api/register` and `/api/contact` are wrapped
  in `rateLimit(...)` (`server/lib/rate-limit.ts`) and `requireCaptcha()` (`server/lib/captcha.ts`).
  The rate limiter keys on `req.ip` (proxy-aware; never the raw `X-Forwarded-For`), and the captcha
  middleware verifies a reCAPTCHA v3 token against Google when `RECAPTCHA_SECRET_KEY` is set —
  without it, verification is skipped and a warning is logged once. The client obtains the token via
  `src/lib/recaptcha.ts` (`getRecaptchaToken(action)`), which reuses the script Firebase App Check
  already loads and is imported by `RegistrationForm`/`ContactForm` only, so it stays out of the home
  payload. App Check is a separate, Firebase-enforced layer — it never gates our own Express routes.
- **Security headers and origin policy.** `server/index.ts` sets `trust proxy`, CSP, HSTS,
  `X-Frame-Options`, `nosniff` and `Referrer-Policy`, and restricts `/api/*` CORS to the
  `PUBLIC_ORIGIN` allow-list.
- JSON-LD is serialised through `src/lib/json-ld.ts` (`jsonLdHtml`) so content authored in the admin
  panel cannot break out of the `<script type="application/ld+json">` tag.
- CORS headers on `/api/*` mirror what `next.config.mjs` used to set, and there is an explicit
  `OPTIONS` preflight handler.
- Environment variables are documented in `.env.example`. Client vars need the `VITE_` prefix;
  server secrets must not have it. `src/lib/site.ts` reads `import.meta.env` but falls back to
  `process.env` so the Express server can import it for the sitemap.

## Deployment (VPS)

Long-running Node process, not a static host:

```bash
npm ci && cp .env.example .env && npm run build:all
pm2 start "npm start" --name a2zacademy --update-env && pm2 save
```

Reverse-proxy nginx/Caddy to `127.0.0.1:12000`. `npm run build:all` needs devDependencies and a
Chromium binary (`/usr/bin/chromium`) for the prerender step.

## Migration history

The Next.js → Vite port was verified before the swap: `tsc --noEmit` clean, ESLint 0 errors,
production build green, all 11 routes + 404 returning the right status, prerendered HTML carrying
per-route SEO, hydration with no console errors, and a DOM-parity check against the running Next
app matching on text, headings, titles, and links for every route.

## Retheme (a2zacademy.co.in parity)

The portal mirrors the reference site's design system. Values below come from its computed
styles, so changing them is a deliberate deviation, not a cleanup:

- **Radii come from the `--radius` token (0.5rem).** Cards/panels/inputs use `rounded-lg`
  (= `var(--radius)`); buttons are pills (`.btn-pill*` / Button `variant="pill*"`). Do not
  reintroduce `rounded-none` on surfaces — it was an earlier over-correction.
- **Primary foreground is near-black** (`#1a1a1a`), not white — white on `#71bf43` fails contrast.
- **`font-medium` in the Button base** would beat the `.btn-pill*` component classes (utilities
  win over the component layer), so the pill variants repeat `rounded-full font-bold` as
  utilities for `cn`/tailwind-merge to resolve.
- **Headings follow a strict H1→H2→H3 outline.** Each page's first `SectionTitle` passes
  `as="h1"` (every other title stays `h2`); card titles directly under it are `h2`, and anything
  nested inside those is `h3`. The reference uses the same sequential outline, so a skip
  (`h1`→`h3`) is a bug, not a style choice.
- Reference computed styles: body `#f7f7f7` / `#333`, h1 60px/700, h2 36px/300, footer `#222`
  with a `#2A2A2A` footnote strip, nav links 13–15px semibold, header `h-[4.25rem]`.
- `body` sets `overflow-x: clip` because the hero/section ambient blur shapes are offset past the
  viewport edge on purpose. This hides their bleed without creating a scroll container (unlike
  `overflow-x: hidden`), so `scrollWidth` can exceed `clientWidth` while the page stays
  non-scrollable — probe `window.scrollX` rather than `scrollWidth` when testing overflow.
- The reference has no forms, so form fields follow its tokens instead: `rounded-lg`,
  `border-input` (`#e6e6e6`), and a `#9ca3af` placeholder. All fields share `inputClassName`
  in `src/components/ui/FormField.tsx`.
- The home page ends with a navy (`bg-brand-navy`) CTA band, mirroring the reference's closing
  call-to-action strip.

### shadcn/ui tokens

`tailwind.config.js` maps `primary`/`accent`/`muted`/etc. to HSL CSS vars in `globals.css`
(`--primary` = brand green, `--accent` = near-black, `--radius: 0.5rem`). The old numeric
`primary-50…950` and `accent-blue/cyan/electric` scales were unused and were replaced by these.
`src/components/ui/Button.tsx` is a cva-based shadcn Button.

### Cookie consent and prerender

`src/components/CookieConsent.tsx` renders only in the browser. The prerender harness
(`scripts/prerender.ts`) sets `window.__A2Z_PRERENDER__ = true` via `evaluateOnNewDocument`, and
the component checks that flag — otherwise the captured HTML would contain the banner while the
client's first render would not, which is a hydration mismatch. Consent is stored in
`localStorage` under `a2z-cookie-consent`.

### Content parity

Footer content, social handles, and the legal pages (`/privacy`, `/terms`, `/cookies`) follow the
reference. Legal pages must also be added to `scripts/prerender.ts` `ROUTES` and to
`CRAWLABLE_ROUTES` in `server/index.ts` (sitemap). The Department field is free text with a
themed in-page suggestion list — participants are never restricted to the list.

## Admin panel integration (admin.a2zacademy.co.in)

The hackathon content shown here can be edited by operators in a **separate application**
(`a2z-admin` — its own Express process, ports 13000/13001, its own repo). The two apps share only
the **Firestore database**: the admin panel writes with the Firebase Admin SDK, this site reads
the published documents with the client SDK. Nothing else is shared — no code, no build, no
deploy pipeline.

`src/contexts/PortalContentContext.tsx` is the single bridge. It is mounted in `App.tsx` and
exposes `usePortalContent()` for `Faq`, `Rounds`, `Guidelines`, `Hackathon`, `Home`, `Register`,
`TeamFormation`, `Contact`, `ImportantNotice` and `register/SuccessPanel`.

Three rules make this safe to reason about:

- **The baseline is checked in, not fetched.** `src/lib/content.ts` `siteConfig` remains the
  source of truth for the prerendered HTML and for any field the admin panel leaves empty. The
  merge only overrides a field when the stored value is non-blank, so a half-filled document can
  never blank out the published site.
- **The fetch is skipped while prerendering.** `scripts/prerender.ts` sets
  `window.__A2Z_PRERENDER__`, and the provider returns early when it sees that flag. Without this,
  admin values would be baked into the static HTML while the client's first render — starting from
  the baseline — would disagree, producing a hydration mismatch. The captured HTML is therefore
  always the baseline, and admin values appear after hydration.
- **The fetch is deferred to idle** (`requestIdleCallback`, 200 ms `setTimeout` fallback) so the
  ~477 kB Firebase chunk never competes with first paint on pages that only need the baseline.

Do not add a static `<meta>` or a second fetch path for this data; extend the provider instead.

### Shared Firestore contract

The document shapes this site reads are the ones `a2z-admin/server/lib/content.ts` writes:

| Collection | Document | Read by |
| --- | --- | --- |
| `publicContent` | `hackathon` (`value` holds `HackathonContent`) | `Home`, `Hackathon`, `Register`, `TeamFormation`, `Guidelines`, `Contact` |
| `publicContent` | `rounds` (array of `RoundInfo`) | `Rounds` |
| `publicContent` | `guidelines` (`{ content }`, newline-separated) | `Guidelines` |
| `publicContent` | `faq` (array of `{ question, answer }`) | `Faq` |
| `publicContent` | `whatsapp` (`{ url }`) | every WhatsApp CTA |
| `problemStatements` | one doc per statement, `status == "published"` | `ProblemStatements` |

Field-name note: the admin panel calls the Round-3 venue **`venue`**; this site's
`siteConfig.hackathonInfo` calls it **`round3Venue`**. The mapping lives in
`overlayHackathonInfo` — if the admin schema is renamed, update it and
`tests/portal-content.test.ts` together.

Access rules are in `a2z-admin/deploy/firestore.rules` (deployed to the shared project): published
`problemStatements` and `publicContent` are world-readable, everything else (registrations,
members, `emailLogs`, `adminUsers`, `auditLogs`, `adminOtpChallenges`) is denied to clients. The
admin panel is unaffected because the Admin SDK bypasses rules.

`npm test` runs `tests/portal-content.test.ts`, which pins this contract — including that blank
admin fields fall back to the baseline and that `venue` maps to `round3Venue`.

