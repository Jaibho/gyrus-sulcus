'use client'
import { useLanguage } from '@/lib/LanguageContext'
import { Mail, Phone, Send, Youtube, Instagram, MapPin } from 'lucide-react'

export default function ContactPage() {
  const { t } = useLanguage()

  const rows = [
    { icon: Phone, label: t('व्हाट्सऐप', 'WhatsApp'), value: t('संदेश भेजें', 'Message us'), href: 'https://wa.me/917597647088' },
    { icon: Send, label: 'Telegram', value: t('चैनल से जुड़ें', 'Join the channel'), href: 'https://t.me/gyrussulcus7597647088' },
    { icon: Youtube, label: 'YouTube', value: 'GYRUS SULCUS', href: 'https://www.youtube.com/@gyrussulcus1908' },
    { icon: Instagram, label: 'Instagram', value: '@dharmendrasir12', href: 'https://www.instagram.com/dharmendrasir12/' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Mail size={28} className="text-brand-500" />
        <h1 className="text-3xl font-bold text-gray-900">{t('संपर्क करें', 'Contact Us')}</h1>
      </div>
      <p className="text-gray-500 mb-8">
        {t(
          'प्रश्न, सुझाव या सहयोग के लिए हमसे नीचे दिए किसी भी माध्यम से संपर्क करें। हम आमतौर पर 24–48 घंटों में उत्तर देते हैं।',
          'For questions, suggestions or collaboration, reach us through any of the channels below. We usually reply within 24–48 hours.'
        )}
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <div className="mb-6">
          <p className="text-lg font-bold text-gray-900">Gyrus Sulcus</p>
          <p className="text-sm text-gray-500 mt-1">{t('हमसे इन माध्यमों से जुड़ें:', 'Connect with us here:')}</p>
        </div>

        <div className="flex flex-col divide-y divide-gray-100">
          {rows.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 py-3.5 group"
            >
              <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <r.icon size={18} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-xs text-gray-400">{r.label}</span>
                <span className="block text-gray-800 font-medium group-hover:text-brand-600 transition-colors break-all">{r.value}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        {t(
          'Gyrus Sulcus एक स्वतंत्र शैक्षिक मंच है और किसी सरकारी निकाय या परीक्षा एजेंसी से संबद्ध नहीं है।',
          'Gyrus Sulcus is an independent educational platform and is not affiliated with any government body or examination agency.'
        )}
      </p>
    </div>
  )
}
