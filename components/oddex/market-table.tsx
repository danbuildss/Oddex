"use client"

import Link from "next/link"
import { useState } from "react"
import type { ScoredMarket } from "@/lib/scorer"
import { labelColor } from "@/lib/scorer"
import { ScoreBadge } from "./score-badge"

interface MarketTableProps {
  items: ScoredMarket[]
}

type SortKey = "score" | "volume24h" | "yesPrice"

function formatVol(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

const CAT_COLORS: Record<string, string> = {
  CRYPTO: "#f5a623",
  FOOTBALL: "#00e5ff",
  OTHER: "#666",
}

const TH: React.CSSProperties = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: "#444",
  textTransform: "uppercase",
  padding: "6px 10px",
  textAlign: "left",
  cursor: "pointer",
  userSelect: "none",
  whiteSpace: "nowrap",
}

const TD: React.CSSProperties = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "11px",
  padding: "8px 10px",
  borderTop: "1px solid rgba(255,255,255,0.04)",
  color: "#999",
  verticalAlign: "middle",
}

export function MarketTable({ items }: MarketTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("score")
  const [asc, setAsc] = useState(false)

  function handleSort(key: SortKey) {
    if (sortKey === key) setAsc((a) => !a)
    else {
      setSortKey(key)
      setAsc(false)
    }
  }

  const sorted = [...items].sort((a, b) => {
    const v = b[sortKey] - a[sortKey]
    return asc ? -v : v
  })

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return " ·"
    return asc ? " ↑" : " ↓"
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <th style={TH}>Market</th>
            <th style={TH}>Cat</th>
            <th style={{ ...TH, color: "#00ff88" }}>YES</th>
            <th style={{ ...TH, color: "#ff3b5c" }}>NO</th>
            <th style={TH} onClick={() => handleSort("volume24h")}>
              Vol 24H{sortIcon("volume24h")}
            </th>
            <th style={TH} onClick={() => handleSort("score")}>
              Score{sortIcon("score")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => {
            const color = labelColor(item.label)
            const catColor = CAT_COLORS[item.category] ?? "#666"
            return (
              <tr
                key={`${item.event.id}-${item.market.id}`}
                style={{ transition: "background 0.1s" }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLTableRowElement).style.background =
                    "rgba(255,255,255,0.02)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLTableRowElement).style.background = "transparent"
                }}
              >
                <td style={{ ...TD, maxWidth: "320px" }}>
                  <Link
                    href={`/${item.event.slug}`}
                    style={{
                      color: "#ccc",
                      textDecoration: "none",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                    }}
                  >
                    {item.event.title}
                  </Link>
                </td>
                <td style={TD}>
                  <span style={{ fontSize: "9px", fontWeight: 700, color: catColor, letterSpacing: "0.08em" }}>
                    {item.category}
                  </span>
                </td>
                <td style={{ ...TD, color: "#00ff88", fontWeight: 700 }}>
                  {Math.round(item.yesPrice * 100)}¢
                </td>
                <td style={{ ...TD, color: "#ff3b5c", fontWeight: 700 }}>
                  {Math.round(item.noPrice * 100)}¢
                </td>
                <td style={TD}>{formatVol(item.volume24h)}</td>
                <td style={TD}>
                  <ScoreBadge label={item.label} score={item.score} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
