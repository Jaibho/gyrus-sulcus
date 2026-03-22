'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { Flame, Bell, BookOpen, Clock, ArrowRight, Send } from 'lucide-react'

export default function RasEnglishPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Badge */}
      <div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-bold mb-6 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
      >
        <Flame size={16} />
        {t('जल्द आ रहा है', 'Coming Soon')}
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4 leading-tight">
        RAS{' '}
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, #f97316, #ef4444)' }}
        >
          English Medium
        </span>
      </h1>
      <p className="text-gray-500 text-lg text-center max-w-xl mb-10">
        {t(
          'RAS English Medium के लिए विशेष सामग्री तैयार की जा रही है — MCQs, नोट्स और विश्लेषण।',
          'Special content for RAS English Medium is being prepared — MCQs, notes and analysis.'
        )}
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
        {[
          { icon: BookOpen, hi: 'विशेष MCQs', en: 'Dedicated MCQs', descHi: 'RAS सिलेबस पर आधारित', descEn: 'Based on RAS syllabus', color: 'text-orange-500 bg-orange-50' },
          { icon: Clock, hi: 'टाइम्ड टेस्ट', en: 'Timed Tests', descHi: 'रियल एग्जाम पैटर्न', descEn: 'Real exam pattern', color: 'text-red-500 bg-red-50' },
          { icon: Bell, hi: 'अपडेट्स', en: 'Updates', descHi: 'Telegram पर सूचना', descEn: 'Notify on Telegram', color: 'text-amber-500 bg-amber-50' },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
            <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ${f.color}`}>
              <f.icon size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{t(f.hi, f.en)}</h3>
            <p className="text-xs text-gray-400">{t(f.descHi, f.descEn)}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="https://t.me/gyrussulcus7597647088"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
        >
          <Send size={18} />
          {t('Telegram पर अपडेट पाएं', 'Get Updates on Telegram')}
        </a>
        <Link
          href="/tests"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          {t('अभी टेस्ट दें', 'Take a Test Now')} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
