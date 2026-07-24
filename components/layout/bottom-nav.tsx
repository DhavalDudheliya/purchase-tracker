"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { isNavActive, useNavItems } from "./nav-items"

/** Mobile-only bottom navigation. Hidden at `md` and up, where the sidebar takes over. */
export function BottomNav() {
  const pathname = usePathname()
  const items = useNavItems()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background md:hidden">
      <div className="mx-auto flex max-w-md">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isNavActive(pathname, href)
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
