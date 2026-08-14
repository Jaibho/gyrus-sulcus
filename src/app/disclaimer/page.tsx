'use client'
import { useLanguage } from '@/lib/LanguageContext'
import { FileText } from 'lucide-react'

export default function DisclaimerPage() {
  const { t } = useLanguage()

  const sections = [
    {
      h: t('1. शैक्षिक उद्देश्य', '1. Educational Purpose'),
      p: t(
        'Gyrus Sulcus पर उपलब्ध सभी सामग्री (MCQs, लेख, नोट्स, वीडियो) केवल शैक्षिक एवं सूचनात्मक उद्देश्यों के लिए है, जिसका लक्ष्य UPSC, IAS, RAS तथा राज्य PCS जैसी प्रतियोगी परीक्षाओं की तैयारी में सहायता करना है।',
        'All content on Gyrus Sulcus (MCQs, articles, notes, videos) is provided for educational and informational purposes only, to help candidates prepare for competitive examinations such as UPSC, IAS, RAS and State PCS.'
      ),
    },
    {
      h: t('2. सटीकता की कोई गारंटी नहीं', '2. No Guarantee of Accuracy'),
      p: t(
        'हम जानकारी को सटीक और अद्यतन रखने का हर संभव प्रयास करते हैं, फिर भी किसी त्रुटि की संभावना रहती है। किसी भी महत्वपूर्ण निर्णय से पहले कृपया आधिकारिक स्रोतों से पुष्टि करें। किसी उत्तर/तथ्य पर पूर्ण निर्भरता आपकी अपनी जिम्मेदारी है।',
        'While we make every effort to keep information accurate and up to date, errors may occur. Please verify with official sources before making any important decision. Reliance on any answer or fact is at your own responsibility.'
      ),
    },
    {
      h: t('3. परिणाम की कोई गारंटी नहीं', '3. No Guarantee of Results'),
      p: t(
        'हमारी सामग्री का उपयोग किसी परीक्षा में सफलता की गारंटी नहीं देता। परिणाम व्यक्तिगत प्रयास और अन्य कारकों पर निर्भर करते हैं।',
        'Use of our content does not guarantee success in any examination. Results depend on individual effort and other factors.'
      ),
    },
    {
      h: t('4. संबद्धता नहीं', '4. No Affiliation'),
      p: t(
        'Gyrus Sulcus एक स्वतंत्र मंच है और UPSC, संघ लोक सेवा आयोग, RPSC या किसी भी सरकारी/परीक्षा एजेंसी से संबद्ध, समर्थित या अधिकृत नहीं है।',
        'Gyrus Sulcus is an independent platform and is not affiliated with, endorsed by, or authorised by UPSC, the Union Public Service Commission, RPSC, or any government/examination agency.'
      ),
    },
    {
      h: t('5. बाहरी लिंक एवं विज्ञापन', '5. External Links & Advertising'),
      p: t(
        'इस वेबसाइट में तृतीय-पक्ष वेबसाइटों के लिंक तथा विज्ञापन (जैसे Google AdSense) शामिल हो सकते हैं। हम बाहरी वेबसाइटों की सामग्री या विज्ञापनों के लिए ज़िम्मेदार नहीं हैं।',
        'This website may include links to third-party websites and advertisements (such as Google AdSense). We are not responsible for the content of external websites or advertisements.'
      ),
    },
    {
      h: t('6. बौद्धिक संपदा', '6. Intellectual Property'),
      p: t(
        'इस वेबसाइट की मूल सामग्री Gyrus Sulcus की संपत्ति है। अनुमति के बिना पुनः प्रकाशन या व्यावसायिक उपयोग वर्जित है।',
        'The original content of this website is the property of Gyrus Sulcus. Republishing or commercial use without permission is prohibited.'
      ),
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <FileText size={28} className="text-brand-500" />
        <h1 className="text-3xl font-bold text-gray-900">{t('अस्वीकरण एवं नियम', 'Disclaimer & Terms')}</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <p className="text-sm text-gray-400 mb-6">{t('अंतिम अपडेट: अगस्त 2026', 'Last Updated: August 2026')}</p>
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">{s.h}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{s.p}</p>
          </div>
        ))}
        <p className="text-gray-600 text-sm leading-relaxed mt-8">
          {t(
            'किसी भी प्रश्न के लिए कृपया हमारे संपर्क पृष्ठ के माध्यम से संपर्क करें।',
            'For any questions, please reach us through our Contact page.'
          )}
        </p>
      </div>
    </div>
  )
}
