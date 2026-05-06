'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

/**
 * DateStrip — horizontal scrollable date tape for inline date browsing.
 *
 * • variant="tests"    → each weekday is a button mapping to its subject
 *                        (Mon=Sci, Tue=Polity, Wed=Economy, Thu=Geog, Fri=CA).
 *                        Clicking a past weekday navigates to /tests?subject=…&date=…
 *
 * • variant="articles" → each date is a button. Clicking sets the parent's
 *                        ?date= filter. A small numeric badge shows how many
 *                        articles were published on that day.
 *
 * Both variants:
 * • Today is highlighted.
 * • Future dates are dimmed (no test/article yet).
 * • Left/right arrows + native overflow-x scroll for both desktop and mobile.
 * • Auto-scrolls to today / selected date on mount.
 */

const SUBJECT_BY_WEEKDAY: Record<number, { key: string; hi: string; en: string; color: string; bgClass: string }> = {
  1: { key: 'science_tech',    hi: 'विज्ञान',     en: 'Sci',     color: 'bg-blue-500',    bgClass: 'bg-blue-500' },
  2: { key: 'polity',          hi: 'राजव्यवस्था', en: 'Polity',  color: 'bg-amber-500',   bgClass: 'bg-amber-500' },
  3: { key: 'economy',         hi: 'अर्थ',        en: 'Eco',     color: 'bg-emerald-500', bgClass: 'bg-emerald-500' },
  4: { key: 'geography',       hi: 'भूगोल',       en: 'Geo',     color: 'bg-purple-500',  bgClass: 'bg-purple-500' },
  5: { key: 'current_affairs', hi: 'समसामयिकी',  en: 'CA',      color: 'bg-rose-500',    bgClass: 'bg-rose-500' },
}

