"use client"

import type { TraderScore } from "@/lib/trader"

interface TraderRow {
  wallet: string
  score: number
  winRate: number
  totalVolume: number
  tradeCount: number
  specialty: TraderScore["specialty"]
}

interface TraderLeaderboardProps {
  traders: TraderRow[]
}

function formatVol(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

const SPECIALTY_COLORS: Record<string, string> = {
  CRYPTO: "#f5a623",
  FOOTBALL: "#00e5ff",
  OTHER: "#9b59b6",
  GENERALIST: "#666",
}

const SCORE_COLORS = (score: number) => {
  if (score >= 80) return "#00ff88"
  if (score >= 60) return "#00e5ff"
  if (score >= 40) return "#f5a623"
  return "#666"
}

const TH: React.CSSProperties = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: "#444",
  textTransform: "uppercase",
  padding: "6px 12px",
  textAlign: "left",
  whiteSpace: "nowrap",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
}

const TD: React.CSSProperties = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "11px",
  padding: "10px 12px",
  borderTop: "1px solid rgba(255,255,255,0.04)",
  color: "#888",
  verticalAlign: "middle",
}

export function TraderLeaderboard({ traders }: TraderLeaderboardProps) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={TH}>#</th>
            <th style={TH}>Wallet</th>
            <th style={TH}>Score</th>
            <th style={TH}>Win Rate</th>
            <th style={TH}>Vol Traded</th>
            <th style={TH}>Trades</th>
            <th style={TH}>Specialty</th>
          </tr>
        </thead>
        <tbody>
          {traders.map((t, i) => {
            const scoreColor = SCORE_COLORS(t.score)
            const specColor = SPECIALTY_COLORS[t.specialty] ?? "#666"
            return (
              <tr
                key={t.wallet}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLTableRowElement).style.background =
                    "rgba(255,255,255,0.02)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLTableRowElement).style.background = "transparent"
                }}
              >
                <td style={{ ...TD, color: "#444" }}>{i + 1}</td>
                <td style={{ ...TD, color: "#bbb", fontWeight: 600 }}>{t.wallet}</td>
                <td style={{ ...TD }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: scoreColor,
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: scoreColor,
                        flexShrink: 0,
                      }}
                    />
                    {t.score}
                  </span>
                </td>
                <td style={{ ...TD, color: t.winRate >= 0.6 ? "#00ff88" : "#888" }}>
                  {Math.round(t.winRate * 100)}%
                </td>
                <td style={TD}>{formatVol(t.totalVolume)}</td>
                <td style={TD}>{t.tradeCount}</td>
                <td style={TD}>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: specColor,
                    }}
                  >
                    {t.specialty}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
