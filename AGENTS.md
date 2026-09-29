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

Icons throughout the UI come from `lucide-react` — the same set the reference site uses (arrow,
chevron, check, plus/minus/circle for accordions and steppers).

## SEO & structured data

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

- `server/routes/register.ts` and `server/routes/contact.ts` (Firestore + Nodemailer). Firebase/App
  Check may be unconfigured locally; every failure path degrades gracefully (problem statements
  resolve to an empty state, emails are best-effort).
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

- **Surfaces are square.** Every card, panel, input, and option box is `rounded-none`. Only
  buttons are pills (`.btn-pill*` / Button `variant="pill*"`).
- **Primary foreground is near-black** (`#1a1a1a`), not white — white on `#71bf43` fails contrast.
- **`font-medium`/`rounded-none` in the Button base** would beat the `.btn-pill*` component
  classes (utilities win over the component layer), so the pill variants repeat `rounded-full
  font-bold` as utilities for `cn`/tailwind-merge to resolve.
- Reference computed styles: body `#f7f7f7` / `#333`, h1 60px/700, h2 36px/300, footer `#222`
  with a `#2A2A2A` footnote strip, nav links 13–15px semibold, header `h-[4.25rem]`.

### shadcn/ui tokens

`tailwind.config.js` maps `primary`/`accent`/`muted`/etc. to HSL CSS vars in `globals.css`
(`--primary` = brand green, `--accent` = near-black, `--radius: 0px`). The old numeric
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
`<datalist>` of suggestions — participants are never restricted to the list.

