'use client'
import Link from 'next/link'
import { useMemo } from 'react'
import { Article } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import AuthorByline from '@/components/AuthorByline'
import {
  Calendar, ArrowLeft, ArrowRight, Tag, Clock, FileText,
  ChevronRight, BookOpen, Home,
} from 'lucide-react'

// ----------------------------- helpers ---------------------------------

function countWords(text: string | null | undefined) {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

function readingMinutes(words: number, lang: 'hi' | 'en') {
  // Average adult reading speed: ~225 wpm English, ~180 wpm Hindi (Devanagari)
  const wpm = lang === 'hi' ? 180 : 225
  return Math.max(1, Math.round(words / wpm))
}

// ----------------------------- markdown-lite -----------------------------

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9ऀ-ॿ]+/g, '-').replace(/(^-|-$)/g, '')
}

interface RenderResult {
  body: React.ReactNode[]
  toc: { id: string; text: string }[]
}

function renderContent(text: string | null | undefined): RenderResult {
  if (!text) return { body: [], toc: [] }
  const lines = text.split('\n')
  const body: React.ReactNode[] = []
  const toc: { id: string; text: string }[] = []
  let key = 0

  for (const line of lines) {
    if (line.startsWith('## ')) {
      const heading = line.replace('## ', '').trim()
      const id = slugify(heading) + '-' + key
      toc.push({ id, text: heading })
      body.push(
        <h2 id={id} key={key++} className="text-xl font-bold text-gray-900 mt-8 mb-3 scroll-mt-20">
          {heading}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      const heading = line.replace('### ', '').trim()
      body.push(<h3 key={key++} className="text-lg font-bold text-gray-900 mt-5 mb-2">{heading}</h3>)
    } else if (line.startsWith('- ')) {
      const content = line.replace('- ', '')
      body.push(
        <li key={key++} className="text-gray-700 ml-4 mb-1 list-disc"
          dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
        />
      )
    } else if (/^\d+\. /.test(line)) {
      const content = line.replace(/^\d+\. /, '')
      body.push(
        <li key={key++} className="text-gray-700 ml-4 mb-1 list-decimal"
          dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
        />
      )
    } else if (line.startsWith('| ')) {
      // Simple inline table-row passthrough — render as plain styled paragraph
      body.push(
        <p key={key++} className="text-gray-700 leading-relaxed mb-1 font-mono text-xs bg-gray-50 px-2 py-1 rounded"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
        />
      )
    } else if (line.trim() === '') {
      body.push(<div key={key++} className="h-2" />)
    } else {
      body.push(
        <p key={key++} className="text-gray-700 leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
        />
      )
    }
  }
  return { body, toc }
}

// ----------------------------- component -----------------------------

export default function ArticleContent({ article, related = [] }: { article: Article; related?: Article[] }) {
  const { lang, t } = useLanguage()
  const isEn = lang === 'en'

  const title = isEn && article.title_en ? article.title_en : article.title
  const excerpt = isEn && article.excerpt_en ? article.excerpt_en : article.excerpt
  const content = isEn && article.content_en ? article.content_en : article.content

  const { body, toc } = useMemo(() => renderContent(content), [content])
  const wordCount = useMemo(() => countWords(content), [content])
  const minutes = readingMinutes(wordCount, lang)

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-gray-400 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-brand-500">
          <Home size={12} /> {t('होम', 'Home')}
        </Link>
        <ChevronRight size={12} className="text-gray-300" />
        <Link href="/articles" className="hover:text-brand-500">{t('लेख', 'Articles')}</Link>
        <ChevronRight size={12} className="text-gray-300" />
        <span className="text-gray-500 truncate">{title}</span>
      </nav>

      {/* Back link */}
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 text-sm font-medium mb-6"
      >
        <ArrowLeft size={16} /> {t('सभी लेखों पर वापस जाएं', 'Back to all articles')}
      </Link>

      {/* Category + date + reading meta */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-600 text-xs font-semibold px-3 py-1 rounded-full">
          <Tag size={11} />
          {article.category}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Calendar size={12} />
          {article.created_at ? new Date(article.created_at).toLocaleDateString(isEn ? 'en-IN' : 'hi-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
          }) : ''}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Clock size={12} /> {minutes} {t('मिनट पठन', 'min read')}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <FileText size={12} /> {wordCount.toLocaleString(isEn ? 'en-IN' : 'hi-IN')} {t('शब्द', 'words')}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
        {title}
      </h1>

      {/* Excerpt / lead */}
      {excerpt && (
        <p className="text-lg text-gray-600 border-l-4 border-brand-400 pl-4 mb-6 leading-relaxed">
          {excerpt}
        </p>
      )}

      {/* Author + freshness */}
      <AuthorByline
        publishedAt={article.created_at}
        updatedAt={article.updated_at}
        reviewers={2}
      />

      {/* Table of Contents (only if 3+ headings) */}
      {toc.length >= 3 && (
        <details className="my-6 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
          <summary className="cursor-pointer px-4 py-3 font-semibold text-gray-700 text-sm hover:bg-gray-100 flex items-center gap-2">
            <BookOpen size={14} /> {t('विषय-सूची', 'Table of Contents')}
            <span className="text-xs text-gray-400">({toc.length})</span>
          </summary>
          <ol className="px-4 py-3 border-t border-gray-200 list-decimal list-inside text-sm text-gray-700 space-y-1.5">
            {toc.map((item, i) => (
              <li key={i}>
                <a href={`#${item.id}`} className="text-brand-600 hover:underline">{item.text}</a>
              </li>
            ))}
          </ol>
        </details>
      )}

      {/* Body */}
      <div className="prose-like">
        {body}
      </div>

      {/* Disclaimer (only on health categories) */}
      {(article.category.includes('स्वास्थ्य') || article.category.toLowerCase().includes('health')) && (
        <div className="my-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
          <strong>{t('अस्वीकरण: ', 'Disclaimer: ')}</strong>
          {t(
            'यह लेख केवल जानकारी हेतु है। यह योग्य चिकित्सीय सलाह का स्थान नहीं ले सकता। संदेह की स्थिति में डॉक्टर से मिलें या Tele-MANAS (14416) पर कॉल करें।',
            'This article is for informational purposes only. It is not a substitute for qualified medical advice. When in doubt, consult a doctor or call Tele-MANAS (14416).'
          )}
        </div>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t('संबंधित लेख', 'Related Articles')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((r) => {
              const rTitle = isEn && r.title_en ? r.title_en : r.title
              const rExcerpt = isEn && r.excerpt_en ? r.excerpt_en : r.excerpt
              return (
                <Link
                  key={r.id}
                  href={`/articles/${r.slug}`}
                  className="group block rounded-xl border border-gray-100 bg-white p-4 hover:border-brand-200 hover:shadow-md transition-all"
                >
                  <span className="inline-block text-[10px] uppercase tracking-wider text-brand-600 font-bold mb-1.5">
                    {r.category}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-brand-600 transition-colors leading-snug mb-1">
                    {rTitle}
                  </h3>
                  {rExcerpt && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{rExcerpt}</p>
                  )}
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-brand-600">
                    {t('पढ़ें', 'Read')} <ArrowRight size={12} />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Footer back link */}
      <div className="mt-12 pt-6 border-t border-gray-100">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 text-sm font-medium"
        >
          <ArrowLeft size={16} /> {t('सभी लेखों पर वापस जाएं', 'Back to all articles')}
        </Link>
      </div>
    </article>
  )
}
