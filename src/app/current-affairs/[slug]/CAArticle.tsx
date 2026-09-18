'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import AdSlot from '@/components/AdSlot'
import { AD_SLOTS } from '@/lib/ads'
import ArticleThumb from '@/components/ArticleThumb'
import { renderMarkdown } from '@/lib/articleMarkdown'
import { ArrowLeft, ArrowRight, Calendar, Tag, Link2, Check } from 'lucide-react'

export interface CAArticle {
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
  image_url?: string
  image_credit?: string
  image_license?: string
  image_source?: string
}

type Neighbour = { slug: string; title: string; title_en?: string } | null

export default function CAArticleView({
  article,
  prev,
  next,
  related,
}: {
  article: CAArticle
  prev: Neighbour
  next: Neighbour
  related: CAArticle[]
}) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const title = t(article.title, article.title_en || article.title)
  const body = t(article.content, article.content_en || article.content) || article.content_en || article.content || ''
  const url = typeof window !== 'undefined' ? window.location.href : `https://gyrussulcus.com/current-affairs/${article.slug}`

  const share = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(title + ' — ' + url)}`, cls: 'bg-[#25D366]' },
    { name: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, cls: 'bg-[#229ED9]' },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, cls: 'bg-[#1877F2]' },
    { name: 'X', href: `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, cls: 'bg-black' },
  ]

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/current-affairs" className="inline-flex items-center gap-1.5 text-sm text-brand-500 font-medium hover:underline mb-6">
        <ArrowLeft size={16} /> {t('सभी समसामयिकी', 'All Current Affairs')}
      </Link>

      {/* Hero thumbnail */}
      <div className="mb-6 shadow-sm rounded-2xl overflow-hidden">
        <ArticleThumb
          title={title}
          category={article.category}
          date={article.created_at}
          slug={article.slug}
          variant="hero"
          imageUrl={article.image_url}
          credit={article.image_credit}
        />
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
        {article.category && (
          <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full font-medium">
            <Tag size={12} /> {article.category}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Calendar size={12} />
          {new Date(article.created_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-6">{title}</h1>

      <article className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        {renderMarkdown(body)}
      </article>

      {/* Share */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 mr-1">{t('साझा करें', 'Share')}:</span>
        {share.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${s.cls} text-white text-xs font-medium px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity`}
          >
            {s.name}
          </a>
        ))}
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-brand-300"
        >
          {copied ? <Check size={13} /> : <Link2 size={13} />}
          {copied ? t('कॉपी हो गया', 'Copied') : t('लिंक कॉपी करें', 'Copy link')}
        </button>
      </div>

      <AdSlot slot={AD_SLOTS.articleFooter} />

      {/* Prev / Next */}
      {(prev || next) && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prev ? (
            <Link href={`/current-affairs/${prev.slug}`} className="border border-gray-100 bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
              <span className="text-xs text-gray-400 flex items-center gap-1 mb-1"><ArrowLeft size={12} /> {t('पिछला', 'Previous')}</span>
              <span className="text-sm font-semibold text-gray-800 line-clamp-2">{t(prev.title, prev.title_en || prev.title)}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/current-affairs/${next.slug}`} className="border border-gray-100 bg-white rounded-xl p-4 hover:shadow-md transition-shadow sm:text-right">
              <span className="text-xs text-gray-400 flex items-center gap-1 sm:justify-end mb-1">{t('अगला', 'Next')} <ArrowRight size={12} /></span>
              <span className="text-sm font-semibold text-gray-800 line-clamp-2">{t(next.title, next.title_en || next.title)}</span>
            </Link>
          ) : <div />}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t('संबंधित समाचार', 'Related Stories')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.id} href={`/current-affairs/${r.slug}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                <ArticleThumb
                  title={t(r.title, r.title_en || r.title)}
                  category={r.category}
                  date={r.created_at}
                  slug={r.slug}
                  imageUrl={r.image_url}
                  credit={r.image_credit}
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors">
                    {t(r.title, r.title_en || r.title)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
