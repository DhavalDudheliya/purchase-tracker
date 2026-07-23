"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ProductCard } from "@/components/products/product-card"
import { ProductForm } from "@/components/products/product-form"
import { useDeleteProduct, useProducts } from "@/hooks/use-products"
import { deleteProductImage } from "@/lib/supabase/products"
import { useI18n } from "@/i18n/context"
import type { Product } from "@/types/database"

export default function ProductsPage() {
  const { t } = useI18n()
  const { data: products, isLoading } = useProducts()
  const deleteProduct = useDeleteProduct()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setFormOpen(true)
  }

  async function confirmDelete() {
    const product = pendingDelete
    if (!product) return
    try {
      await deleteProduct.mutateAsync(product.id)
      if (product.image_url) void deleteProductImage(product.image_url)
      toast.success(t.products.deleted)
    } catch (error) {
      console.error(error)
      // Foreign-key restriction: product still has purchases.
      toast.error(t.products.deleteBlocked)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{t.products.title}</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus />
          {t.products.add}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="flex flex-col gap-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={openEdit}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t.products.empty}
        </p>
      )}

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => {
          if (!o) setPendingDelete(null)
        }}
        title={t.products.deleteConfirm}
        description={pendingDelete?.name}
        confirmLabel={t.common.delete}
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
