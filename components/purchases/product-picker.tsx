"use client"

import { useState } from "react"
import { ImageIcon, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatINR } from "@/lib/utils"
import { useProducts } from "@/hooks/use-products"
import { useI18n } from "@/i18n/context"
import type { Product, ProductType } from "@/types/database"

export function ProductPicker({
  onSelect,
}: {
  onSelect: (product: Product) => void
}) {
  const { t } = useI18n()
  const { data: products, isLoading } = useProducts()
  const [tab, setTab] = useState<ProductType>("resale")
  const [search, setSearch] = useState("")

  const filtered = (products ?? []).filter(
    (p) =>
      p.type === tab &&
      p.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <TabButton
          active={tab === "resale"}
          label={t.products.resale}
          onClick={() => setTab("resale")}
        />
        <TabButton
          active={tab === "supply"}
          label={t.products.supply}
          onClick={() => setTab("supply")}
        />
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.purchases.search}
          className="pl-8"
        />
      </div>

      <div className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
        {isLoading ? (
          [0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t.purchases.noMatch}
          </p>
        ) : (
          filtered.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              className="flex items-center gap-3 rounded-lg border p-2 text-left transition-colors hover:bg-muted"
            >
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt=""
                  className="size-10 shrink-0 rounded-md border object-cover"
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                  <ImageIcon className="size-5" />
                </div>
              )}
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {product.name}
              </span>
              <span className="shrink-0 text-sm text-muted-foreground">
                {formatINR(product.default_price)}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border p-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/5 text-primary"
          : "border-border text-muted-foreground hover:bg-muted",
      )}
    >
      {label}
    </button>
  )
}
