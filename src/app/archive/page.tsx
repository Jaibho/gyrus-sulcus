'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, ChevronRight, ClipboardList, BookOpen, ArrowRight,
  CalendarDays, Filter,
} from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import type { Article } from '@/lib/supabase'

/**
 * /archive — single browse-by-date hub for the whole site.
 *
 * • Top toggle switches between "Tests" and "Articles" view.
 * • Click any date in the calendar to see what's available that day.
 * • Tests: each weekday is mapped to a subject (Mon=Sci, Tue=Polity, …).
 * • Articles: shows every article published on the picked date.
 * • Side panel summarises the picked day and links straight to the content.
 */

// ----------- constants ------------

const DAYS_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि']
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS_HI = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const SUBJECT_BY_WEEKDAY: Record<number, { key: string; hi: string; en: string; color: string }> = {
  1: { key: 'science_tech',    hi: 'विज्ञान एवं तकनीक',    en: 'Science & Tech',   color: 'bg-blue-500'    },
  2: { key: 'polity',          hi: 'भारतीय राजव्यवस्था',   en: 'Polity',           color: 'bg-amber-500'   },
  3: { key: 'economy',         hi: 'अर्थव्यवस्था',        en: 'Economy',          color: 'bg-emerald-500' },
  4: { key: 'geography',       hi: 'भूगोल',              en: 'Geography',        color: 'bg-purple-500'  },
  5: { key: 'current_affairs', hi: 'समसामयिकी',          en: 'Current Affairs',  color: 'bg-rose-500'    },
}

// ----------- helpers --------------

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ----------- page -----------

type View = 'tests' | 'articles'
type CategoryFilter = 'all' | string

