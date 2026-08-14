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
          {t('अंतिम अपडेट: अगस्त 2026', 'Last Updated: August 2026')}
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          {t('1. परिचय', '1. Introduction')}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t(
            'Gyrus Sulcus (gyrussulcus.com) पर आपका स्वागत है। हम आपकी गोपनीयता का सम्मान करते हैं। यह नीति बताती है कि हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित रखते हैं।',
            'Welcome to Gyrus Sulcus (gyrussulcus.com). We respect your privacy. This policy explains how we collect, use and protect your information.'
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
            'आपकी जानकारी का उपयोग केवल शैक्षिक सेवाएं प्रदान करने, आपकी प्रगति ट्रैक करने, और वेबसाइट को बेहतर बनाने के लिए किया जाता है। हम आपकी व्यक्तिगत जानकारी किसी तीसरे पक्ष को नहीं बेचते।',
            'Your information is used solely to provide educational services, track your progress, and improve the website. We do not sell your personal information to any third party.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          {t('4. कुकीज़ और Analytics', '4. Cookies & Analytics')}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t(
            'हमारी वेबसाइट कुकीज़ का उपयोग करती है ताकि आपके अनुभव को बेहतर बनाया जा सके और उपयोग-आँकड़े समझे जा सकें। हम Google Analytics का उपयोग करते हैं। आप अपने ब्राउज़र सेटिंग्स से कुकीज़ को अक्षम कर सकते हैं।',
            'Our website uses cookies to improve your experience and understand usage statistics. We use Google Analytics. You can disable cookies from your browser settings at any time.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          {t('5. तृतीय-पक्ष विज्ञापन (Google AdSense)', '5. Third-Party Advertising (Google AdSense)')}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t(
            'यह वेबसाइट विज्ञापन दिखाने के लिए Google AdSense का उपयोग कर सकती है। एक तृतीय-पक्ष विक्रेता के रूप में, Google इस और अन्य वेबसाइटों पर आपकी पिछली विज़िट के आधार पर विज्ञापन दिखाने हेतु कुकीज़ (जैसे DoubleClick DART कुकी) का उपयोग करता है।',
            'This website may use Google AdSense to display advertisements. As a third-party vendor, Google uses cookies (such as the DoubleClick DART cookie) to serve ads based on your prior visits to this and other websites.'
          )}
        </p>
        <ul className="text-gray-600 text-sm leading-relaxed list-disc pl-5 mt-2">
          <li>{t(
            'Google तथा उसके साझेदार विज्ञापन-नेटवर्क विज्ञापन दिखाने के लिए कुकीज़ का उपयोग कर सकते हैं।',
            'Google and its partner ad networks may use cookies to serve ads.'
          )}</li>
          <li>{t(
            'आप वैयक्तिकृत विज्ञापन (personalised ads) से बाहर निकल सकते हैं — Google Ads Settings (google.com/settings/ads) पर जाकर।',
            'You can opt out of personalised advertising by visiting Google Ads Settings (google.com/settings/ads).'
          )}</li>
          <li>{t(
            'तृतीय-पक्ष विक्रेताओं की कुकीज़ के बारे में अधिक जानकारी तथा opt-out विकल्प www.aboutads.info पर उपलब्ध हैं।',
            'More information about third-party vendor cookies and opt-out options is available at www.aboutads.info.'
          )}</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          {t('6. बच्चों की गोपनीयता', "6. Children's Privacy")}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t(
            'यह वेबसाइट प्रतियोगी परीक्षा की तैयारी कर रहे वयस्क/किशोर विद्यार्थियों के लिए है। हम जानबूझकर 13 वर्ष से कम आयु के बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते।',
            'This website is intended for adult/teen students preparing for competitive exams. We do not knowingly collect personal information from children under 13.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          {t('7. संपर्क करें', '7. Contact Us')}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t(
            'किसी भी प्रश्न के लिए कृपया हमारे संपर्क पृष्ठ पर उपलब्ध माध्यमों से हमसे संपर्क करें।',
            'For any questions, please reach us through the channels on our Contact page.'
          )}
        </p>
      </div>
    </div>
  )
}
