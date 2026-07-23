"use client"

import { createContext, useContext, useEffect, useState } from "react"

import {
  dictionaries,
  languages,
  type Dictionary,
  type Language,
} from "./dictionaries"

type I18nContextValue = {
  lang: Language
  setLang: (lang: Language) => void
  /** Dictionary for the current language, e.g. `t.products.add`. */
  t: Dictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)
const STORAGE_KEY = "pt-lang"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en")

  // Restore the saved language on mount. Reading localStorage must happen on
  // the client (not during SSR), so an effect is the correct place for it.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved && (languages as readonly string[]).includes(saved)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(saved as Language)
    }
  }, [])

  function setLang(next: Language) {
    setLangState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return ctx
}
