import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { ServiceWorkerRegister } from "@/components/providers/sw-register"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Toaster } from "@/components/ui/sonner"
import { I18nProvider } from "@/i18n/context"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Purchase Tracker",
  description: "Log daily wholesale purchases",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Purchases",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#059669",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            <I18nProvider>
              <div className="flex min-h-svh flex-col md:flex-row">
                <Sidebar />
                <div className="flex min-h-svh flex-1 flex-col">
                  <Header />
                  <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-4 pb-24 md:px-8 md:pt-8 md:pb-10">
                    {children}
                  </main>
                </div>
                <BottomNav />
              </div>
              <Toaster />
              <ServiceWorkerRegister />
            </I18nProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
