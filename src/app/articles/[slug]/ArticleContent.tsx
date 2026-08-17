'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import AdSlot from '@/components/AdSlot'
import { AD_SLOTS } from '@/lib/ads'
import { Calendar, ArrowLeft, Tag } from 'lucide-react'

export interface Article {
  id: string
  title: string
  title_en?: string
  slug: string
  category?: string
  excerpt?: string
  excerpt_en?: string
  content: string
  content_en?: string
  is_published?: boolean
  created_at: string
}

// Inline formatting: **bold** and *italic*
function renderInline(text: string, keyBase: string) {
  const parts: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(<strong key={`${keyBase}-b${i++}`}>{m[1]}</strong>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

// Lightweight Markdown → JSX (headings, lists, blockquotes, paragraphs)
function renderMarkdown(md: string) {
  const lines = (md || '').split('\n')
  const out: React.ReactNode[] = []
  let list: string[] = []
  let k = 0
  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={`ul${k++}`} className="list-disc pl-6 my-3 space-y-1.5 text-gray-700">
          {list.map((li, i) => (
            <li key={i}>{renderInline(li, `li${k}-${i}`)}</li>
          ))}
        </ul>
      )
      list = []
    }
  }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { flush(); continue }
    if (line.startsWith('### ')) { flush(); out.push(<h3 key={`h${k++}`} className="text-lg font-bold text-gray-900 mt-6 mb-2">{renderInline(line.slice(4), `h${k}`)}</h3>) }
    else if (line.startsWith('## ')) { flush(); out.push(<h2 key={`h${k++}`} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{renderInline(line.slice(3), `h${k}`)}</h2>) }
    else if (line.startsWith('# ')) { flush(); out.push(<h2 key={`h${k++}`} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{renderInline(line.slice(2), `h${k}`)}</h2>) }
    else if (line.startsWith('> ')) { flush(); out.push(<blockquote key={`q${k++}`} className="border-l-4 border-brand-300 bg-brand-50/50 pl-4 py-2 my-4 text-sm text-gray-600 italic">{renderInline(line.slice(2), `q${k}`)}</blockquote>) }
    else if (/^[-*]\s+/.test(line)) { list.push(line.replace(/^[-*]\s+/, '')) }
    else { flush(); out.push(<p key={`p${k++}`} className="my-3 text-gray-700 leading-relaxed">{renderInline(line, `p${k}`)}</p>) }
  }
  flush()
  return out
}

export default function ArticleContent({ article }: { article: Article }) {
  const { t } = useLanguage()
  const title = t(article.title, article.title_en || article.title)
  const body = t(article.content, article.content_en || article.content) || article.content_en || article.content || ''

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-brand-500 font-medium hover:underline mb-6">
        <ArrowLeft size={16} /> {t('सभी लेख', 'All Articles')}
      </Link>

      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
        {article.category && (
          <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full font-medium">
            <Tag size={12} /> {article.category}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Calendar size={12} /> {new Date(article.created_at).toLocaleDateString('hi-IN')}
        </span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-6">{title}</h1>

      <article className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        {renderMarkdown(body)}
      </article>

      {/* Ad — below the article content */}
      <AdSlot slot={AD_SLOTS.articleFooter} />

      <div className="mt-8">
        <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-brand-500 font-medium hover:underline">
          <ArrowLeft size={16} /> {t('और लेख पढ़ें', 'Read more articles')}
        </Link>
      </div>
    </div>
  )
}
