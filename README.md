# BestAuto — Car Rental Platform (Customer Site + Admin Dashboard + AI Assistant)

A production-style car rental platform built from the supplied Figma design (admin dashboard mockup + customer-site wireframe). Includes a real SQLite-backed database, password-hashed authentication with role-gated admin access, a live customer booking experience, a fully dynamic and CRUD-complete admin dashboard, an AI vehicle recommendation assistant (Gemini/Anthropic) grounded in real inventory, and an inquiry → lead-qualification automation pipeline.

## Overview

Two products, one codebase:

- **Customer front-end** — browse and filter vehicles, view details, submit a rental inquiry, and chat with an AI assistant that recommends real cars from inventory.
- **Admin dashboard** — recreated from the Figma mockup (stat cards, best sellers, recent transactions, sales analytics chart, sales-by-region panel), all wired to API routes with real filtering.

## Features

### Customer Front-End
- Hero with a functional pick-up/drop-off search widget (routes into the filtered listing page)
- "How it works" + "Why choose us" sections
- Tabbed, data-driven vehicle grid (Popular / Large / Small / Exclusive) with loading and empty states
- Full `/vehicles` listing page with live search, type, price, and seat filters
- Vehicle detail page with specs, features, similar vehicles, and a validated booking/inquiry form (loading, success, and error states)
- Responsive nav with mobile drawer; testimonial carousel; promo banner
- Floating **AI Vehicle Recommendation Assistant** available on every page

### Admin Dashboard
Every sidebar destination is a real, working page — nothing is a dead link.

- Sidebar recreated from the Figma nav groups (Main / Inventory / Stock / Sales / Promo), responsive mobile drawer
- Topbar: functional search (routes into filtered inventory), Add New / POS actions that link to real pages, working notification + settings panels, avatar
- Dynamic stat cards sourced from `/api/dashboard/stats`, with a **working date-range filter** (7d/30d/90d/12m) that actually changes the numbers
- Best Sellers panel and Recent Transactions table (working status filter: All / Success / Pending / Cancelled), responsive card layout on mobile
- Sales Analytics area chart (Recharts) and a Sales-by-Region panel with a stylized map + ranked bars
- **Products** (`/admin/vehicles`) — full inventory table, search + type filter, live stock counts, Edit action per row
- **Create / Edit / Delete Product** (`/admin/vehicles/new`, `/admin/vehicles/:id/edit`) — full CRUD against `/api/vehicles`, including a Delete action with a confirmation prompt
- **Category / Sub Category / Brands** — live breakdowns of the fleet grouped by type / fuel type / manufacturer, click through to filtered inventory
- **Low Stocks** — vehicles at or below threshold, with a one-click Restock action
- **Expired Products** — vehicles whose inspection date has passed or is expiring within 60 days
- **Units** — editable rental-duration pricing multipliers (day/week/month)
- **Variant Attributes** — aggregated feature-tag usage across the fleet
- **Warranties** — vehicles grouped by warranty plan
- **Print Barcode / Print QR Code** — generates a real, deterministic barcode and a real scannable QR code (via the `qrcode` package) per vehicle, printable
- **Manage Stock / Stock Adjustment / Stock Transfer** — live stock +/- controls, a reasoned adjustment form, and a location-transfer form, all writing to the real vehicle store
- **Invoices** — completed (Success) bookings, printable
- **Sales Return** — process a return/cancellation against a real booking
- **Quotation** — live price calculator (vehicle × days × discount)
- **POS** — quick in-person checkout that creates an instant `Success` booking and decrements stock
- **Promo / Campaigns** — full CRUD (create, toggle active, delete) against `/api/campaigns`
- **Super Admin** — role/permission matrix with functional toggles
- **Sales** (`/admin/bookings`) — full sales/leads table, search + status filter, shows AI-sourced leads with score and qualification tier

