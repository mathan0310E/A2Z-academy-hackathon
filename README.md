# A2Z Academy — Public Website & Hackathon Portal

Public marketing site for **A2Z Academy** plus the participant-facing portal for the
**A2Z Academy Tech-Based Hackathon**: team registration, Registration ID generation,
confirmation emails, published problem statements, and a contact channel.

> This website is deliberately **information + registration only**. PPT submission, judging,
> round scheduling, and offline activities happen *outside* this platform and are announced in
> the official WhatsApp group.

---

## 1. Tech stack

| Layer | Choice |
| --- | --- |
| Build | Vite 5 |
| UI | React 18 + React Router 6 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + component utilities in `src/globals.css` |
| Animation | CSS keyframes + IntersectionObserver reveals (no animation runtime) |
| Forms | react-hook-form + zod (`@hookform/resolvers/zod`) |
| Icons | Local SVG module (`src/components/icons`) |
| Head/SEO | react-helmet-async + prerendered HTML |
| Server | Express (static `dist/` + `/api/*`) |
| Database | Firestore — client SDK for public reads, Admin SDK for writes |
| Email | Nodemailer over SMTP |
| Abuse protection | Per-IP rate limiting + reCAPTCHA v3 on `/api/register` and `/api/contact`; Firebase App Check (optional) |

---

## 2. Quick start

```bash
npm install
cp .env.example .env      # then fill in the values  (Windows: copy .env.example .env)
npm run dev               # http://localhost:12001
```

`npm run dev` serves the SPA with hot reload and proxies `/api/*` to the Express server, so run
`npm start` in a second terminal if you need the API locally.

The site renders fine **without** any credentials: Firestore/App Check failures are caught and
degrade to empty lists, and email failures never invalidate a registration. Only the `/register`
*storage* step requires Firebase Admin credentials.

---

## 3. Environment variables

Vite only exposes variables prefixed with `VITE_` to the browser. Server-only secrets keep their
plain names and are read by Express through `process.env` — never prefix them with `VITE_`.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_FIREBASE_*` | client | Firebase web config |
| `VITE_RECAPTCHA_SITE_KEY` | client | reCAPTCHA v3 site key — used by App Check and by the registration/contact forms (optional in dev) |
| `VITE_WHATSAPP_GROUP_URL` | client + server | Official WhatsApp group invite used in CTAs and emails |
| `VITE_SITE_URL` | client + server | Canonical URL for metadata, `sitemap.xml`, `robots.txt` |
| `FIREBASE_PROJECT_ID` | server only | Admin SDK project id (falls back to `VITE_FIREBASE_PROJECT_ID`) |
| `FIREBASE_CLIENT_EMAIL` | server only | Admin SDK service-account client email |
| `FIREBASE_PRIVATE_KEY` | server only | Admin SDK private key (`\n` escapes are converted) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` | server only | Nodemailer transport |
| `SMTP_FROM` | server only | Friendly From header, e.g. `A2Z Academy <no-reply@…>` |
| `ADMIN_EMAIL` | server only | Organiser inbox that receives registrations and contact messages |
| `PUBLIC_ORIGIN` | server only | Comma-separated origins allowed to call `/api/*` (CORS allow-list) |
| `RECAPTCHA_SECRET_KEY` | server only | reCAPTCHA v3 secret used to verify tokens on `/api/register` and `/api/contact`. Unset = verification skipped (development only) |
| `PORT` | server only | Port the Express server binds to (default `12000`) |

---

## 4. Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server on `:12001` (proxies `/api` to `:12000`) |
| `npm run build` | Type-check (`tsc --noEmit`) + `vite build` |
| `npm run build:all` | `build` + `prerender` — **this is what deploys** |
| `npm run prerender` | Render every route to static HTML (needs `dist/` to exist) |
| `npm start` | Express server on `:12000` serving `dist/` and the API |
| `npm run preview` | Serve the raw Vite build (no API, no per-route HTML) |
| `npm run lint` | ESLint over `src/` and `server/` |
| `npm run typecheck` | `tsc --noEmit` |

---

## 5. Project structure

