'use client'
import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase, Article } from '@/lib/supabase'
import DateStrip from '@/components/DateStrip'
import { Calendar, ArrowRight, Loader2, BookOpen, Search as SearchIcon, X } from 'lucide-react'

function ymd(d: Date | string) {
  const x = typeof d === 'string' ? new Date(d) : d
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

function ArticlesInner() {
  const { t, lang } = useLanguage()
  const sp = useSearchParams()
  const router = useRouter()

  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  // URL params drive filters: ?cat=…&date=…&search=…
  const cat = sp.get('cat') || 'all'
  const date = sp.get('date')
  const search = (sp.get('search') || '').toLowerCase().trim()

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('articles').select('*').eq('is_published', true)
          .order('created_at', { ascending: false }).limit(200)
        if (!cancelled && data && data.length > 0) {
          setArticles(data); setLoading(false); return
        }
      } catch { /* fall through */ }
      try {
        const res = await fetch('/data/articles.json')
        const json: Article[] = await res.json()
        if (!cancelled) setArticles(json.filter(a => a.is_published))
      } catch {
        if (!cancelled) setArticles([])
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Counts per yyyy-mm-dd for the DateStrip badge
  const countsByDate = useMemo(() => {
    const m: Record<string, number> = {}
    for (const a of articles) {
      const k = ymd(a.created_at)
      m[k] = (m[k] || 0) + 1
    }
    return m
  }, [articles])

  // Categories for the tab row
  const categories = useMemo(() => {
    const set = new Set<string>()
    articles.forEach(a => set.add(a.category))
    return ['all', ...Array.from(set).sort()]
  }, [articles])

  // Filtered list
  const filtered = useMemo(() => {
    return articles.filter(a => {
      if (cat !== 'all' && a.category !== cat) return false
      if (date && ymd(a.created_at) !== date) return false
      if (search) {
        const haystack = `${a.title} ${a.title_en || ''} ${a.excerpt || ''} ${a.excerpt_en || ''} ${a.category}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })
  }, [articles, cat, date, search])

  // URL helpers — preserve other params
  function setParam(k: string, v: string | null) {
    const params = new URLSearchParams(sp.toString())
    if (v === null || v === '') params.delete(k)
    else params.set(k, v)
    router.push(`/articles${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {t('नवीनतम लेख', 'Latest Articles')}
        </h1>
        <p className="text-gray-500 text-sm">
          {t('गहन विश्लेषण, द्विभाषी, संपादकीय-समीक्षित।', 'In-depth, bilingual, editorially reviewed.')}
        </p>
      </div>

      {/* DateStrip — inline date browse */}
      <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Calendar size={13} className="text-purple-500" /> {t('दिनांक से ब्राउज़', 'Browse by date')}
          </h2>
          {date && (
            <button
              onClick={() => setParam('date', null)}
              className="text-xs font-semibold text-purple-600 hover:underline inline-flex items-center gap-1"
            >
              <X size={12} /> {t('फ़िल्टर हटाएँ', 'Clear filter')}
            </button>
          )}
        </div>
        <DateStrip
          variant="articles"
          countsByDate={countsByDate}
          selectedDate={date}
          onSelectDate={d => setParam('date', d)}
        />
      </section>

      {/* Search bar */}
      <div className="mb-5 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 max-w-md">
        <SearchIcon size={16} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setParam('search', e.target.value || null)}
          placeholder={t('शीर्षक/शब्द खोजें...', 'Search title / keyword...')}
          className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
        />
        {search && (
          <button onClick={() => setParam('search', null)} aria-label="Clear search" className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="mb-6 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 min-w-min">
          {categories.map(c => {
            const active = cat === c
            return (
              <button
                key={c}
                onClick={() => setParam('cat', c === 'all' ? null : c)}
                className={`shrink-0 inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  active
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                {c === 'all' ? t('सभी', 'All') : c}
              </button>
            )
          })}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-brand-500" />
          <span className="ml-3 text-gray-500">{t('लोड हो रहा है...', 'Loading...')}</span>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <BookOpen size={48} className="mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-gray-500">
            {t('इन फ़िल्टरों के लिए कोई लेख नहीं मिला।', 'No articles match these filters.')}
          </p>
          <button
            onClick={() => router.push('/articles', { scroll: false })}
            className="mt-3 text-sm font-semibold text-brand-600 hover:underline"
          >
            {t('सभी फ़िल्टर हटाएँ', 'Clear all filters')}
          </button>
        </div>
      )}

      {/* Result count */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 mb-3">
          {t(`${filtered.length} लेख`, `${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'}`)}
        </p>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a) => {
            const title = (lang === 'en' && a.title_en) ? a.title_en : a.title
            const excerpt = (lang === 'en' && a.excerpt_en) ? a.excerpt_en : a.excerpt
            return (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-brand-200 transition-all group"
              >
                <div className="relative h-44 bg-gradient-to-br from-brand-100 to-brand-200 overflow-hidden">
                  {a.image_url ? (
                    <Image src={a.image_url} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><BookOpen size={48} className="text-brand-300" /></div>
                  )}
                  <span className="absolute top-3 left-3 bg-brand-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                    {a.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors">
                    {title}
                  </h3>
                  {excerpt && <p className="text-gray-500 text-sm mt-2 line-clamp-2">{excerpt}</p>}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(a.created_at).toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-brand-500 text-sm font-medium flex items-center gap-1">
                      {t('पढ़ें', 'Read')} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-brand-500" />
      </div>
    }>
      <ArticlesInner />
    </Suspense>
  )
}
