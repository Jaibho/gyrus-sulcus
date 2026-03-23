'use client'
import { useState } from 'react'

const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function isWeekday(date: Date) {
  const d = date.getDay()
  return d >= 1 && d <= 5
}

export default function DailyCalendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelected(null); setMessage('')
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null); setMessage('')
  }

  function handleDay(day: number) {
    setSelected(day)
    const d = new Date(year, month, day)
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    if (isToday) {
      setMessage('Quiz available today! Click any subject to begin.')
    } else if (isWeekday(d)) {
      setMessage(`Quiz available for ${MONTHS_EN[month]} ${day}.`)
    } else {
      setMessage('No quiz on weekends.')
    }
  }

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="bg-white border border-emerald-200 rounded-xl p-4 max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100 text-gray-600">&#8249;</button>
        <span className="font-semibold text-gray-800 text-sm">
          {MONTHS_EN[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 text-gray-600">&#8250;</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_EN.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const d = new Date(year, month, day)
          const weekday = isWeekday(d)
          const isSelected = selected === day

          return (
            <button
              key={i}
              onClick={() => handleDay(day)}
              className={`relative flex flex-col items-center justify-center rounded-lg py-1 text-sm font-medium transition-colors
                ${isToday ? 'bg-blue-500 text-white' : isSelected ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              {day}
              {!isToday && (
                <span className={`w-1 h-1 rounded-full mt-0.5 ${weekday ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              )}
            </button>
          )
        })}
      </div>

      {message && (
        <p className="mt-3 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          {message}
        </p>
      )}
    </div>
  )
}
