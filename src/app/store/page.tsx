'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import {
  ShoppingCart, Tag, GraduationCap, ArrowRight,
  Pen, BookOpen, BookMarked, Archive, Star, Phone, Truck, Shield, RefreshCw
} from 'lucide-react'

const studyItems = [
  {
    icon: Pen, emoji: '✍️',
    hi: 'हस्तलिखित नोट्स', en: 'Handwritten Notes',
    descHi: 'Dharmendra Sir के हाथ से लिखे, परीक्षा-केंद्रित नोट्स। UPSC, RAS, LDC सभी के लिए।',
    descEn: 'Handcrafted by Dharmendra Sir — exam-focused notes for UPSC, RAS, LDC and more.',
    price: '₹199', mrp: '₹299', badge: 'Bestseller', badgeColor: 'bg-brand-500',
    rating: 4.9, reviews: 1240,
  },
  {
    icon: BookOpen, emoji: '📗',
    hi: 'Science & Technology (किताब)', en: 'Science & Technology (Book)',
    descHi: 'Dharmendra Sir द्वारा लिखित। UPSC और RAS के लिए सर्वाधिक बिकने वाली किताब।',
    descEn: 'Written by Dharmendra Sir. Best-selling book for UPSC and RAS preparation.',
    price: '₹349', mrp: '₹499', badge: 'Our Book', badgeColor: 'bg-emerald-500',
    rating: 4.8, reviews: 875,
  },
  {
    icon: BookMarked, emoji: '📒',
    hi: 'करंट अफेयर्स बुकलेट', en: 'Current Affairs Booklet',
    descHi: 'हर महीने नया संस्करण। मुख्य घटनाओं का सारांश, MCQs के साथ।',
    descEn: 'New edition every month. Summary of key events with MCQs.',
    price: '₹99', mrp: '₹149', badge: 'Monthly', badgeColor: 'bg-purple-500',
    rating: 4.7, reviews: 560,
  },
  {
    icon: Archive, emoji: '📁',
    hi: 'PYQ संकलन 2025', en: 'PYQ Compilation 2025',
    descHi: '2015–2025 के पिछले वर्षों के प्रश्न, विस्तृत उत्तर सहित।',
    descEn: 'Previous year questions 2015–2025 with detailed solutions.',
    price: '₹249', mrp: '₹399', badge: 'Updated', badgeColor: 'bg-rose-500',
    rating: 4.9, reviews: 920,
  },
  {
    icon: Pen, emoji: '🗺️',
    hi: 'भूगोल नोट्स', en: 'Geography Notes',
    descHi: 'नक्शों और चित्रों सहित, हस्तलिखित भूगोल नोट्स।',
    descEn: 'Handwritten geography notes with maps and diagrams.',
    price: '₹179', mrp: '₹249', badge: null, badgeColor: '',
    rating: 4.6, reviews: 340,
  },
  {
    icon: BookMarked, emoji: '⚖️',
    hi: 'राजव्यवस्था बुकलेट', en: 'Polity Booklet',
    descHi: 'संविधान और राजनीतिक व्यवस्था पर संक्षिप्त और परीक्षा-केंद्रित नोट्स।',
    descEn: 'Concise exam-focused notes on Constitution and political system.',
    price: '₹99', mrp: '₹149', badge: null, badgeColor: '',
    rating: 4.7, reviews: 415,
  },
]

const merchItems = [
  {
    emoji: '🧢',
    hi: 'Gyrus Sulcus Cap', en: 'Gyrus Sulcus Cap',
    descHi: 'लोगो के साथ प्रीमियम क्वालिटी कैप। एक Size सभी के लिए।',
    descEn: 'Premium quality cap with logo. One size fits all.',
    price: '₹299', mrp: '₹399', badge: 'Limited', badgeColor: 'bg-amber-500',
    rating: 4.8, reviews: 210,
  },
  {
    emoji: '👕',
    hi: 'Gyrus Sulcus T-Shirt', en: 'Gyrus Sulcus T-Shirt',
    descHi: '"I know that I don\'t know" — प्रेरक उद्धरण के साथ 100% कॉटन टी-शर्ट।',
    descEn: '"I know that I don\'t know" — 100% cotton tee with motivational quote.',
    price: '₹499', mrp: '₹699', badge: 'Popular', badgeColor: 'bg-rose-500',
    rating: 4.9, reviews: 387,
  },
  {
    emoji: '☂️',
    hi: 'Gyrus Sulcus छाता', en: 'Gyrus Sulcus Umbrella',
    descHi: 'बड़े आकार का, गुणवत्तापूर्ण छाता — गर्मी और बरसात दोनों के लिए।',
    descEn: 'Large, quality umbrella — for both summer and rain.',
    price: '₹599', mrp: '₹799', badge: null, badgeColor: '',
    rating: 4.5, reviews: 128,
  },
  {
    emoji: '🖼️',
    hi: 'प्रेरक पोस्टर (A3)', en: 'Motivational Poster (A3)',
    descHi: 'पढ़ाई की मेज के लिए — "Knowledge begins with curiosity" A3 पोस्टर।',
    descEn: 'For your study desk — "Knowledge begins with curiosity" A3 poster.',
    price: '₹149', mrp: '₹199', badge: null, badgeColor: '',
    rating: 4.6, reviews: 94,
  },
  {
    emoji: '☕',
    hi: 'Gyrus Sulcus कॉफी मग', en: 'Gyrus Sulcus Coffee Mug',
    descHi: '350ml सिरेमिक मग — "I know that I don\'t know" के साथ।',
    descEn: '350ml ceramic mug — with "I know that I don\'t know".',
    price: '₹249', mrp: '₹349', badge: 'Gift', badgeColor: 'bg-teal-500',
    rating: 4.8, reviews: 173,
  },
  {
    emoji: '🎒',
    hi: 'स्टडी किट (कॉम्बो)', en: 'Study Kit (Combo)',
    descHi: 'नोट्स + बुकलेट + PYQ + मग — सब एक साथ बड़ी छूट पर।',
    descEn: 'Notes + Booklet + PYQ + Mug — all together at a big discount.',
    price: '₹699', mrp: '₹1099', badge: 'Best Value', badgeColor: 'bg-brand-500',
    rating: 5.0, reviews: 56,
  },
]

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= Math.round(n) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </span>
  )
}

