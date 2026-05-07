'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { CalendarDays, ShieldCheck, RefreshCw } from 'lucide-react'

interface AuthorBylineProps {
  publishedAt?: string  // ISO date
  updatedAt?: string    // ISO date
  reviewers?: number    // count of editorial reviewers
  authorName?: string
  authorRole?: string
  /** Show a compact one-line variant */
  compact?: boolean
}

function formatDate(iso: string, lang: 'hi' | 'en') {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch {
    return iso
  }
}

/**
 * Authorship + freshness signal block. Use at the top of any article.
 *
 * Renders the author photo, name, role, publish/update dates and a
 * "two-pass review" badge — all signals that improve E-E-A-T (Google's
 * Experience-Expertise-Authoritativeness-Trustworthiness rubric).
 */
export default function AuthorByline({
  publishedAt,
  updatedAt,
  reviewers = 2,
  authorName = 'Dharmendra Sir',
  authorRole,
  compact = false,
}: AuthorBylineProps) {
  const { t, lang } = useLanguage()
  const role = authorRole || t('संस्थापक एवं मुख्य संपादक — Gyrus Sulcus', 'Founder & Editor-in-Chief — Gyrus Sulcus')

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Image src="/profile.jpg" alt={authorName} width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
        <span className="font-semibold text-gray-700">{authorName}</span>
        {publishedAt && <span>· {formatDate(publishedAt, lang)}</span>}
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-6 p-4 rounded-xl border border-gray-100 bg-gray-50">
      {/* Author */}
      <Link href="/about" className="flex items-center gap-3 group">
        <Image
          src="/profile.jpg"
          alt={authorName}
          width={44}
          height={44}
          className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
        />
        <div>
          <p className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
            {authorName}
          </p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </Link>

      {/* Dates + review badge */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        {publishedAt && (
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={13} /> {t('प्रकाशित:', 'Published:')} {formatDate(publishedAt, lang)}
          </span>
        )}
        {updatedAt && updatedAt !== publishedAt && (
          <span className="inline-flex items-center gap-1 text-amber-600">
            <RefreshCw size={13} /> {t('अद्यतन:', 'Updated:')} {formatDate(updatedAt, lang)}
          </span>
        )}
        <Link
          href="/editorial-policy"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold hover:bg-emerald-100 transition-colors"
          title={t('संपादकीय नीति देखें', 'See Editorial Policy')}
        >
          <ShieldCheck size={11} /> {t(`${reviewers}-स्तरीय समीक्षा`, `${reviewers}-pass review`)}
        </Link>
      </div>
    </div>
  )
}
