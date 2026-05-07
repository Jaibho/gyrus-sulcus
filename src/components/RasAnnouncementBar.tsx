'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { Flame, ArrowRight, X } from 'lucide-react'

export default function RasAnnouncementBar() {
  const { t } = useLanguage()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className="relative flex items-center justify-center gap-2 px-8 sm:px-4 py-2 sm:py-2.5 text-white text-xs sm:text-sm font-medium overflow-hidden"
      style={{ background: 'linear-gradient(90deg, #ea580c, #dc2626, #ea580c)', backgroundSize: '200% 100%' }}
    >
      {/* Content — single line, truncated on mobile */}
      <div className="flex items-center gap-2 min-w-0 max-w-full">
        <span className="flex items-center gap-1.5 font-bold shrink-0">
          <Flame size={13} className="shrink-0" />
          {t('नया:', 'NEW:')}
        </span>
        <span className="opacity-90 truncate">
          {t('RAS English Medium — विशेष सामग्री आ रही है', 'RAS English Medium — Special content coming')}
        </span>
        <Link
          href="/ras-english"
          className="hidden sm:flex items-center gap-1 bg-white/20 hover:bg-white/30 border border-white/30 px-3 py-0.5 rounded-full text-xs font-bold transition-colors shrink-0"
        >
          {t('देखें', 'Explore')} <ArrowRight size={12} />
        </Link>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}
