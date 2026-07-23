"use client"

import { useI18n } from "@/i18n/context"

export default function PurchasesPage() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">{t.purchases.title}</h1>
      <p className="py-12 text-center text-sm text-muted-foreground">
        {t.purchases.comingSoon}
      </p>
    </div>
  )
}
