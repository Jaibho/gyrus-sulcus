'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X, BookOpen, ClipboardList, FileText, Library, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase, type Article } from '@/lib/supabase'

interface SearchResult {
  kind: 'article' | 'test' | 'note' | 'resource'
  title: string
  subtitle?: string
  href: string
}

const STATIC_TESTS: SearchResult[] = [
  { kind: 'test', title: 'Science & Technology — Daily Quiz',  subtitle: '5 questions • 10 mins', href: '/tests?subject=science_tech'    },
  { kind: 'test', title: 'Indian Polity — Daily Quiz',          subtitle: '5 questions • 10 mins', href: '/tests?subject=polity'          },
  { kind: 'test', title: 'Economy — Daily Quiz',                subtitle: '5 questions • 10 mins', href: '/tests?subject=economy'         },
  { kind: 'test', title: 'Geography & Environment — Daily Quiz', subtitle: '5 questions • 10 mins', href: '/tests?subject=geography'      },
  { kind: 'test', title: 'Current Affairs — Daily Quiz',        subtitle: '5 questions • 10 mins', href: '/tests?subject=current_affairs' },
]

const STATIC_RESOURCES: SearchResult[] = [
  { kind: 'resource', title: 'GS1 — History, Geography & Society',       subtitle: 'UPSC syllabus bucket', href: '/resources-hub#gs1' },
  { kind: 'resource', title: 'GS2 — Polity, Governance & International', subtitle: 'UPSC syllabus bucket', href: '/resources-hub#gs2' },
  { kind: 'resource', title: 'GS3 — Economy, Tech, Environment',         subtitle: 'UPSC syllabus bucket', href: '/resources-hub#gs3' },
  { kind: 'resource', title: 'GS4 — Ethics, Integrity & Aptitude',       subtitle: 'UPSC syllabus bucket', href: '/resources-hub#gs4' },
  { kind: 'resource', title: 'Handwritten Notes Library',                subtitle: 'PDF downloads',        href: '/notes'             },
  { kind: 'resource', title: 'RAS English Medium — New Section',         subtitle: 'Special content',      href: '/ras-english'       },
  { kind: 'resource', title: 'Discussion Forum',                         subtitle: 'Ask & discuss',        href: '/forum'             },
  { kind: 'resource', title: 'Gyrus Leaderboard',                        subtitle: 'Weekly ranking',       href: '/leaderboard'       },
  { kind: 'resource', title: 'Wellness Hub',                             subtitle: 'Mental & sexual health self-checks', href: '/wellness' },
  { kind: 'resource', title: 'Archive — Browse by Date',                 subtitle: 'Calendar of tests & articles', href: '/archive' },
  { kind: 'resource', title: 'Dharmendra Sir — Author',                  subtitle: 'Credentials & recent articles', href: '/authors/dharmendra-sir' },
  { kind: 'resource', title: 'About Gyrus Sulcus',                       subtitle: 'Mission & team', href: '/about' },
  { kind: 'resource', title: 'Editorial Policy',                         subtitle: 'Sourcing & corrections', href: '/editorial-policy' },
]

function useDebouncedValue<T>(value: T, ms = 180) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms)
    return () => clearTimeout(id)
  }, [value, ms])
  return v
}

