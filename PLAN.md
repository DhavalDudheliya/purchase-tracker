# Implementation Plan — Purchase Tracker

Roadmap for building v1. See `SPEC.md` (scope) and `TECH_STACK.md` (choices).

## Data model (Supabase / Postgres)

### `products`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (pk) | default `gen_random_uuid()` |
| `name` | text | required |
| `type` | text/enum | `'resale'` \| `'supply'` |
| `default_price` | numeric | usual rate; pre-fills purchases |
| `image_url` | text (nullable) | points to Supabase Storage object |
| `created_at` | timestamptz | default `now()` |
| `updated_at` | timestamptz | maintained via trigger |

### `purchases`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (pk) | |
| `product_id` | uuid (fk → products) | on delete restrict |
| `purchase_date` | date | defaults to today |
| `quantity` | numeric | plain number, no unit |
| `rate` | numeric | actual rate paid (may differ from product default) |
| `total` | numeric | **generated column** = `quantity * rate` |
| `created_at` | timestamptz | |

### Storage
- Bucket `product-images` (public read) for product photos.

### Insights (per product)
Exposed via a SQL **view** `product_stats`: last rate, avg/min/max rate,
total quantity, total spent — computed from `purchases`.

## Folder structure (Next.js App Router — flat, no `src/`)

Alias `@/*` maps to the repo root. See `CLAUDE.md` for the authoritative version.

```
app/
  layout.tsx            # root layout: ThemeProvider > QueryProvider, header
  page.tsx              # Home: quick "Add Purchase", recent, month totals
  purchases/page.tsx    # Purchase history (filter by product/date/type)
  products/page.tsx     # Product catalog (list + add/edit)
  globals.css
components/
  ui/                   # shadcn/ui (Base UI) generated components
  providers/            # QueryProvider (+ future providers)
  layout/               # header, nav, language toggle
  products/             # product form, product card, image picker
  purchases/            # purchase form, purchase list/row, filters
lib/
  supabase/             # browser Supabase client + queries
  utils.ts              # cn(), formatters (currency, date)
hooks/                  # TanStack Query hooks (useProducts, usePurchases, ...)
types/                  # shared TS types (Product, Purchase, ...)
i18n/                   # en + gujlish dictionaries + helpers
```

## Screens (v1)

1. **Home** — big "Add Purchase" button, recent purchases, this-month totals (Resale vs Supply).
2. **Add Purchase** — product picker with **Resale | Supply** tabs, date (default today), quantity, rate (pre-filled, editable), auto total, save.
3. **Products** — list; add/edit product (name, type, default price, image via camera/gallery).
4. **Purchase History** — list with filters (product, date range, type); edit/delete.
5. **Product insights** — last/avg/min/max rate, totals (inline on product or its detail).
6. **Language toggle** — English ⇄ Gujlish, in the header; persisted.

## Build phases

- **Phase 0 — Scaffold & standards**
  Next.js + shadcn (Base UI, Nova) + Tailwind; add TanStack Query provider;
  set up folder structure; write `CLAUDE.md` (code standards + structure);
  base layout + header. Commit.
- **Phase 1 — Supabase**
  Create project; run schema (tables, generated `total`, `product_stats` view,
  storage bucket); wire `@supabase/supabase-js` + env vars.
- **Phase 2 — Products**
  Catalog CRUD with image upload (camera/gallery). TanStack Query hooks.
- **Phase 3 — Purchases**
  Log purchase (pre-fill rate from product), history list with filters.
- **Phase 4 — Insights**
  Per-product rate stats + month totals on Home.
- **Phase 5 — i18n**
  English + Gujlish dictionaries; header toggle; persist choice.
- **Phase 6 — PWA & mobile polish**
  Manifest, icons, service worker (installable only), mobile UI pass.
- **Phase 7 — Deploy**
  Vercel project; env vars; production build; push.

## What I need from you

- **Supabase account**: you'll create the project (free tier) and share the
  project URL + anon key (public, safe for client). I can guide you when we hit Phase 1.
- **Vercel account**: needed at Phase 7 for deploy.

## Open choices (with my recommendation)

1. **i18n approach** → *lightweight custom dictionaries* (2 languages, mostly custom Gujlish). `next-intl` is the alternative if you want richer tooling. **Rec: custom, keep it simple.**
2. **Home dashboard** → include a minimal one (recent + month totals). **Rec: yes, small.**
3. **Quantity type** → allow decimals or whole numbers only? **Rec: whole numbers** (pieces), but easy to change.
