'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { Send, Youtube, Instagram, Phone } from 'lucide-react'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white">Gyrus Sulcus</h3>
            <p className="text-sm italic mt-1 text-gray-400">&quot;I Know that I don&apos;t know&quot;</p>
            <a href="https://wa.me/917597647088" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-green-400 text-sm hover:text-green-300">
              <Phone size={14} /> 7597647088
            </a>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <Link href="/" className="hover:text-white transition-colors">{t('होम', 'Home')}</Link>
              <Link href="/tests" className="hover:text-white transition-colors">{t('टेस्ट', 'Tests')}</Link>
              <Link href="/articles" className="hover:text-white transition-colors">{t('लेख', 'Articles')}</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/courses" className="hover:text-white transition-colors">{t('कोर्स', 'Courses')}</Link>
              <Link href="/notes" className="hover:text-white transition-colors">{t('नोट्स', 'Notes')}</Link>
              <Link href="/resources" className="hover:text-white transition-colors">{t('संसाधन', 'Resources')}</Link>
              <Link href="/about" className="hover:text-white transition-colors">{t('हमारे बारे में', 'About Us')}</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">{t('गोपनीयता नीति', 'Privacy Policy')}</Link>
            </div>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <a href="https://t.me/gyrussulcus7597647088" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors">
              <Send size={18} />
            </a>
            <a href="https://www.youtube.com/@gyrussulcus1908" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
              <Youtube size={18} />
            </a>
            <a href="https://www.instagram.com/dharmendrasir12/" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors">
              <Instagram size={18} />
            </a>
            <a href="https://wa.me/917597647088" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-800 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
              <Phone size={18} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © 2026 Gyrus Sulcus. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
