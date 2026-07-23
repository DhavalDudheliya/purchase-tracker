"use client"

import Link from "next/link"
import { ImageIcon, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatINR } from "@/lib/utils"
import { useI18n } from "@/i18n/context"
import type { Product } from "@/types/database"

type Props = {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductCard({ product, onEdit, onDelete }: Props) {
  const { t } = useI18n()

  return (
    <div className="flex flex-row items-center gap-3 rounded-xl bg-card p-3 text-card-foreground ring-1 ring-foreground/10">
      <Link
        href={`/products/${product.id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt=""
            className="size-14 shrink-0 rounded-md border object-cover"
          />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
            <ImageIcon className="size-6" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{product.name}</span>
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
      </Link>

      <div className="flex shrink-0 gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => onEdit(product)}
          aria-label={t.common.edit}
        >
          <Pencil />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => onDelete(product)}
          aria-label={t.common.delete}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  )
}
