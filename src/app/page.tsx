'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Dancing_Script } from 'next/font/google'
import { useLanguage } from '@/lib/LanguageContext'
import {
  Microscope, Scale, BarChart3, Globe, Newspaper,
  CheckCircle, Languages, Smartphone, FileDown, ArrowRight,
  Play, Flame, Radio, Phone, Users, MessageCircle, BookOpen, FileText, Clock,
  ShoppingCart, Pen, BookMarked, Archive, Tag, GraduationCap
} from 'lucide-react'

function getSecondsUntil8AM() {
  const now = new Date()
  const next8AM = new Date()
  next8AM.setHours(8, 0, 0, 0)
  if (now >= next8AM) next8AM.setDate(next8AM.getDate() + 1)
  return Math.floor((next8AM.getTime() - now.getTime()) / 1000)
}

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['700'] })
const subjects = [
  { key: 'science_tech', icon: Microscope, hi: 'विज्ञान एवं प्रौद्योगिकी', en: 'Science & Technology', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { key: 'polity', icon: Scale, hi: 'भारतीय राजव्यवस्था', en: 'Indian Polity', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { key: 'economy', icon: BarChart3, hi: 'अर्थव्यवस्था', en: 'Economy', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { key: 'geography', icon: Globe, hi: 'भूगोल एवं पर्यावरण', en: 'Geography & Environment', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { key: 'current_affairs', icon: Newspaper, hi: 'समसामयिकी', en: 'Current Affairs', color: 'bg-rose-50 text-rose-600 border-rose-200' },
]

const youtubeVideos = [
  {
    id: 'jAiba2Di260',
    titleHi: 'Critical Thinking — सबसे लोकप्रिय',
    titleEn: 'Critical Thinking — Most Popular',
    views: '1.4M+ views',
    icon: Flame,
    badge: 'Most Popular',
    badgeColor: 'bg-red-500',
  },
  {
    id: 'X8qBR8u5178',
    titleHi: 'MASTER CLASS — Science & Technology',
    titleEn: 'MASTER CLASS — Science & Technology',
    views: '100K+ views',
    icon: Radio,
    badge: 'Live Class',
    badgeColor: 'bg-purple-500',
  },
  {
    id: 'AaVBjzPR9Jk',
    titleHi: 'Why NATO is Silent on Iran?',
    titleEn: 'Why NATO is Silent on Iran?',
    views: '42K+ views',
    icon: Play,
    badge: 'Latest',
    badgeColor: 'bg-brand-500',
  },
]

const features = [
  { icon: CheckCircle, hi: 'गुणवत्तापूर्ण MCQs', en: 'Quality MCQs', descHi: 'रोज़ 100+ नए, परीक्षा-केंद्रित प्रश्न जो आपको वास्तविक परीक्षा के लिए तैयार करते हैं।', descEn: 'Daily 100+ new, exam-focused questions that prepare you for the real exam.' },
  { icon: Languages, hi: 'द्विभाषी सामग्री', en: 'Bilingual Content', descHi: 'हिंदी और English दोनों माध्यमों में उत्कृष्ट गुणवत्ता वाली अध्ययन सामग्री उपलब्ध।', descEn: 'High quality study material available in both Hindi and English.' },
  { icon: Smartphone, hi: 'सभी डिवाइस पर अनुकूल', en: 'All Device Friendly', descHi: 'फ़ोन, टैबलेट या लैपटॉप — कहीं भी और कभी भी अध्ययन करें बिना किसी रुकावट के।', descEn: 'Phone, tablet or laptop — study anywhere, anytime without interruption.' },
  { icon: FileDown, hi: 'PDF नोट्स डाउनलोड', en: 'PDF Notes Download', descHi: 'हस्तलिखित नोट्स और संकलन PDF में डाउनलोड करें — ऑफ़लाइन पढ़ाई के लिए।', descEn: 'Download handwritten notes and compilations in PDF — for offline study.' },
]

const studyItems = [
  { icon: Pen,         emoji: '✍️', hi: 'हस्तलिखित नोट्स',           en: 'Handwritten Notes',          price: '₹199', descHi: 'टॉपर्स की शैली में',        descEn: 'Topper-style notes' },
  { icon: BookOpen,    emoji: '📗', hi: 'किताबें',                     en: 'Books',                      price: '₹349', descHi: 'Dharmendra Sir द्वारा',     descEn: 'By Dharmendra Sir' },
  { icon: BookMarked,  emoji: '📒', hi: 'बुकलेट्स',                    en: 'Booklets',                   price: '₹99',  descHi: 'विषय-केंद्रित संकलन',       descEn: 'Topic-focused digests' },
  { icon: Archive,     emoji: '📁', hi: 'PYQ संकलन',                   en: 'PYQ Compilations',           price: '₹249', descHi: '2025 तक के प्रश्न',         descEn: 'Questions up to 2025' },
]
const merchItems = [
  { emoji: '🧢', hi: 'टोपी (Cap)',        en: 'Cap',          price: '₹299', descHi: 'Gyrus Sulcus लोगो के साथ',   descEn: 'With Gyrus Sulcus logo' },
  { emoji: '👕', hi: 'टी-शर्ट',           en: 'T-Shirt',      price: '₹499', descHi: 'प्रेरक उद्धरण के साथ',       descEn: 'With motivational quote' },
  { emoji: '☂️', hi: 'छाता',              en: 'Umbrella',     price: '₹599', descHi: 'हर मौसम के लिए',             descEn: 'For every season' },
  { emoji: '🖼️', hi: 'पोस्टर',            en: 'Poster',       price: '₹149', descHi: 'प्रेरक A3 पोस्टर',           descEn: 'Motivational A3 poster' },
  { emoji: '☕', hi: 'कॉफी मग',           en: 'Coffee Mug',   price: '₹249', descHi: '"I know that I don\'t know"', descEn: '"I know that I don\'t know"' },
]

const stats = [
  { icon: Users, num: '13L+', hi: 'YouTube Subscribers', en: 'YouTube Subscribers' },
  { icon: MessageCircle, num: '14K+', hi: 'Telegram Members', en: 'Telegram Members' },
  { icon: BookOpen, num: '1000+', hi: 'दैनिक MCQs', en: 'Daily MCQs' },
  { icon: FileText, num: '500+', hi: 'लेख', en: 'Articles' },
]

export default function HomePage() {
  const { t } = useLanguage()
  const [countdown, setCountdown] = useState(getSecondsUntil8AM())

  useEffect(() => {
    const id = setInterval(() => setCountdown(getSecondsUntil8AM()), 1000)
    return () => clearInterval(id)
  }, [])

  const ch = Math.floor(countdown / 3600).toString().padStart(2, '0')
  const cm = Math.floor((countdown % 3600) / 60).toString().padStart(2, '0')
  const cs = (countdown % 60).toString().padStart(2, '0')

  return (
    <>
      {/* Hero Section */}
      <section className="overflow-hidden">
        <div className="relative w-full">
          <Image
            src="/banner.jpg"
            alt="Gyrus Sulcus — I know that I don't know"
            width={1200}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
          {/* Handwritten signature overlay */}
          <div
            className={`${dancingScript.className} absolute`}
            style={{
              bottom: '9%',
              right: '5%',
              fontSize: 'clamp(22px, 3vw, 36px)',
              color: 'rgba(255, 235, 180, 0.92)',
              textShadow: '0 1px 6px rgba(0,0,0,0.45)',
              lineHeight: 1,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            — Dharmendra
          </div>
        </div>
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 py-5">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/tests" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
              {t('आज का टेस्ट दें', 'Take Today\'s Test')} <ArrowRight size={18} />
            </Link>
            <Link href="/articles" className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              {t('लेख पढ़ें', 'Read Articles')}
            </Link>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-4xl mx-auto text-center px-4 py-10">
        <p className="text-gray-600 text-lg leading-relaxed">
          {t(
            'UPSC, IAS, RAS और State PCS की तैयारी के लिए आपका दैनिक साथी। गुणवत्तापूर्ण MCQs और लेखों के साथ निरंतरता बनाएं।',
            'Your daily companion for UPSC, IAS, RAS and State PCS preparation. Build consistency with quality MCQs and articles.'
          )}
        </p>
      </section>

      {/* Today's Tests */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        {/* Daily quiz hook */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          <span className="text-lg">🔥</span>
          <div className="flex-1">
            <span className="font-bold text-amber-800 text-sm">{t('हर दिन नया क्विज़!', 'New Quiz Every Day!')}</span>
            <span className="text-amber-600 text-xs ml-2">{t('अगला क्विज़:', 'Next quiz:')} <span className="font-mono font-semibold">{ch}:{cm}:{cs}</span></span>
          </div>
          <Clock size={16} className="text-amber-500 shrink-0" />
        </div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('आज के टेस्ट', 'Today\'s Tests')}</h2>
          <Link href="/tests" className="text-brand-500 font-medium text-sm flex items-center gap-1 hover:underline">
            {t('सभी देखें', 'View All')} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <Link key={sub.key} href={`/tests?subject=${sub.key}`} className="flex items-center gap-4 p-4 rounded-xl border bg-white hover:shadow-md transition-all group">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${sub.color}`}><sub.icon size={22} /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{t(sub.hi, sub.en)}</h3>
                <p className="text-sm text-gray-500">{t('5 प्रश्न', '5 Questions')}</p>
              </div>
              <span className="text-brand-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                {t('शुरू करें', 'Start')} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-800 py-12 mb-0">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-8">{t('13 लाख+ छात्रों का भरोसा', '13 Lakh+ Students Trust Us')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 mx-auto bg-white/15 rounded-xl flex items-center justify-center mb-3">
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="text-3xl font-extrabold text-white mb-1">{stat.num}</div>
                <div className="text-blue-200 text-sm">{t(stat.hi, stat.en)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('YouTube से चुनिंदा वीडियो', 'Featured Videos from YouTube')}</h2>
          <a href="https://www.youtube.com/@gyrussulcus1908" target="_blank" rel="noopener noreferrer" className="text-red-500 font-medium text-sm flex items-center gap-1 hover:underline">
            {t('चैनल देखें', 'Visit Channel')} <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {youtubeVideos.map((video) => (
            <a key={video.id} href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative aspect-video bg-gray-900">
                <img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} alt={video.titleEn} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={24} className="text-white ml-1" fill="white" />
                  </div>
                </div>
                <span className={`absolute top-3 left-3 ${video.badgeColor} text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1`}>
                  <video.icon size={12} /> {video.badge}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 leading-snug group-hover:text-brand-500 transition-colors">{t(video.titleHi, video.titleEn)}</h3>
                <p className="text-sm text-gray-500 mt-1">{video.views}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ===== GYRUS SULCUS STORE ===== */}
      <section style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 40%, #fde68a 70%, #fed7aa 100%)' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              <ShoppingCart size={13} /> {t('नया', 'New')}
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              🛒 {t('Gyrus Sulcus स्टोर', 'Gyrus Sulcus Store')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm">
              {t('अध्ययन सामग्री और मर्चेंडाइज़ — सीधे Dharmendra Sir से', 'Study material & merchandise — directly from Dharmendra Sir')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Study Material */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t('📚 अध्ययन सामग्री', '📚 Study Material')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {studyItems.map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100 hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col gap-2">
                    <div className="text-3xl">{item.emoji}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{t(item.hi, item.en)}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{t(item.descHi, item.descEn)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-brand-600 font-extrabold text-base">{item.price}</span>
                      <a href="#" className="text-xs font-semibold bg-brand-500 text-white px-3 py-1.5 rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-1">
                        <Tag size={11} /> {t('खरीदें', 'Buy Now')}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Merchandise */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t('🎁 मर्चेंडाइज़', '🎁 Merchandise')}</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {merchItems.map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-2">
                    <div className="text-3xl">{item.emoji}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{t(item.hi, item.en)}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{t(item.descHi, item.descEn)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-amber-600 font-extrabold text-base">{item.price}</span>
                      <a href="#" className="text-xs font-semibold bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1">
                        <Tag size={11} /> {t('खरीदें', 'Buy')}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link href="/store" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors shadow-lg text-sm">
              <ShoppingCart size={18} />
              {t('पूरा स्टोर देखें', 'View Full Store')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp Contact Bar */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Phone size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{t('WhatsApp पर संपर्क करें', 'Contact on WhatsApp')}</h3>
              <p className="text-sm text-gray-600">{t('किसी भी प्रश्न के लिए सीधे WhatsApp करें', 'WhatsApp us directly for any questions')}</p>
            </div>
          </div>
          <a href="https://wa.me/917597647088" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-sm">
            <Phone size={18} /> 7597647088
          </a>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">{t('क्यों चुनें Gyrus Sulcus?', 'Why Choose Gyrus Sulcus?')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-14 h-14 mx-auto bg-brand-500 rounded-xl flex items-center justify-center mb-4"><f.icon size={26} /></div>
                <h3 className="font-bold text-lg mb-2">{t(f.hi, f.en)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t(f.descHi, f.descEn)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
