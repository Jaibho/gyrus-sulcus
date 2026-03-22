'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { Microscope, Scale, BarChart3, Globe, Newspaper, Clock, ArrowRight } from 'lucide-react'

const subjects = [
  { key: 'science_tech', icon: Microscope, hi: 'विज्ञान एवं प्रौद्योगिकी', en: 'Science & Technology', questions: 5, color: 'border-blue-200 hover:border-blue-400' },
  { key: 'polity', icon: Scale, hi: 'भारतीय राजव्यवस्था', en: 'Indian Polity', questions: 5, color: 'border-amber-200 hover:border-amber-400' },
  { key: 'economy', icon: BarChart3, hi: 'अर्थव्यवस्था', en: 'Economy', questions: 5, color: 'border-emerald-200 hover:border-emerald-400' },
  { key: 'geography', icon: Globe, hi: 'भूगोल एवं पर्यावरण', en: 'Geography & Environment', questions: 5, color: 'border-purple-200 hover:border-purple-400' },
  { key: 'current_affairs', icon: Newspaper, hi: 'समसामयिकी', en: 'Current Affairs', questions: 5, color: 'border-rose-200 hover:border-rose-400' },
]

export default function TestsPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {t('सभी उपलब्ध टेस्ट', 'All Available Tests')}
      </h1>
      <p className="text-gray-500 mb-8">
        {t('हर विषय में 5 प्रश्न, 10 मिनट का समय', 'Each subject has 5 questions, 10 minutes time')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((sub) => (
          <Link
            key={sub.key}
            href={`/tests?subject=${sub.key}`}
            className={`flex items-center gap-4 p-5 bg-white rounded-xl border-2 ${sub.color} hover:shadow-lg transition-all group`}
          >
            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
              <sub.icon size={26} className="text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg">{t(sub.hi, sub.en)}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>{sub.questions} {t('प्रश्न', 'Questions')}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> 10 {t('मिनट', 'mins')}</span>
              </div>
            </div>
            <span className="text-brand-500 font-semibold text-sm flex items-center gap-1 shrink-0">
              {t('शुरू करें', 'Start')} <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
