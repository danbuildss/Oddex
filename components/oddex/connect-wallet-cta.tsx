"use client"

import { usePrivy } from "@privy-io/react-auth"

export function ConnectWalletCTA() {
  const { login, authenticated, user } = usePrivy()

  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(0,255,136,0.15)",
        borderRadius: "4px",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid rgba(0,255,136,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
        }}
      >
        ◎
      </div>

      {authenticated ? (
        <>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "11px",
              color: "#00ff88",
              margin: 0,
            }}
          >
            WALLET_CONNECTED
          </p>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "9px",
              color: "#555",
              margin: 0,
              wordBreak: "break-all",
            }}
          >
            {user?.wallet?.address?.slice(0, 10)}...
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#555", margin: 0 }}>
            Your trader score will appear here as you trade on Polymarket.
          </p>
        </>
      ) : (
        <>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "11px",
              color: "#666",
              margin: 0,
            }}
          >
            // YOUR_SCORE
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#888", margin: 0 }}>
            Connect your wallet to see your trader intelligence score.
          </p>
          <button
            onClick={login}
            style={{
              background: "rgba(0,255,136,0.1)",
              border: "1px solid rgba(0,255,136,0.3)",
              borderRadius: "4px",
              padding: "8px 20px",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#00ff88",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,136,0.18)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,136,0.1)"
            }}
          >
            CONNECT_WALLET
          </button>
        </>
      )}
    </div>
  )
}
