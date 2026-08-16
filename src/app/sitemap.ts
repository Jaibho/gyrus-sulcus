import type { MetadataRoute } from 'next'
import articles from '../../public/data/articles.json'

// Canonical production domain (Cloudflare → Vercel). Keep in sync with robots.txt.
const BASE = 'https://gyrussulcus.com'

type Article = { slug?: string; is_published?: boolean; created_at?: string }

// Static, indexable pages. (We deliberately omit /admin, /login and /store —
// admin is private, login is not useful to searchers, store is not launched yet.)
const STATIC_PATHS = [
  '', 'tests', 'articles', 'notes', 'resources', 'courses',
  'ras-english', 'about', 'contact', 'privacy', 'disclaimer',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: p ? `${BASE}/${p}` : BASE,
    lastModified: now,
    changeFrequency: p === '' || p === 'tests' || p === 'articles' ? 'daily' : 'weekly',
    priority: p === '' ? 1 : p === 'tests' || p === 'articles' ? 0.9 : 0.6,
  }))

  // Published, non-future articles only (matches how the site lists them).
  const articleEntries: MetadataRoute.Sitemap = (articles as Article[])
    .filter((a) => a?.slug && a.is_published !== false)
    .filter((a) => !a.created_at || new Date(a.created_at) <= now)
    .map((a) => ({
      url: `${BASE}/articles/${a.slug}`,
      lastModified: a.created_at ? new Date(a.created_at) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  return [...staticEntries, ...articleEntries]
}