const DAYS_HI = ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श']
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS_HI = ['जन', 'फर', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्ट', 'नव', 'दिस']
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface DateStripProps {
  variant: 'tests' | 'articles'
  /** Number of past days (and today) to show. Default 60. */
  days?: number
  /** YYYY-MM-DD. Articles variant: parent-controlled filter date. */
  selectedDate?: string | null
  /** Articles variant: optional callback (instead of href navigation). */
  onSelectDate?: (date: string | null) => void
  /** Articles variant: counts per yyyy-mm-dd for badges. */
  countsByDate?: Record<string, number>
}

export default function DateStrip({
  variant,
  days = 60,
  selectedDate,
  onSelectDate,
  countsByDate = {},
}: DateStripProps) {
  const { t, lang } = useLanguage()
  const [today, setToday] = useState<Date | null>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Avoid hydration mismatch — set today on mount
  useEffect(() => { setToday(new Date()) }, [])

  // Build dates: today first, then yesterday, …, n days back. Render reversed
  // so oldest is leftmost, today is rightmost.
  const dates = useMemo(() => {
    if (!today) return []
    const arr: Date[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      arr.push(d)
    }
    return arr
  }, [today, days])

  // Auto-scroll right on mount so today is centred
  useEffect(() => {
    if (!scrollerRef.current) return
    requestAnimationFrame(() => {
      if (scrollerRef.current) {
        scrollerRef.current.scrollLeft = scrollerRef.current.scrollWidth
      }
    })
  }, [dates.length])

  function scrollBy(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const months = lang === 'hi' ? MONTHS_HI : MONTHS_EN
  const days_arr = lang === 'hi' ? DAYS_HI : DAYS_EN

  if (!today) {
    // SSR / first paint placeholder — keeps height stable
    return <div className="h-24 sm:h-28" />
  }

  const todayKey = ymd(today)

  return (
    <div className="relative">
      {/* Left scroll button */}
      <button
        onClick={() => scrollBy(-300)}
        aria-label="Scroll left"
        className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-500 hover:text-brand-500 hover:border-brand-200"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Right scroll button */}
      <button
        onClick={() => scrollBy(300)}
        aria-label="Scroll right"
        className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-500 hover:text-brand-500 hover:border-brand-200"
      >
        <ChevronRight size={16} />
      </button>

      {/* Selected-state pill (articles variant) */}
      {variant === 'articles' && selectedDate && (
        <div className="mb-2 inline-flex items-center gap-2 text-xs text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-3 py-1">
          <span className="font-semibold">
            {t('फ़िल्टर:', 'Filter:')} {new Date(selectedDate).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <button
            onClick={() => onSelectDate?.(null)}
            className="hover:text-purple-900"
            aria-label="Clear date filter"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Scroller */}
      <div
        ref={scrollerRef}
        className="overflow-x-auto scroll-smooth pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'thin' }}
      >
        <ul className="flex gap-2 min-w-min">
          {dates.map((d, idx) => {
            const key = ymd(d)
            const dow = d.getDay()
            const isToday = key === todayKey
            const isSelected = selectedDate === key
            const isWeekday = dow >= 1 && dow <= 5
            const monthLabel = idx === 0 || d.getDate() === 1 ? months[d.getMonth()] : null

            // === tests variant ===
            if (variant === 'tests') {
              const sub = isWeekday ? SUBJECT_BY_WEEKDAY[dow] : null
              const disabled = !sub || (!isToday && d > today)
              const href = sub
                ? isToday
                  ? `/tests?subject=${sub.key}`
                  : `/tests?subject=${sub.key}&date=${key}`
                : '#'

              const cardCls = [
                'flex flex-col items-center justify-center min-w-[64px] rounded-xl border transition-all',
                'px-2 py-2.5 text-center',
                isToday
                  ? 'bg-brand-50 border-brand-300 ring-2 ring-brand-200'
                  : disabled
                    ? 'bg-gray-50 border-gray-100 text-gray-300'
                    : 'bg-white border-gray-200 hover:border-brand-200 hover:shadow-sm',
              ].join(' ')

              const inner = (
                <>
                  {monthLabel && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{monthLabel}</span>
                  )}
                  <span className="text-[10px] text-gray-500">{days_arr[dow]}</span>
                  <span className={`text-base font-bold ${isToday ? 'text-brand-700' : disabled ? 'text-gray-300' : 'text-gray-900'}`}>
                    {d.getDate()}
                  </span>
                  {sub && (
                    <span className={`mt-1 text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${disabled ? 'opacity-40' : ''} ${sub.color}`}>
                      {sub.en.slice(0, 3).toUpperCase()}
                    </span>
                  )}
                  {!sub && (
                    <span className="mt-1 text-[9px] text-gray-300">—</span>
                  )}
                </>
              )

              return (
                <li key={key}>
                  {disabled ? (
                    <div className={cardCls + ' cursor-not-allowed'} aria-disabled="true">{inner}</div>
                  ) : (
                    <Link href={href} className={cardCls}>{inner}</Link>
                  )}
                </li>
              )
            }

            // === articles variant ===
            const count = countsByDate[key] || 0
            const hasArticles = count > 0
            const cardCls = [
              'flex flex-col items-center justify-center min-w-[64px] rounded-xl border transition-all relative',
              'px-2 py-2.5 text-center',
              isSelected
                ? 'bg-purple-100 border-purple-400 ring-2 ring-purple-300'
                : isToday
                  ? 'bg-brand-50 border-brand-300 ring-2 ring-brand-200'
                  : hasArticles
                    ? 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm'
                    : 'bg-gray-50 border-gray-100 text-gray-300 hover:border-gray-200',
            ].join(' ')

            return (
              <li key={key}>
                <button
                  onClick={() => onSelectDate?.(isSelected ? null : key)}
                  className={cardCls}
                  aria-pressed={isSelected}
                >
                  {monthLabel && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{monthLabel}</span>
                  )}
                  <span className="text-[10px] text-gray-500">{days_arr[dow]}</span>
                  <span className={`text-base font-bold ${isSelected ? 'text-purple-700' : isToday ? 'text-brand-700' : hasArticles ? 'text-gray-900' : 'text-gray-300'}`}>
                    {d.getDate()}
                  </span>
                  {hasArticles ? (
                    <span className="mt-1 text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full">
                      {count}
                    </span>
                  ) : (
                    <span className="mt-1 text-[9px] text-gray-300">—</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Legend */}
      {variant === 'tests' && (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-500">
          {Object.entries(SUBJECT_BY_WEEKDAY).map(([dow, sub]) => (
            <span key={dow} className="inline-flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${sub.color}`} />
              {days_arr[Number(dow)]} · {t(sub.hi, sub.en)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
