'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

const HINDI_DAYS = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि']
const EN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HINDI_MONTHS = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्तूबर', 'नवंबर', 'दिसंबर',
]
const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function isWeekday(date: Date) {
  const d = date.getDay()
  return d >= 1 && d <= 5
}

function isArticleDay(date: Date) {
  const d = date.getDay()
  return d === 1 || d === 3 || d === 5
}

interface DailyCalendarProps {
  mode?: 'quiz' | 'article'
}

export default function DailyCalendar({ mode = 'quiz' }: DailyCalendarProps) {
  const { lang, t } = useLanguage()

  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(todayDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const isCurrentMonth =
    viewYear === todayDate.getFullYear() && viewMonth === todayDate.getMonth()

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
    setSelectedDate(null)
  }

  function nextMonth() {
    if (isCurrentMonth) return
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
    setSelectedDate(null)
  }

  function handleDayClick(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0, 0, 0, 0)
    if (d > todayDate) return
    setSelectedDate(d)
  }

  const dayNames = lang === 'hi' ? HINDI_DAYS : EN_DAYS
  const monthName =
    lang === 'hi' ? HINDI_MONTHS[viewMonth] : EN_MONTHS[viewMonth]

  const cells: (number | null)[] = Array(firstDayOfMonth).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  function getMsg(date: Date) {
    const available = mode === 'quiz' ? isWeekday(date) : isArticleDay(date)
    if (mode === 'quiz') {
      return available
        ? t('इस दिन का क्विज़ उपलब्ध है ✅', 'Quiz available for this day ✅')
        : t('इस दिन कोई क्विज़ उपलब्ध नहीं', 'No quiz available for this day')
    }
    return available
      ? t('इस दिन का लेख उपलब्ध है ✅', 'Article available for this day ✅')
      : t('इस दिन कोई लेख उपलब्ध नहीं', 'No article available for this day')
  }

  // Current week for mobile strip
  const weekStart = new Date(todayDate)
  weekStart.setDate(todayDate.getDate() - todayDate.getDay())
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    d.setHours(0, 0, 0, 0)
    return d
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-bold text-gray-800 text-base">
          {monthName} {viewYear}
        </h3>
        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Desktop: full month grid */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-7 mb-1">
          {dayNames.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />
            const cellDate = new Date(viewYear, viewMonth, day)
            cellDate.setHours(0, 0, 0, 0)
            const isToday = cellDate.getTime() === todayDate.getTime()
            const isFuture = cellDate > todayDate
            const isSelected =
              selectedDate !== null &&
              selectedDate.getTime() === cellDate.getTime()
            const hasQuiz = isWeekday(cellDate)
            const hasArticle = isArticleDay(cellDate)

            let cls =
              'relative flex flex-col items-center justify-center aspect-square rounded-xl text-sm font-medium transition-all '
            if (isToday) cls += 'bg-blue-500 text-white font-bold shadow-md '
            else if (isSelected) cls += 'bg-blue-50 border-2 border-blue-400 text-blue-700 '
            else cls += 'hover:bg-gray-50 text-gray-700 '
            if (isFuture) cls += 'opacity-30 cursor-not-allowed'
            else cls += 'cursor-pointer'

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleDayClick(day)}
                disabled={isFuture}
                className={cls}
              >
                {day}
                {!isFuture && (
                  <div className="flex gap-0.5 mt-0.5">
                    {hasQuiz && (
                      <span className="w-1 h-1 rounded-full bg-emerald-400 block" />
                    )}
                    {hasArticle && (
                      <span className="w-1 h-1 rounded-full bg-blue-300 block" />
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile: horizontal week strip */}
      <div className="sm:hidden overflow-x-auto -mx-1">
        <div className="flex gap-2 px-1 pb-1">
          {weekDates.map((d, i) => {
            const isToday = d.getTime() === todayDate.getTime()
            const isFuture = d > todayDate
            const isSelected =
              selectedDate !== null && selectedDate.getTime() === d.getTime()
            const hasQuiz = isWeekday(d)
            const hasArticle = isArticleDay(d)

            let cls =
              'flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[52px] transition-all '
            if (isToday) cls += 'bg-blue-500 text-white font-bold shadow '
            else if (isSelected) cls += 'bg-blue-50 border-2 border-blue-400 text-blue-700 '
            else cls += 'bg-gray-50 text-gray-700 '
            if (isFuture) cls += 'opacity-30 cursor-not-allowed'

            return (
              <button
                key={`week-${i}`}
                onClick={() => {
                  if (!isFuture) setSelectedDate(d)
                }}
                disabled={isFuture}
                className={cls}
              >
                <span className="text-xs">{dayNames[d.getDay()]}</span>
                <span className="text-sm font-bold">{d.getDate()}</span>
                {!isFuture && (
                  <div className="flex gap-0.5">
                    {hasQuiz && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block" />
                    )}
                    {hasArticle && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-300 block" />
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected date message */}
      {selectedDate && (
        <div
          className={
            'mt-4 px-4 py-2.5 rounded-xl text-sm font-medium ' +
            ((mode === 'quiz'
              ? isWeekday(selectedDate)
              : isArticleDay(selectedDate))
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-gray-50 text-gray-500 border border-gray-200')
          }
        >
          {getMsg(selectedDate)}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          {t('क्विज़ उपलब्ध', 'Quiz available')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
          {t('लेख उपलब्ध', 'Article available')}
        </span>
      </div>
    </div>
  )
}
