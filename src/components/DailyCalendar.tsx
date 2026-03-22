'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

const HI_MONTHS = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्तूबर','नवंबर','दिसंबर']
const EN_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const HI_DAYS = ['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि']
const EN_DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export interface DayData {
  date: string // YYYY-MM-DD
  hasQuiz?: boolean
  hasArticle?: boolean
}

interface Props {
  mode: 'quiz' | 'article'
  selectedDate: string
  onSelectDate: (date: string) => void
  availableDates: DayData[]
}

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function todayISO() {
  const d = new Date()
  return toISO(d.getFullYear(), d.getMonth(), d.getDate())
}

function formatHindiDate(dateStr: string, lang: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const hi = `${d} ${HI_MONTHS[m - 1]} ${y}`
  const en = `${d} ${EN_MONTHS[m - 1]} ${y}`
  return lang === 'hi' ? hi : en
}

/** Generate sample availability for a given year/month up to today */
export function generateAvailability(year: number, month: number): DayData[] {
  const todayStr = todayISO()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const result: DayData[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = toISO(year, month, d)
    if (dateStr > todayStr) break
    const dow = new Date(year, month, d).getDay()
    const hasQuiz = dow >= 1 && dow <= 6          // Mon–Sat
    const hasArticle = dow === 1 || dow === 3 || dow === 5  // Mon, Wed, Fri
    if (hasQuiz || hasArticle) result.push({ date: dateStr, hasQuiz, hasArticle })
  }
  return result
}

/** Generate full-year availability (past 3 months + current) */
export function generateFullAvailability(): DayData[] {
  const today = new Date()
  const result: DayData[] = []
  for (let mo = -3; mo <= 0; mo++) {
    const d = new Date(today.getFullYear(), today.getMonth() + mo, 1)
    result.push(...generateAvailability(d.getFullYear(), d.getMonth()))
  }
  return result
}

export default function DailyCalendar({ mode, selectedDate, onSelectDate, availableDates }: Props) {
  const { t, lang } = useLanguage()
  const todayStr = todayISO()

  // ── month grid state ──────────────────────────────────────────
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(selectedDate || todayStr)
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  // ── mobile week strip state ───────────────────────────────────
  const [weekOffset, setWeekOffset] = useState(0)

  const { year, month } = viewMonth

  const availMap = useMemo(() => {
    const map: Record<string, DayData> = {}
    availableDates.forEach(d => { map[d.date] = d })
    return map
  }, [availableDates])

  // ── month grid helpers ────────────────────────────────────────
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array(firstDow).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const today = new Date(todayStr)
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  const prevMonth = () =>
    setViewMonth(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    )
  const nextMonth = () => {
    if (isCurrentMonth) return
    setViewMonth(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    )
  }

  // ── mobile week helpers ───────────────────────────────────────
  const weekDays = useMemo(() => {
    const base = new Date(todayStr)
    const sunday = new Date(base)
    sunday.setDate(base.getDate() - base.getDay() + weekOffset * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday)
      d.setDate(sunday.getDate() + i)
      return toISO(d.getFullYear(), d.getMonth(), d.getDate())
    })
  }, [weekOffset, todayStr])

  const hasDot = (dateStr: string) =>
    mode === 'quiz' ? !!availMap[dateStr]?.hasQuiz : !!availMap[dateStr]?.hasArticle

  const dotColor = (dateStr: string, isSelected: boolean) => {
    if (isSelected) return 'bg-white'
    return mode === 'quiz' ? 'bg-emerald-500' : 'bg-brand-400'
  }

  const dayHeaders = lang === 'hi' ? HI_DAYS : EN_DAYS

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm select-none overflow-hidden">

      {/* ── MOBILE: horizontal week strip (hidden on md+) ──────── */}
      <div className="md:hidden p-3">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setWeekOffset(o => o - 1)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-500" />
          </button>
          <span className="text-xs font-bold text-gray-700">
            {formatHindiDate(weekDays[0], lang)} – {formatHindiDate(weekDays[6], lang)}
          </span>
          <button
            onClick={() => weekOffset < 0 && setWeekOffset(o => o + 1)}
            disabled={weekOffset === 0}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30"
          >
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((dateStr, i) => {
            const [, , d] = dateStr.split('-')
            const isToday = dateStr === todayStr
            const isSelected = dateStr === selectedDate
            const isFuture = dateStr > todayStr
            const dot = hasDot(dateStr)
            return (
              <button
                key={i}
                onClick={() => !isFuture && onSelectDate(dateStr)}
                disabled={isFuture}
                className={`
                  relative flex flex-col items-center justify-center h-12 rounded-xl text-xs font-bold transition-all
                  ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                  ${isSelected ? 'bg-brand-500 text-white' :
                    isToday ? 'ring-2 ring-brand-500 text-brand-600' : 'hover:bg-brand-50 text-gray-700'}
                `}
              >
                <span className={`text-[10px] mb-0.5 ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
                  {dayHeaders[new Date(dateStr).getDay()].slice(0, 2)}
                </span>
                <span>{Number(d)}</span>
                {dot && !isFuture && (
                  <span className={`absolute bottom-1.5 w-1 h-1 rounded-full ${dotColor(dateStr, isSelected)}`} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── DESKTOP: full month grid (hidden below md) ─────────── */}
      <div className="hidden md:block p-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft size={16} className="text-gray-500" />
          </button>
          <h3 className="font-bold text-gray-900 text-sm">
            {lang === 'hi' ? HI_MONTHS[month] : EN_MONTHS[month]} {year}
          </h3>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1">
          {dayHeaders.map((d, i) => (
            <div key={i} className={`text-center text-[10px] font-semibold py-1 ${i === 0 ? 'text-red-400' : 'text-gray-400'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const dateStr = toISO(year, month, day)
            const isToday = dateStr === todayStr
            const isSelected = dateStr === selectedDate
            const isFuture = dateStr > todayStr
            const dot = hasDot(dateStr)
            return (
              <button
                key={i}
                onClick={() => !isFuture && onSelectDate(dateStr)}
                disabled={isFuture}
                className={`
                  relative flex flex-col items-center justify-center h-9 rounded-lg text-xs font-semibold transition-all
                  ${isFuture ? 'opacity-25 cursor-not-allowed' : 'hover:bg-brand-50 cursor-pointer'}
                  ${isSelected
                    ? 'bg-brand-500 text-white shadow-sm'
                    : isToday
                    ? 'ring-2 ring-brand-500 ring-offset-1 text-brand-600 font-bold'
                    : 'text-gray-700'}
                `}
              >
                {day}
                {dot && !isFuture && (
                  <span className={`absolute bottom-1 w-1 h-1 rounded-full ${dotColor(dateStr, isSelected)}`} />
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full inline-block ${mode === 'quiz' ? 'bg-emerald-500' : 'bg-brand-400'}`} />
            {mode === 'quiz' ? t('क्विज़ उपलब्ध', 'Quiz available') : t('लेख उपलब्ध', 'Article available')}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <span className="w-2 h-2 rounded-full border-2 border-brand-500 inline-block" />
            {t('आज', 'Today')}
          </span>
        </div>
      </div>

      {/* Selected date label */}
      <div className="px-4 pb-3 pt-0 text-xs text-center font-medium text-brand-600">
        {formatHindiDate(selectedDate, lang)} {t('चुना गया', 'selected')}
      </div>
    </div>
  )
}
