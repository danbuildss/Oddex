import Link from "next/link"
import type { ScoredMarket } from "@/lib/scorer"
import { labelColor } from "@/lib/scorer"
import { ScoreBadge } from "./score-badge"
import { VolumeBar } from "./volume-bar"

interface SignalCardProps {
  item: ScoredMarket
  maxVol: number
}

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

export function SignalCard({ item, maxVol }: SignalCardProps) {
  const color = labelColor(item.label)
  const catColor = CAT_COLORS[item.category] ?? "#666"

  return (
    <Link
      href={`/${item.event.slug}`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "4px",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          cursor: "pointer",
          transition: "border-color 0.15s ease",
          borderLeft: `2px solid ${color}55`,
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.borderColor = `${color}44`
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
          <p
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              color: "#ccc",
              margin: 0,
              lineHeight: 1.4,
              flex: 1,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
            }}
          >
            {item.event.title}
          </p>
          <ScoreBadge label={item.label} score={item.score} />
        </div>

        {/* Odds */}
        <div style={{ display: "flex", gap: "12px" }}>
          <div>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "#555" }}>YES </span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", fontWeight: 700, color: "#00ff88" }}>
              {Math.round(item.yesPrice * 100)}¢
            </span>
          </div>
          <div>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "#555" }}>NO </span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", fontWeight: 700, color: "#ff3b5c" }}>
              {Math.round(item.noPrice * 100)}¢
            </span>
          </div>
        </div>

        {/* Volume bar */}
        <div>
          <VolumeBar value={item.volume24h} max={maxVol} width={14} color={color} />
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "9px",
              color: "#444",
              marginLeft: "6px",
            }}
          >
            {formatVol(item.volume24h)} 24h
          </span>
        </div>

        {/* Category */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: catColor,
            }}
          >
            [{item.category}]
          </span>
        </div>
      </div>
    </Link>
  )
}
