'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase, Article } from '@/lib/supabase'
import { Calendar, ArrowRight, Loader2, BookOpen } from 'lucide-react'

interface LocalArticle extends Article {
  title_en?: string
  excerpt_en?: string
  content_en?: string
}

const categories = [
  { key: 'all', hi: 'सभी', en: 'All' },
  { key: 'विज्ञान', hi: 'विज्ञान', en: 'Science' },
  { key: 'राजव्यवस्था', hi: 'राजव्यवस्था', en: 'Polity' },
  { key: 'अर्थव्यवस्था', hi: 'अर्थव्यवस्था', en: 'Economy' },
  { key: 'भूगोल', hi: 'भूगोल', en: 'Geography' },
  { key: 'समसामयिकी', hi: 'समसामयिकी', en: 'Current Affairs' },
]

export default function ArticlesPage() {
  const { t } = useLanguage()
  const [articles, setArticles] = useState<LocalArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    setLoading(true)

    // Try JSON file first
    let jsonArticles: LocalArticle[] = []
    try {
      const res = await fetch('/data/articles.json')
      if (res.ok) {
        jsonArticles = await res.json()
      }
    } catch {
      // ignore
    }

    // Try Supabase
    let supabaseArticles: LocalArticle[] = []
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(20)
      if (!error && data) {
        supabaseArticles = data
      }
    } catch {
      // ignore
    }

    // Merge: JSON articles first, then Supabase (de-duplicate by id)
    const seen = new Set<string>()
    const merged: LocalArticle[] = []
    for (const a of [...jsonArticles, ...supabaseArticles]) {
      if (!seen.has(a.id)) {
        seen.add(a.id)
        merged.push(a)
      }
    }

    setArticles(merged)
    setLoading(false)
  }

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        {t('नवीनतम लेख', 'Latest Articles')}
      </h1>
      <p className="text-gray-500 mb-6">
        {t('गहन विश्लेषण और परीक्षा-उन्मुख अध्ययन सामग्री।', 'In-depth analysis and exam-oriented study material.')}
      </p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.key
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t(cat.hi, cat.en)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-brand-500" />
          <span className="ml-3 text-gray-500">{t('लोड हो रहा है...', 'Loading...')}</span>
        </div>
      )}

      {/* Articles Grid */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <BookOpen size={48} className="mx-auto mb-3 opacity-40" />
          <p>{t('कोई लेख नहीं मिला', 'No articles found')}</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-brand-100 to-brand-200 overflow-hidden">
                {article.image_url ? (
                  <Image
                    src={article.image_url}
                    alt={t(article.title, article.title_en || article.title)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={48} className="text-brand-300" />
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-brand-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors">
                  {t(article.title, article.title_en || article.title)}
                </h3>
                {(article.excerpt || article.excerpt_en) && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    {t(article.excerpt || '', article.excerpt_en || article.excerpt || '')}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(article.created_at).toLocaleDateString('hi-IN')}
                  </span>
                  <span className="text-brand-500 text-sm font-medium flex items-center gap-1">
                    {t('पढ़ें', 'Read')} <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
