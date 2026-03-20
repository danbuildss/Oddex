"use client"

import { PrivyProvider } from "@/components/privy-provider"
import { Toaster } from "@/components/ui/sonner"

// PrivyProvider is a "use client" component — it renders safely on server
// with a valid app ID, only browser APIs initialize on client.
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider>
      {children}
      <Toaster position="bottom-right" />
    </PrivyProvider>
  )
}
