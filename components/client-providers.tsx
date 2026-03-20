"use client"

import { PrivyProvider } from "@/components/privy-provider"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "@/components/error-boundary"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div style={{ display: "flex", height: "100vh" }}>
          <div style={{ width: "200px", borderRight: "1px solid rgba(255,255,255,0.06)", background: "#050505" }} />
          <div style={{ flex: 1, padding: "40px", fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#ff3b5c" }}>
            [AUTH_ERROR] Privy app ID missing — add NEXT_PUBLIC_PRIVY_APP_ID to Vercel environment variables.
          </div>
        </div>
      }
    >
      <PrivyProvider>
        {children}
        <Toaster position="bottom-right" />
      </PrivyProvider>
    </ErrorBoundary>
  )
}
