'use client'
import { useLanguage } from '@/lib/LanguageContext'
import { CheckCircle, Star, ExternalLink, BookOpen, Brain, PenTool, Layers, Smartphone } from 'lucide-react'

// Live enrolment / prices are managed on the Gyrus Sulcus learning app.
// The website showcases the current batches and links out to the app, which is
// always the authoritative source for pricing and enrolment.
const APP_URL = 'https://gyrussulcus.akamai.net.in'
const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.mevwzv.obcdyi'

const courses = [
  {
    id: 1,
    titleHi: 'डेल्टा बैच — RAS/PCS प्री (विज्ञान-तकनीक)',
    titleEn: 'Delta Batch — RAS/PCS Pre (Sci-Tech)',
    descHi: 'RAS/PCS प्रीलिम्स के लिए सम्पूर्ण विज्ञान एवं प्रौद्योगिकी — दैनिक विज्ञान, मानव स्वास्थ्य, आनुवंशिकी, बायोटेक व नैनोटेक, रक्षा व अंतरिक्ष प्रौद्योगिकी, तथा पर्यावरण एवं पारिस्थितिकी।',
    descEn: 'Complete Science & Technology for RAS/PCS Prelims — everyday science, human health, genetics, biotech & nanotech, defence & space technology, and environment & ecology.',
    features: ['Prelims Sci-Tech', 'Bilingual medium', 'Recorded + Notes', 'Environment & Ecology'],
    price: '₹1,313', mrp: '', off: '', badge: 'NEW',
    icon: Brain, gradient: 'from-blue-900 to-brand-700', link: APP_URL,
  },
  {
    id: 2,
    titleHi: 'कॉम्बो बैच — RAS/PCS प्री + IPPON (मेन्स तकनीक)',
    titleEn: 'Combo Batch — RAS/PCS Pre + IPPON (Mains Tech)',
    descHi: 'डेल्टा बैच (प्रीलिम्स विज्ञान-तकनीक) की सम्पूर्ण सामग्री + IPPON बैच (मेन्स हेतु उन्नत प्रौद्योगिकी) — प्री + मेन्स का पूर्ण पैकेज।',
    descEn: 'Everything in the Delta Batch (Prelims Sci-Tech) plus the IPPON Batch (advanced Technology for Mains) — the complete Pre + Mains technology package.',
    features: ['Pre + Mains', 'Best value', 'Bilingual medium', 'Recorded + Notes'],
    price: '₹2,929', mrp: '₹3,434', off: '15% off', badge: 'BESTSELLER',
    icon: Layers, gradient: 'from-amber-800 to-orange-700', link: APP_URL,
  },
  {
    id: 3,
    titleHi: 'IPPON बैच — RAS प्री एवं मेन्स हेतु प्रौद्योगिकी',
    titleEn: 'IPPON Batch — Technology for RAS Pre & Mains',
    descHi: 'RAS प्री एवं मेन्स के लिए उन्नत स्तर की प्रौद्योगिकी (IAS/State PCS हेतु भी उपयोगी): नाभिकीय, अंतरिक्ष, रक्षा, बायोटेक, नैनोटेक, रोबोटिक्स आदि। द्विभाषी, 1 वर्ष वैधता।',
    descEn: 'Advanced-level Technology for RAS Prelims & Mains (also useful for IAS/State PCS): nuclear, space, defence, biotech, nanotech, robotics and more. Bilingual, 1-year validity.',
    features: ['Advanced Technology', 'Pre + Mains', 'Bilingual medium', '1-year validity'],
    price: '₹2,121', mrp: '', off: '', badge: 'NEW',
    icon: Brain, gradient: 'from-emerald-900 to-emerald-700', link: APP_URL,
  },
  {
    id: 4,
    titleHi: 'अल्फा बैच (पुराना रिकॉर्डेड) — State PCS प्रीलिम्स',
    titleEn: 'Alpha Batch (Old Recorded) — State PCS Prelims',
    descHi: 'State PCS प्रीलिम्स के लिए सामान्य विज्ञान + प्रौद्योगिकी की बुनियादी बातें: भौतिकी, रसायन, जीव विज्ञान, अंतरिक्ष व रक्षा तकनीक, बायोटेक, नैनोटेक, पर्यावरण व पारिस्थितिकी, रोबोटिक्स।',
    descEn: 'General Science + Technology basics for State PCS Prelims: Physics, Chemistry, Biology, space & defence technology, biotech, nanotech, environment & ecology, and robotics.',
    features: ['Foundation basics', 'Bilingual medium', 'Recorded', 'State PCS focused'],
    price: '₹1,212', mrp: '₹1,515', off: '20% off', badge: '',
    icon: PenTool, gradient: 'from-purple-900 to-purple-700', link: APP_URL,
  },
]

export default function CoursesPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {t('प्रीमियम कोर्स', 'Premium Courses')}
        </h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          {t(
            'UPSC, RAS और State PCS की तैयारी को fast-track करें। नामांकन और नवीनतम मूल्य हमारे लर्निंग ऐप पर उपलब्ध हैं।',
            'Fast-track your UPSC, RAS & State PCS preparation. Enrolment and the latest prices are on our learning app.'
          )}
        </p>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors shadow-lg"
        >
          {t('ऐप पर सभी कोर्स देखें', 'Browse all courses on our app')} <ExternalLink size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col">
            <div className={`relative bg-gradient-to-br ${course.gradient} text-white p-6 pb-8`}>
              {course.badge && (
                <span className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  {course.badge === 'BESTSELLER' && <Star size={11} fill="currentColor" />} {course.badge}
                </span>
              )}
              <course.icon size={30} className="mb-3 opacity-80" />
              <h2 className="text-lg font-bold leading-snug">{t(course.titleHi, course.titleEn)}</h2>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                {t(course.descHi, course.descEn)}
              </p>

              <div className="space-y-2 mb-5 flex-1">
                {course.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={15} className="text-green-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-end gap-2 mb-4">
                <span className="text-2xl font-extrabold text-gray-900">{course.price}</span>
                {course.mrp && <span className="text-sm text-gray-400 line-through mb-0.5">{course.mrp}</span>}
                {course.off && <span className="text-xs font-bold text-green-600 mb-1">{course.off}</span>}
              </div>

              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
              >
                {t('विवरण देखें / नामांकन', 'View Details / Enroll')} <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Get the app */}
      <div className="mt-12 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 text-center">
        <Smartphone size={30} className="mx-auto mb-3 opacity-90" />
        <h3 className="text-xl font-bold">{t('Gyrus Sulcus लर्निंग ऐप डाउनलोड करें', 'Get the Gyrus Sulcus Learning App')}</h3>
        <p className="text-gray-300 text-sm mt-2 max-w-xl mx-auto">
          {t('लाइव व रिकॉर्डेड क्लासेस, नोट्स और नामांकन — सब एक ऐप में।', 'Live & recorded classes, notes and enrolment — all in one app.')}
        </p>
        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
            {t('Play Store से पाएं', 'Get it on Play Store')} <ExternalLink size={16} />
          </a>
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
            {t('वेब पर खोलें', 'Open on Web')} <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        {t('मूल्य और उपलब्धता ऐप पर दर्शाए अनुसार; कुछ बैच के लिए रिफ़ंड लागू नहीं।', 'Prices and availability as shown on the app; some batches are non-refundable.')}
      </p>
    </div>
  )
}
