"use client"

import dynamic from "next/dynamic"
import { Toaster } from "@/components/ui/sonner"
import { Sidebar } from "@/components/oddex/sidebar"
import { StatusBar } from "@/components/oddex/status-bar"

const PrivyProvider = dynamic(
  () => import("@/components/privy-provider").then((m) => m.PrivyProvider),
  { ssr: false }
)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider>
      <Sidebar />
      <main
        style={{
          marginLeft: "200px",
          marginBottom: "28px",
          minHeight: "calc(100vh - 28px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </main>
      <StatusBar />
      <Toaster position="bottom-right" />
    </PrivyProvider>
  )
}
