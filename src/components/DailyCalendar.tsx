'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Monday → Friday maps to one subject per day
const WEEKDAY_SUBJECT: Record<number, { key: string; label: string; color: string }> = {
  1: { key: 'science_tech',    label: 'Science & Tech',   color: 'bg-blue-500'    },
  2: { key: 'polity',          label: 'Polity',           color: 'bg-amber-500'   },
  3: { key: 'economy',         label: 'Economy',          color: 'bg-emerald-500' },
  4: { key: 'geography',       label: 'Geography',        color: 'bg-purple-500'  },
  5: { key: 'current_affairs', label: 'Current Affairs',  color: 'bg-rose-500'    },
}

export default function DailyCalendar() {
  const today = new Date()
  const todayY = today.getFullYear()
  const todayM = today.getMonth()
  const todayD = today.getDate()

  const [year, setYear] = useState(todayY)
  const [month, setMonth] = useState(todayM)
  const [selected, setSelected] = useState<number | null>(todayD)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelected(null)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  // Details for the currently selected cell
  const selDate = selected != null ? new Date(year, month, selected) : null
  const selDayOfWeek = selDate ? selDate.getDay() : null
  const selSubject = selDayOfWeek != null ? WEEKDAY_SUBJECT[selDayOfWeek] : undefined
  const selTodayStamp = new Date(todayY, todayM, todayD).getTime()
  const selStamp = selDate ? new Date(year, month, selected!).getTime() : null
  const isFuture = selStamp != null && selStamp > selTodayStamp
  const isToday = selStamp != null && selStamp === selTodayStamp

  return (
    <div className="bg-white border border-emerald-200 rounded-xl p-4 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 px-2 rounded hover:bg-gray-100 text-gray-600 text-lg leading-none" aria-label="Previous month">&#8249;</button>
        <span className="font-semibold text-gray-800 text-sm">
          {MONTHS[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-1 px-2 rounded hover:bg-gray-100 text-gray-600 text-lg leading-none" aria-label="Next month">&#8250;</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] sm:text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const d = new Date(year, month, day)
          const dow = d.getDay()
          const isWeekday = dow >= 1 && dow <= 5
          const cellToday = day === todayD && month === todayM && year === todayY
          const cellStamp = d.getTime()
          const cellPast = cellStamp < selTodayStamp
          const cellFuture = cellStamp > selTodayStamp
          const isSel = selected === day

          const base = 'relative flex flex-col items-center justify-center rounded-lg py-1 text-xs sm:text-sm font-medium transition-colors aspect-square'
          let cls = 'text-gray-700 hover:bg-gray-100'
          if (cellToday) cls = 'bg-blue-500 text-white hover:bg-blue-600'
          else if (isSel) cls = 'bg-emerald-100 text-emerald-800'
          else if (!isWeekday) cls = 'text-gray-300'
          else if (cellFuture) cls = 'text-gray-400'

          return (
            <button
              key={i}
              onClick={() => setSelected(day)}
              className={`${base} ${cls}`}
              aria-label={`${MONTHS[month]} ${day}`}
            >
              {day}
              {isWeekday && !cellToday && (
                <span className={`w-1 h-1 rounded-full mt-0.5 ${cellPast ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected-day action panel */}
      {selDate && (
        <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-xs text-gray-500 mb-2">
            {DAYS[selDayOfWeek!]}, {MONTHS[month]} {selected}, {year}
          </p>

          {selSubject && !isFuture ? (
            <Link
              href={isToday
                ? `/tests?subject=${selSubject.key}`
                : `/tests?subject=${selSubject.key}&date=${year}-${String(month + 1).padStart(2, '0')}-${String(selected).padStart(2, '0')}`}
              className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-white ${selSubject.color} hover:opacity-95 transition-opacity`}
            >
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] uppercase tracking-wide opacity-90">
                  {isToday ? "Today's Quiz" : 'Archived Quiz'}
                </span>
                <span className="font-semibold text-sm truncate">{selSubject.label}</span>
              </div>
              <ArrowRight size={16} className="shrink-0" />
            </Link>
          ) : selSubject && isFuture ? (
            <div className="rounded-lg px-3 py-2.5 bg-white border border-dashed border-gray-200 text-gray-500 text-xs">
              <span className="font-semibold text-gray-700">{selSubject.label}</span> — quiz unlocks on this day.
            </div>
          ) : (
            <div className="rounded-lg px-3 py-2.5 bg-white border border-gray-100 text-gray-500 text-xs">
              No quiz on weekends. Pick a Mon–Fri date.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