```text
.
|-- index.html                 Vite entry (font preloads, #root)
|-- vite.config.ts             React plugin, @ -> ./src alias, manualChunks, dev proxy
|-- src/
|   |-- main.tsx               mounts BrowserRouter + HelmetProvider
|   |-- App.tsx                route table, Navbar/Footer, AppCheckProvider, page transitions
|   |-- globals.css            Tailwind layers, @font-face, keyframes, btn-pill/glass utilities
|   |-- pages/                 one component per route (Seo + section markup)
|   |-- components/
|   |   |-- Seo.tsx            per-page <head> via react-helmet-async
|   |   |-- StructuredData.tsx site-wide Organization + WebSite JSON-LD
|   |   |-- register/          RegistrationForm + StepTeam/StepMembers/StepReview/SuccessPanel/Field
|   |   |-- contact/           ContactForm.tsx
|   |   |-- ui/                Reveal.tsx (IntersectionObserver), Section.tsx, DrawUnderline.tsx
|   |   |-- Navbar.tsx, Hero.tsx, Footer.tsx, FaqAccordion.tsx, ImportantNotice.tsx,
|   |       ProblemStatementsList.tsx, BrandLogo.tsx, ScrollToTop.tsx
|   |-- contexts/              AppCheckContext.tsx (reCAPTCHA v3)
|   |-- lib/                   firebase (client init), firestore, content, site, format,
|   |                          utils, validations, recaptcha, json-ld
|   |-- types/index.ts         shared TS types
|-- server/
|   |-- index.ts               Express: static dist/, /api/*, sitemap.xml, robots.txt, headers
|   |-- routes/                register.ts, contact.ts
|   |-- lib/                   firebase-admin, firestore, registration, nodemailer,
|   |                          email-templates, contact, rate-limit, captcha
|-- scripts/
|   |-- prerender.ts           headless-Chromium render of every route into dist/
|   |-- verify-hydration.ts    asserts client nav, title updates, reveals, clean console
|-- public/                    fonts/, logo/, PWA icons, favicon, manifest.json
|-- .env.example               copy to .env and fill in
```

---

## 6. Routes

### Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page: hero, what A2Z provides, hackathon overview, journey |
| `/about` | Who we are, mission, vision, focus areas |
| `/hackathon` | Team size, team types, venue, fee, shortlisting |
| `/rounds` | Round 1 (PPT) → Round 2 (online) → Round 3 (offline at Cyber Wolf HQ) |
| `/what-we-provide` | Training, workshops, skill development, hackathons, institutional programs |
| `/problem-statements` | Published problem statements (Firestore, client-fetched) |
| `/team-formation` | Duo / Tri / Squad rules, leader role, cross-institution teams |
| `/guidelines` | Rules and conduct |
| `/faq` | Accordion of frequently asked questions |
| `/register` | 3-step registration wizard (team → members → review) |
| `/contact` | Contact channels + message form |
| `*` | Styled 404 |

### API

| Route | Method | Description |
| --- | --- | --- |
| `/api/register` | `POST` | Validates, de-duplicates, stores a registration, then emails leader + members + organiser. Returns the Registration ID. |
| `/api/register` | `GET` | Health probe |
| `/api/contact` | `POST` | Validates a contact message, notifies the organiser (Reply-To = sender), acknowledges the sender, stores it. Returns reference `MSG-YYYY-XXXXXX`. |
| `/api/contact` | `GET` | Health probe |

`/api/*` is excluded from `robots.txt` and carries the same CORS headers the previous stack set.

---

## 7. Firestore data model

```
registrations/{registrationId}          AZZ-YYYY-00001
  teamName, teamType, leaderMemberId, leaderName, leaderEmail,
  status (REGISTERED|CONFIRMED|CANCELLED), createdAt,
  memberEmails: string[], memberCount
  └── members/{memberId}
        name, phone, email, college, department, year, isLeader

_counters/registrations                 { seq, year }  → atomic ID sequence

emailLogs/{autoId}
  emailLogId, registrationId, recipient, recipientType, emailType,
  status, errorMessage?, attemptedAt, sentAt?

contactMessages/{MSG-YYYY-XXXXXX}
  name, email, topic, message, registrationId?, submittedAt,
  status: "NEW", organizerNotified, createdAt

problemStatements/{problemId}
  title, domain, description, requirements, additionalInfo,
  status (draft|published), createdAt, updatedAt

publicContent/{about|hackathon|rounds|guidelines|faq}
  { published: boolean, value: <content> }
```

