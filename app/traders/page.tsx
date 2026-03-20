import type { Metadata } from "next"
import { Panel } from "@/components/oddex/panel"
import { StatCard } from "@/components/oddex/stat-card"
import { TraderLeaderboard } from "@/components/oddex/trader-leaderboard"
import { ConnectWalletCTA } from "@/components/oddex/connect-wallet-cta"

export const metadata: Metadata = {
  title: "Trader Intelligence — Oddex",
}

// Known high-volume Polymarket wallets for demo leaderboard
// In production these would come from Supabase trader_scores
const DEMO_TRADERS = [
  {
    wallet: "0x1a2b...3c4d",
    score: 87,
    winRate: 0.71,
    totalVolume: 284000,
    tradeCount: 142,
    specialty: "CRYPTO" as const,
  },
  {
    wallet: "0x5e6f...7a8b",
    score: 79,
    winRate: 0.64,
    totalVolume: 196000,
    tradeCount: 98,
    specialty: "FOOTBALL" as const,
  },
  {
    wallet: "0x9c0d...1e2f",
    score: 74,
    winRate: 0.61,
    totalVolume: 158000,
    tradeCount: 211,
    specialty: "GENERALIST" as const,
  },
  {
    wallet: "0x3a4b...5c6d",
    score: 68,
    winRate: 0.59,
    totalVolume: 112000,
    tradeCount: 67,
    specialty: "CRYPTO" as const,
  },
  {
    wallet: "0x7e8f...9a0b",
    score: 63,
    winRate: 0.55,
    totalVolume: 94000,
    tradeCount: 183,
    specialty: "OTHER" as const,
  },
  {
    wallet: "0x1c2d...3e4f",
    score: 58,
    winRate: 0.52,
    totalVolume: 78000,
    tradeCount: 44,
    specialty: "FOOTBALL" as const,
  },
]

export default function TradersPage() {
  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        <StatCard
          label="TRACKED_TRADERS"
          value={DEMO_TRADERS.length}
          sub="indexed wallets"
          color="#00ff88"
        />
        <StatCard
          label="TOP_SCORE"
          value={`${DEMO_TRADERS[0]?.score ?? 0}/100`}
          sub="best performer"
          color="#00e5ff"
        />
        <StatCard
          label="AVG_WIN_RATE"
          value={`${Math.round((DEMO_TRADERS.reduce((s, t) => s + t.winRate, 0) / DEMO_TRADERS.length) * 100)}%`}
          sub="across leaderboard"
          color="#f5a623"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px" }}>
        {/* Leaderboard */}
        <Panel title="TRADER_LEADERBOARD">
          <TraderLeaderboard traders={DEMO_TRADERS} />
        </Panel>

        {/* Connect CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <ConnectWalletCTA />

          <Panel title="SCORING_ALGO">
            <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { factor: "Win Rate", pts: "40pts" },
                { factor: "Conviction Size", pts: "30pts" },
                { factor: "Trade Consistency", pts: "20pts" },
                { factor: "Volume", pts: "10pts" },
              ].map((row) => (
                <div
                  key={row.factor}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "10px",
                  }}
                >
                  <span style={{ color: "#666" }}>{row.factor}</span>
                  <span style={{ color: "#00ff88" }}>{row.pts}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
