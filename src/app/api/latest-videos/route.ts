import { NextResponse } from 'next/server'

// Auto-updating "Latest Videos" feed for the homepage ribbon.
// Strategy: read the channel's /videos page (newest-first), take the newest
// video IDs, then resolve each title via YouTube's official oEmbed endpoint.
// Revalidated hourly, so a newly posted video replaces the oldest automatically
// — no code change or redeploy needed.

export const revalidate = 3600 // seconds — refresh at most once per hour

const CHANNEL_HANDLE = 'gyrussulcus1908'
const CHANNEL_ID = 'UCpBRZ6j0oAkjyd3FLr4yPtA' // GYRUS SULCUS
const MAX = 6
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0 Safari/537.36'

type Video = { id: string; title: string }

async function extractNewestIds(): Promise<string[]> {
  // Primary: RSS feed (clean, ordered). Fallback: scrape the /videos HTML.
  const sources = [
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
    `https://www.youtube.com/@${CHANNEL_HANDLE}/videos`,
  ]
  for (const url of sources) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
        next: { revalidate },
      })
      if (!res.ok) continue
      const text = await res.text()
      const ids: string[] = []
      const seen = new Set<string>()
      // Matches <yt:videoId>ID</yt:videoId> (RSS) and "videoId":"ID" (HTML)
      const re = /(?:<yt:videoId>|"videoId":")([A-Za-z0-9_-]{11})/g
      let m: RegExpExecArray | null
      while ((m = re.exec(text)) !== null && ids.length < 10) {
        if (!seen.has(m[1])) {
          seen.add(m[1])
          ids.push(m[1])
        }
      }
      if (ids.length) return ids
    } catch {
      // try next source
    }
  }
  return []
}

async function resolveTitle(id: string): Promise<Video | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      { next: { revalidate } }
    )
    if (!res.ok) return null
    const data = (await res.json()) as { title?: string }
    if (!data.title) return null
    return { id, title: data.title }
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const ids = await extractNewestIds()
    if (!ids.length) return NextResponse.json({ videos: [], source: 'empty' })
    const resolved = await Promise.all(ids.slice(0, MAX).map(resolveTitle))
    const videos = resolved.filter((v): v is Video => v !== null)
    return NextResponse.json({ videos, source: 'youtube' })
  } catch {
    return NextResponse.json({ videos: [], source: 'error' })
  }
}
