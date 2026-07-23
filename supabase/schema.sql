-- Purchase Tracker — database schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE where possible.

-- =====================================================================
-- Tables
-- =====================================================================

-- Products: the seller's catalog. A product has a "usual" default price that
-- pre-fills purchases; the actual rate is stored per-purchase.
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          text not null check (type in ('resale', 'supply')),
  default_price numeric(12, 2) not null default 0 check (default_price >= 0),
  image_url     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Purchases: one row per purchase (one product each). Total is derived.
create table if not exists public.purchases (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete restrict,
  purchase_date date not null default current_date,
  quantity      integer not null check (quantity > 0),
  rate          numeric(12, 2) not null check (rate >= 0),
  total         numeric(14, 2) generated always as (quantity * rate) stored,
  created_at    timestamptz not null default now()
);

create index if not exists purchases_product_id_idx on public.purchases (product_id);
create index if not exists purchases_date_idx        on public.purchases (purchase_date desc);

-- =====================================================================
-- updated_at trigger (products)
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =====================================================================
-- Per-product insights view
-- =====================================================================
create or replace view public.product_stats as
select
  p.id                              as product_id,
  count(pu.id)                      as purchase_count,
  coalesce(sum(pu.quantity), 0)     as total_quantity,
  coalesce(sum(pu.total), 0)        as total_spent,
  min(pu.rate)                      as min_rate,
  max(pu.rate)                      as max_rate,
  round(avg(pu.rate), 2)            as avg_rate,
  (
    select lp.rate
    from public.purchases lp
    where lp.product_id = p.id
    order by lp.purchase_date desc, lp.created_at desc
    limit 1
  )                                 as last_rate
from public.products p
left join public.purchases pu on pu.product_id = p.id
group by p.id;

-- =====================================================================
-- Row Level Security
-- Single-user app with NO login: the public anon key is used directly, so we
-- grant the anon role full access. NOTE: the anon key ships in the browser,
-- so anyone with the deployed URL can reach this data. Acceptable for v1 per
-- SPEC (no auth). Revisit if the data ever needs protecting.
-- =====================================================================
alter table public.products  enable row level security;
alter table public.purchases enable row level security;

drop policy if exists "anon full access products" on public.products;
create policy "anon full access products" on public.products
  for all to anon using (true) with check (true);

drop policy if exists "anon full access purchases" on public.purchases;
create policy "anon full access purchases" on public.purchases
  for all to anon using (true) with check (true);

-- =====================================================================
-- Storage bucket for product images
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "anon read product-images" on storage.objects;
create policy "anon read product-images" on storage.objects
  for select to anon using (bucket_id = 'product-images');

drop policy if exists "anon insert product-images" on storage.objects;
create policy "anon insert product-images" on storage.objects
  for insert to anon with check (bucket_id = 'product-images');

drop policy if exists "anon update product-images" on storage.objects;
create policy "anon update product-images" on storage.objects
  for update to anon using (bucket_id = 'product-images');

drop policy if exists "anon delete product-images" on storage.objects;
create policy "anon delete product-images" on storage.objects
  for delete to anon using (bucket_id = 'product-images');
