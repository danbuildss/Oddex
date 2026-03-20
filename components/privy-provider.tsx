"use client"

import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth"
import { addRpcUrlOverrideToChain } from "@privy-io/chains"
import { polygon } from "viem/chains"

const POLYGON_RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon.drpc.org"
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <BasePrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#00ff88",
          landingHeader: "Sign in to trade",
          loginMessage: "Connect your wallet to access Oddex trader intelligence.",
        },
        loginMethods: ["email", "wallet"],
        defaultChain: polygon,
        supportedChains: [addRpcUrlOverrideToChain(polygon, POLYGON_RPC_URL)],
        embeddedWallets: {
          showWalletUIs: false,
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  )
}
