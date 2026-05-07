'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import {
  HeartPulse, Brain, ShieldAlert, Phone, RefreshCw, ArrowRight,
  CheckCircle2, AlertTriangle, Info,
} from 'lucide-react'

/**
 * Two self-screening questionnaires:
 *
 * 1. Mental Wellness Check — modelled on the public-domain PHQ-9 + WHO-5
 *    structure. NOT a diagnostic tool; a self-awareness aid only.
 *
 * 2. Sexual Health Awareness Quiz — factual knowledge questions from
 *    NACO / MoHFW / WHO public guidelines. Educational, not diagnostic.
 *
 * Disclaimer surfaces are heavy and deliberate: the law (Mental Healthcare
 * Act 2017) and WHO guidance both require that self-tools never substitute
 * for professional care.
 */

type LikertScore = 0 | 1 | 2 | 3
const LIKERT_OPTIONS: { score: LikertScore; hi: string; en: string }[] = [
  { score: 0, hi: 'बिल्कुल नहीं',         en: 'Not at all'         },
  { score: 1, hi: 'कुछ दिन',              en: 'Several days'        },
  { score: 2, hi: 'अधिकांश दिन',          en: 'More than half the days' },
  { score: 3, hi: 'लगभग रोज़',            en: 'Nearly every day'    },
]

const MENTAL_QUESTIONS: { hi: string; en: string }[] = [
  { hi: 'पिछले 2 सप्ताह में काम / पढ़ाई / गतिविधियों में रुचि या आनंद की कमी।', en: 'Little interest or pleasure in work, study, or activities in the past 2 weeks.' },
  { hi: 'उदास, निराश या हताश महसूस करना।', en: 'Feeling down, depressed, or hopeless.' },
  { hi: 'सोने में कठिनाई, बहुत अधिक सोना, या नींद से बार-बार जागना।', en: 'Trouble falling asleep, sleeping too much, or waking frequently.' },
  { hi: 'थकान या ऊर्जा की कमी।', en: 'Tiredness or low energy.' },
  { hi: 'भूख कम या अधिक लगना।', en: 'Poor appetite or overeating.' },
  { hi: 'स्वयं के बारे में नकारात्मक विचार — \'मैं असफल हूँ\' या \'अपने या परिवार को निराश किया\'।', en: 'Negative thoughts about yourself — feeling like a failure or that you have let yourself or your family down.' },
  { hi: 'पढ़ने, टीवी देखने जैसी चीज़ों पर ध्यान केंद्रित करने में कठिनाई।', en: 'Trouble concentrating on reading, watching TV, or similar tasks.' },
  { hi: 'इतनी तेज़ी से चलना या बोलना कि दूसरों को ध्यान आए — या इसके विपरीत बहुत धीमा होना।', en: 'Moving or speaking so fast (or so slowly) that others noticed.' },
  { hi: 'यह विचार कि \'मेरे न होने से अच्छा होगा\' या स्वयं को नुकसान पहुँचाने का विचार।', en: 'Thoughts that you would be better off dead, or of hurting yourself in some way.' },
]

