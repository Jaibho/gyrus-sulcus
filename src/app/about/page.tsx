'use client'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'
import { Youtube, Send, Instagram, Target, BookOpen, Users } from 'lucide-react'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('हमारे बारे में', 'About Us')}
      </h1>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center mb-10">
        <div classNamelogow-40 h-40 rounded-2xl overflow-hidden shrink-0 shadow-lg">
          <Image src="/profile.jpg" alt="Dharmendra Sir" width={160} height={160} className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dharmendra Sir</h2>
          <p className="text-brand-500 font-medium mt-1">Founder — Gyrus Sulcus</p>
          <p className="text-gray-600 mt-3 leading-relaxed">
            {t(
              'B.Pharmacy graduate, educator और content creator। 1.1 Million+ subscribers के साथ YouTube पर UPSC, NEET, RAS, LDC की तैयारी करवाते हैं। "I know that I don\'t know" — यही हमारी philosophy है। सीखना कभी नहीं रुकता।',
              'B.Pharmacy graduate, educator and content creator. Teaching UPSC, NEET, RAS, LDC preparation on YouTube with 1.1 Million+ subscribers. "I know that I don\'t know" — this is our philosophy. Learning never stops.'
            )}
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://youtube.com/@gyrussulcus" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors">
              <Youtube size={18} />
            </a>
            <a href="https://t.me/gyrussulcus" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
              <Send size={18} />
            </a>
            <a href="https://instagram.com/gyrussulcus" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-100 transition-colors">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <Target size={28} className="text-brand-500 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">{t('हमारा मिशन', 'Our Mission')}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'हर aspirant को गुणवत्तापूर्ण, bilingual study material free या affordable price पर उपलब्ध कराना।',
              'To provide quality, bilingual study material to every aspirant for free or at affordable prices.'
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <BookOpen size={28} className="text-emerald-500 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">{t('Teaching Method', 'Teaching Method')}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'Three-Layer Teaching: Concept Core → India Connect → Current Affairs। PYQ Reverse Engineering और One Statement One Fact principle।',
              'Three-Layer Teaching: Concept Core → India Connect → Current Affairs. PYQ Reverse Engineering and One Statement One Fact principle.'
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <Users size={28} className="text-purple-500 mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">{t('Community', 'Community')}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              '1.1 Million+ YouTube subscribers, active Telegram group, और हज़ारों aspirants daily MCQs solve करते हैं।',
              '1.1 Million+ YouTube subscribers, active Telegram group, and thousands of aspirants solve daily MCQs.'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
