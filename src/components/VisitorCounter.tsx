'use client'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { Eye } from 'lucide-react'

export default function VisitorCounter() {
  const { t } = useLanguage()
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('https://api.counterapi.dev/v1/gyrussulcus/visitors/up', {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('API unavailable')
        const data = await res.json()
        setCount(data.count)
      } catch {
        // Fallback: per-browser localStorage counter
        const prev = parseInt(localStorage.getItem('gs_visit_count') || '125000', 10)
        const next = prev + 1
        localStorage.setItem('gs_visit_count', String(next))
        setCount(next)
      }
    }
    fetchCount()
  }, [])

  if (count === null) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-white/15 text-sm text-blue-100">
      <Eye size={14} className="opacity-70 shrink-0" />
      <span>
        {t('कुल विज़िटर', 'Total Visitors')}:{' '}
        <span className="font-bold text-white">{count.toLocaleString('en-IN')}</span>
      </span>
    </div>
  )
}
