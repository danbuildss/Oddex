interface VolumeBarProps {
  value: number
  max: number
  width?: number
  color?: string
}

export function VolumeBar({ value, max, width = 16, color = "#00ff88" }: VolumeBarProps) {
  const filled = Math.round((value / Math.max(max, 1)) * width)
  const empty = width - filled
  return (
    <span
      style={{
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "10px",
        letterSpacing: "-0.02em",
        color,
        userSelect: "none",
      }}
    >
      {"I".repeat(Math.max(0, filled))}
      <span style={{ opacity: 0.2 }}>{"░".repeat(Math.max(0, empty))}</span>
    </span>
  )
}
