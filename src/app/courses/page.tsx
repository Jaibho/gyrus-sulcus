'use client'
import { useLanguage } from '@/lib/LanguageContext'
import { CheckCircle, Star, ExternalLink, BookOpen, Brain, PenTool } from 'lucide-react'

const courses = [
  {
    id: 1,
    titleHi: 'IPPON BATCH 2026 — IAS Prelims S&T',
    titleEn: 'IPPON BATCH 2026 — IAS Prelims S&T',
    descHi: 'UPSC Prelims के लिए विज्ञान एवं प्रौद्योगिकी का सम्पूर्ण कोर्स। PYQ analysis, daily MCQs, और current affairs integration के साथ।',
    descEn: 'Complete Science & Technology course for UPSC Prelims. With PYQ analysis, daily MCQs, and current affairs integration.',
    features: ['Live & Recorded Classes', 'Weekly Doubt Solving', 'Full Study Material PDF', 'Telegram Group Access', 'PYQ Pattern Analysis'],
    isBestseller: true,
    icon: Brain,
    gradient: 'from-blue-900 to-brand-700',
    link: 'https://t.me/gyrussulcus',
  },
  {
    id: 2,
    titleHi: 'LDC Science Special 2026',
    titleEn: 'LDC Science Special 2026',
    descHi: 'LDC परीक्षा के लिए विज्ञान का विशेष बैच। सरल भाषा में, परीक्षा-केंद्रित approach के साथ।',
    descEn: 'Special Science batch for LDC exam. In simple language, with exam-focused approach.',
    features: ['Live & Recorded Classes', 'Weekly Doubt Solving', 'Full Study Material PDF', 'Practice Tests', 'Bilingual Content'],
    isBestseller: false,
    icon: BookOpen,
    gradient: 'from-emerald-900 to-emerald-700',
    link: 'https://t.me/gyrussulcus',
  },
  {
    id: 3,
    titleHi: 'Mains Answer Writing Practice',
    titleEn: 'Mains Answer Writing Practice',
    descHi: 'UPSC Mains के लिए उत्तर लेखन अभ्यास। Daily feedback, model answers, और structured approach।',
    descEn: 'Answer writing practice for UPSC Mains. Daily feedback, model answers, and structured approach.',
    features: ['Live & Recorded Classes', 'Weekly Doubt Solving', 'Full Study Material PDF', 'Personal Feedback', 'Model Answers'],
    isBestseller: false,
    icon: PenTool,
    gradient: 'from-purple-900 to-purple-700',
    link: 'https://t.me/gyrussulcus',
  },
]

export default function CoursesPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {t('प्रीमियम कोर्स', 'Premium Courses')}
        </h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          {t(
            'UPSC और प्रतियोगी परीक्षाओं की तैयारी को fast-track करें। Structured, high-yield guidance के साथ।',
            'Fast-track your UPSC & competitive exam preparation with structured, high-yield guidance.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col">
            {/* Card Header */}
            <div className={`relative bg-gradient-to-br ${course.gradient} text-white p-6 pb-8`}>
              {course.isBestseller && (
                <span className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> BESTSELLER
                </span>
              )}
              <course.icon size={32} className="mb-3 opacity-80" />
              <h2 className="text-xl font-bold leading-snug">{t(course.titleHi, course.titleEn)}</h2>
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                {t(course.descHi, course.descEn)}
              </p>

              <div className="space-y-2.5 mb-6 flex-1">
                {course.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-green-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
              >
                {t('अभी जुड़ें', 'Join Now')} <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