export default function StorePage() {
  const { t } = useLanguage()
  const [tab, setTab] = useState<'study' | 'merch'>('study')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0033CC 50%, #1d4ed8 100%)' }} className="py-14 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            <ShoppingCart size={12} /> {t('आधिकारिक स्टोर', 'Official Store')}
          </div>
          <h1 className="text-4xl font-extrabold mb-3">🛒 Gyrus Sulcus {t('स्टोर', 'Store')}</h1>
          <p className="text-blue-200 text-base max-w-xl mx-auto">
            {t('Dharmendra Sir द्वारा तैयार अध्ययन सामग्री और ब्रांडेड मर्चेंडाइज़ — एक ही जगह पर।', 'Study material prepared by Dharmendra Sir and branded merchandise — all in one place.')}
          </p>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-blue-200">
            <span className="flex items-center gap-1"><Truck size={14} /> {t('तेज़ डिलीवरी', 'Fast Delivery')}</span>
            <span className="flex items-center gap-1"><Shield size={14} /> {t('100% सुरक्षित भुगतान', '100% Secure Payment')}</span>
            <span className="flex items-center gap-1"><RefreshCw size={14} /> {t('7-दिन रिटर्न', '7-Day Return')}</span>
            <span className="flex items-center gap-1"><Phone size={14} /> {t('WhatsApp सपोर्ट', 'WhatsApp Support')}</span>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center gap-2 -mt-5 mb-10 relative z-10">
          <button
            onClick={() => setTab('study')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow transition-all ${tab === 'study' ? 'bg-brand-500 text-white scale-105 shadow-lg' : 'bg-white text-gray-600 hover:bg-brand-50'}`}
          >
            <GraduationCap size={16} /> {t('📚 अध्ययन सामग्री', '📚 Study Material')}
          </button>
          <button
            onClick={() => setTab('merch')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow transition-all ${tab === 'merch' ? 'bg-amber-500 text-white scale-105 shadow-lg' : 'bg-white text-gray-600 hover:bg-amber-50'}`}
          >
            <ShoppingCart size={16} /> {t('🎁 मर्चेंडाइज़', '🎁 Merchandise')}
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
          {(tab === 'study' ? studyItems : merchItems).map((item, i) => {
            const accentCls = tab === 'study' ? 'bg-brand-500 hover:bg-brand-600' : 'bg-amber-500 hover:bg-amber-600'
            const discount = Math.round((1 - parseInt(item.price.slice(1)) / parseInt(item.mrp.slice(1))) * 100)
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col overflow-hidden group">
                {/* Image area */}
                <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 h-44 flex items-center justify-center">
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
                  {(item as any).badge && (
                    <span className={`absolute top-3 left-3 ${(item as any).badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                      {(item as any).badge}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 leading-snug">{t((item as any).hi, (item as any).en)}</h3>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{t((item as any).descHi, (item as any).descEn)}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <Stars n={(item as any).rating} />
                    <span className="text-xs text-gray-500">{(item as any).rating} ({(item as any).reviews})</span>
                  </div>

                  {/* Price + Buy */}
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xl font-extrabold text-gray-900">{item.price}</span>
                      <span className="text-xs text-gray-400 line-through ml-1.5">{item.mrp}</span>
                    </div>
                    <a href="#" className={`flex items-center gap-1.5 px-4 py-2 text-white text-sm font-bold rounded-xl transition-colors ${accentCls}`}>
                      <Tag size={13} /> {t('अभी खरीदें', 'Buy Now')}
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* WhatsApp CTA */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">☎️</div>
            <div>
              <h3 className="font-bold text-gray-900">{t('बल्क ऑर्डर या कोई सवाल?', 'Bulk order or any question?')}</h3>
              <p className="text-sm text-gray-600">{t('WhatsApp पर सीधे संपर्क करें — 7597647088', 'Contact directly on WhatsApp — 7597647088')}</p>
            </div>
          </div>
          <a href="https://wa.me/917597647088" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-sm">
            <Phone size={17} /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