export default function ArchivePage() {
  const { t, lang } = useLanguage()

  const today = useMemo(() => new Date(), [])
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate())
  const [view, setView] = useState<View>('tests')
  const [catFilter, setCatFilter] = useState<CategoryFilter>('all')

  // Article load
  const [articles, setArticles] = useState<Article[]>([])
  useEffect(() => {
    fetch('/data/articles.json')
      .then(r => r.json())
      .then((all: Article[]) => setArticles(all.filter(a => a.is_published)))
      .catch(() => setArticles([]))
  }, [])

  // Calendar grid
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  // Articles by yyyy-mm-dd
  const articlesByDate = useMemo(() => {
    const m = new Map<string, Article[]>()
    for (const a of articles) {
      try {
        const key = ymd(new Date(a.created_at))
        const arr = m.get(key) || []
        arr.push(a)
        m.set(key, arr)
      } catch { /* ignore bad dates */ }
    }
    return m
  }, [articles])

  // Categories
  const categories = useMemo(() => {
    const s = new Set<string>()
    articles.forEach(a => s.add(a.category))
    return ['all', ...Array.from(s).sort()]
  }, [articles])

  // Selected date helpers
  const selectedDate = new Date(year, month, selectedDay)
  const selectedKey = ymd(selectedDate)
  const selectedDow = selectedDate.getDay()
  const isWeekday = selectedDow >= 1 && selectedDow <= 5
  const todayStamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const isFuture = selectedDate.getTime() > todayStamp
  const isToday = selectedDate.getTime() === todayStamp

  // Selected day's tests (mapped to weekday)
  const selectedSubject = isWeekday ? SUBJECT_BY_WEEKDAY[selectedDow] : null

  // Selected day's articles
  const selectedArticles = useMemo(() => {
    const arr = articlesByDate.get(selectedKey) || []
    if (catFilter === 'all') return arr
    return arr.filter(a => a.category === catFilter)
  }, [articlesByDate, selectedKey, catFilter])

  // Calendar nav
  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }
  function jumpToToday() {
    setYear(today.getFullYear()); setMonth(today.getMonth()); setSelectedDay(today.getDate())
  }

  const days = lang === 'hi' ? DAYS_HI : DAYS_EN
  const months = lang === 'hi' ? MONTHS_HI : MONTHS_EN

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CalendarDays size={13} /> {t('आर्काइव', 'Archive')}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          {t('दिनांक से ब्राउज़ करें', 'Browse by date')}
        </h1>
        <p className="text-gray-600">
          {t(
            'किसी भी दिन का टेस्ट या लेख खोलें। नीचे टॉगल से टेस्ट एवं लेख के बीच स्विच करें।',
            'Open any day\'s test or article. Toggle below to switch between tests and articles.'
          )}
        </p>
      </div>

      {/* View toggle */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="inline-flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setView('tests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              view === 'tests'
                ? 'bg-white shadow-sm text-emerald-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ClipboardList size={16} /> {t('टेस्ट', 'Tests')}
          </button>
          <button
            onClick={() => setView('articles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              view === 'articles'
                ? 'bg-white shadow-sm text-purple-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen size={16} /> {t('लेख', 'Articles')}
          </button>
        </div>

        <button
          onClick={jumpToToday}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 text-sm font-semibold border border-brand-100"
        >
          {t('आज पर जाएँ', 'Jump to today')}
        </button>

        {view === 'articles' && categories.length > 1 && (
          <div className="inline-flex items-center gap-2 ml-auto">
            <Filter size={14} className="text-gray-400" />
            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-brand-400"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'all' ? t('सभी श्रेणियाँ', 'All categories') : c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Calendar */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <header className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Previous month">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900">
              {months[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Next month">
              <ChevronRight size={20} />
            </button>
          </header>

          <div className="grid grid-cols-7 mb-2">
            {days.map(d => (
              <div key={d} className="text-center text-xs text-gray-400 font-semibold py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />
              const cellDate = new Date(year, month, day)
              const cellKey = ymd(cellDate)
              const cellDow = cellDate.getDay()
              const cellWeekday = cellDow >= 1 && cellDow <= 5
              const cellToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const cellSelected = day === selectedDay
              const cellArticles = articlesByDate.get(cellKey) || []
              const cellHasArticles = cellArticles.length > 0
              const cellInFuture = cellDate.getTime() > todayStamp

              // Decorate based on view
              let badgeColor = 'bg-gray-200'
              if (view === 'tests' && cellWeekday && !cellInFuture) {
                badgeColor = SUBJECT_BY_WEEKDAY[cellDow].color
              } else if (view === 'articles' && cellHasArticles) {
                badgeColor = 'bg-purple-500'
              } else {
                badgeColor = ''
              }

              const base = 'relative flex flex-col items-center justify-center rounded-lg py-2 text-sm font-medium transition-colors aspect-square'
              let cls = 'text-gray-700 hover:bg-gray-100'
              if (cellToday) cls = 'bg-blue-500 text-white hover:bg-blue-600 ring-2 ring-blue-300'
              else if (cellSelected) cls = 'bg-brand-100 text-brand-800 ring-2 ring-brand-300'
              else if (cellInFuture) cls = 'text-gray-300 hover:bg-gray-50'

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  className={`${base} ${cls}`}
                  aria-label={`${months[month]} ${day}`}
                >
                  <span>{day}</span>
                  {badgeColor && (
                    <span className={`mt-0.5 w-1.5 h-1.5 rounded-full ${badgeColor} ${cellInFuture ? 'opacity-30' : ''}`} />
                  )}
                  {view === 'articles' && cellHasArticles && (
                    <span className="absolute top-0.5 right-1 text-[9px] font-bold text-purple-700">
                      {cellArticles.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-3 text-xs text-gray-500">
            {view === 'tests' && (
              <>
                {Object.entries(SUBJECT_BY_WEEKDAY).map(([dow, sub]) => (
                  <span key={dow} className="inline-flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${sub.color}`} />
                    {days[Number(dow)]} · {t(sub.hi, sub.en)}
                  </span>
                ))}
              </>
            )}
            {view === 'articles' && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                {t('लेख प्रकाशित', 'Articles published')}
              </span>
            )}
          </div>
        </section>

        {/* Side panel: details for selected date */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              {isToday ? t('आज', 'Today') : t('चयनित दिनांक', 'Selected date')}
            </p>
            <p className="text-lg font-bold text-gray-900">
              {days[selectedDow]}, {months[month]} {selectedDay}, {year}
            </p>
          </div>

          {/* Tests view side panel */}
          {view === 'tests' && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ClipboardList size={14} className="text-emerald-500" /> {t('दैनिक टेस्ट', 'Daily Test')}
              </h3>
              {selectedSubject ? (
                <Link
                  href={isFuture
                    ? `/tests?subject=${selectedSubject.key}`
                    : `/tests?subject=${selectedSubject.key}${isToday ? '' : `&date=${selectedKey}`}`}
                  className={`block ${selectedSubject.color} text-white rounded-xl p-4 hover:opacity-95 transition-opacity`}
                >
                  <p className="text-[10px] uppercase tracking-wider opacity-90">
                    {isToday ? t("आज का टेस्ट", "Today's Test") : isFuture ? t('आगामी', 'Upcoming') : t('अभ्यास', 'Practice')}
                  </p>
                  <p className="font-bold text-lg leading-tight mt-1">{t(selectedSubject.hi, selectedSubject.en)}</p>
                  <p className="text-xs opacity-90 mt-2 flex items-center gap-1">
                    {t('30+ कथन-प्रकार प्रश्न', '30+ statement-type questions')} <ArrowRight size={12} />
                  </p>
                </Link>
              ) : (
                <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-4 text-sm text-gray-500 text-center">
                  {t('शनिवार/रविवार पर कोई टेस्ट नहीं', 'No test on Saturdays/Sundays')}
                </div>
              )}
            </div>
          )}

          {/* Articles view side panel */}
          {view === 'articles' && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen size={14} className="text-purple-500" /> {t('इस दिन के लेख', 'Articles this day')}
                <span className="ml-auto text-gray-400 font-normal">{selectedArticles.length}</span>
              </h3>
              {selectedArticles.length === 0 ? (
                <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-4 text-sm text-gray-500 text-center">
                  {t('इस दिनांक पर कोई लेख प्रकाशित नहीं हुआ।', 'No articles published on this date.')}
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {selectedArticles.map(a => (
                    <li key={a.id}>
                      <Link
                        href={`/articles/${a.slug}`}
                        className="block rounded-xl border border-gray-100 bg-white p-3 hover:border-purple-200 hover:bg-purple-50/30 transition-colors"
                      >
                        <span className="inline-block text-[10px] uppercase tracking-wider text-purple-600 font-bold mb-1">
                          {a.category}
                        </span>
                        <p className="font-semibold text-sm text-gray-900 leading-tight">
                          {lang === 'en' && a.title_en ? a.title_en : a.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Cross-link */}
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-4 text-xs text-gray-600">
            {view === 'tests' ? (
              <>
                {t('इस दिन के लेख देखना चाहते हैं?', 'Want to see articles for this day?')}
                <button
                  onClick={() => setView('articles')}
                  className="ml-1 font-semibold text-brand-600 hover:underline"
                >
                  {t('लेख दृश्य खोलें →', 'Open Articles view →')}
                </button>
              </>
            ) : (
              <>
                {t('इस दिन का दैनिक टेस्ट?', "This day's daily test?")}
                <button
                  onClick={() => setView('tests')}
                  className="ml-1 font-semibold text-brand-600 hover:underline"
                >
                  {t('टेस्ट दृश्य खोलें →', 'Open Tests view →')}
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