export default function SmartSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [loadingArticles, setLoadingArticles] = useState(false)
  const debounced = useDebouncedValue(query, 150)

  // Load articles once (Supabase → /data/articles.json fallback)
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoadingArticles(true)
      try {
        const { data } = await supabase.from('articles').select('*').eq('is_published', true).limit(50)
        if (!cancelled && data && data.length > 0) {
          setArticles(data)
          setLoadingArticles(false)
          return
        }
      } catch { /* fall through */ }
      try {
        const res = await fetch('/data/articles.json')
        const json = await res.json()
        if (!cancelled) setArticles(json)
      } catch {
        if (!cancelled) setArticles([])
      }
      if (!cancelled) setLoadingArticles(false)
    }
    if (open && articles.length === 0) load()
    return () => { cancelled = true }
  }, [open, articles.length])

  // Focus the input when the modal opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo<SearchResult[]>(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return []

    const articleResults: SearchResult[] = articles
      .map(a => {
        const title = (lang === 'en' && a.title_en) ? a.title_en : a.title
        const excerpt = (lang === 'en' && a.excerpt_en) ? a.excerpt_en : a.excerpt
        return { a, title, excerpt }
      })
      .filter(({ title, excerpt, a }) =>
        title.toLowerCase().includes(q) ||
        (excerpt || '').toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map(({ a, title, excerpt }) => ({
        kind: 'article' as const,
        title,
        subtitle: excerpt?.slice(0, 90),
        href: `/articles/${a.slug}`,
      }))

    const testResults = STATIC_TESTS.filter(r => r.title.toLowerCase().includes(q))
    const resourceResults = STATIC_RESOURCES.filter(r =>
      r.title.toLowerCase().includes(q) || (r.subtitle || '').toLowerCase().includes(q)
    )

    return [...articleResults, ...testResults, ...resourceResults]
  }, [debounced, articles, lang])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('लेख, टेस्ट, संसाधन खोजें...', 'Search articles, tests, resources...')}
            className="flex-1 bg-transparent outline-none text-base"
          />
          {loadingArticles && <Loader2 size={16} className="text-gray-400 animate-spin" />}
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[70vh] overflow-y-auto">
          {!query && (
            <EmptyHint />
          )}
          {query && results.length === 0 && !loadingArticles && (
            <div className="p-8 text-center text-gray-400 text-sm">
              {t(`"${query}" के लिए कोई परिणाम नहीं`, `No results for "${query}"`)}
            </div>
          )}
          {results.length > 0 && (
            <ul className="p-2">
              {results.map((r, i) => (
                <li key={i}>
                  <Link
                    href={r.href}
                    onClick={onClose}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
                  >
                    <KindIcon kind={r.kind} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{r.title}</p>
                      {r.subtitle && <p className="text-xs text-gray-500 truncate">{r.subtitle}</p>}
                    </div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 font-bold self-center shrink-0">
                      {r.kind}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-[11px] text-gray-500 flex justify-between">
          <span>{t('Esc से बंद करें', 'Press Esc to close')}</span>
          <span>{t('सब कुछ खोजें', 'Search everything')}</span>
        </div>
      </div>
    </div>
  )
}

function KindIcon({ kind }: { kind: SearchResult['kind'] }) {
  const map = {
    article:  { Icon: BookOpen,      cls: 'text-purple-500 bg-purple-50'  },
    test:     { Icon: ClipboardList, cls: 'text-emerald-500 bg-emerald-50' },
    note:     { Icon: FileText,      cls: 'text-amber-500 bg-amber-50'    },
    resource: { Icon: Library,       cls: 'text-indigo-500 bg-indigo-50'  },
  }
  const { Icon, cls } = map[kind]
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cls}`}>
      <Icon size={16} />
    </div>
  )
}

function EmptyHint() {
  const { t } = useLanguage()
  const hints = [
    { hi: 'उदाहरण: "Monetary Policy"', en: 'Try: "Monetary Policy"' },
    { hi: 'उदाहरण: "ISRO"',             en: 'Try: "ISRO"'             },
    { hi: 'उदाहरण: "Polity GS2"',       en: 'Try: "Polity GS2"'       },
  ]
  return (
    <div className="p-6">
      <p className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-3">
        {t('लोकप्रिय खोज', 'Popular searches')}
      </p>
      <ul className="flex flex-wrap gap-2">
        {hints.map((h, i) => (
          <li key={i} className="px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-700">
            {t(h.hi, h.en)}
          </li>
        ))}
      </ul>
    </div>
  )
}