const SEXUAL_QUESTIONS: {
  hi: string
  en: string
  options: { hi: string; en: string }[]
  correct: number
  explanationHi: string
  explanationEn: string
}[] = [
  {
    hi: 'गर्भनिरोधन की कौन सी विधि STI एवं गर्भ — दोनों से बचाती है?',
    en: 'Which contraceptive method protects against both pregnancy and STIs?',
    options: [
      { hi: 'गर्भनिरोधक गोली', en: 'Oral contraceptive pill' },
      { hi: 'कॉन्डोम', en: 'Condom' },
      { hi: 'IUCD', en: 'IUCD' },
      { hi: 'इमरजेंसी पिल', en: 'Emergency contraceptive pill' },
    ],
    correct: 1,
    explanationHi: 'सही ढंग से उपयोग किया गया कॉन्डोम एकमात्र विधि है जो गर्भ एवं अधिकांश STIs दोनों से सुरक्षा देता है।',
    explanationEn: 'Used correctly, the condom is the only contraceptive method that also protects against most STIs.',
  },
  {
    hi: 'इमरजेंसी कॉन्ट्रासेप्टिव (i-Pill) कितने समय में लेनी चाहिए?',
    en: 'Within what time should an emergency contraceptive (i-Pill) be taken?',
    options: [
      { hi: '24 घंटे', en: '24 hours' },
      { hi: '72 घंटे', en: '72 hours' },
      { hi: '7 दिन', en: '7 days' },
      { hi: '1 महीना', en: '1 month' },
    ],
    correct: 1,
    explanationHi: 'इमरजेंसी पिल 72 घंटे के भीतर लेने पर सबसे प्रभावी है — पहले 24 घंटे में सर्वाधिक। यह नियमित गर्भनिरोधन का विकल्प नहीं।',
    explanationEn: 'Emergency contraceptives are most effective within 72 hours — best within the first 24. They are not a substitute for regular contraception.',
  },
  {
    hi: 'भारत का स्वदेशी HPV टीका क्या कहलाता है?',
    en: "What is India's indigenous HPV vaccine called?",
    options: [
      { hi: 'COVAXIN', en: 'COVAXIN' },
      { hi: 'CERVAVAC', en: 'CERVAVAC' },
      { hi: 'CORBEVAX', en: 'CORBEVAX' },
      { hi: 'COVOVAX', en: 'COVOVAX' },
    ],
    correct: 1,
    explanationHi: 'CERVAVAC — सीरम इंस्टीट्यूट का स्वदेशी HPV टीका 2022 में लॉन्च हुआ। यह सर्वाइकल कैंसर रोकथाम में सहायक।',
    explanationEn: 'CERVAVAC — Serum Institute\'s indigenous HPV vaccine launched in 2022 — supports cervical-cancer prevention.',
  },
  {
    hi: 'MTP (संशोधन) Act, 2021 के तहत विशेष श्रेणियों के लिए अधिकतम गर्भकाल सीमा क्या है?',
    en: 'Under the MTP (Amendment) Act 2021, what is the upper gestational limit for special categories?',
    options: [
      { hi: '12 सप्ताह', en: '12 weeks' },
      { hi: '20 सप्ताह', en: '20 weeks' },
      { hi: '24 सप्ताह', en: '24 weeks' },
      { hi: '28 सप्ताह', en: '28 weeks' },
    ],
    correct: 2,
    explanationHi: '2021 संशोधन ने विशेष श्रेणियों (बलात्कार पीड़िता, अनाचार, नाबालिग आदि) के लिए सीमा 20 से 24 सप्ताह कर दी। भ्रूण-असामान्यता पर Medical Board की स्वीकृति से कोई समय-सीमा नहीं।',
    explanationEn: 'The 2021 amendment raised the limit from 20 to 24 weeks for special categories (rape, incest, minors, etc.). For foetal abnormality, with Medical Board approval, there is no time limit.',
  },
  {
    hi: 'POCSO Act किस आयु तक के व्यक्तियों की सुरक्षा करता है?',
    en: 'POCSO Act protects persons of what age?',
    options: [
      { hi: '12 वर्ष से कम', en: 'Below 12 years' },
      { hi: '16 वर्ष से कम', en: 'Below 16 years' },
      { hi: '18 वर्ष से कम', en: 'Below 18 years' },
      { hi: '21 वर्ष से कम', en: 'Below 21 years' },
    ],
    correct: 2,
    explanationHi: 'POCSO 2012 18 वर्ष से कम आयु के सभी व्यक्तियों को यौन अपराधों से सुरक्षा देता है — लिंग-तटस्थ।',
    explanationEn: 'POCSO 2012 protects every person below 18 from sexual offences — and is gender-neutral.',
  },
  {
    hi: 'NACO द्वारा संचालित निःशुल्क HIV हेल्पलाइन का नंबर क्या है?',
    en: "What is NACO's free HIV helpline number?",
    options: [
      { hi: '1098', en: '1098' },
      { hi: '1097', en: '1097' },
      { hi: '14416', en: '14416' },
      { hi: '181', en: '181' },
    ],
    correct: 1,
    explanationHi: '1097 — NACO की 24×7 निःशुल्क HIV/AIDS हेल्पलाइन। 1098 Childline; 14416 Tele-MANAS; 181 महिला हेल्पलाइन।',
    explanationEn: '1097 — NACO\'s 24×7 free HIV/AIDS helpline. 1098 is Childline; 14416 is Tele-MANAS; 181 is the Women Helpline.',
  },
  {
    hi: 'सहमति (Consent) के बारे में निम्नलिखित में से कौन सा कथन सही है?',
    en: 'Which of the following statements about consent is correct?',
    options: [
      { hi: 'मौन को सहमति माना जा सकता है', en: 'Silence may be treated as consent' },
      { hi: 'पिछले संबंध भविष्य की सहमति बनाते हैं', en: 'Past relationships imply future consent' },
      { hi: 'सहमति किसी भी समय वापस ली जा सकती है', en: 'Consent can be withdrawn at any time' },
      { hi: 'सहमति की कोई आयु-सीमा नहीं', en: 'There is no age limit on consenting' },
    ],
    correct: 2,
    explanationHi: 'सहमति स्पष्ट, सूचित, स्वैच्छिक एवं उत्क्रमणीय (revocable) होनी चाहिए — यानी किसी भी क्षण वापस ली जा सकती है। 18 वर्ष से कम आयु POCSO के तहत संरक्षित।',
    explanationEn: 'Consent must be clear, informed, voluntary and revocable — it can be withdrawn at any moment. Persons under 18 are protected by POCSO.',
  },
  {
    hi: 'POSH Act 2013 के तहत कितने कर्मचारियों वाले कार्यस्थल पर Internal Committee अनिवार्य है?',
    en: 'Under the POSH Act 2013, an Internal Committee is mandatory at workplaces with how many employees?',
    options: [
      { hi: '5 या अधिक', en: '5 or more' },
      { hi: '10 या अधिक', en: '10 or more' },
      { hi: '20 या अधिक', en: '20 or more' },
      { hi: '50 या अधिक', en: '50 or more' },
    ],
    correct: 1,
    explanationHi: 'POSH Act 2013 की धारा 4 के अनुसार 10 या अधिक कर्मचारियों वाले कार्यस्थल पर IC अनिवार्य। छोटे कार्यस्थलों के लिए जिला Local Committee।',
    explanationEn: 'Section 4 of POSH 2013 requires an IC at any workplace with 10 or more employees. Smaller workplaces are covered by the District Local Committee.',
  },
]

