"use client"

import { useEffect } from "react"

/** Registers the minimal service worker so the app is installable. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failures are non-fatal (e.g. unsupported browser).
      })
    }
  }, [])
  return null
}
