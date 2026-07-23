"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { deleteProductImage, uploadProductImage } from "@/lib/supabase/products"
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products"
import { useI18n } from "@/i18n/context"
import type { Product, ProductType } from "@/types/database"
import { ImagePicker } from "./image-picker"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When set, the form edits this product; otherwise it creates a new one. */
  product?: Product | null
}

export function ProductForm({ open, onOpenChange, product }: Props) {
  const { t } = useI18n()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product ? t.products.editTitle : t.products.addTitle}
          </DialogTitle>
        </DialogHeader>
        {/* Keyed + only mounted while open, so fields initialize fresh from
            `product` without needing a state-resetting effect. */}
        {open && (
          <ProductFormFields
            key={product?.id ?? "new"}
            product={product ?? null}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function ProductFormFields({
  product,
  onDone,
}: {
  product: Product | null
  onDone: () => void
}) {
  const { t } = useI18n()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const [name, setName] = useState(product?.name ?? "")
  const [type, setType] = useState<ProductType>(product?.type ?? "resale")
  const [price, setPrice] = useState(
    product ? String(product.default_price) : "",
  )
  const [image, setImage] = useState<File | string | null>(
    product?.image_url ?? null,
  )
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      toast.error(t.products.nameRequired)
      return
    }

    setSubmitting(true)
    try {
      // Resolve the image URL: upload a new File, keep an existing URL, or clear.
      let imageUrl: string | null = null
      if (image instanceof File) {
        imageUrl = await uploadProductImage(image)
      } else if (typeof image === "string") {
        imageUrl = image
      }

      const payload = {
        name: name.trim(),
        type,
        default_price: Number(price) || 0,
        image_url: imageUrl,
      }

      if (product) {
        await updateProduct.mutateAsync({ id: product.id, input: payload })
        // Clean up the old image if it was replaced or removed.
        if (product.image_url && product.image_url !== imageUrl) {
          void deleteProductImage(product.image_url)
        }
        toast.success(t.products.updated)
      } else {
        await createProduct.mutateAsync(payload)
        toast.success(t.products.created)
      }
      onDone()
    } catch (error) {
      console.error(error)
      toast.error(t.common.somethingWrong)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product-name">{t.products.name}</Label>
        <Input
          id="product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.products.namePlaceholder}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t.products.type}</Label>
        <div className="grid grid-cols-2 gap-2">
          <TypeOption
            selected={type === "resale"}
            title={t.products.resale}
            hint={t.products.resaleHint}
            onClick={() => setType("resale")}
          />
          <TypeOption
            selected={type === "supply"}
            title={t.products.supply}
            hint={t.products.supplyHint}
            onClick={() => setType("supply")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product-price">{t.products.defaultPrice}</Label>
        <Input
          id="product-price"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t.products.photo}</Label>
        <ImagePicker value={image} onChange={setImage} />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          {t.common.cancel}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? t.common.saving : t.common.save}
        </Button>
      </DialogFooter>
    </form>
  )
}

function TypeOption({
  selected,
  title,
  hint,
  onClick,
}: {
  selected: boolean
  title: string
  hint: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left transition-colors",
        selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
      )}
    >
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </button>
  )
}
