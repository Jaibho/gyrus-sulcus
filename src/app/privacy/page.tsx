'use client'
import { useLanguage } from '@/lib/LanguageContext'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Shield size={28} className="text-brand-500" />
        <h1 className="text-3xl font-bold text-gray-900">
          {t('गोपनीयता नीति', 'Privacy Policy')}
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 prose prose-gray max-w-none">
        <p className="text-sm text-gray-400 mb-6">
          {t('अंतिम अपडेट: मार्च 2026', 'Last Updated: March 2026')}
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          {t('1. परिचय', '1. Introduction')}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t(
            'Gyrus Sulcus (gyrus-sulcus.vercel.app) पर आपका स्वागत है। हम आपकी गोपनीयता का सम्मान करते हैं। यह नीति बताती है कि हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित रखते हैं।',
            'Welcome to Gyrus Sulcus (gyrus-sulcus.vercel.app). We respect your privacy. This policy explains how we collect, use and protect your information.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          {t('2. एकत्र की जाने वाली जानकारी', '2. Information We Collect')}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t(
            'हम निम्नलिखित जानकारी एकत्र कर सकते हैं: नाम और ईमेल (रजिस्ट्रेशन के समय), टेस्ट स्कोर और प्रगति डेटा, और सामान्य उपयोग analytics (Google Analytics के माध्यम से)।',
            'We may collect the following information: name and email (during registration), test scores and progress data, and general usage analytics (through Google Analytics).'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          {t('3. जानकारी का उपयोग', '3. How We Use Information')}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t(
            'आपकी जानकारी का उपयोग केवल शैक्षिक सेवाएं प्रदान करने, आपकी प्रगति ट्रैक करने, और वेबसाइट को बेहतर बनाने के लिए किया जाता है। हम आपकी जानकारी किसी तीसरे पक्ष को नहीं बेचते।',
            'Your information is used solely to provide educational services, track your progress, and improve the website. We do not sell your information to any third party.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          {t('4. कुकीज़ और Analytics', '4. Cookies & Analytics')}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t(
            'हम Google Analytics और AdSense कुकीज़ का उपयोग करते हैं। आप अपने ब्राउज़र सेटिंग्स से कुकीज़ को अक्षम कर सकते हैं।',
            'We use Google Analytics and AdSense cookies. You can disable cookies from your browser settings.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          {t('5. संपर्क करें', '5. Contact Us')}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t(
            'किसी भी प्रश्न के लिए हमें contact@gyrussulcus.com पर ईमेल करें।',
            'For any questions, email us at contact@gyrussulcus.com.'
          )}
        </p>
      </div>
    </div>
  )
}
