"use client"

import { Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import { otherLanguageLabel } from "@/i18n/dictionaries"
import { useI18n } from "@/i18n/context"

export function LanguageToggle() {
  const { lang, setLang } = useI18n()
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLang(lang === "en" ? "gu" : "en")}
    >
      <Languages />
      {otherLanguageLabel[lang]}
    </Button>
  )
}
