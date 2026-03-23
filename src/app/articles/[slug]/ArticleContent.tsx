'use client'
import Link from 'next/link'
import { Article } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { Calendar, ArrowLeft, Tag } from 'lucide-react'

// Very simple markdown-like renderer: ## headings, **bold**, newlines
function renderContent(text: string | null | undefined) {
  if (!text) return []
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-xl font-bold text-gray-900 mt-8 mb-3">
          {line.replace('## ', '')}
        </h2>
      )
    } else if (line.startsWith('- ')) {
      const content = line.replace('- ', '')
      elements.push(
        <li key={key++} className="text-gray-700 ml-4 mb-1 list-disc"
          dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
        />
      )
    } else if (line.startsWith('1. ') || /^\d+\. /.test(line)) {
      const content = line.replace(/^\d+\. /, '')
      elements.push(
        <li key={key++} className="text-gray-700 ml-4 mb-1 list-decimal"
          dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
        />
      )
    } else if (line.trim() === '') {
      elements.push(<br key={key++} />)
    } else {
      elements.push(
        <p key={key++} className="text-gray-700 leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
        />
      )
    }
  }
  return elements
}

export default function ArticleContent({ article }: { article: Article }) {
  const { lang, t } = useLanguage()
  const isEn = lang === 'en'

  const title = isEn && article.title_en ? article.title_en : article.title
  const excerpt = isEn && article.excerpt_en ? article.excerpt_en : article.excerpt
  const content = isEn && article.content_en ? article.content_en : article.content

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 text-sm font-medium mb-6"
      >
        <ArrowLeft size={16} />
        {t('सभी लेखों पर वापस जाएं', 'Back to all articles')}
      </Link>

      {/* Category tag */}
      <div className="flex items-center gap-2 mb-4">
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
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
        {title}
      </h1>

      {/* Excerpt / lead */}
      {excerpt && (
        <p className="text-lg text-gray-500 border-l-4 border-brand-400 pl-4 mb-8 leading-relaxed">
          {excerpt}
        </p>
      )}

      {/* Divider */}
      <hr className="border-gray-100 mb-8" />

      {/* Article body */}
      <div className="prose-like">
        {renderContent(content)}
      </div>

      {/* Footer back link */}
      <div className="mt-12 pt-6 border-t border-gray-100">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          {t('सभी लेखों पर वापस जाएं', 'Back to all articles')}
        </Link>
      </div>
    </div>
  )
}
