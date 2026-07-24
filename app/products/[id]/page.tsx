"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ImageIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PurchaseRow } from "@/components/purchases/purchase-row"
import { useProduct, useProductStats } from "@/hooks/use-products"
import { usePurchases } from "@/hooks/use-purchases"
import { cn, formatINR } from "@/lib/utils"
import { useI18n } from "@/i18n/context"

export default function ProductDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? "")
  const { t } = useI18n()

  const { data: product, isLoading } = useProduct(id)
  const { data: stats } = useProductStats(id)
  const { data: allPurchases } = usePurchases()

  const purchases = useMemo(
    () => (allPurchases ?? []).filter((p) => p.product_id === id),
    [allPurchases, id],
  )

  const money = (v: number | null | undefined) =>
    v == null ? "—" : formatINR(v)

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        className="-ml-2 self-start"
        render={<Link href="/products" />}
      >
        <ArrowLeft />
        {t.common.back}
      </Button>

      {isLoading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : !product ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t.products.notFound}
        </p>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center gap-4">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt=""
                className="size-20 shrink-0 rounded-lg border object-cover"
              />
            ) : (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                <ImageIcon className="size-8" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-semibold">
                  {product.name}
                </h1>
                <Badge
                  variant="secondary"
                  className={cn(
                    product.type === "supply" &&
                      "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                  )}
                >
                  {product.type === "resale"
                    ? t.products.resale
                    : t.products.supply}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.products.defaultPrice}: {formatINR(product.default_price)}
              </p>
            </div>
          </div>

          {/* Insights */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium">{t.products.insights}</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <StatTile label={t.products.lastRate} value={money(stats?.last_rate)} />
              <StatTile label={t.products.avgRate} value={money(stats?.avg_rate)} />
              <StatTile label={t.products.lowest} value={money(stats?.min_rate)} />
              <StatTile label={t.products.highest} value={money(stats?.max_rate)} />
              <StatTile
                label={t.products.totalQty}
                value={String(stats?.total_quantity ?? 0)}
              />
              <StatTile
                label={t.products.totalSpent}
                value={money(stats?.total_spent ?? 0)}
              />
            </div>
          </div>

          {/* Purchase history */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium">{t.products.history}</h2>
            {purchases.length > 0 ? (
              <div className="flex flex-col gap-2">
                {purchases.map((purchase) => (
                  <PurchaseRow key={purchase.id} purchase={purchase} />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t.products.noPurchases}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-card p-3 ring-1 ring-foreground/10">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tracking-tight">{value}</p>
    </div>
  )
}
