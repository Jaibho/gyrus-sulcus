'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import ArticleThumb from '@/components/ArticleThumb'
import { Article } from '@/lib/supabase'
import { Calendar, ArrowRight, Loader2, BookOpen } from 'lucide-react'

interface LocalArticle extends Article {
  title_en?: string
  excerpt_en?: string
  content_en?: string
  image_credit?: string
}

export default function ArticlesPage() {
  const { t } = useLanguage()
  const [articles, setArticles] = useState<LocalArticle[]>([])
  const [loading, setLoading] = useState(true)

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

    // Supabase merge DISABLED: the DB `articles` table schema does not match the
    // site (it uses content_hi/title_hi, the site expects content/title) and only
    // holds old, superseded content. Current content lives in articles.json.
    // Re-enable this once the table schema is aligned with the site.
    const supabaseArticles: LocalArticle[] = []

    // Merge: JSON articles first, then Supabase (de-duplicate by id)
    const seen = new Set<string>()
    const merged: LocalArticle[] = []
    for (const a of [...jsonArticles, ...supabaseArticles]) {
      if (!seen.has(a.id)) {
        seen.add(a.id)
        merged.push(a)
      }
    }

    // Hide scheduled (future-dated) articles, then always show newest first.
    const now = Date.now()
    setArticles(
      merged
        .filter(a => new Date(a.created_at).getTime() <= now)
        .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
    )
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        {t('लेख', 'Articles')}
      </h1>
      <p className="text-gray-500 mb-8">
        {t('गहन विश्लेषण और परीक्षा-उन्मुख अध्ययन सामग्री।', 'In-depth analysis and exam-oriented study material.')}
      </p>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-brand-500" />
          <span className="ml-3 text-gray-500">{t('लोड हो रहा है...', 'Loading...')}</span>
        </div>
      )}

      {/* Articles Grid */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <BookOpen size={48} className="mx-auto mb-3 opacity-40" />
          <p>{t('कोई लेख नहीं मिला', 'No articles found')}</p>
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Thumbnail — generated from the article's own title, category
                  and date; uses a licensed photo instead when one is supplied. */}
              <ArticleThumb
                title={t(article.title, article.title_en || article.title)}
                category={article.category}
                date={article.created_at}
                slug={article.slug}
                imageUrl={article.image_url}
                credit={article.image_credit}
              />

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