export default function WellnessPage() {
  const { t } = useLanguage()
  const [tab, setTab] = useState<'mental' | 'sexual'>('mental')

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
          {t('स्व-मूल्यांकन', 'Self-Assessment')}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
          <HeartPulse className="text-rose-500" size={28} />
          {t('Wellness Hub', 'Wellness Hub')}
        </h1>
        <p className="text-gray-600 leading-relaxed">
          {t(
            'दो गोपनीय, साक्ष्य-आधारित प्रश्नावलियाँ जो आपको अपनी स्थिति समझने में मदद करती हैं। ये निदान नहीं हैं — पेशेवर सहायता का विकल्प नहीं।',
            'Two private, evidence-based questionnaires to help you reflect on your wellbeing. These are not diagnoses and never a substitute for professional care.'
          )}
        </p>
      </div>

      {/* Privacy + scope notice */}
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3">
        <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900 leading-relaxed">
          <strong>{t('गोपनीयता:', 'Privacy:')}</strong>{' '}
          {t(
            'आपके उत्तर केवल इस ब्राउज़र में रहते हैं — कुछ भी सर्वर पर नहीं भेजा जाता। आप कभी भी पेज बंद कर सकते हैं।',
            'Your answers stay in this browser only — nothing is sent to any server. You may close the page at any time.'
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          onClick={() => setTab('mental')}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
            tab === 'mental'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Brain size={16} /> {t('मानसिक स्वास्थ्य चेक', 'Mental Wellness Check')}
        </button>
        <button
          onClick={() => setTab('sexual')}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
            tab === 'sexual'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <HeartPulse size={16} /> {t('यौन स्वास्थ्य जागरूकता', 'Sexual Health Awareness')}
        </button>
      </div>

      {tab === 'mental' ? <MentalCheck /> : <SexualAwareness />}
    </div>
  )
}

/* ================================ MENTAL =============================== */

function MentalCheck() {
  const { t } = useLanguage()
  const [answers, setAnswers] = useState<(LikertScore | null)[]>(
    Array(MENTAL_QUESTIONS.length).fill(null)
  )
  const [submitted, setSubmitted] = useState(false)

  function setAnswer(i: number, v: LikertScore) {
    setAnswers(prev => {
      const next = [...prev]
      next[i] = v
      return next
    })
  }

  function reset() {
    setAnswers(Array(MENTAL_QUESTIONS.length).fill(null))
    setSubmitted(false)
  }

  const allAnswered = answers.every(a => a !== null)
  const score = answers.reduce<number>((s, a) => s + (a ?? 0), 0)
  const flaggedQ9 = (answers[8] ?? 0) >= 1   // any frequency on the self-harm question

  // Scoring bands modelled on PHQ-9
  let band: { color: string; bg: string; titleHi: string; titleEn: string; advHi: string; advEn: string }
  if (score <= 4) {
    band = {
      color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200',
      titleHi: 'न्यूनतम चिंता', titleEn: 'Minimal concern',
      advHi: 'आपके उत्तरों के आधार पर अभी कोई महत्वपूर्ण लक्षण नहीं दिख रहे। नियमित नींद, व्यायाम, सामाजिक संपर्क बनाए रखें।',
      advEn: 'Your answers do not currently flag significant symptoms. Keep up regular sleep, physical activity and social contact.',
    }
  } else if (score <= 9) {
    band = {
      color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200',
      titleHi: 'हल्की चिंता', titleEn: 'Mild concern',
      advHi: 'कुछ लक्षण मौजूद हैं। यदि ये दो सप्ताह से अधिक बने रहें — स्कूल काउंसलर, पारिवारिक डॉक्टर, या Tele-MANAS से बात करना मददगार हो सकता है।',
      advEn: 'Some symptoms are present. If they persist beyond two weeks, consider speaking with a school counsellor, a family doctor, or Tele-MANAS.',
    }
  } else if (score <= 14) {
    band = {
      color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200',
      titleHi: 'मध्यम चिंता', titleEn: 'Moderate concern',
      advHi: 'मध्यम स्तर के लक्षण इंगित हो रहे हैं। पेशेवर मूल्यांकन की सिफारिश की जाती है — एक मनोवैज्ञानिक/मनोचिकित्सक से मिलें।',
      advEn: 'Moderate symptoms are indicated. Professional evaluation is recommended — please see a psychologist or psychiatrist.',
    }
  } else {
    band = {
      color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200',
      titleHi: 'गंभीर चिंता — कृपया सहायता लें', titleEn: 'Significant concern — please reach out',
      advHi: 'आपके उत्तर महत्वपूर्ण लक्षण इंगित कर रहे हैं। कृपया आज ही Tele-MANAS (14416) पर कॉल करें या किसी पेशेवर से मिलें।',
      advEn: 'Your answers indicate significant symptoms. Please call Tele-MANAS (14416) today or see a mental-health professional.',
    }
  }

  if (submitted) {
    return (
      <div>
        {/* Crisis banner if Q9 flagged */}
        {flaggedQ9 && (
          <div className="mb-6 rounded-xl border-2 border-rose-300 bg-rose-50 p-5">
            <div className="flex items-start gap-3 mb-2">
              <AlertTriangle size={22} className="text-rose-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-bold text-rose-900">
                  {t('आप अकेले नहीं हैं', "You are not alone")}
                </h3>
                <p className="text-sm text-rose-800 leading-relaxed mt-1">
                  {t(
                    'आपने स्वयं को नुकसान पहुँचाने या जीवन समाप्त करने के विचारों का संकेत दिया है। यह अनुभव बहुत कठिन हो सकता है, और इसमें मदद उपलब्ध है — अभी।',
                    'You have indicated thoughts of self-harm or of ending your life. This is a hard experience to carry, and help is available — right now.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <a href="tel:14416" className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white font-bold text-sm rounded-lg hover:bg-rose-700">
                <Phone size={14} /> Tele-MANAS — 14416
              </a>
              <a href="tel:112" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-gray-800">
                <Phone size={14} /> {t('आपातकालीन — 112', 'Emergency — 112')}
              </a>
            </div>
          </div>
        )}

        {/* Score band */}
        <div className={`rounded-2xl border-2 p-6 mb-5 ${band.bg}`}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">
            {t('स्कोर', 'Score')}: {score} / 27
          </p>
          <h3 className={`text-2xl font-extrabold mb-2 ${band.color}`}>
            {t(band.titleHi, band.titleEn)}
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {t(band.advHi, band.advEn)}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-5 text-xs text-gray-600 leading-relaxed">
          <Info size={14} className="inline-block text-gray-500 mr-1 mb-0.5" />
          {t(
            'यह मूल्यांकन PHQ-9 / WHO-5 जैसे साक्ष्य-आधारित उपकरणों से प्रेरित है, परंतु निदान नहीं। केवल पेशेवर ही नैदानिक निदान कर सकते हैं।',
            'This screening is inspired by evidence-based tools like PHQ-9 / WHO-5 but is not a diagnostic instrument. Only a qualified professional can make a clinical diagnosis.'
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
          >
            <RefreshCw size={16} /> {t('फिर से करें', 'Retake')}
          </button>
          <Link
            href="/articles/adolescent-mental-health-india"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
          >
            {t('आगे पढ़ें', 'Read more')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">
        {t(
          'पिछले 2 सप्ताह में आप कितनी बार निम्नलिखित से परेशान थे?',
          'Over the past 2 weeks, how often have you been bothered by the following?'
        )}
      </p>
      <p className="text-xs text-gray-400 mb-5">
        {t('कुल 9 प्रश्न • अनुमानित समय: 2 मिनट', '9 questions • takes ~2 minutes')}
      </p>

      <ol className="flex flex-col gap-4">
        {MENTAL_QUESTIONS.map((q, i) => (
          <li key={i} className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="font-medium text-gray-800 text-sm mb-3">
              {i + 1}. {t(q.hi, q.en)}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LIKERT_OPTIONS.map(opt => {
                const selected = answers[i] === opt.score
                return (
                  <button
                    key={opt.score}
                    onClick={() => setAnswer(i, opt.score)}
                    className={`text-xs font-semibold px-3 py-2 rounded-lg border-2 transition-colors ${
                      selected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-100 hover:border-indigo-200 text-gray-600 hover:bg-indigo-50'
                    }`}
                  >
                    {t(opt.hi, opt.en)}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      <button
        disabled={!allAnswered}
        onClick={() => setSubmitted(true)}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('परिणाम देखें', 'See result')} <ArrowRight size={16} />
      </button>
      {!allAnswered && (
        <p className="text-center text-xs text-gray-400 mt-2">
          {t(`${answers.filter(a => a !== null).length}/${MENTAL_QUESTIONS.length} उत्तर दिए`, `${answers.filter(a => a !== null).length}/${MENTAL_QUESTIONS.length} answered`)}
        </p>
      )}
    </div>
  )
}

/* ================================ SEXUAL =============================== */

function SexualAwareness() {
  const { t } = useLanguage()
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(SEXUAL_QUESTIONS.length).fill(null)
  )
  const [submitted, setSubmitted] = useState(false)

  function setAnswer(i: number, v: number) {
    setAnswers(prev => {
      const next = [...prev]
      next[i] = v
      return next
    })
  }

  function reset() {
    setAnswers(Array(SEXUAL_QUESTIONS.length).fill(null))
    setSubmitted(false)
  }

  const allAnswered = answers.every(a => a !== null)
  const correct = answers.filter((a, i) => a === SEXUAL_QUESTIONS[i].correct).length
  const total = SEXUAL_QUESTIONS.length
  const percent = Math.round((correct / total) * 100)

  if (submitted) {
    return (
      <div>
        <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white p-6 mb-5">
          <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">
            {t('जागरूकता स्कोर', 'Awareness Score')}
          </p>
          <h3 className="text-3xl font-extrabold text-rose-700 mb-1">
            {correct}/{total} <span className="text-base font-semibold text-gray-500">({percent}%)</span>
          </h3>
          <p className="text-gray-700 text-sm">
            {percent >= 80
              ? t('शानदार जागरूकता!', 'Excellent awareness!')
              : percent >= 50
                ? t('अच्छी शुरुआत — नीचे दिए स्पष्टीकरण से और सीखें।', 'A good start — learn more from the explanations below.')
                : t('कोई बात नहीं — हर सही जानकारी एक कदम है।', 'No worries — every correct fact is a step forward.')}
          </p>
        </div>

        <ol className="flex flex-col gap-3 mb-6">
          {SEXUAL_QUESTIONS.map((q, i) => {
            const userAns = answers[i]
            const isCorrect = userAns === q.correct
            return (
              <li
                key={i}
                className={`rounded-xl border p-4 ${
                  isCorrect ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/50'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  {isCorrect
                    ? <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                    : <AlertTriangle size={16} className="text-rose-600 mt-0.5 shrink-0" />}
                  <p className="font-medium text-gray-900 text-sm">{i + 1}. {t(q.hi, q.en)}</p>
                </div>
                <p className="text-xs text-gray-700 ml-6 mb-2">
                  <strong>{t('सही उत्तर:', 'Correct answer:')}</strong>{' '}
                  {t(q.options[q.correct].hi, q.options[q.correct].en)}
                </p>
                <p className="text-xs text-gray-600 ml-6 leading-relaxed">
                  {t(q.explanationHi, q.explanationEn)}
                </p>
              </li>
            )
          })}
        </ol>

        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
          >
            <RefreshCw size={16} /> {t('फिर से करें', 'Retake')}
          </button>
          <Link
            href="/articles/sexual-reproductive-health-adolescents"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700"
          >
            {t('आगे पढ़ें', 'Read more')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">
        {t(
          'WHO, NACO, MoHFW दिशानिर्देशों पर आधारित 8 तथ्य-आधारित प्रश्न।',
          'Eight fact-based questions grounded in WHO, NACO and MoHFW guidelines.'
        )}
      </p>
      <p className="text-xs text-gray-400 mb-5">
        {t('अनुमानित समय: 3 मिनट', 'Takes ~3 minutes')}
      </p>

      <ol className="flex flex-col gap-4">
        {SEXUAL_QUESTIONS.map((q, i) => (
          <li key={i} className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="font-medium text-gray-800 text-sm mb-3">{i + 1}. {t(q.hi, q.en)}</p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, oi) => {
                const selected = answers[i] === oi
                return (
                  <button
                    key={oi}
                    onClick={() => setAnswer(i, oi)}
                    className={`text-left text-sm font-medium px-3 py-2 rounded-lg border-2 transition-colors ${
                      selected
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-gray-100 hover:border-rose-200 text-gray-700 hover:bg-rose-50'
                    }`}
                  >
                    <span className="font-bold mr-2 text-gray-400">{String.fromCharCode(65 + oi)}.</span>
                    {t(opt.hi, opt.en)}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      <button
        disabled={!allAnswered}
        onClick={() => setSubmitted(true)}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('परिणाम देखें', 'See result')} <ArrowRight size={16} />
      </button>
      {!allAnswered && (
        <p className="text-center text-xs text-gray-400 mt-2">
          {t(`${answers.filter(a => a !== null).length}/${total} उत्तर दिए`, `${answers.filter(a => a !== null).length}/${total} answered`)}
        </p>
      )}
    </div>
  )
}
