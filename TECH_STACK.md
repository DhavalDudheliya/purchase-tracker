# Tech Stack — Purchase Tracker

The definitive record of what we build with and why. See `SPEC.md` for the product scope.

## At a glance

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js** (App Router, TypeScript) | Latest. Future-proofs server-side needs (marketplace API integrations in the revenue phase). |
| UI components | **shadcn/ui** on **Base UI** primitives | shadcn CLI v4; Base UI is the default primitive set. Nova preset (Lucide icons, Geist font). |
| Styling | **Tailwind CSS** | Ships with the shadcn scaffold. |
| Server state / data fetching | **TanStack Query** | Caching, mutations, and query invalidation for all Supabase reads/writes. |
| Database | **Supabase (managed Postgres)** | SQL fits the rate-history math (avg/min/max). Accessed from the client via `@supabase/supabase-js`. |
| Image storage | **Supabase Storage** | Product images (camera/gallery); not stored in the DB. |
| Internationalization | **Lightweight i18n** (English + Gujlish dictionaries) | Two languages only; mostly custom Gujlish strings, so no heavy framework. Library TBD in plan. |
| PWA | **Installable PWA** (no offline) | "Add to Home Screen" for an app-like feel. Service worker for installability only. |
| Hosting | **Vercel** | First-class Next.js deploys. Free tier. |
| Package manager | **npm** | Installed and zero-setup on this machine. |
| Version control | **GitHub** (private) | `github.com/DhavalDudheliya/purchase-tracker` |

## Principles

- **Latest stable versions** of all dependencies at scaffold time.
- **No auth / no login** — single-user app (see `SPEC.md`).
- **Client talks directly to Supabase** for v1; a server layer is added only when
  secrets must be hidden (future marketplace API integrations).
- **Free tier everywhere** — target ₹0/month to start.

## Explicitly considered and rejected

- **Vite + React** — simpler, but no server layer for the future revenue phase. Next.js chosen for longevity.
- **Firebase / Firestore** — NoSQL; a worse fit than Postgres for the structured rate-history queries.
- **On-device-only storage** — data loss risk; unacceptable for accounting records.
- **Offline mode** — out of scope for v1 (see `SPEC.md`).
