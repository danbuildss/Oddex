"use client"

import { PrivyProvider } from "@/components/privy-provider"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "@/components/error-boundary"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <PrivyProvider>
        {children}
        <Toaster position="bottom-right" />
      </PrivyProvider>
    </ErrorBoundary>
  )
}
