import Link from "next/link"
import type { ScoredMarket } from "@/lib/scorer"
import { labelColor } from "@/lib/scorer"
import { ScoreBadge } from "./score-badge"

interface HeatRowProps {
  item: ScoredMarket
  rank: number
  maxVol: number
}

function formatVol(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

export function HeatRow({ item, rank, maxVol }: HeatRowProps) {
  const color = labelColor(item.label)
  const pct = maxVol > 0 ? (item.volume24h / maxVol) * 100 : 0

  return (
    <Link href={`/${item.event.slug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "20px 1fr auto auto",
          alignItems: "center",
          gap: "10px",
          padding: "7px 12px",
          borderRadius: "3px",
          transition: "background 0.1s",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.background = "transparent"
        }}
      >
        {/* Heat fill */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pct}%`,
            background: `${color}08`,
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            color: "#444",
            textAlign: "right",
          }}
        >
          {rank}
        </span>
        <span
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "11px",
            color: "#bbb",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.event.title}
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            color: "#555",
            whiteSpace: "nowrap",
          }}
        >
          {formatVol(item.volume24h)}
        </span>
        <ScoreBadge label={item.label} score={item.score} />
      </div>
    </Link>
  )
}
