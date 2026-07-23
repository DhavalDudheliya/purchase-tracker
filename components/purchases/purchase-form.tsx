"use client"

import { useState } from "react"
import { ImageIcon, Pencil } from "lucide-react"
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
import { formatINR, todayISO } from "@/lib/utils"
import type { PurchaseWithProduct } from "@/lib/supabase/purchases"
import { useCreatePurchase, useUpdatePurchase } from "@/hooks/use-purchases"
import { useI18n } from "@/i18n/context"
import type { Product } from "@/types/database"
import { ProductPicker } from "./product-picker"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase?: PurchaseWithProduct | null
}

export function PurchaseForm({ open, onOpenChange, purchase }: Props) {
  const { t } = useI18n()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {purchase ? t.purchases.editTitle : t.purchases.addTitle}
          </DialogTitle>
        </DialogHeader>
        {open && (
          <PurchaseFormFields
            key={purchase?.id ?? "new"}
            purchase={purchase ?? null}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

/** Minimal shape the form needs to represent the chosen product. */
type SelectedProduct = {
  id: string
  name: string
  image_url: string | null
}

function PurchaseFormFields({
  purchase,
  onDone,
}: {
  purchase: PurchaseWithProduct | null
  onDone: () => void
}) {
  const { t } = useI18n()
  const createPurchase = useCreatePurchase()
  const updatePurchase = useUpdatePurchase()

  const [selected, setSelected] = useState<SelectedProduct | null>(
    purchase?.product
      ? {
          id: purchase.product.id,
          name: purchase.product.name,
          image_url: purchase.product.image_url,
        }
      : null,
  )
  const [date, setDate] = useState(purchase?.purchase_date ?? todayISO())
  const [quantity, setQuantity] = useState(
    purchase ? String(purchase.quantity) : "",
  )
  const [rate, setRate] = useState(purchase ? String(purchase.rate) : "")
  const [submitting, setSubmitting] = useState(false)

  const total = (Number(quantity) || 0) * (Number(rate) || 0)

  function handlePick(product: Product) {
    setSelected({
      id: product.id,
      name: product.name,
      image_url: product.image_url,
    })
    // Pre-fill the rate from the product's default; the user can override it.
    setRate(String(product.default_price))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!selected) {
      toast.error(t.purchases.selectProductError)
      return
    }
    if (!quantity || Number(quantity) <= 0) {
      toast.error(t.purchases.quantityError)
      return
    }

    setSubmitting(true)
    try {
      const input = {
        product_id: selected.id,
        purchase_date: date,
        quantity: Number(quantity),
        rate: Number(rate) || 0,
      }
      if (purchase) {
        await updatePurchase.mutateAsync({ id: purchase.id, input })
        toast.success(t.purchases.updated)
      } else {
        await createPurchase.mutateAsync(input)
        toast.success(t.purchases.created)
      }
      onDone()
    } catch (error) {
      console.error(error)
      toast.error(t.common.somethingWrong)
    } finally {
      setSubmitting(false)
    }
  }

  // Step 1: no product chosen yet.
  if (!selected) {
    return <ProductPicker onSelect={handlePick} />
  }

  // Step 2: product chosen — enter the purchase details.
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-lg border p-2">
        {selected.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selected.image_url}
            alt=""
            className="size-10 shrink-0 rounded-md border object-cover"
          />
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
            <ImageIcon className="size-5" />
          </div>
        )}
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {selected.name}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setSelected(null)}
        >
          <Pencil />
          {t.purchases.change}
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="purchase-date">{t.purchases.date}</Label>
        <Input
          id="purchase-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="purchase-qty">{t.purchases.quantity}</Label>
          <Input
            id="purchase-qty"
            type="number"
            inputMode="numeric"
            min={1}
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="purchase-rate">{t.purchases.rate}</Label>
          <Input
            id="purchase-rate"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5">
        <span className="text-sm font-medium">{t.purchases.total}</span>
        <span className="text-lg font-semibold">{formatINR(total)}</span>
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
