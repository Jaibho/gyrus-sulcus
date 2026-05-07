'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import {
  ShieldCheck, FileSearch, AlertTriangle, RefreshCw, Mail, BookOpen,
  Scale, Eye, GitPullRequest,
} from 'lucide-react'

export default function EditorialPolicyPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
          {t('पारदर्शिता दस्तावेज़', 'Transparency Document')}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          {t('संपादकीय नीति', 'Editorial Policy')}
        </h1>
        <p className="text-gray-600 leading-relaxed">
          {t(
            'यह दस्तावेज़ बताता है कि Gyrus Sulcus पर सामग्री कैसे शोधित, सत्यापित, संपादित और प्रकाशित होती है। हमारी विश्वसनीयता हमारे पाठकों के विश्वास पर निर्भर है, इसलिए हम पारदर्शिता को सर्वोच्च प्राथमिकता देते हैं।',
            'This document explains how content on Gyrus Sulcus is researched, verified, edited and published. Our credibility rests on the trust of our readers, which is why transparency is our highest priority.'
          )}
        </p>
        <p className="text-xs text-gray-400 mt-3">
          {t('अंतिम अद्यतन: मई 2026', 'Last updated: May 2026')}
        </p>
      </div>

      {/* 1. Sources */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-3">
          <FileSearch size={20} className="text-brand-600" /> 1. {t('स्रोत-प्राथमिकता', 'Source Hierarchy')}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          {t(
            'हम केवल प्राथमिक एवं उच्च-विश्वसनीयता वाले स्रोतों से तथ्यों का उपयोग करते हैं। निम्नलिखित प्राथमिकता क्रम है:',
            'We use facts only from primary and high-credibility sources. The priority order is:'
          )}
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
          <li>
            <strong>{t('प्राथमिक सरकारी स्रोत: ', 'Primary government sources: ')}</strong>
            Press Information Bureau (PIB), {t('संबंधित मंत्रालय की वेबसाइट', 'the relevant ministry website')}, RBI, ISRO, NACO, NIMHANS, MoHFW, MoEFCC, NCRB, NITI Aayog
          </li>
          <li>
            <strong>{t('संवैधानिक एवं विधिक स्रोत: ', 'Constitutional & legal sources: ')}</strong>
            {t('सर्वोच्च न्यायालय का निर्णय', 'Supreme Court judgments')}, {t('संसदीय अधिनियम', 'parliamentary acts')}, {t('राजपत्र अधिसूचनाएँ', 'gazette notifications')}
          </li>
          <li>
            <strong>{t('शैक्षिक मानक संदर्भ: ', 'Educational standards: ')}</strong>
            NCERT, IGNOU, {t('विश्वविद्यालय पाठ्यपुस्तकें', 'university textbooks')}
          </li>
          <li>
            <strong>{t('अंतर्राष्ट्रीय निकाय: ', 'International bodies: ')}</strong>
            WHO, UN agencies, IMF, World Bank, IPCC
          </li>
          <li>
            <strong>{t('प्रतिष्ठित मीडिया: ', 'Reputable media: ')}</strong>
            The Hindu, Indian Express, PRS India, Down to Earth — {t('केवल पुष्टिकरण के लिए', 'used only for confirmation')}
          </li>
        </ol>
      </section>

      {/* 2. MCQ verification */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-3">
          <ShieldCheck size={20} className="text-emerald-600" /> 2. {t('MCQ की दोहरी समीक्षा', 'MCQ Two-Pass Review')}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          {t(
            'प्रत्येक MCQ को प्रकाशन से पहले दो स्वतंत्र समीक्षाओं से गुज़रना होता है:',
            'Every MCQ undergoes two independent reviews before publication:'
          )}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <p className="font-bold text-emerald-800 text-sm mb-1">
              {t('समीक्षा 1 — सटीकता', 'Pass 1 — Accuracy')}
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">
              {t(
                'हर तथ्य, उत्तर विकल्प और स्पष्टीकरण को मूल स्रोत से क्रॉस-चेक किया जाता है।',
                'Every fact, option, and explanation is cross-checked against the original source.'
              )}
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <p className="font-bold text-blue-800 text-sm mb-1">
              {t('समीक्षा 2 — प्रासंगिकता', 'Pass 2 — Relevance')}
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">
              {t(
                'क्या प्रश्न का उत्तर समय या विधि-परिवर्तन के कारण बदल चुका है? यदि हाँ, तो प्रश्न हटाया या अद्यतन किया जाता है।',
                'Has the answer changed due to a time or legal shift? If yes, the question is retired or updated.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Stale content */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-3">
          <RefreshCw size={20} className="text-amber-600" /> 3. {t('पुरानी सामग्री हटाना', 'Stale-Content Removal')}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          {t(
            'हम सक्रिय रूप से उन प्रश्नों एवं तथ्यों की निगरानी करते हैं जिनका उत्तर समय के साथ बदल जाता है। उदाहरण:',
            'We actively monitor questions and facts whose answers shift over time. Examples:'
          )}
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>{t('GDP रैंकिंग, मुद्रास्फीति लक्ष्य, रेपो दर', 'GDP rankings, inflation targets, repo rate')}</li>
          <li>{t('सरकार में नियुक्तियाँ, मंत्रिमंडल फेरबदल', 'Government appointments, cabinet reshuffles')}</li>
          <li>{t('न्यायिक निर्णय जो पिछले निर्णयों को पलट दें', 'Judicial verdicts that overturn earlier rulings')}</li>
          <li>{t('योजनाओं की सीमाएँ, अनुदान राशि, पात्रता मापदंड', 'Scheme limits, grant amounts, eligibility criteria')}</li>
          <li>{t('अंतरिक्ष मिशनों की समय-सीमाएँ', 'Space-mission timelines')}</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-3 text-sm">
          {t(
            'जैसे ही कोई परिवर्तन ज्ञात होता है, संबंधित MCQ या लेख को 7 दिनों के भीतर अद्यतन किया जाता है।',
            'When a change is detected, the related MCQ or article is updated within 7 days.'
          )}
        </p>
      </section>

      {/* 4. Independence and bias */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-3">
          <Scale size={20} className="text-purple-600" /> 4. {t('स्वतंत्रता एवं निष्पक्षता', 'Independence & Bias')}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {t(
            'Gyrus Sulcus किसी राजनीतिक दल, सरकारी एजेंसी या कोचिंग संस्थान से संबद्ध नहीं है। हम विवादास्पद विषयों — जैसे आरक्षण, अनुच्छेद 370, आर्थिक नीति — पर तथ्य प्रस्तुत करते हैं, राय नहीं। जब किसी विषय पर एक से अधिक मान्य दृष्टिकोण हों, हम सभी पक्षों को संदर्भित करते हैं।',
            'Gyrus Sulcus is not affiliated with any political party, government agency, or coaching institute. On contested topics — reservation, Article 370, economic policy — we present facts, not opinions. When more than one valid view exists, we acknowledge all sides.'
          )}
        </p>
      </section>

      {/* 5. Sensitive topics */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-3">
          <AlertTriangle size={20} className="text-rose-600" /> 5. {t('संवेदनशील विषय', 'Sensitive Topics')}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          {t(
            'मानसिक स्वास्थ्य, यौन स्वास्थ्य, आत्महत्या रोकथाम और लिंग आधारित हिंसा जैसे विषयों पर हम WHO, NIMHANS, NACO एवं MoHFW के दिशानिर्देशों का सख्ती से पालन करते हैं। ऐसी सामग्री में:',
            'On topics like mental health, sexual health, suicide prevention and gender-based violence, we strictly follow WHO, NIMHANS, NACO and MoHFW guidelines. Such content always:'
          )}
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>{t('कलंक-मुक्त भाषा का उपयोग किया जाता है', 'uses stigma-free language')}</li>
          <li>{t('सहायता हेलपलाइन की जानकारी सम्मिलित होती है', 'includes contact information for helplines')}</li>
          <li>{t('व्यवसायिक सहायता लेने को प्रोत्साहित किया जाता है', 'encourages seeking professional help')}</li>
          <li>{t('चिकित्सा-संबंधी निर्णय की जगह नहीं लेती', 'is not a substitute for medical advice')}</li>
        </ul>
      </section>

      {/* 6. AI use */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-3">
          <Eye size={20} className="text-indigo-600" /> 6. {t('AI के उपयोग पर पारदर्शिता', 'Transparency on AI Use')}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {t(
            'हम AI उपकरणों का उपयोग केवल इन कार्यों में करते हैं: (1) हिंदी–English अनुवाद की पहली कड़ी, (2) व्याकरण एवं भाषा संपादन, (3) लेखों की संरचना का सुझाव। AI द्वारा उत्पन्न कोई भी तथ्य मानवीय सत्यापन के बिना प्रकाशित नहीं होता।',
            'We use AI tools only for: (1) first-pass Hindi–English translation, (2) grammar and language editing, (3) structural suggestions for articles. No fact generated by an AI tool is published without human verification.'
          )}
        </p>
      </section>

      {/* 7. Corrections */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-3">
          <GitPullRequest size={20} className="text-cyan-600" /> 7. {t('त्रुटि सुधार नीति', 'Corrections Policy')}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          {t(
            'अगर आपको किसी प्रश्न या लेख में त्रुटि मिले, तो कृपया हमें ईमेल करें। हम:',
            'If you find an error in any question or article, please email us. We:'
          )}
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>{t('48 घंटे के भीतर त्रुटि की समीक्षा करते हैं', 'review the report within 48 hours')}</li>
          <li>{t('यदि पुष्टि होती है तो लेख/MCQ को 7 दिनों में अद्यतन करते हैं', 'update the article/MCQ within 7 days if confirmed')}</li>
          <li>{t('लेख के नीचे एक "सुधार लॉग" प्रकाशित करते हैं', 'publish a "Corrections Log" at the bottom of the article')}</li>
          <li>{t('त्रुटि के स्रोत और सुधार दोनों का उल्लेख करते हैं', 'state both the source of error and the correction')}</li>
        </ul>
      </section>

      {/* 8. Plagiarism */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-3">
          <BookOpen size={20} className="text-orange-600" /> 8. {t('मौलिकता एवं प्रतिलिप्याधिकार', 'Originality & Copyright')}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {t(
            'सभी लेख Gyrus Sulcus की संपादकीय टीम द्वारा मौलिक रूप से लिखे जाते हैं। जहाँ भी किसी अन्य स्रोत से उद्धरण लिया गया है, वहाँ श्रेय दिया गया है। हम किसी भी रूप में सामग्री की चोरी (plagiarism) के विरुद्ध शून्य-सहिष्णुता नीति का पालन करते हैं।',
            'All articles are written originally by the Gyrus Sulcus editorial team. Wherever a passage is quoted from another source, that source is credited. We follow a zero-tolerance policy against plagiarism in any form.'
          )}
        </p>
      </section>

      {/* Contact */}
      <section className="rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-6">
        <div className="flex items-start gap-3">
          <Mail size={22} className="text-brand-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-bold text-gray-900 mb-1">
              {t('त्रुटि सूचना या प्रतिक्रिया', 'Report an Error or Send Feedback')}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {t(
                'सभी त्रुटि-रिपोर्ट सीधे संपादक तक पहुँचती हैं और 48 घंटे के भीतर उत्तर दिया जाता है।',
                'All error reports reach the editor directly and are responded to within 48 hours.'
              )}
            </p>
            <a href="mailto:editor@gyrussulcus.com" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
              editor@gyrussulcus.com →
            </a>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-gray-400 mt-8">
        <Link href="/about" className="hover:text-brand-500">
          {t('हमारे बारे में पढ़ें', 'Read About Us')}
        </Link>
        {' • '}
        <Link href="/privacy" className="hover:text-brand-500">
          {t('गोपनीयता नीति', 'Privacy Policy')}
        </Link>
      </p>
    </div>
  )
}
