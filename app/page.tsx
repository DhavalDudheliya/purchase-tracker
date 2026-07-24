"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Package, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PurchaseRow } from "@/components/purchases/purchase-row"
import { usePurchases } from "@/hooks/use-purchases"
import { formatINR, formatLongDate, todayISO } from "@/lib/utils"
import { useI18n } from "@/i18n/context"

export default function Page() {
  const { t } = useI18n()
  const { data: purchases, isLoading } = usePurchases()

  const summary = useMemo(() => {
    const now = new Date()
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    let total = 0
    let resale = 0
    let supply = 0
    for (const p of purchases ?? []) {
      if (!p.purchase_date.startsWith(prefix)) continue
      total += p.total
      if (p.product?.type === "supply") supply += p.total
      else resale += p.total
    }
    return { total, resale, supply }
  }, [purchases])

  const recent = (purchases ?? []).slice(0, 5)
  const today = useMemo(() => formatLongDate(todayISO()), [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {t.home.today}
        </p>
        <h1 className="text-xl font-semibold md:text-2xl">{today}</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* This month's spend */}
        <div className="rounded-xl bg-card p-4 text-card-foreground ring-1 ring-foreground/10 lg:col-span-2 lg:p-6">
          <p className="text-sm text-muted-foreground">{t.home.thisMonth}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight lg:text-4xl">
            {formatINR(summary.total)}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-primary/5 px-3 py-2">
              <p className="text-xs text-muted-foreground">
                {t.products.resale}
              </p>
              <p className="font-medium">{formatINR(summary.resale)}</p>
            </div>
            <div className="rounded-lg bg-amber-500/10 px-3 py-2">
              <p className="text-xs text-muted-foreground">
                {t.products.supply}
              </p>
              <p className="font-medium">{formatINR(summary.supply)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:justify-center">
          <Button
            size="lg"
            nativeButton={false}
            className="h-14 text-base"
            render={<Link href="/purchases" />}
          >
            <Plus />
            {t.home.addPurchase}
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            className="h-14 text-base"
            render={<Link href="/products" />}
          >
            <Package />
            {t.home.manageProducts}
          </Button>
        </div>
      </div>

      {/* Recent purchases */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">{t.home.recent}</h2>
          {recent.length > 0 && (
            <Link
              href="/purchases"
              className="text-sm text-primary hover:underline"
            >
              {t.home.viewAll}
            </Link>
          )}
        </div>
        {isLoading ? (
          <div className="grid gap-2 lg:grid-cols-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
            ))}
          </div>
        ) : recent.length > 0 ? (
          <div className="grid gap-2 lg:grid-cols-2">
            {recent.map((purchase) => (
              <PurchaseRow key={purchase.id} purchase={purchase} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t.home.noRecent}
          </p>
        )}
      </div>
    </div>
  )
}
