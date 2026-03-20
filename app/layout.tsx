import type { Metadata } from "next"

import "./globals.css"
import { ClientProviders } from "@/components/client-providers"

export const metadata: Metadata = {
  title: "Oddex — Prediction Market Intelligence Terminal",
  description: "Real-time signal intelligence for Polymarket traders",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: "#000", color: "#e0e0e0" }}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
