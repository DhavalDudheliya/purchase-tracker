# CLAUDE.md — Purchase Tracker

Guidance for working in this repo. Read alongside `SPEC.md` (scope),
`TECH_STACK.md` (choices), and `PLAN.md` (roadmap).

## What this is

A single-user, mobile-first web app for a Surat online seller to log daily
inventory + supply purchases from wholesalers. **No login, no multi-user, no
offline.** Full scope in `SPEC.md`.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 ·
shadcn/ui on **Base UI** primitives (Nova preset, Lucide icons) · TanStack Query ·
Supabase (Postgres + Storage). Deployed on Vercel.

> **Next.js 16 is not the Next.js in your training data** (see `AGENTS.md`).
> Before writing framework code, check `node_modules/next/dist/docs/` for the
> current API. Heed deprecation notices.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (also typechecks) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npx shadcn@latest add <component>` | Add a shadcn/ui component |

Run `npm run typecheck` and `npm run lint` before considering work done.

## Folder structure

Flat layout (no `src/`); alias `@/*` maps to repo root.

```
app/                  # App Router routes
  layout.tsx          # root layout: ThemeProvider > QueryProvider
  page.tsx            # Home
  <route>/page.tsx    # feature pages (products, purchases, ...)
components/
  ui/                 # shadcn/ui components — generated, avoid hand-editing
  providers/          # React context providers (query-provider, ...)
  layout/             # header, nav, language toggle
  products/           # product-feature components
  purchases/          # purchase-feature components
hooks/                # TanStack Query hooks (useProducts, usePurchases, ...)
lib/
  utils.ts            # cn() and shared helpers
  supabase/           # Supabase client + queries
types/                # shared TS types (Product, Purchase, ...)
i18n/                 # en + gujlish dictionaries + helpers
```

## Code standards

- **Server Components by default.** Add `"use client"` only when a component needs
  state, effects, browser APIs, or a client library (TanStack Query, forms).
- **All data access goes through TanStack Query hooks** in `hooks/`, which call
  the Supabase client in `lib/supabase/`. Never call Supabase directly inside a
  page/component. Use query keys consistently and invalidate on mutation.
- **UI comes from `@/components/ui`** (shadcn). Add new primitives via the CLI,
  don't reinvent them. Primitives are **Base UI**, not Radix.
- **Icons**: `lucide-react` only.
- **No hardcoded user-facing strings.** Every label goes through the i18n layer
  with both **English** and **Gujlish** entries (Gujlish = romanized Gujarati,
  keeping common English words like Purchase/Rate/Total).
- **Money & dates**: format via shared helpers in `lib/utils.ts` (₹ / INR).
- **TypeScript strict**; no `any` without a clear reason.
- **Formatting** is Prettier + `prettier-plugin-tailwindcss` — don't fight it.
- Match the naming and style of surrounding files.

## Guardrails (do not violate without asking)

- No authentication, accounts, or multi-user code — ever.
- No offline / service-worker caching logic (PWA is **installable only**).
- No sales/revenue/profit or udhaar features in v1 (future phases — see `SPEC.md`).
- Keep it mobile-first: design for a phone screen before desktop.
- Supabase **anon key** only on the client; never expose service-role keys client-side.
