'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { Accordion } from '@/components/Accordion'
import {
  Library, Landmark, Scale, BarChart3, Heart, BookOpen, ClipboardList, FileText, ArrowRight, Info,
} from 'lucide-react'

interface Bucket {
  id: string
  code: 'GS1' | 'GS2' | 'GS3' | 'GS4'
  icon: typeof Library
  color: string
  titleHi: string
  titleEn: string
  topicsHi: string[]
  topicsEn: string[]
  subject: string   // subject key used by /tests to pre-select the quiz
}

const BUCKETS: Bucket[] = [
  {
    id: 'gs1', code: 'GS1', icon: Landmark, color: 'from-amber-400 to-orange-500',
    titleHi: 'इतिहास, भूगोल एवं समाज',
    titleEn: 'History, Geography & Society',
    topicsHi: ['प्राचीन भारत', 'आधुनिक भारत', 'कला एवं संस्कृति', 'विश्व इतिहास', 'भारतीय समाज', 'भौतिक भूगोल', 'विश्व भूगोल'],
    topicsEn: ['Ancient India', 'Modern India', 'Art & Culture', 'World History', 'Indian Society', 'Physical Geography', 'World Geography'],
    subject: 'geography',
  },
  {
    id: 'gs2', code: 'GS2', icon: Scale, color: 'from-blue-500 to-indigo-600',
    titleHi: 'राजव्यवस्था, शासन एवं अंतर्राष्ट्रीय संबंध',
    titleEn: 'Polity, Governance & International Relations',
    topicsHi: ['संविधान', 'संसद एवं न्यायपालिका', 'संघवाद', 'शासन', 'सामाजिक न्याय', 'अंतर्राष्ट्रीय संगठन', 'भारत-पड़ोसी संबंध'],
    topicsEn: ['Constitution', 'Parliament & Judiciary', 'Federalism', 'Governance', 'Social Justice', 'International Organisations', 'India & Neighbours'],
    subject: 'polity',
  },
  {
    id: 'gs3', code: 'GS3', icon: BarChart3, color: 'from-emerald-500 to-teal-600',
    titleHi: 'अर्थव्यवस्था, विज्ञान-प्रौद्योगिकी एवं पर्यावरण',
    titleEn: 'Economy, Science-Tech & Environment',
    topicsHi: ['भारतीय अर्थव्यवस्था', 'बजट एवं कर', 'कृषि', 'विज्ञान एवं तकनीक', 'पर्यावरण एवं जलवायु', 'आंतरिक सुरक्षा', 'आपदा प्रबंधन'],
    topicsEn: ['Indian Economy', 'Budget & Taxation', 'Agriculture', 'Science & Technology', 'Environment & Climate', 'Internal Security', 'Disaster Management'],
    subject: 'economy',
  },
  {
    id: 'gs4', code: 'GS4', icon: Heart, color: 'from-rose-500 to-pink-600',
    titleHi: 'नैतिकता, सत्यनिष्ठा एवं अभिवृत्ति',
    titleEn: 'Ethics, Integrity & Aptitude',
    topicsHi: ['नीतिशास्त्र के सिद्धांत', 'भावनात्मक बुद्धिमत्ता', 'लोक प्रशासन में नैतिकता', 'केस स्टडी', 'विचारक एवं दार्शनिक'],
    topicsEn: ['Ethical Principles', 'Emotional Intelligence', 'Public Administration Ethics', 'Case Studies', 'Thinkers & Philosophers'],
    subject: 'current_affairs',
  },
]

export default function ResourceHubPage() {
  const { t, lang } = useLanguage()

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-3 uppercase tracking-wide">
          <Library size={13} /> {t('संसाधन केंद्र', 'Resource Hub')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          {t('UPSC सिलेबस द्वारा सब कुछ', 'Everything, organised by UPSC syllabus')}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
          {t(
            'GS1 से GS4 तक — हर विषय के लिए लेख, नोट्स, MCQs और वीडियो व्याख्यान एक ही जगह।',
            'GS1 through GS4 — articles, notes, MCQs and video lectures for every topic in one place.'
          )}
        </p>
      </div>

      {/* Syllabus intro accordion */}
      <div className="mb-10">
        <Accordion
          items={[
            {
              title: (
                <span className="flex items-center gap-2">
                  <Info size={16} className="text-indigo-500" />
                  {t('GS पेपर क्या होते हैं?', 'What are the GS papers?')}
                </span>
              ),
              body: t(
                'UPSC मुख्य परीक्षा में चार General Studies पेपर होते हैं — GS1 (इतिहास, भूगोल, समाज), GS2 (राजव्यवस्था, शासन), GS3 (अर्थव्यवस्था, तकनीक, पर्यावरण) और GS4 (नैतिकता)। यह पेज हर पेपर के लिए क्यूरेटेड सामग्री रखता है।',
                'The UPSC Mains exam has four General Studies papers — GS1 (History, Geography, Society), GS2 (Polity, Governance), GS3 (Economy, Tech, Environment) and GS4 (Ethics). This page curates material for each paper.'
              ),
            },
          ]}
        />
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {BUCKETS.map((b) => {
          const Icon = b.icon
          const topics = lang === 'en' ? b.topicsEn : b.topicsHi
          return (
            <section key={b.id} id={b.id} className="scroll-mt-20 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              {/* Header strip */}
              <div className={`bg-gradient-to-r ${b.color} p-5 text-white`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-90">{b.code}</p>
                      <h2 className="font-bold text-lg leading-tight">{t(b.titleHi, b.titleEn)}</h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide font-bold text-gray-400 mb-3">
                  {t('प्रमुख विषय', 'Key topics')}
                </p>
                <ul className="flex flex-wrap gap-2 mb-5">
                  {topics.map((topic, i) => (
                    <li key={i}>
                      <Link
                        href={`/articles?search=${encodeURIComponent(topic)}`}
                        className="inline-block px-3 py-1.5 rounded-full bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 text-xs text-gray-700 hover:text-indigo-700 transition-colors"
                      >
                        {topic}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Quick actions per bucket */}
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href={`/articles?search=${encodeURIComponent(b.code)}`}
                    className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                  >
                    <BookOpen size={16} />
                    <span className="text-[11px] font-semibold">{t('लेख', 'Articles')}</span>
                  </Link>
                  <Link
                    href={`/tests?subject=${b.subject}`}
                    className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  >
                    <ClipboardList size={16} />
                    <span className="text-[11px] font-semibold">{t('MCQs', 'MCQs')}</span>
                  </Link>
                  <Link
                    href="/notes"
                    className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                  >
                    <FileText size={16} />
                    <span className="text-[11px] font-semibold">{t('नोट्स', 'Notes')}</span>
                  </Link>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* CTA strip */}
      <div className="mt-10 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div>
          <h3 className="font-bold text-gray-900">
            {t('कोई विषय नहीं मिला?', "Can't find a topic?")}
          </h3>
          <p className="text-sm text-gray-600">
            {t('सर्च बार (⌘K) खोलें और कीवर्ड डालें।', 'Open the search bar (⌘K) and type a keyword.')}
          </p>
        </div>
        <Link
          href="/tests"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors text-sm"
        >
          {t('आज का टेस्ट', "Today's Test")} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
