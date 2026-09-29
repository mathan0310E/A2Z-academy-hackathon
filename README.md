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
| Framework | Next.js 14 (App Router, Server Components by default) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + glassmorphism utilities in `app/globals.css` |
| Animation | CSS keyframes + IntersectionObserver reveals (no animation runtime) |
| Forms | react-hook-form + zod (`@hookform/resolvers/zod`) |
| Icons | lucide-react |
| Database | Firestore — client SDK for public reads, Admin SDK for writes |
| Email | Nodemailer over SMTP |
| Abuse protection | Firebase App Check (reCAPTCHA v3), optional |

---

## 2. Quick start

```bash
npm install
cp .env.local.example .env.local   # then fill in the values  (Windows: copy .env.local.example .env.local)
npm run dev                        # http://localhost:3000
```

The site renders fine **without** any credentials: Firestore/App Check failures are caught and
degrade to empty lists, and email failures never invalidate a registration. Only the `/register`
*storage* step requires Firebase Admin credentials.

---

## 3. Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | client + server | Firebase web config (also supplies the Admin `projectId`) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | client | App Check / reCAPTCHA v3 site key (optional in dev) |
| `NEXT_PUBLIC_WHATSAPP_GROUP_URL` | client + server | Official WhatsApp group invite used in CTAs and emails |
| `NEXT_PUBLIC_SITE_URL` | client + server | Canonical URL for metadata, `sitemap.xml`, `robots.txt` |
| `FIREBASE_CLIENT_EMAIL` | server only | Admin SDK service-account client email |
| `FIREBASE_PRIVATE_KEY` | server only | Admin SDK private key (`\n` escapes are converted) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` | server only | Nodemailer transport |
| `SMTP_FROM` | server only | Friendly From header, e.g. `A2Z Academy <no-reply@…>` |
| `ADMIN_EMAIL` | server only | Organiser inbox that receives registrations and contact messages |

---

## 4. Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (also type-checks and lints) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |

---

## 5. Project structure

```text
.
|-- app/                       App Router; pages are Server Components unless noted
|   |-- api/contact/route.ts   POST /api/contact
|   |-- api/register/route.ts  POST /api/register
|   |-- <page>/page.tsx        about, hackathon, rounds, what-we-provide, faq, guidelines,
|   |                          problem-statements, team-formation, register, contact
|   |-- layout.tsx             root layout (imports metadata.ts + globals.css)
|   |-- metadata.ts            site-wide <head> metadata
|   |-- error.tsx              root error boundary (client)
|   |-- not-found.tsx          styled 404
|   |-- robots.ts              /robots.txt
|   |-- sitemap.ts             /sitemap.xml
|   |-- icon.svg               favicon (served natively by the App Router)
|   |-- globals.css
|-- components/
|   |-- ui/                    Reveal.tsx (IntersectionObserver reveal helpers), Section.tsx, FormField.tsx
|   |-- register/              RegistrationForm + StepTeam/StepMembers/StepReview/SuccessPanel/Field
|   |-- contact/               ContactForm.tsx (client)
|   |-- Navbar.tsx, Hero.tsx, Footer.tsx, FaqAccordion.tsx, ImportantNotice.tsx,
|   |   ProblemStatementsList.tsx
|-- contexts/AppCheckContext.tsx   Firebase App Check (reCAPTCHA v3)
|-- firebase/client.ts             client SDK init (browser only)
|-- lib/                           server + shared logic: firebase-admin, firestore, registration,
|                                  nodemailer, email-templates, contact, validations, content,
|                                  site, format, utils
|-- types/index.ts                 shared TS types
|-- .env.local.example             copy to .env.local and fill in
`|-- next.config.mjs | tailwind.config.js | postcss.config.js | tsconfig.json | .eslintrc.json
```

## 6. Routes

### Pages (`app/`)

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
| `not-found.tsx`, `error.tsx` | Styled 404 and route-level error boundary |

### API (`app/api/`)

| Route | Method | Description |
| --- | --- | --- |
| `/api/register` | `POST` | Validates, de-duplicates, stores a registration, then emails leader + members + organiser. Returns the Registration ID. |
| `/api/register` | `GET` | Health probe |
| `/api/contact` | `POST` | Validates a contact message, notifies the organiser (Reply-To = sender), acknowledges the sender, stores it. Returns reference `MSG-YYYY-XXXXXX`. |
| `/api/contact` | `GET` | Health probe |

`/api/*` is excluded from `robots.txt`.

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

* **Animation is CSS-only — do not add an animation runtime.** Entrance, stagger, hover, and
  route transitions come from plain CSS keyframes in `app/globals.css` (`reveal-item`,
  `hero-enter-item`, `hover-lift`, `animate-float*`, `page-enter`). Scroll-triggered reveals use
  the `IntersectionObserver` client helpers `Reveal` / `RevealGroup` / `RevealItem`
  (`components/ui/Reveal.tsx`), which only toggle a `data-revealed` attribute — no `framer-motion`
  import anywhere, so pages stay Server Components and keep `metadata`.
* **Client boundary:** interactive/animated components start with `"use client"`; everything else
  stays a Server Component for SEO and payload size.
* **Respect reduced motion:** every CSS animation has a `prefers-reduced-motion: reduce` branch —
  add one when you introduce new motion.
* **Shared form fields** live in `components/ui/FormField.tsx`; `components/register/Field.tsx`
  re-exports them so the registration flow is unchanged.
* **Class names:** compose with `cn()` from `lib/utils` — no per-component `cn` helpers.
* **Copy/content:** marketing copy is centralised in `lib/content.ts` (`siteConfig`).
* **Email is best-effort.** Registration succeeds as soon as the Firestore write succeeds; email
  failures land in `emailLogs` and are never returned as a registration error. The contact route
  only returns 500 when neither storage nor the organiser notification succeeded.
* **No real credentials in the repo.** `.env.local`, service-account keys, and logs are git-ignored.

---

## 9. Verification checklist

```bash
npx tsc --noEmit     # types
npm run lint         # eslint
npm run build        # must not emit "Export encountered errors"
```

Manual smoke test: `/` → `/register` (submit a Duo team) → Registration ID shown → confirmation
email + organiser email → `/contact` (send a message) → reference shown → `/sitemap.xml` and
`/robots.txt` reachable → visit a bogus URL for the styled 404.

---

## 10. Deploy notes

* Deploy to any Node host (Vercel works out of the box); set every variable from §3 in the hosting
  dashboard. Server-only secrets must **not** be prefixed with `NEXT_PUBLIC_`.
* Add the deployed domain to Firebase → Authentication → App Check (reCAPTCHA v3) and to the
  Firestore rules allowlist.
* `next.config.mjs` keeps `firebase-admin` external to the server-components bundler and applies
  CORS headers to `/api/*`.
