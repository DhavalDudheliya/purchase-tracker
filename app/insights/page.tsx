"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ImageIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { usePurchases } from "@/hooks/use-purchases"
import { cn, formatINR } from "@/lib/utils"
import { useI18n } from "@/i18n/context"
import type { ProductType } from "@/types/database"

type Range = "thisMonth" | "lastMonth" | "all"
type Sort = "spent" | "quantity" | "name"

type Row = {
  productId: string
  name: string
  type: ProductType
  imageUrl: string | null
  quantity: number
  spent: number
  count: number
}

/** Year-month prefix ("YYYY-MM") for the current month offset by `monthsAgo`. */
function monthPrefix(monthsAgo: number): string {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export default function InsightsPage() {
  const { t } = useI18n()
  const { data: purchases, isLoading } = usePurchases()

  const [range, setRange] = useState<Range>("thisMonth")
  const [sort, setSort] = useState<Sort>("spent")

  const rows = useMemo<Row[]>(() => {
    const prefix =
      range === "thisMonth"
        ? monthPrefix(0)
        : range === "lastMonth"
          ? monthPrefix(1)
          : null

    const byProduct = new Map<string, Row>()
    for (const p of purchases ?? []) {
      if (prefix && !p.purchase_date.startsWith(prefix)) continue
      if (!p.product) continue
      const existing = byProduct.get(p.product_id)
      if (existing) {
        existing.quantity += p.quantity
        existing.spent += p.total
        existing.count += 1
      } else {
        byProduct.set(p.product_id, {
          productId: p.product_id,
          name: p.product.name,
          type: p.product.type,
          imageUrl: p.product.image_url,
          quantity: p.quantity,
          spent: p.total,
          count: 1,
        })
      }
    }

    const list = Array.from(byProduct.values())
    list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "quantity") return b.quantity - a.quantity
      return b.spent - a.spent
    })
    return list
  }, [purchases, range, sort])

  const totals = useMemo(() => {
    let spent = 0
    let count = 0
    for (const r of rows) {
      spent += r.spent
      count += r.count
    }
    return { spent, count, products: rows.length }
  }, [rows])

  const ranges: { key: Range; label: string }[] = [
    { key: "thisMonth", label: t.insights.thisMonth },
    { key: "lastMonth", label: t.insights.lastMonth },
    { key: "all", label: t.insights.allTime },
  ]

  const sorts: { key: Sort; label: string }[] = [
    { key: "spent", label: t.insights.bySpent },
    { key: "quantity", label: t.insights.byQuantity },
    { key: "name", label: t.insights.byName },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">{t.insights.title}</h1>

      {/* Period */}
      <div className="grid grid-cols-3 gap-2">
        {ranges.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setRange(key)}
            className={cn(
              "rounded-lg border p-2 text-sm font-medium transition-colors",
              range === key
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Totals for the selected period */}
      <div className="grid grid-cols-3 gap-2">
        <SummaryTile
          label={t.insights.totalSpent}
          value={formatINR(totals.spent)}
        />
        <SummaryTile
          label={t.insights.totalPurchases}
          value={String(totals.count)}
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
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : rows.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <Link
              key={row.productId}
              href={`/products/${row.productId}`}
              className="flex flex-col gap-3 rounded-xl bg-card p-4 text-card-foreground ring-1 ring-foreground/10 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-3">
                {row.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.imageUrl}
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
                    <span className="truncate font-medium">{row.name}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        row.type === "supply" &&
                          "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                      )}
                    >
                      {row.type === "resale"
                        ? t.products.resale
                        : t.products.supply}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {row.count} {t.insights.purchaseCount}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Metric label={t.insights.spent} value={formatINR(row.spent)} />
                <Metric label={t.insights.qty} value={String(row.quantity)} />
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
