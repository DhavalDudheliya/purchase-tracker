"use client"

import { useI18n } from "@/i18n/context"
import { LanguageToggle } from "./language-toggle"

export function Header() {
  const { t } = useI18n()
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <span className="font-heading text-base font-semibold">{t.appName}</span>
        <LanguageToggle />
      </div>
    </header>
  )
}
