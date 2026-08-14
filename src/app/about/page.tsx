'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { BookOpen, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t('हमारे बारे में', 'About Us')}
      </h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
          <BookOpen size={24} />
        </div>
        <p className="text-gray-700 leading-relaxed">
          {t(
            'Gyrus Sulcus, Dharmendra Sir द्वारा संचालित एक द्विभाषी (हिंदी + English) शिक्षण मंच है, जो UPSC, IAS, RAS तथा राज्य PCS की तैयारी करने वाले विद्यार्थियों के लिए बनाया गया है। यहाँ रोज़ाना MCQs, लेख, नोट्स और वीडियो लेक्चर उपलब्ध कराए जाते हैं।',
            'Gyrus Sulcus is a bilingual (Hindi + English) learning platform run by Dharmendra Sir, made for students preparing for UPSC, IAS, RAS and State PCS examinations. It offers daily MCQs, articles, notes and video lectures.'
          )}
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          {t(
            'हमारा उद्देश्य हर अभ्यर्थी तक गुणवत्तापूर्ण अध्ययन सामग्री सरल भाषा में पहुँचाना है।',
            'Our aim is to bring quality study material to every aspirant in simple language.'
          )}
        </p>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 mt-6 text-brand-600 font-medium hover:underline"
        >
          {t('संपर्क करें', 'Contact us')} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
