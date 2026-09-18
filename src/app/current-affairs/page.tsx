'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import ArticleThumb from '@/components/ArticleThumb'
import { Loader2, Search, Newspaper, X } from 'lucide-react'

interface CAArticle {
  id: string
  title: string
  title_en?: string
  slug: string
  category?: string
  excerpt?: string
  excerpt_en?: string
  content?: string
  content_en?: string
  is_published?: boolean
  created_at: string
  /** Optional licensed photo; falls back to the designed card when absent. */
  image_url?: string
  image_credit?: string
  image_license?: string
}

const CATEGORIES = ['समसामयिकी', 'विज्ञान', 'भूगोल', 'राजव्यवस्था', 'अर्थव्यवस्था']

export default function CurrentAffairsPage() {
  const { t } = useLanguage()
  const [articles, setArticles] = useState<CAArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/data/articles.json')
        const all: CAArticle[] = res.ok ? await res.json() : []
        if (!alive) return
        const now = Date.now()
        setArticles(
          all
            .filter((a) => a.is_published !== false)
            .filter((a) => new Date(a.created_at).getTime() <= now)
            .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
        )
      } catch {
        if (alive) setArticles([])
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return articles.filter((a) => {
      if (cat && a.category !== cat) return false
      if (!q) return true
      return [a.title, a.title_en, a.excerpt, a.excerpt_en]
        .filter(Boolean)
        .some((f) => (f as string).toLowerCase().includes(q))
    })
  }, [articles, query, cat])

  // Group by calendar day so the feed reads like a dated archive.
  const grouped = useMemo(() => {
    const map = new Map<string, CAArticle[]>()
    for (const a of filtered) {
      const day = (a.created_at || '').slice(0, 10)
      if (!map.has(day)) map.set(day, [])
      map.get(day)!.push(a)
    }
    return Array.from(map.entries())
  }, [filtered])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const a of articles) if (a.category) c[a.category] = (c[a.category] || 0) + 1
    return c
  }, [articles])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-start gap-3 mb-1">
        <Newspaper className="text-brand-500 mt-1" size={28} />
        <h1 className="text-3xl font-bold text-gray-900">
          {t('समसामयिकी', 'Current Affairs')}
        </h1>
      </div>
      <p className="text-gray-500 mb-6 pl-10">
        {t(
          'तिथि-वार करेंट अफेयर्स — प्रत्येक समाचार का संदर्भ, मुख्य बिंदु और पृष्ठभूमि।',
          'Day-by-day current affairs — context, key points and background for every story.'
        )}
      </p>

      {/* Search + category filter */}
      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur border-b border-gray-100 -mx-4 px-4 py-3 mb-6">
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('खोजें…', 'Search…')}
            className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label={t('साफ़ करें', 'Clear')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCat(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              cat === null
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
            }`}
          >
            {t('सभी', 'All')} ({articles.length})
          </button>
          {CATEGORIES.filter((c) => counts[c]).map((c) => (
            <button
              key={c}
              onClick={() => setCat(cat === c ? null : c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                cat === c
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
              }`}
            >
              {c} ({counts[c]})
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-brand-500" />
          <span className="ml-3 text-gray-500">{t('लोड हो रहा है...', 'Loading...')}</span>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Newspaper size={48} className="mx-auto mb-3 opacity-40" />
          <p>{t('कोई समाचार नहीं मिला', 'No stories found')}</p>
        </div>
      )}

      {!loading &&
        grouped.map(([day, items]) => (
          <section key={day} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-bold text-gray-700 whitespace-nowrap">
                {new Date(day).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h2>
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-400">{items.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((a) => (
                <Link
                  key={a.id}
                  href={`/current-affairs/${a.slug}`}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <ArticleThumb
                    title={t(a.title, a.title_en || a.title)}
                    category={a.category}
                    date={a.created_at}
                    slug={a.slug}
                    imageUrl={a.image_url}
                    credit={a.image_credit}
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors">
                      {t(a.title, a.title_en || a.title)}
                    </h3>
                    {(a.excerpt || a.excerpt_en) && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                        {t(a.excerpt || '', a.excerpt_en || a.excerpt || '')}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}
