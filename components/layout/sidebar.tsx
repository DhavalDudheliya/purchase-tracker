"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package } from "lucide-react"

import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/context"
import { LanguageToggle } from "./language-toggle"
import { isNavActive, useNavItems } from "./nav-items"

/** Desktop-only left navigation. Hidden below `md`, where the bottom nav takes over. */
export function Sidebar() {
  const pathname = usePathname()
  const { t } = useI18n()
  const items = useNavItems()

  return (
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r bg-background md:flex">
      <div className="flex h-14 items-center gap-2 px-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Package className="size-4.5" />
        </span>
        <span className="font-heading text-base font-semibold">
          {t.appName}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isNavActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3">
        <LanguageToggle />
      </div>
    </aside>
  )
}
