# AGENTS.md

## Project

A2Z Academy public website + hackathon portal (Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion). Deployed from the repo root (`app/`, `components/`, `lib/`, `types/`).

## Commands

- `npm install` — install dependencies
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — run the production build (respects `PORT`)
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint (`next lint`)

## Design system (A2Z brand theme)

The visual language mirrors the official brand site <https://www.a2zacademy.co.in/>: a **light** theme with a green primary, navy ink, and pill-shaped buttons.

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

Helper classes live in `app/globals.css`:

- `.btn-pill-primary` — solid green pill button with dark ink text (matches the reference site's contrast)
- `.btn-pill-outline` — white pill with green border
- `.btn-pill-navy` — navy pill, white text
- `.glass-card` — light card surface (white + soft border + subtle shadow)
- `.grid-pattern`, `.gradient-text` — background/text accents

Font: **Puvi** (the brand typeface), loaded with `next/font/local` from `app/fonts/` (see `app/fonts.ts`) and exposed as the `--font-puvi` CSS variable. Tailwind `font-sans`/`font-display` resolve to it, and `next/font` handles preloading plus a metric-adjusted fallback so there is no layout shift. Do not reintroduce raw `@font-face` blocks in `globals.css`.

## Brand assets

The official A2Z Academy logo and app icons are mirrored from the brand site and live in `public/`:

- `public/logo/logo.jpeg` — official wordmark (1254×1254), the source artwork
- `public/logo/logo-mark-{128,256}.{webp,png}` — tightly cropped, re-encoded square mark used by `components/BrandLogo.tsx` (WebP first, PNG fallback). Prefer these over the raw JPEG.
- `public/icon-{192,512}.png`, `public/icon-maskable-{192,512}.png` — PWA icons
- `public/favicon.png` — 32×32 favicon
- `public/apple-touch-icon.png` — 180×180 iOS icon
- `public/manifest.json` — web app manifest (`theme_color: #71BF43`)

`app/metadata.ts` wires up the icon + manifest links. Icons throughout the UI come from `lucide-react` — the same set the reference site uses (arrow, chevron, check, plus/minus/circle for accordions and steppers).

## SEO & structured data

- `app/metadata.ts` holds the root metadata: title template, canonical, OpenGraph, Twitter card, robots directives, and `theme-color`.
- `app/opengraph-image.tsx` generates the branded 1200×630 social card with `next/og`.
- `components/StructuredData.tsx` renders the site-wide `Organization` + `WebSite` JSON-LD graph (once, in the root layout).
- `app/faq/page.tsx` adds a `FAQPage` JSON-LD block built from `siteConfig.faqs`.
- `app/sitemap.ts` and `app/robots.ts` are generated routes.
- Every page sets `alternates.canonical`.

## Performance & motion conventions

- Motion is CSS-only. Global keyframes/utilities live in `app/globals.css`: `reveal-item` +
  `data-revealed` (scroll stagger), `hero-enter-item` (hero entrance), `hover-lift` (card lift),
  `animate-float` / `animate-float-slow` (ambient decoration), `page-enter` (route transition via
  `app/template.tsx`), `step-enter` (registration wizard steps), and `underline-draw` (section
  headline underline). Do not add an animation runtime — `framer-motion` was removed.
- Scroll reveals use the `IntersectionObserver` helpers in `components/ui/Reveal.tsx`
  (`Reveal`, `RevealGroup`, `RevealItem`); they only toggle attributes/classes. `Reveal` renders a
  `reveal-root` wrapper so the `<noscript>` fallback can un-hide it.
- `components/ui/DrawUnderline.tsx` is the only client component in `Section.tsx`; `SectionTitle`
  itself stays a Server Component.
- Every animation has a `prefers-reduced-motion: reduce` branch — add one for new motion.
- Firebase is loaded lazily through `firebase/client.ts` and `lib/firestore.ts` so it never lands in a page bundle. Keep those imports dynamic.
- The `<noscript>` block in `app/layout.tsx` forces reveal elements visible when JS is disabled — keep it in sync if you rename the reveal classes.
- `next.config.mjs` sets long-lived immutable caching for `/_next/static` and the logo directory, plus baseline security headers.

### Conventions

- Headings inherit navy and bold display weight from the `@layer base` rule in `globals.css`.
- Primary buttons drop `rounded-lg` in favour of the pill utilities; keep the dark ink text so green stays legible.
- `text-white` is only correct on navy/green/dark surfaces — use `text-brand-navy` / `text-brand-ink` on light backgrounds.
- Keep decorative icons on white cards in `text-brand-green`; semantic status colours use the standalone `red`/`amber`/`indigo` Tailwind scales with light (`*-50`) backgrounds.

## Backend

- `app/api/register` and `app/api/contact` are server routes (Firestore + Nodemailer). Firebase/App Check may be unconfigured locally; every failure path degrades gracefully (problem statements resolve to an empty state, emails are best-effort).
- Environment variables are documented in `.env.local.example`.

## Vite migration (`vite-app/`)

The Next.js app remains the source of truth until the Vite port is verified. The port lives in
`vite-app/` as a self-contained project (own `package.json`, `vite.config.ts`, `tsconfig.json`) so
the two can be compared side by side.

**Status: verified.** `tsc --noEmit` clean, ESLint clean (warnings only), production build green,
all 11 routes + 404 return the right status, prerendered HTML carries per-route SEO, hydration has
no console errors, and a DOM-parity check against the running Next app matches on text, headings,
titles, and links for every route.

### Layout

- `src/` — React app. `main.tsx` mounts `BrowserRouter` + `HelmetProvider`; `App.tsx` owns the
  route table, `Navbar`/`Footer`, the `AppCheckProvider`, and the `grid-pattern` overlay.
- `src/pages/*` — one component per route. These were ported from `app/**/page.tsx` with the
  `metadata` export replaced by `<Seo … />`.
- `src/components/Seo.tsx` — per-page head (title template, description, canonical, OpenGraph,
  Twitter, robots) via `react-helmet-async`. This is the Vite equivalent of `app/metadata.ts`.
- `server/` — Express. `server/index.ts` serves `dist/`, `/api/register`, `/api/contact`,
  `/sitemap.xml`, `/robots.txt`, and the security/caching headers that used to live in
  `next.config.mjs`. Routes are in `server/routes/`; server-only libs in `server/lib/`.
- `scripts/prerender.ts` — builds once, boots `vite preview`, renders every route with headless
  Chromium (`puppeteer-core` + the system `/usr/bin/chromium`), and writes
  `dist/<route>/index.html` plus `dist/404.html` and `dist/og-image.png`.
- `scripts/verify-hydration.ts` — asserts client-side navigation, Helmet title updates, reveal
  animations, and a clean console against a running server.

### Commands

```
npm run dev          # Vite dev server on :12001, proxies /api to :12000
npm run build:all    # typecheck + vite build + prerender (this is what deploys)
npm start            # Express server on :12000 serving dist/ and the API
npm run lint         # ESLint over src/ and server/
```

### Port notes (differences from the Next app)

- **Fonts.** No `next/font/local`. Puvi is self-hosted: the woff2 files live in
  `vite-app/public/fonts/` and `src/globals.css` declares `@font-face` for weights 400/600/700,
  exposing `--font-puvi` (so Tailwind's `font-sans`/`font-display` still resolve to it).
  `index.html` preloads the regular and bold faces.
- **Links.** `next/link` → `react-router-dom`'s `Link` (named import) with `to=` instead of
  `href=`. External `mailto:`/`tel:`/`https:` targets and `target="_blank"` links stay plain `<a>`.
- **Navigation state.** `usePathname()` → `useLocation().pathname`. `components/ScrollToTop.tsx`
  restores Next's scroll-reset-per-route behaviour.
- **Route transition.** `app/template.tsx` has no equivalent; each page is wrapped in the same
  `page-enter` class inside its own markup, so the CSS fade-up is preserved.
- **Env vars.** `NEXT_PUBLIC_*` → `VITE_*` and `process.env.*` → `import.meta.env.*` in client
  code. `src/lib/site.ts` reads `import.meta.env` but falls back to `process.env` so the Express
  server can import it for the sitemap. Server-only secrets keep their unprefixed names; see
  `vite-app/.env.example`.
- **Code splitting.** `ProblemStatements`, `Contact`, and `Register` are `React.lazy` routes so
  `react-hook-form`/`zod` (forms chunk, ~86 kB) and Firebase (~477 kB) never enter the home page
  payload. Only the React chunk is module-preloaded.
- **`"use client"`** directives were dropped — every component is a client component under Vite.

