"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { PurchaseForm } from "@/components/purchases/purchase-form"
import { PurchaseRow } from "@/components/purchases/purchase-row"
import { usePurchases, useDeletePurchase } from "@/hooks/use-purchases"
import type { PurchaseWithProduct } from "@/lib/supabase/purchases"
import { cn, formatDate, formatINR } from "@/lib/utils"
import { useI18n } from "@/i18n/context"
import type { ProductType } from "@/types/database"

type Filter = "all" | ProductType

export default function PurchasesPage() {
  const { t } = useI18n()
  const { data: purchases, isLoading } = usePurchases()
  const deletePurchase = useDeletePurchase()

  const [filter, setFilter] = useState<Filter>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<PurchaseWithProduct | null>(null)
  const [pendingDelete, setPendingDelete] = useState<PurchaseWithProduct | null>(
    null,
  )

  const filtered = useMemo(() => {
    const list = purchases ?? []
    if (filter === "all") return list
    return list.filter((p) => p.product?.type === filter)
  }, [purchases, filter])

  // Group by purchase date (already sorted newest-first by the query).
  const groups = useMemo(() => {
    const map = new Map<string, PurchaseWithProduct[]>()
    for (const p of filtered) {
      const arr = map.get(p.purchase_date) ?? []
      arr.push(p)
      map.set(p.purchase_date, arr)
    }
    return Array.from(map.entries())
  }, [filtered])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(purchase: PurchaseWithProduct) {
    setEditing(purchase)
    setFormOpen(true)
  }

  async function confirmDelete() {
    const purchase = pendingDelete
    if (!purchase) return
    try {
      await deletePurchase.mutateAsync(purchase.id)
      toast.success(t.purchases.deleted)
    } catch (error) {
      console.error(error)
      toast.error(t.common.somethingWrong)
    }
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t.purchases.all },
    { key: "resale", label: t.products.resale },
    { key: "supply", label: t.products.supply },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{t.purchases.title}</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus />
          {t.purchases.add}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-lg border p-2 text-sm font-medium transition-colors",
              filter === key
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
          ))}
        </div>
      ) : groups.length > 0 ? (
        <div className="flex flex-col gap-5">
          {groups.map(([date, items]) => {
            const dayTotal = items.reduce((sum, p) => sum + p.total, 0)
            return (
              <div key={date} className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-sm font-medium text-muted-foreground">
                    {formatDate(date)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t.purchases.dayTotal}: {formatINR(dayTotal)}
                  </span>
                </div>
                {items.map((purchase) => (
                  <PurchaseRow
                    key={purchase.id}
                    purchase={purchase}
                    onEdit={openEdit}
                    onDelete={setPendingDelete}
                  />
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t.purchases.empty}
        </p>
      )}

      <PurchaseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        purchase={editing}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => {
          if (!o) setPendingDelete(null)
        }}
        title={t.purchases.deleteConfirm}
        description={pendingDelete?.product?.name}
        confirmLabel={t.common.delete}
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
