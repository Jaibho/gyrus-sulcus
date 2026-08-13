import { NextResponse } from 'next/server'

// Live social stats for the homepage badges (YouTube subscribers + Telegram members).
// Fetched server-side (client CSP blocks third-party calls) and refreshed ~every 2 min.

export const revalidate = 120 // seconds

const YT_CHANNEL = 'UCpBRZ6j0oAkjyd3FLr4yPtA' // GYRUS SULCUS
const TG_CHANNEL = 'gyrussulcus7597647088'
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0 Safari/537.36'

async function youtubeSubscribers(): Promise<number | null> {
  try {
    const res = await fetch(
      `https://mixerno.space/api/youtube-channel-counter/user/${YT_CHANNEL}`,
      { headers: { 'User-Agent': UA }, next: { revalidate } }
    )
    if (!res.ok) return null
    const data = (await res.json()) as { counts?: { value: string; count: number }[] }
    const c = data.counts?.find((x) => x.value === 'subscribers')?.count
    return typeof c === 'number' && c > 0 ? c : null
  } catch {
    return null
  }
}

async function telegramMembers(): Promise<number | null> {
  try {
    const res = await fetch(`https://t.me/${TG_CHANNEL}`, {
      headers: { 'User-Agent': UA },
      next: { revalidate },
    })
    if (!res.ok) return null
    const html = await res.text()
    // e.g. <div class="tgme_page_extra">21 040 subscribers</div>
    const m = html.match(/tgme_page_extra">([^<]*?)(?:subscribers|members)/i)
    if (!m) return null
    const n = parseInt(m[1].replace(/[^\d]/g, ''), 10)
    return Number.isFinite(n) && n > 0 ? n : null
  } catch {
    return null
  }
}

export async function GET() {
  const [youtube, telegram] = await Promise.all([
    youtubeSubscribers(),
    telegramMembers(),
  ])
  return NextResponse.json({ youtube, telegram })
}