### Authentication & Access Control
- Real accounts backed by SQLite (`users` table), passwords hashed with bcrypt — never stored in plain text.
- `/api/auth/register`, `/login`, `/logout`, `/me` — JSON API, sessions are signed JWTs (`jose`) in an httpOnly, sameSite cookie.
- **`src/proxy.ts`** (Next.js 16's replacement for `middleware.ts`) checks the session on every `/admin/**` request and enforces role access *before* any admin page or API route runs:
  - No session → redirected to `/login?redirect=...`
  - Logged in but role is `CUSTOMER` → redirected home (not bounced back to login)
  - Role is `ADMIN` → allowed through
- Public registration (`/register`) always creates a `CUSTOMER` account — there is no self-service way to become an admin, by design. Admin accounts are provisioned via the seed script (see below).
- The Navbar and admin Topbar both reflect real session state (name, role-aware links, working Log out) via `useCurrentUser()`.

**Seeded credentials** (from `npm run db:seed`):

| Role | Email | Password |
|---|---|---|
| Admin | `admin@bestauto.com` | `Admin123!` |
| Customer | `customer@bestauto.com` | `Customer123!` |

Change these in `scripts/seed.ts` before any real deployment.

### Database
- **SQLite via Drizzle ORM + Node's built-in `node:sqlite` module** — a real, persistent, file-backed database (`dev.db`), not an in-memory mock. Survives server restarts.
- **Zero native dependencies, on purpose.** Every earlier option we tried had a real cost:
  - **Prisma** requires downloading engine binaries from `binaries.prisma.sh` at `generate`/`push` time — fails outright in network-restricted environments.
  - **better-sqlite3** is a native addon: if npm can't find a prebuilt binary for your exact OS/architecture/Node version, it silently falls back to compiling from source with `node-gyp`, which needs Visual Studio Build Tools (Windows), Xcode Command Line Tools (macOS), or build-essential (Linux) — a common source of broken `npm install` on machines that don't have a C++ toolchain set up.
  - **`node:sqlite`** ships inside Node itself (stable without a flag since Node 22.13). Nothing to download, nothing to compile, works identically on every platform Node runs on. Drizzle added first-party support for it in the `1.0.0-rc` line — that's why `drizzle-orm` is pinned to `1.0.0-rc.4` instead of the `0.45.x` stable release, which doesn't have this driver yet. The version is pinned exactly (no `^`) so nobody gets silently upgraded to a future RC or the eventual 1.0 stable without testing first.
- Schema: `src/db/schema.ts` — `users`, `vehicles`, `bookings`, `campaigns` tables. Matching raw DDL lives in `src/db/migrations.sql`, applied by `scripts/migrate.ts` (`npm run db:push`) — written by hand rather than via `drizzle-kit push`, because drizzle-kit's CLI doesn't yet support the `node:sqlite` driver either.
- `src/lib/store.ts` is the data-access layer every API route uses. `node:sqlite`'s sync API mirrors better-sqlite3's (`.all()`/`.get()`/`.run()`), so this file needed no logic changes when the driver was swapped.
- `npm run db:seed` (`scripts/seed.ts`) populates the fleet, sample bookings, campaigns, and the two accounts above.
- Swapping to Postgres/MySQL in production is a driver change in `src/db/client.ts` (see comments there and in `src/db/schema.ts`) plus writing that provider's DDL; the schema shape and every query in `src/lib/store.ts` stay the same.
- Requires **Node ≥ 22.13.0** (see `engines` in `package.json`) for `node:sqlite`. Check your version with `node --version`; on an older Node, upgrade via [nodejs.org](https://nodejs.org) or a version manager (nvm/fnm/volta).

### AI Feature — Vehicle Recommendation Assistant
A chat widget that:
1. Extracts requirements from free text (seats, vehicle type, budget, trip length, feature keywords) — see `src/lib/ai/recommend.ts`.
2. Scores and ranks **actual vehicles from the live vehicle store** against those requirements — never invents vehicles or prices.
3. Generates a natural-language reply with provider priority **Gemini → Anthropic → deterministic templated fallback** (`src/lib/ai/explain.ts`). The widget shows "Answered live by Gemini" when the real model responded. The site never breaks if the LLM is unavailable, slow, or misconfigured.

### Automation — Inquiry → Lead Qualification
`POST /api/bookings` runs a full pipeline on every rental inquiry:

```
inquiry → zod validation → requirement extraction → vehicle matching
        → lead scoring (specificity, urgency, match quality) → stored
        → surfaced on the admin dashboard (score + Hot/Warm/Cold tier)
```

See `src/lib/leadScore.ts`. Leads from the chat widget or the booking form both show up in `/admin/bookings` with their score and tier.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** SQLite via Drizzle ORM + `node:sqlite` (Node built-in, zero native dependencies)
- **Auth:** bcryptjs (password hashing) + jose (JWT sessions) + `src/proxy.ts` route protection
- **Charts:** Recharts
- **Icons:** lucide-react
- **Validation:** Zod
- **AI:** Gemini (primary) / Anthropic (secondary) / deterministic fallback

## Architecture

```
├── scripts/
│   └── seed.ts                populates the DB + creates admin/customer accounts
├── src/
│   ├── app/
│   │   ├── (site)/            customer-facing routes (layout: Navbar + Footer + AI widget)
│   │   │   ├── page.tsx        home
│   │   │   └── vehicles/       listing + [id] detail
│   │   ├── admin/              admin dashboard routes (layout: Sidebar + Topbar), gated by proxy.ts
│   │   │   ├── page.tsx        dashboard
│   │   │   ├── vehicles/       inventory table + new/ + [id]/edit/ (full CRUD)
│   │   │   └── bookings/       sales/leads table
│   │   ├── login/, register/   auth pages
│   │   └── api/                REST route handlers (see below), incl. api/auth/*
│   ├── components/
│   │   ├── site/               customer UI (Navbar, Hero, VehicleCard, AIAssistant, …)
│   │   ├── admin/               dashboard UI (Sidebar, StatCard, charts, tables, …)
│   │   ├── auth/                AuthShell (shared login/register layout)
│   │   └── ui/                  shared primitives (Button, Modal, Badge, Skeleton)
│   ├── data/                   typed seed datasets (vehicles, bookings) used by scripts/seed.ts
│   ├── db/
│   │   ├── schema.ts            Drizzle table definitions (users, vehicles, bookings, campaigns)
│   │   ├── client.ts             node:sqlite + Drizzle client singleton
│   │   ├── migrations.sql        hand-written DDL (mirrors schema.ts)
│   │   └── users.ts              user data-access functions
│   ├── lib/
│   │   ├── ai/                  recommend.ts (matching engine), explain.ts (Gemini/Anthropic/fallback)
│   │   ├── auth.ts               password hashing, JWT sign/verify, getCurrentUser()
│   │   ├── useCurrentUser.ts     client hook for session state (Navbar, admin Topbar)
│   │   ├── leadScore.ts          automation/lead-qualification
│   │   └── store.ts              vehicle/booking/campaign data-access layer (SQLite-backed)
│   ├── proxy.ts                 route protection for /admin/** (Next.js 16's middleware replacement)
│   └── types/                   shared TypeScript types
```

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/vehicles` | List vehicles (`type`, `brand`, `fuelType`, `search`, `minSeats`, `maxPrice`) |
| POST | `/api/vehicles` | Create a vehicle |
| GET | `/api/vehicles/:id` | Single vehicle |
| PATCH | `/api/vehicles/:id` | Update stock, price, location, availability, name |
| DELETE | `/api/vehicles/:id` | Remove a vehicle |
| GET | `/api/bookings` | List bookings/leads (`status`, `search`, `limit`) |
| POST | `/api/bookings` | Submit a rental inquiry — runs the automation pipeline (supports `instant: true` for POS) |
| PATCH | `/api/bookings/:id` | Update booking status (returns/cancellations) |
| GET | `/api/dashboard/stats` | Dashboard stat cards (`range`: 7d / 30d / 90d / 12m) |
| GET | `/api/dashboard/revenue` | Revenue series + region sales |
| GET | `/api/dashboard/bookings` | Best sellers + recent transactions |
| GET | `/api/campaigns` | List promo campaigns |
| POST | `/api/campaigns` | Create a campaign |
| PATCH | `/api/campaigns/:id` | Toggle active state |
| DELETE | `/api/campaigns/:id` | Remove a campaign |
| POST | `/api/ai/recommend` | AI assistant: extraction, matching, reply (Gemini/Anthropic/fallback), lead qualification |
| POST | `/api/auth/register` | Create a CUSTOMER account, starts a session |
| POST | `/api/auth/login` | Verify credentials, start a session |
| POST | `/api/auth/logout` | Clear the session cookie |
| GET | `/api/auth/me` | Current session's user (or `null`) |

All write endpoints validate input with Zod and return structured `422` errors on failure. `/admin/**` pages and are additionally gated by `src/proxy.ts` — an unauthenticated or non-admin request never reaches the page at all.

## Local Development

**Requires Node ≥ 22.13.0** (for the built-in `node:sqlite` module — see the Database section below for why). Check with `node --version`.

```bash
npm install
cp .env.example .env.local   # then fill in AUTH_SECRET at minimum — see below
npm run db:setup             # creates dev.db and seeds vehicles/bookings/campaigns/accounts
npm run dev
```

Visit `http://localhost:3000` for the customer site and log in at `http://localhost:3000/login` with the seeded admin account to reach `http://localhost:3000/admin`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
DATABASE_URL="file:./dev.db"   # required — SQLite file path
AUTH_SECRET=                    # required — random 32+ char string, signs session JWTs
GEMINI_API_KEY=                 # optional — primary provider for LLM-generated assistant replies
ANTHROPIC_API_KEY=              # optional — secondary provider if Gemini is unset or fails
```

Generate `AUTH_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The AI assistant and the whole app work fully without either AI key; they only upgrade the quality of the assistant's natural-language phrasing. Provider priority is Gemini first, then Anthropic, then a deterministic template — all grounded in the same ranked vehicle data either way. `DATABASE_URL` and `AUTH_SECRET` are required — the app won't start meaningfully without them (no database connection, no way to sign sessions).

**Security note:** `.env.local` is gitignored (see `.env*` in `.gitignore`) and must never be committed. If a key or secret is ever pasted into a chat, ticket, or shared doc, treat it as compromised and rotate it immediately.

## Deployment

Ready for Vercel, with one caveat: **SQLite on Vercel's serverless filesystem is ephemeral** — fine for demos, not for production persistence. For a real deployment:

1. Swap the client in `src/db/client.ts` for a hosted Postgres/MySQL driver (e.g. `@vercel/postgres`, `postgres.js`, or Turso for edge SQLite) and write that provider's equivalent of `src/db/migrations.sql`. The schema in `src/db/schema.ts` and every query in `src/lib/store.ts` / `src/db/users.ts` stay the same — only the driver and DDL change.
2. Run `npm run db:push` against the production database as part of your deploy step.
3. Set `DATABASE_URL`, `AUTH_SECRET`, and optionally `GEMINI_API_KEY`/`ANTHROPIC_API_KEY` in your hosting provider's environment variables.
4. Run the seed script once against production (or create your admin account manually) — don't ship the default `Admin123!` password.

```bash
npm run build
npm run start
```

## AI Implementation Notes

The assistant is deliberately **grounded-first, LLM-second**: matching and ranking always run against the live vehicle store (`src/lib/store.ts`, seeded from `src/data/vehicles.ts`), so recommendations can never reference a car that doesn't exist or a price that's wrong, and newly created vehicles (via Create Product) are immediately eligible for recommendation. The LLM call (when configured) is only used to phrase the explanation — it's given the already-ranked, already-correct list and told explicitly not to invent vehicles. Provider order is Gemini → Anthropic → deterministic template, each wrapped in an 8s timeout with automatic fallback to the next provider (or the template) on any error, so the feature never breaks the page and never leaves the user without a useful answer.

## Automation Workflow Notes

Every booking submission and every AI chat message runs through `qualifyLead()`, which scores requirement specificity, urgency language, and match quality into a 0–99 lead score and a Hot/Warm/Cold tier. This is visible end-to-end: submit an inquiry on the site, then check `/admin/bookings` — the new lead appears immediately with its score and AI note.

## Known Limitations / Future Improvements

- `node:sqlite` is officially "stable" as of Node 22.13 but the module still prints an `ExperimentalWarning` on startup — cosmetic, safe to ignore; it doesn't affect functionality. Similarly, `drizzle-orm` is pinned to a `1.0.0-rc` release rather than a final stable tag, since that's the first release line with `node:sqlite` support. Both are pinned exactly and have been tested end-to-end (auth, CRUD, seeding, full build) as part of this project.
- SQLite is file-based and great for local dev/small deployments, but is ephemeral on serverless platforms — see the Deployment section above for swapping to hosted Postgres/MySQL.
- Payment is not integrated (mock `Card` payment method on submission); would add Stripe for a real checkout.
- No password reset / email verification flow; would add a transactional email provider (Resend, Postmark) for that.
- No rate limiting on `/api/auth/login` or `/api/auth/register`; would add before any public deployment to prevent brute-force/spam.
- Sales-by-region map is a stylized illustration, not a geographically precise map component.
- The generated barcode (`/admin/inventory/barcode`) is a deterministic visual pattern, not a scannable industry-standard format (Code128/EAN); the QR code is real and scannable.
- Units, Variant Attributes edits, and Super Admin permission toggles are session-local UI state (not persisted to the database) — they demonstrate the interaction pattern but reset on reload. Vehicles, bookings, campaigns, and user accounts are all fully persisted.