`registrations` and `contactMessages` are written with the **Admin SDK** only; the browser reads
`problemStatements` (published only) through the client SDK + App Check.

---

## 8. Conventions & gotchas

* **Animation is CSS-only — do not add an animation runtime.** Entrance, stagger, hover, and route
  transitions come from plain CSS keyframes in `src/globals.css` (`reveal-item`, `hero-enter-item`,
  `hover-lift`, `animate-float*`, `page-enter`, `step-enter`, `underline-draw`). Scroll-triggered
  reveals use the `IntersectionObserver` helpers `Reveal` / `RevealGroup` / `RevealItem`
  (`src/components/ui/Reveal.tsx`), which only toggle a `data-revealed` attribute.
* **Respect reduced motion:** every CSS animation has a `prefers-reduced-motion: reduce` branch —
  add one when you introduce new motion.
* **Server HTML must match the client.** Pages are prerendered, so anything that reads the clock,
  `window`, or random values during render will break hydration. Keep such logic in effects.
* **Fonts.** Puvi is self-hosted from `public/fonts/`; `src/globals.css` declares `@font-face` for
  weights 400/600/700 and exposes `--font-puvi`, which Tailwind's `font-sans`/`font-display`
  resolve to. Do not add raw `@font-face` blocks anywhere else.
* **Class names:** compose with `cn()` from `src/lib/utils` — no per-component `cn` helpers.
* **Copy/content:** marketing copy is centralised in `src/lib/content.ts` (`siteConfig`).
* **Email is best-effort.** Registration succeeds as soon as the Firestore write succeeds; email
  failures land in `emailLogs` and are never returned as a registration error. The contact route
  only returns 500 when neither storage nor the organiser notification succeeded.
* **No real credentials in the repo.** `.env`, service-account keys, and logs are git-ignored.

---

## 9. Verification checklist

```bash
npx tsc --noEmit            # types
npm run lint                # eslint (0 errors expected)
npm run build:all           # typecheck + build + prerender, must finish clean
npm start                   # then, in another shell:
npx tsx scripts/verify-hydration.ts   # client nav, titles, reveals, console errors
```

Manual smoke test: `/` → `/register` (submit a Duo team) → Registration ID shown → confirmation
email + organiser email → `/contact` (send a message) → reference shown → `/sitemap.xml` and
`/robots.txt` reachable → visit a bogus URL for the styled 404.

---

## 10. Deploy notes (VPS)

The app is a **long-running Node process** (Express), not a static host. On the server:

```bash
git clone <repo> /srv/a2zacademy && cd /srv/a2zacademy
npm ci                      # installs dev deps too — the build needs them
cp .env.example .env        # then fill in every value
npm run build:all           # produces dist/ with prerendered HTML
```

Keep it alive with a process manager and reverse-proxy it:

```bash
npm i -g pm2
pm2 start "npm start" --name a2zacademy --update-env
pm2 save && pm2 startup     # survive reboots
```

Point nginx (or Caddy) at `127.0.0.1:12000` and terminate TLS there; the Express server speaks
plain HTTP and trusts the proxy. After a deploy, re-run `npm run build:all` and
`pm2 reload a2zacademy`.

Notes:

* Set every variable from §3 in the server environment (`.env` in the working directory, or the
  process manager's env). Server-only secrets must **not** be prefixed with `VITE_`.
* The build step needs the `devDependencies` (Vite, TypeScript, tsx), so do not use
  `npm ci --omit=dev` before `build:all`.
* `prerender` needs a Chromium binary on the box; `scripts/prerender.ts` looks for the system
  `/usr/bin/chromium`. Install it (`apt install chromium`) or adjust the executable path.
* Add the deployed domain to Firebase → Authentication → App Check (reCAPTCHA v3) and to the
  Firestore rules allowlist.
* Long-lived immutable caching for `/assets/*`, `/logo/*`, and `/fonts/*`, plus baseline security
  headers and CORS on `/api/*`, are applied by `server/index.ts`.
