import type React from "react"
import type { Metadata } from "next/metadata"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SidebarNav } from "@/components/sidebar-nav"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Experimentation Framework",
  description: "Player Retention & Monetization Experimentation Platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex h-screen">
            <SidebarNav />
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
          </div>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
