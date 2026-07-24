"use client"

import { Home, Package, ReceiptText, type LucideIcon } from "lucide-react"

import { useI18n } from "@/i18n/context"

export type NavItem = { href: string; label: string; icon: LucideIcon }

/** Shared nav destinations used by both the mobile bottom nav and desktop sidebar. */
export function useNavItems(): NavItem[] {
  const { t } = useI18n()
  return [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/products", label: t.nav.products, icon: Package },
    { href: "/purchases", label: t.nav.purchases, icon: ReceiptText },
  ]
}

export function isNavActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}
