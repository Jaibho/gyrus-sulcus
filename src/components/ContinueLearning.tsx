'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Flame, ArrowRight, GraduationCap } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { getStreak, getLastSubject, getAttempts, type AttemptTag } from '@/lib/progress'

const LABELS: Record<string, { hi: string; en: string }> = {
  science_tech:    { hi: 'विज्ञान एवं प्रौद्योगिकी', en: 'Science & Technology' },
  polity:          { hi: 'भारतीय राजव्यवस्था',        en: 'Indian Polity' },
  economy:         { hi: 'अर्थव्यवस्था',              en: 'Economy' },
  geography:       { hi: 'भूगोल एवं पर्यावरण',        en: 'Geography & Environment' },
  current_affairs: { hi: 'समसामयिकी',                 en: 'Current Affairs' },
}

export default function ContinueLearning() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [streak, setStreak] = useState({ count: 0, lastDateISO: '' })
  const [last, setLast] = useState<AttemptTag | null>(null)
  const [totalAttempts, setTotalAttempts] = useState(0)

  useEffect(() => {
    // Only runs on client — localStorage isn't available on the server
    setStreak(getStreak())
    setLast(getLastSubject())
    setTotalAttempts(getAttempts().length)
    setMounted(true)
  }, [])

  // Hide entirely until we've read localStorage, and for first-time users
  if (!mounted || totalAttempts === 0) return null

  const subjKey = last || 'science_tech'
  const subjLabel = LABELS[subjKey] || LABELS.science_tech

  return (
    <section className="max-w-7xl mx-auto px-4 pt-6">
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-amber-50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        {/* Streak badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
            <Flame size={22} className="text-white" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 leading-none">
              {streak.count}
              <span className="text-sm font-semibold text-gray-500 ml-1">
                {t('दिन', streak.count === 1 ? 'day' : 'days')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{t('लगातार अध्ययन', 'Current streak')}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-10 bg-gray-200" />

        {/* Continue message */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide flex items-center gap-1">
            <GraduationCap size={13} /> {t('जारी रखें', 'Continue learning')}
          </p>
          <p className="text-sm font-bold text-gray-900 truncate">
            {t(subjLabel.hi, subjLabel.en)}
          </p>
          <p className="text-xs text-gray-500">
            {t(`${totalAttempts} प्रयास पूरे`, `${totalAttempts} attempt${totalAttempts > 1 ? 's' : ''} so far`)}
          </p>
        </div>

        {/* Primary action */}
        <Link
          href={`/tests?subject=${subjKey}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors shadow-md text-sm shrink-0"
        >
          {t('अगला टेस्ट', 'Next Test')} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
