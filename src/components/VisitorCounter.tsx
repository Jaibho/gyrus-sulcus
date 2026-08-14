'use client'
import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

// Site visitor counter. Increments once per browser session (sessionStorage
// guard) and otherwise just reads the running total from /api/visits.
export default function VisitorCounter() {
  const { t } = useLanguage()
  const [visits, setVisits] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const counted = typeof window !== 'undefined' && sessionStorage.getItem('gs_visit_counted') === '1'
    const url = counted ? '/api/visits' : '/api/visits?hit=1'
    fetch(url)
      .then((r) => r.json())
      .then((d: { visits?: number | null }) => {
        if (cancelled) return
        if (typeof d.visits === 'number') setVisits(d.visits)
        if (!counted) sessionStorage.setItem('gs_visit_counted', '1')
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (visits == null) return null

  return (
    <div className="inline-flex items-center gap-2 text-sm text-gray-400">
      <Eye size={15} className="text-brand-400" />
      <span>
        {t('कुल विज़िटर', 'Total Visitors')}:{' '}
        <span className="font-semibold text-gray-200">{visits.toLocaleString('en-IN')}</span>
      </span>
    </div>
  )
}
