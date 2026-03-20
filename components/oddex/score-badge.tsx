import type { SignalLabel } from "@/lib/scorer"
import { labelColor } from "@/lib/scorer"

interface ScoreBadgeProps {
  label: SignalLabel
  score?: number
}

export function ScoreBadge({ label, score }: ScoreBadgeProps) {
  const color = labelColor(label)
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 7px",
        borderRadius: "3px",
        border: `1px solid ${color}33`,
        background: `${color}0f`,
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        color,
        whiteSpace: "nowrap",
      }}
    >
      {label}
      {score !== undefined && (
        <span style={{ opacity: 0.7 }}>{score}</span>
      )}
    </span>
  )
}
