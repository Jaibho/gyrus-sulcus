import { NextResponse } from 'next/server'

// Global visitor counter (persisted by a free keyless counter service).
// Client calls this route (same-origin, CSP-safe); ?hit=1 increments once per
// visitor session, otherwise it just reads the current total.

export const dynamic = 'force-dynamic' // never cache — the count must be live

const NS = 'gyrussulcus'
const KEY = 'sitevisits'
const BASE = 'https://abacus.jasoncameron.dev'

export async function GET(request: Request) {
  const hit = new URL(request.url).searchParams.get('hit') === '1'
  const endpoint = `${BASE}/${hit ? 'hit' : 'get'}/${NS}/${KEY}`
  try {
    const res = await fetch(endpoint, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ visits: null })
    const data = (await res.json()) as { value?: number }
    return NextResponse.json({ visits: typeof data.value === 'number' ? data.value : null })
  } catch {
    return NextResponse.json({ visits: null })
  }
}
