'use client'
/**
 * Local-only learning progress store.
 *
 * All state lives in localStorage keyed under `gs:` — no backend required.
 * Replace with a real DB/auth layer later; all writes go through these helpers
 * so the migration is a single-file swap.
 */

const KEY = {
  attempts: 'gs:attempts',         // Attempt[]
  streak:   'gs:streak',           // { count: number; lastDateISO: string }
  name:     'gs:name',             // display name on leaderboard
  last:     'gs:last-subject',     // last subject key attempted
}

export type AttemptTag =
  | 'science_tech' | 'polity' | 'economy' | 'geography' | 'current_affairs'
  | 'mental_health' | 'sexual_health'

export interface Attempt {
  subject: AttemptTag
  score: number
  total: number
  wrongIndices: number[]     // indices of wrong questions for gap analysis
  wrongTopicsHi: string[]    // short topic labels for suggestions
  wrongTopicsEn: string[]
  atISO: string              // ISO timestamp
}

export interface StreakState {
  count: number
  lastDateISO: string   // YYYY-MM-DD of last activity
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore quota */ }
}

function ymd(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function daysBetween(a: string, b: string) {
  const ad = new Date(a + 'T00:00:00').getTime()
  const bd = new Date(b + 'T00:00:00').getTime()
  return Math.round((bd - ad) / 86400000)
}

export function getAttempts(): Attempt[] {
  return read<Attempt[]>(KEY.attempts, [])
}

export function recordAttempt(a: Attempt) {
  const all = getAttempts()
  all.unshift(a)
  // cap to last 100 so localStorage doesn't balloon
  write(KEY.attempts, all.slice(0, 100))
  write(KEY.last, a.subject)
  bumpStreak()
}

export function getLastSubject(): AttemptTag | null {
  return read<AttemptTag | null>(KEY.last, null)
}

export function getStreak(): StreakState {
  return read<StreakState>(KEY.streak, { count: 0, lastDateISO: '' })
}

/** Called when the user submits ANY quiz — advances, resets, or leaves the streak as-is. */
export function bumpStreak(): StreakState {
  const today = ymd()
  const cur = getStreak()
  if (cur.lastDateISO === today) return cur      // already counted today
  const gap = cur.lastDateISO ? daysBetween(cur.lastDateISO, today) : Infinity
  const next: StreakState = gap === 1
    ? { count: cur.count + 1, lastDateISO: today }
    : { count: 1, lastDateISO: today }
  write(KEY.streak, next)
  return next
}

export function getName(): string {
  return read<string>(KEY.name, '')
}

export function setName(n: string) {
  write(KEY.name, n)
}

/**
 * Rule-based "AI" gap analysis.
 * Aggregates wrong answers by topic across recent attempts and returns the
 * user's top weak topics with a plain-language suggestion per topic.
 */
export interface WeakTopic {
  topicHi: string
  topicEn: string
  misses: number
  suggestionHi: string
  suggestionEn: string
}

export function analyzeGaps(attempts: Attempt[] = getAttempts(), maxTopics = 3): WeakTopic[] {
  const buckets = new Map<string, { hi: string; en: string; misses: number }>()
  for (const a of attempts) {
    for (let i = 0; i < a.wrongTopicsEn.length; i++) {
      const k = a.wrongTopicsEn[i]
      const prev = buckets.get(k)
      if (prev) prev.misses += 1
      else buckets.set(k, { hi: a.wrongTopicsHi[i] || k, en: k, misses: 1 })
    }
  }
  return [...buckets.values()]
    .sort((p, q) => q.misses - p.misses)
    .slice(0, maxTopics)
    .map(b => ({
      topicHi: b.hi,
      topicEn: b.en,
      misses: b.misses,
      suggestionHi: `${b.hi} पर ${b.misses} प्रश्न चूके — इस विषय पर लेख और नोट्स देखें।`,
      suggestionEn: `You missed ${b.misses} question${b.misses > 1 ? 's' : ''} on ${b.en} — review the articles and notes for this topic.`,
    }))
}
