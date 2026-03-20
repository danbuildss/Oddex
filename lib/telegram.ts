const TELEGRAM_API = "https://api.telegram.org"

export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return false

  const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  })

  return res.ok
}

export function formatSignalAlert(params: {
  label: "STRONG" | "HIGH" | "MEDIUM" | "LOW"
  score: number
  title: string
  yesPrice: number
  noPrice: number
  volume24h: number
  slug: string
}): string {
  const { label, score, title, yesPrice, noPrice, volume24h, slug } = params

  const emoji =
    label === "STRONG" ? "🟢" : label === "HIGH" ? "🔵" : label === "MEDIUM" ? "🟡" : "⚪"

  const vol =
    volume24h >= 1_000_000
      ? `$${(volume24h / 1_000_000).toFixed(1)}M`
      : volume24h >= 1_000
        ? `$${(volume24h / 1_000).toFixed(0)}K`
        : `$${volume24h}`

  return [
    `${emoji} <b>${label} SIGNAL — Score ${score}/100</b>`,
    ``,
    `${title}`,
    `YES ${Math.round(yesPrice * 100)}¢ · NO ${Math.round(noPrice * 100)}¢`,
    ``,
    `Vol 24H: ${vol}`,
    ``,
    `→ https://oddex.io/${slug}`,
  ].join("\n")
}
