"use client"

import { ImageIcon, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatINR } from "@/lib/utils"
import type { PurchaseWithProduct } from "@/lib/supabase/purchases"
import { useI18n } from "@/i18n/context"

type Props = {
  purchase: PurchaseWithProduct
  onEdit: (purchase: PurchaseWithProduct) => void
  onDelete: (purchase: PurchaseWithProduct) => void
}

export function PurchaseRow({ purchase, onEdit, onDelete }: Props) {
  const { t } = useI18n()
  const product = purchase.product

  return (
    <div className="flex items-center gap-3 rounded-xl bg-card p-3 text-card-foreground ring-1 ring-foreground/10">
      {product?.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image_url}
          alt=""
          className="size-12 shrink-0 rounded-md border object-cover"
        />
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
          <ImageIcon className="size-5" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{product?.name ?? "—"}</span>
          {product && (
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
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {purchase.quantity} × {formatINR(purchase.rate)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-semibold">{formatINR(purchase.total)}</span>
        <div className="flex gap-1">
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onEdit(purchase)}
            aria-label={t.common.edit}
          >
            <Pencil />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onDelete(purchase)}
            aria-label={t.common.delete}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  )
}
