"use client"

import Link from "next/link"
import { Package, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/context"

export default function Page() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">{t.home.greeting}</h1>
        <p className="text-sm text-muted-foreground">{t.home.tagline}</p>
      </div>

      <div className="flex flex-col gap-3">
        <Button size="lg" className="h-14 text-base" render={<Link href="/purchases" />}>
          <Plus />
          {t.home.addPurchase}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-14 text-base"
          render={<Link href="/products" />}
        >
          <Package />
          {t.home.manageProducts}
        </Button>
      </div>
    </div>
  )
}
