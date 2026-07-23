import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number as Indian Rupees, e.g. 1234.5 -> "₹1,234.50". */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a date for display, e.g. "23 Jul 2026".
 * Date-only strings ("YYYY-MM-DD") are parsed as local time to avoid the
 * off-by-one-day shift that `new Date("2026-07-23")` (parsed as UTC) can cause.
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseDateOnly(date) : date
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d)
}

function parseDateOnly(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (match) {
    const [, y, m, d] = match
    return new Date(Number(y), Number(m) - 1, Number(d))
  }
  return new Date(value)
}

/** Today's date as a "YYYY-MM-DD" string in local time (for date inputs). */
export function todayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}
