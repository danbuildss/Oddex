import type { ReactNode } from "react"

interface PanelProps {
  title: string
  children: ReactNode
  style?: React.CSSProperties
  headerRight?: ReactNode
}

export function Panel({ title, children, style, headerRight }: PanelProps) {
  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "4px",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#555",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "rgba(0,255,136,0.7)" }}>// </span>
          {title}
        </span>
        {headerRight}
      </div>
      <div>{children}</div>
    </div>
  )
}
