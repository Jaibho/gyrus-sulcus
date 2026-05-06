'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import {
  Youtube, Send, Instagram, Target, BookOpen, Users, Award, GraduationCap,
  CheckCircle2, Mail, Phone, MapPin, FileText, Compass, ShieldCheck,
} from 'lucide-react'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
          {t('हमारे बारे में', 'About Us')}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          {t(
            'भारत के UPSC, IAS एवं RAS aspirants का दैनिक साथी',
            'A daily companion for India\'s UPSC, IAS and RAS aspirants'
          )}
        </h1>
        <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
          {t(
            'Gyrus Sulcus एक स्वतंत्र शैक्षिक मंच है जो प्रतियोगी परीक्षाओं की तैयारी कर रहे विद्यार्थियों के लिए उच्च गुणवत्ता वाली, द्विभाषी (हिंदी + English) सामग्री निःशुल्क या किफायती दामों पर उपलब्ध कराता है। हम केवल आधिकारिक स्रोतों — PIB, RBI, ISRO, NCERT, MoHFW, NACO, NIMHANS — से तथ्यों का संकलन करते हैं।',
            'Gyrus Sulcus is an independent educational platform that delivers high-quality bilingual (Hindi + English) study material — free or affordably priced — for aspirants of India\'s competitive examinations. We compile facts only from official sources: PIB, RBI, ISRO, NCERT, MoHFW, NACO, NIMHANS.'
          )}
        </p>
      </div>

      {/* Founder profile */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-10 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-40 h-40 rounded-2xl overflow-hidden shrink-0 shadow-lg">
            <Image src="/profile.jpg" alt="Dharmendra Sir — Founder, Gyrus Sulcus" width={160} height={160} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Dharmendra Sir</h2>
            <p className="text-brand-600 font-semibold text-sm mt-0.5">
              {t('संस्थापक एवं मुख्य संपादक — Gyrus Sulcus', 'Founder & Editor-in-Chief — Gyrus Sulcus')}
            </p>

            {/* Credential chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                <GraduationCap size={12} /> B. Pharmacy
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Users size={12} /> 13L+ {t('YouTube सब्सक्राइबर', 'YouTube subscribers')}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                <Award size={12} /> 10+ {t('वर्ष शिक्षण', 'Years teaching')}
              </span>
            </div>

            <p className="text-gray-700 mt-4 leading-relaxed">
              {t(
                'Dharmendra Sir B.Pharmacy स्नातक हैं और पिछले एक दशक से UPSC, IAS, RAS एवं State PCS की तैयारी करने वाले छात्रों के लिए शिक्षण कर रहे हैं। उनका YouTube चैनल — 13 लाख से अधिक सब्सक्राइबर के साथ — हिंदी माध्यम के सबसे भरोसेमंद शैक्षिक चैनलों में गिना जाता है। उनकी पहचान दो विशिष्ट शैलियों के लिए है: (1) Critical Thinking — जहाँ वे प्रश्न के पीछे की तार्किक संरचना समझाते हैं, और (2) "I know that I don\'t know" — एक दर्शन जो जिज्ञासा को सीखने का केंद्र मानता है।',
                'Dharmendra Sir holds a B.Pharmacy degree and has been teaching UPSC, IAS, RAS and State PCS aspirants for over a decade. His YouTube channel — with 13 lakh+ subscribers — is one of the most trusted Hindi-medium educational channels in India. He is known for two distinctive teaching styles: (1) Critical Thinking — explaining the logical structure behind every question, and (2) "I know that I don\'t know" — a philosophy that places curiosity at the centre of learning.'
              )}
            </p>

            {/* Social links */}
            <div className="flex gap-2 mt-5">
              <a href="https://www.youtube.com/@gyrussulcus1908" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-semibold transition-colors">
                <Youtube size={16} /> YouTube
              </a>
              <a href="https://t.me/gyrussulcus7597647088" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-semibold transition-colors">
                <Send size={16} /> Telegram
              </a>
              <a href="https://www.instagram.com/dharmendrasir12/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 text-sm font-semibold transition-colors">
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mb-3">
            <Target size={20} className="text-brand-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1.5">{t('हमारा मिशन', 'Our Mission')}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'हर aspirant को गुणवत्तापूर्ण, द्विभाषी अध्ययन सामग्री बिना किसी आर्थिक बाधा के उपलब्ध कराना। शिक्षा एक अधिकार है, विशेषाधिकार नहीं।',
              'To provide every aspirant with quality, bilingual study material without economic barriers. Education is a right, not a privilege.'
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
            <Compass size={20} className="text-emerald-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1.5">{t('हमारी कार्यशैली', 'Our Method')}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'Three-Layer Teaching — Concept Core → India Connect → Current Affairs। हर PYQ का Reverse Engineering। "एक कथन, एक तथ्य" सिद्धांत।',
              'Three-Layer Teaching — Concept Core → India Connect → Current Affairs. Reverse-engineering of every PYQ. The "One Statement, One Fact" principle.'
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
            <ShieldCheck size={20} className="text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1.5">{t('हमारी प्रतिबद्धता', 'Our Commitment')}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'केवल आधिकारिक स्रोतों से तथ्य। पुराने या भ्रामक प्रश्नों को हटाना। हर लेख की मानवीय समीक्षा।',
              'Facts sourced only from official channels. Outdated or misleading questions are removed. Every article passes a human review.'
            )}
          </p>
        </div>
      </div>

      {/* What we publish */}
      <section className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-6 md:p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('हम क्या प्रकाशित करते हैं', 'What We Publish')}
        </h2>
        <p className="text-gray-600 mb-5 leading-relaxed">
          {t(
            'Gyrus Sulcus की सामग्री पाँच मुख्य स्तंभों में संगठित है, जो UPSC General Studies (GS1–GS4) के सिलेबस के अनुरूप हैं।',
            'Gyrus Sulcus content is organised across five core pillars, mapped to the UPSC General Studies (GS1–GS4) syllabus.'
          )}
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { hi: 'दैनिक MCQs — 5 विषयों में 10 प्रश्न प्रति दिन', en: 'Daily MCQs — 10 questions across 5 subjects, every day' },
            { hi: 'विशेषज्ञ-स्तरीय लेख — 1,500+ शब्दों में मूल विश्लेषण', en: 'Expert-level articles — original 1,500+ word analyses' },
            { hi: 'हस्तलिखित नोट्स — टॉपर्स की शैली में डाउनलोड', en: 'Handwritten notes — topper-style PDF downloads' },
            { hi: 'PYQ संकलन — 2010 से अब तक के प्रश्नों का संग्रह', en: 'PYQ compilations — questions from 2010 to date' },
            { hi: 'मानसिक एवं यौन स्वास्थ्य — साक्ष्य-आधारित सामग्री', en: 'Mental & sexual health — evidence-based content' },
            { hi: 'व्यक्तिगत Gap Analysis — कमज़ोर विषयों की पहचान', en: 'Personal Gap Analysis — identifies weak topics' },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700">{t(item.hi, item.en)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Editorial standards */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t('संपादकीय मानक', 'Editorial Standards')}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          {t(
            'हम मानते हैं कि शिक्षा में तथ्यात्मक सटीकता ही नींव है। हमारी सामग्री इन सिद्धांतों पर खड़ी है:',
            'We believe factual accuracy is the foundation of education. Our content rests on these principles:'
          )}
        </p>
        <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-2 leading-relaxed">
          <li>
            <strong>{t('स्रोत-प्राथमिकता:', 'Source-first: ')}</strong>
            {t(
              'हर तथ्य आधिकारिक सरकारी स्रोत (PIB, ministry website, RBI, ISRO, MoHFW) से सत्यापित किया जाता है।',
              'Every fact is verified against an official government source (PIB, ministry website, RBI, ISRO, MoHFW).'
            )}
          </li>
          <li>
            <strong>{t('दोहरी समीक्षा:', 'Two-pass review: ')}</strong>
            {t(
              'प्रत्येक MCQ की दो बार समीक्षा होती है — सटीकता और प्रासंगिकता दोनों के लिए।',
              'Every MCQ is reviewed twice — once for accuracy, once for current relevance.'
            )}
          </li>
          <li>
            <strong>{t('पुरानी सामग्री हटाना:', 'Stale-content removal: ')}</strong>
            {t(
              'जिन प्रश्नों का उत्तर समय के साथ बदल चुका है, उन्हें या तो अद्यतन किया जाता है या हटा दिया जाता है।',
              'Questions whose answers have changed over time are either updated or retired.'
            )}
          </li>
          <li>
            <strong>{t('त्रुटि सुधार नीति:', 'Corrections policy: ')}</strong>
            {t(
              'किसी भी त्रुटि की सूचना मिलने पर 48 घंटे के भीतर सुधार किया जाता है।',
              'Any reported error is corrected within 48 hours.'
            )}
          </li>
          <li>
            <strong>{t('कोई AI-जनित दावा नहीं:', 'No unverified AI claims: ')}</strong>
            {t(
              'AI-सहायता का उपयोग केवल भाषा संपादन और अनुवाद में किया जाता है — कभी भी अप्रमाणित तथ्य प्रकाशित नहीं किए जाते।',
              'AI assistance is used only for language editing and translation — unverified facts are never published.'
            )}
          </li>
        </ol>
        <Link href="/editorial-policy" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline mt-4">
          <FileText size={14} /> {t('पूरी संपादकीय नीति पढ़ें', 'Read the full Editorial Policy')} →
        </Link>
      </section>

      {/* Contact */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t('संपर्क करें', 'Contact Us')}
        </h2>
        <p className="text-gray-600 mb-5 text-sm">
          {t(
            'सुझाव, त्रुटि सूचना, साझेदारी या प्रेस संबंधी पूछताछ के लिए हमसे संपर्क करें।',
            'Reach out for feedback, error reports, partnerships, or press enquiries.'
          )}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="mailto:contact@gyrussulcus.com" className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <Mail size={20} className="text-brand-600 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{t('ईमेल', 'Email')}</p>
              <p className="text-xs text-gray-500 break-all">contact@gyrussulcus.com</p>
            </div>
          </a>
          <a href="https://wa.me/917597647088" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <Phone size={20} className="text-emerald-600 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{t('WhatsApp', 'WhatsApp')}</p>
              <p className="text-xs text-gray-500">+91 7597 647088</p>
            </div>
          </a>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
            <MapPin size={20} className="text-purple-600 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{t('कार्यालय', 'Office')}</p>
              <p className="text-xs text-gray-500">Jaipur, Rajasthan, India</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
