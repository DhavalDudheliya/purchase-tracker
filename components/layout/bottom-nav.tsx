"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ReceiptText, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/context"

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useI18n()

  const items: { href: string; label: string; icon: LucideIcon }[] = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/products", label: t.nav.products, icon: Package },
    { href: "/purchases", label: t.nav.purchases, icon: ReceiptText },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background">
      <div className="mx-auto flex max-w-md">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
