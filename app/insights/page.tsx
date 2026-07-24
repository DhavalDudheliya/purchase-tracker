"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ImageIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAllProductStats, useProducts } from "@/hooks/use-products"
import { cn, formatINR } from "@/lib/utils"
import { useI18n } from "@/i18n/context"
import type { Product, ProductStats } from "@/types/database"

type Sort = "spent" | "quantity" | "name"

type Row = ProductStats & { product: Product }

export default function InsightsPage() {
  const { t } = useI18n()
  const { data: products, isLoading: productsLoading } = useProducts()
  const { data: stats, isLoading: statsLoading } = useAllProductStats()
  const isLoading = productsLoading || statsLoading

  const [sort, setSort] = useState<Sort>("spent")

  const rows = useMemo<Row[]>(() => {
    const statsById = new Map((stats ?? []).map((s) => [s.product_id, s]))
    const merged: Row[] = (products ?? []).map((product) => {
      const s = statsById.get(product.id)
      return {
        product,
        product_id: product.id,
        purchase_count: s?.purchase_count ?? 0,
        total_quantity: s?.total_quantity ?? 0,
        total_spent: s?.total_spent ?? 0,
        min_rate: s?.min_rate ?? null,
        max_rate: s?.max_rate ?? null,
        avg_rate: s?.avg_rate ?? null,
        last_rate: s?.last_rate ?? null,
      }
    })
    merged.sort((a, b) => {
      if (sort === "name") return a.product.name.localeCompare(b.product.name)
      if (sort === "quantity") return b.total_quantity - a.total_quantity
      return b.total_spent - a.total_spent
    })
    return merged
  }, [products, stats, sort])

  const totals = useMemo(() => {
    let spent = 0
    let purchases = 0
    for (const r of rows) {
      spent += r.total_spent
      purchases += r.purchase_count
    }
    return { spent, purchases, products: rows.length }
  }, [rows])

  const sorts: { key: Sort; label: string }[] = [
    { key: "spent", label: t.insights.bySpent },
    { key: "quantity", label: t.insights.byQuantity },
    { key: "name", label: t.insights.byName },
  ]

  const money = (v: number | null) => (v == null ? "—" : formatINR(v))

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">{t.insights.title}</h1>

      {/* All-time totals */}
      <div className="grid grid-cols-3 gap-2">
        <SummaryTile
          label={t.insights.allTimeSpent}
          value={formatINR(totals.spent)}
        />
        <SummaryTile
          label={t.insights.totalPurchases}
          value={String(totals.purchases)}
        />
        <SummaryTile
          label={t.insights.productsTracked}
          value={String(totals.products)}
        />
      </div>

      {/* Sort control */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {t.insights.sortBy}:
        </span>
        <div className="flex flex-1 gap-2">
          {sorts.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSort(key)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                sort === key
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : rows.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <Link
              key={row.product_id}
              href={`/products/${row.product_id}`}
              className="flex flex-col gap-3 rounded-xl bg-card p-4 text-card-foreground ring-1 ring-foreground/10 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-3">
                {row.product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.product.image_url}
                    alt=""
                    className="size-11 shrink-0 rounded-md border object-cover"
                  />
                ) : (
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                    <ImageIcon className="size-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">
                      {row.product.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        row.product.type === "supply" &&
                          "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                      )}
                    >
                      {row.product.type === "resale"
                        ? t.products.resale
                        : t.products.supply}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {row.purchase_count > 0
                      ? `${row.purchase_count} ${t.insights.purchaseCount}`
                      : t.insights.never}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Metric label={t.insights.spent} value={money(row.total_spent)} />
                <Metric
                  label={t.insights.qty}
                  value={String(row.total_quantity)}
                />
                <Metric label={t.insights.avgRate} value={money(row.avg_rate)} />
                <Metric
                  label={t.insights.lastRate}
                  value={money(row.last_rate)}
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t.insights.empty}
        </p>
      )}
    </div>
  )
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-card p-3 ring-1 ring-foreground/10">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-base font-semibold tracking-tight sm:text-lg">
        {value}
      </p>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium tracking-tight">{value}</span>
    </div>
  )
}
