'use client'
import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import {
  Microscope, Scale, BarChart3, Globe, Newspaper,
  Clock, ArrowRight, ArrowLeft, CheckCircle, XCircle,
  Trophy, RotateCcw, Home, CalendarDays, ChevronLeft, ChevronRight
} from 'lucide-react'

const subjects = [
  { key: 'science_tech', icon: Microscope, hi: 'विज्ञान एवं प्रौद्योगिकी', en: 'Science & Technology', color: 'border-blue-200 hover:border-blue-400', iconColor: 'text-blue-600 bg-blue-50' },
  { key: 'polity', icon: Scale, hi: 'भारतीय राजव्यवस्था', en: 'Indian Polity', color: 'border-amber-200 hover:border-amber-400', iconColor: 'text-amber-600 bg-amber-50' },
  { key: 'economy', icon: BarChart3, hi: 'अर्थव्यवस्था', en: 'Economy', color: 'border-emerald-200 hover:border-emerald-400', iconColor: 'text-emerald-600 bg-emerald-50' },
  { key: 'geography', icon: Globe, hi: 'भूगोल एवं पर्यावरण', en: 'Geography & Environment', color: 'border-purple-200 hover:border-purple-400', iconColor: 'text-purple-600 bg-purple-50' },
  { key: 'current_affairs', icon: Newspaper, hi: 'समसामयिकी', en: 'Current Affairs', color: 'border-rose-200 hover:border-rose-400', iconColor: 'text-rose-600 bg-rose-50' },
]

interface MCQRow {
  date: string
  subject: string
  question_hi: string
  question_en: string
  option_a_hi: string; option_a_en: string
  option_b_hi: string; option_b_en: string
  option_c_hi: string; option_c_en: string
  option_d_hi: string; option_d_en: string
  correct_answer: string
  explanation_hi: string
  explanation_en: string
}

interface Question {
  hi: string
  en: string
  options: { hi: string; en: string }[]
  correct: number
  explanationHi: string
  explanationEn: string
}

function mcqRowToQuestion(row: MCQRow): Question {
  const ansMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 }
  return {
    hi: row.question_hi,
    en: row.question_en,
    options: [
      { hi: row.option_a_hi, en: row.option_a_en },
      { hi: row.option_b_hi, en: row.option_b_en },
      { hi: row.option_c_hi, en: row.option_c_en },
      { hi: row.option_d_hi, en: row.option_d_en },
    ],
    correct: ansMap[row.correct_answer.toUpperCase()] ?? 0,
    explanationHi: row.explanation_hi,
    explanationEn: row.explanation_en,
  }
}

const fallbackQuestionBank: Record<string, Question[]> = {
  science_tech: [
    {
      hi: 'भारत का पहला कृत्रिम उपग्रह कौन सा था?',
      en: 'What was India\'s first artificial satellite?',
      options: [{ hi: 'आर्यभट्ट', en: 'Aryabhatta' }, { hi: 'भास्कर', en: 'Bhaskar' }, { hi: 'रोहिणी', en: 'Rohini' }, { hi: 'INSAT-1A', en: 'INSAT-1A' }],
      correct: 0,
      explanationHi: 'आर्यभट्ट 19 अप्रैल 1975 को लॉन्च किया गया भारत का पहला उपग्रह था।',
      explanationEn: 'Aryabhatta was India\'s first satellite, launched on April 19, 1975.',
    },
    {
      hi: 'DNA का पूरा नाम क्या है?',
      en: 'What is the full form of DNA?',
      options: [{ hi: 'डाइऑक्सीरिबोन्यूक्लिक एसिड', en: 'Deoxyribonucleic Acid' }, { hi: 'डाइरिबोन्यूक्लिक एसिड', en: 'Diribonucleic Acid' }, { hi: 'डायनामिक न्यूक्लिक एसिड', en: 'Dynamic Nucleic Acid' }, { hi: 'डाइऑक्सी न्यूट्रल एसिड', en: 'Dioxygenated Neutral Acid' }],
      correct: 0,
      explanationHi: 'DNA का पूरा नाम डाइऑक्सीरिबोन्यूक्लिक एसिड है।',
      explanationEn: 'DNA stands for Deoxyribonucleic Acid.',
    },
    {
      hi: 'प्रकाश की गति लगभग कितनी है?',
      en: 'What is the approximate speed of light?',
      options: [{ hi: '3×10⁸ m/s', en: '3×10⁸ m/s' }, { hi: '3×10⁶ m/s', en: '3×10⁶ m/s' }, { hi: '3×10¹⁰ m/s', en: '3×10¹⁰ m/s' }, { hi: '3×10⁴ m/s', en: '3×10⁴ m/s' }],
      correct: 0,
      explanationHi: 'प्रकाश की गति निर्वात में लगभग 3×10⁸ मीटर प्रति सेकंड होती है।',
      explanationEn: 'The speed of light in vacuum is approximately 3×10⁸ m/s.',
    },
    {
      hi: 'ISRO का मुख्यालय कहाँ स्थित है?',
      en: 'Where is ISRO headquartered?',
      options: [{ hi: 'नई दिल्ली', en: 'New Delhi' }, { hi: 'मुंबई', en: 'Mumbai' }, { hi: 'बेंगलुरु', en: 'Bengaluru' }, { hi: 'हैदराबाद', en: 'Hyderabad' }],
      correct: 2,
      explanationHi: 'ISRO का मुख्यालय बेंगलुरु, कर्नाटक में स्थित है।',
      explanationEn: 'ISRO is headquartered in Bengaluru, Karnataka.',
    },
    {
      hi: 'चंद्रयान-3 ने चंद्रमा पर कहाँ सॉफ्ट लैंडिंग की?',
      en: 'Where did Chandrayaan-3 make a soft landing on the Moon?',
      options: [{ hi: 'उत्तरी ध्रुव', en: 'North Pole' }, { hi: 'दक्षिणी ध्रुव के निकट', en: 'Near South Pole' }, { hi: 'भूमध्य रेखा', en: 'Equator' }, { hi: 'मारे ट्रैंक्विलिटाटिस', en: 'Mare Tranquillitatis' }],
      correct: 1,
      explanationHi: 'चंद्रयान-3 ने 23 अगस्त 2023 को चंद्रमा के दक्षिणी ध्रुव के निकट सफलतापूर्वक सॉफ्ट लैंडिंग की।',
      explanationEn: 'Chandrayaan-3 successfully soft-landed near the Moon\'s South Pole on August 23, 2023.',
    },
  ],
  polity: [
    {
      hi: 'भारतीय संविधान में मूल रूप से कितने अनुच्छेद थे?',
      en: 'How many articles were in the original Indian Constitution?',
      options: [{ hi: '395', en: '395' }, { hi: '448', en: '448' }, { hi: '444', en: '444' }, { hi: '390', en: '390' }],
      correct: 0,
      explanationHi: 'मूल भारतीय संविधान में 395 अनुच्छेद, 8 अनुसूचियाँ और 22 भाग थे।',
      explanationEn: 'The original Indian Constitution had 395 articles, 8 schedules and 22 parts.',
    },
    {
      hi: 'भारत के राष्ट्रपति का चुनाव कौन करता है?',
      en: 'Who elects the President of India?',
      options: [{ hi: 'केवल लोकसभा सांसद', en: 'Lok Sabha MPs only' }, { hi: 'संसद के दोनों सदन', en: 'Both Houses of Parliament' }, { hi: 'निर्वाचित संसद सदस्य और राज्य विधानसभाओं के सदस्य', en: 'Elected MPs and State Legislature members' }, { hi: 'सर्वोच्च न्यायालय के न्यायाधीश', en: 'Supreme Court Judges' }],
      correct: 2,
      explanationHi: 'राष्ट्रपति का चुनाव निर्वाचक मंडल द्वारा होता है।',
      explanationEn: 'The President is elected by an Electoral College.',
    },
    {
      hi: 'संविधान का कौन सा भाग मौलिक अधिकारों से संबंधित है?',
      en: 'Which part of the Constitution deals with Fundamental Rights?',
      options: [{ hi: 'भाग II', en: 'Part II' }, { hi: 'भाग III (अनु. 12-35)', en: 'Part III (Art. 12-35)' }, { hi: 'भाग IV', en: 'Part IV' }, { hi: 'भाग V', en: 'Part V' }],
      correct: 1,
      explanationHi: 'मौलिक अधिकार संविधान के भाग III (अनुच्छेद 12 से 35) में वर्णित हैं।',
      explanationEn: 'Fundamental Rights are enshrined in Part III (Articles 12-35) of the Constitution.',
    },
    {
      hi: 'भारत के प्रधानमंत्री की नियुक्ति कौन करता है?',
      en: 'Who appoints the Prime Minister of India?',
      options: [{ hi: 'उपराष्ट्रपति', en: 'Vice President' }, { hi: 'राष्ट्रपति', en: 'President' }, { hi: 'लोकसभा अध्यक्ष', en: 'Speaker of Lok Sabha' }, { hi: 'मुख्य न्यायाधीश', en: 'Chief Justice' }],
      correct: 1,
      explanationHi: 'अनुच्छेद 75 के अनुसार प्रधानमंत्री की नियुक्ति राष्ट्रपति द्वारा की जाती है।',
      explanationEn: 'According to Article 75, the Prime Minister is appointed by the President.',
    },
    {
      hi: 'भारत के संविधान में वर्तमान में कितनी अनुसूचियाँ हैं?',
      en: 'How many schedules are there in the Indian Constitution currently?',
      options: [{ hi: '8', en: '8' }, { hi: '10', en: '10' }, { hi: '12', en: '12' }, { hi: '14', en: '14' }],
      correct: 2,
      explanationHi: 'वर्तमान में भारतीय संविधान में 12 अनुसूचियाँ हैं।',
      explanationEn: 'Currently there are 12 schedules in the Indian Constitution.',
    },
  ],
  economy: [
    {
      hi: 'GDP का पूरा नाम क्या है?',
      en: 'What does GDP stand for?',
      options: [{ hi: 'Gross Domestic Product', en: 'Gross Domestic Product' }, { hi: 'General Domestic Production', en: 'General Domestic Production' }, { hi: 'Gross Domestic Provision', en: 'Gross Domestic Provision' }, { hi: 'General Development Product', en: 'General Development Product' }],
      correct: 0,
      explanationHi: 'GDP किसी देश में एक वर्ष में उत्पादित सभी वस्तुओं और सेवाओं का कुल मूल्य होता है।',
      explanationEn: 'GDP is the total value of all goods and services produced in a country in one year.',
    },
    {
      hi: 'भारतीय रिजर्व बैंक (RBI) का मुख्यालय कहाँ है?',
      en: 'Where is the Reserve Bank of India (RBI) headquartered?',
      options: [{ hi: 'नई दिल्ली', en: 'New Delhi' }, { hi: 'मुंबई', en: 'Mumbai' }, { hi: 'कोलकाता', en: 'Kolkata' }, { hi: 'चेन्नई', en: 'Chennai' }],
      correct: 1,
      explanationHi: 'भारतीय रिजर्व बैंक का केंद्रीय कार्यालय मुंबई में स्थित है।',
      explanationEn: 'The central office of Reserve Bank of India is in Mumbai.',
    },
    {
      hi: 'GST कब से लागू हुआ?',
      en: 'When was GST implemented?',
      options: [{ hi: '1 अप्रैल 2016', en: '1 April 2016' }, { hi: '1 जनवरी 2017', en: '1 January 2017' }, { hi: '1 जुलाई 2017', en: '1 July 2017' }, { hi: '1 अक्टूबर 2017', en: '1 October 2017' }],
      correct: 2,
      explanationHi: 'GST 1 जुलाई 2017 से पूरे भारत में लागू हुआ।',
      explanationEn: 'GST was implemented across India from 1 July 2017.',
    },
    {
      hi: 'NITI Aayog ने किसका स्थान लिया?',
      en: 'NITI Aayog replaced which institution?',
      options: [{ hi: 'वित्त आयोग', en: 'Finance Commission' }, { hi: 'योजना आयोग', en: 'Planning Commission' }, { hi: 'चुनाव आयोग', en: 'Election Commission' }, { hi: 'राष्ट्रीय विकास परिषद', en: 'National Development Council' }],
      correct: 1,
      explanationHi: 'NITI Aayog ने 1 जनवरी 2015 को योजना आयोग का स्थान लिया।',
      explanationEn: 'NITI Aayog replaced the Planning Commission on January 1, 2015.',
    },
    {
      hi: 'भारत की GDP के हिसाब से विश्व में क्या स्थान है? (2024)',
      en: 'What is India\'s rank by GDP in the world? (2024)',
      options: [{ hi: '3rd', en: '3rd' }, { hi: '4th', en: '4th' }, { hi: '5th', en: '5th' }, { hi: '6th', en: '6th' }],
      correct: 2,
      explanationHi: '2024 में भारत दुनिया की 5वीं सबसे बड़ी अर्थव्यवस्था है।',
      explanationEn: 'In 2024, India is the 5th largest economy in the world.',
    },
  ],
  geography: [
    {
      hi: 'भारत की सबसे लंबी नदी कौन सी है?',
      en: 'Which is the longest river in India?',
      options: [{ hi: 'यमुना', en: 'Yamuna' }, { hi: 'गंगा', en: 'Ganga' }, { hi: 'गोदावरी', en: 'Godavari' }, { hi: 'नर्मदा', en: 'Narmada' }],
      correct: 1,
      explanationHi: 'गंगा नदी 2,525 km लंबी है और भारत की सबसे लंबी नदी है।',
      explanationEn: 'The Ganga river is 2,525 km long and is the longest river in India.',
    },
    {
      hi: 'सबसे लंबी तटरेखा किस राज्य की है?',
      en: 'Which state has the longest coastline?',
      options: [{ hi: 'महाराष्ट्र', en: 'Maharashtra' }, { hi: 'तमिलनाडु', en: 'Tamil Nadu' }, { hi: 'गुजरात', en: 'Gujarat' }, { hi: 'आंध्र प्रदेश', en: 'Andhra Pradesh' }],
      correct: 2,
      explanationHi: 'गुजरात की तटरेखा लगभग 1,600 km है।',
      explanationEn: 'Gujarat has a coastline of approximately 1,600 km.',
    },
    {
      hi: 'कर्क रेखा भारत के कितने राज्यों से होकर गुजरती है?',
      en: 'The Tropic of Cancer passes through how many Indian states?',
      options: [{ hi: '6', en: '6' }, { hi: '7', en: '7' }, { hi: '8', en: '8' }, { hi: '9', en: '9' }],
      correct: 2,
      explanationHi: 'कर्क रेखा भारत के 8 राज्यों से होकर गुजरती है।',
      explanationEn: 'The Tropic of Cancer passes through 8 Indian states.',
    },
    {
      hi: 'सुंदरबन वन किन देशों में फैला है?',
      en: 'The Sundarbans forest spreads across which countries?',
      options: [{ hi: 'भारत और नेपाल', en: 'India and Nepal' }, { hi: 'भारत और बांग्लादेश', en: 'India and Bangladesh' }, { hi: 'भारत और म्यांमार', en: 'India and Myanmar' }, { hi: 'भारत और श्रीलंका', en: 'India and Sri Lanka' }],
      correct: 1,
      explanationHi: 'सुंदरबन भारत (पश्चिम बंगाल) और बांग्लादेश में फैला है।',
      explanationEn: 'Sundarbans is spread across India (West Bengal) and Bangladesh.',
    },
    {
      hi: 'भारत का सबसे ऊँचा पर्वत शिखर कौन सा है?',
      en: 'Which is the highest mountain peak in India?',
      options: [{ hi: 'माउंट एवरेस्ट', en: 'Mount Everest' }, { hi: 'K2', en: 'K2' }, { hi: 'कंचनजंघा', en: 'Kangchenjunga' }, { hi: 'नंदा देवी', en: 'Nanda Devi' }],
      correct: 2,
      explanationHi: 'कंचनजंघा (8,586 m) पूर्णतः भारत में स्थित सबसे ऊँचा पर्वत शिखर है।',
      explanationEn: 'Kangchenjunga (8,586 m) is the highest peak entirely within India.',
    },
  ],
  current_affairs: [
    {
      hi: 'भारत ने G20 की अध्यक्षता किस वर्ष की?',
      en: 'In which year did India hold the G20 Presidency?',
      options: [{ hi: '2022', en: '2022' }, { hi: '2023', en: '2023' }, { hi: '2024', en: '2024' }, { hi: '2025', en: '2025' }],
      correct: 1,
      explanationHi: 'भारत ने 2023 में G20 की अध्यक्षता की।',
      explanationEn: 'India held the G20 Presidency in 2023.',
    },
    {
      hi: 'UNSC में स्थायी सदस्यों की संख्या कितनी है?',
      en: 'How many permanent members does the UN Security Council have?',
      options: [{ hi: '3', en: '3' }, { hi: '5', en: '5' }, { hi: '7', en: '7' }, { hi: '10', en: '10' }],
      correct: 1,
      explanationHi: 'UNSC में 5 स्थायी सदस्य हैं: USA, UK, फ्रांस, रूस और चीन।',
      explanationEn: 'UNSC has 5 permanent members: USA, UK, France, Russia and China.',
    },
    {
      hi: '\'विकसित भारत 2047\' किस वर्ष पर केंद्रित है?',
      en: 'What year is \'Viksit Bharat 2047\' focused on?',
      options: [{ hi: 'भारत की आजादी के 100 साल (2047)', en: 'India\'s 100 years of independence (2047)' }, { hi: 'UN SDG लक्ष्य (2030)', en: 'UN SDG goals (2030)' }, { hi: 'G20 प्रतिबद्धताएँ', en: 'G20 commitments' }, { hi: 'BRICS रोडमैप', en: 'BRICS roadmap' }],
      correct: 0,
      explanationHi: 'विकसित भारत 2047 की परिकल्पना 2047 तक भारत को विकसित राष्ट्र बनाने की है।',
      explanationEn: 'Viksit Bharat 2047 envisions making India a developed nation by 2047.',
    },
    {
      hi: 'ICC Cricket World Cup 2023 का फाइनल किस शहर में खेला गया?',
      en: 'In which city was the ICC Cricket World Cup 2023 Final played?',
      options: [{ hi: 'मुंबई', en: 'Mumbai' }, { hi: 'कोलकाता', en: 'Kolkata' }, { hi: 'अहमदाबाद', en: 'Ahmedabad' }, { hi: 'चेन्नई', en: 'Chennai' }],
      correct: 2,
      explanationHi: 'ICC Cricket World Cup 2023 का फाइनल नरेंद्र मोदी स्टेडियम, अहमदाबाद में खेला गया।',
      explanationEn: 'The ICC Cricket World Cup 2023 Final was played at Narendra Modi Stadium, Ahmedabad.',
    },
    {
      hi: 'Operation Sindoor (2025) किससे संबंधित है?',
      en: 'What is Operation Sindoor (2025) related to?',
      options: [{ hi: 'बाढ़ राहत अभियान', en: 'Flood relief operation' }, { hi: 'पाकिस्तान में आतंकी ठिकानों पर भारतीय सैन्य हमला', en: 'Indian military strikes on terror camps in Pakistan' }, { hi: 'साइबर सुरक्षा अभियान', en: 'Cybersecurity campaign' }, { hi: 'अंतरिक्ष मिशन', en: 'Space mission' }],
      correct: 1,
      explanationHi: 'ऑपरेशन सिंदूर मई 2025 में पाकिस्तान और POK में आतंकी ठिकानों पर भारत द्वारा किया गया सटीक सैन्य हमला था।',
      explanationEn: 'Operation Sindoor was a precise Indian military strike on terror camps in Pakistan and POK in May 2025.',
    },
  ],
}

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

const QUIZ_DURATION = 10 * 60

// Mini Calendar Component
function MiniCalendar({
  availableDates,
  selectedDate,
  onSelectDate,
}: {
  availableDates: Set<string>
  selectedDate: string
  onSelectDate: (d: string) => void
}) {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(selectedDate + 'T12:00:00')
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthNamesHi = ['जन', 'फर', 'मार', 'अप्र', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्त', 'नव', 'दिस']

  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1))

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft size={16} className="text-gray-500" />
        </button>
        <span className="text-sm font-semibold text-gray-700">
          {monthNamesHi[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'].map((d) => (
          <div key={d} className="text-[10px] text-gray-400 font-medium py-0.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasQuiz = availableDates.has(dateStr)
          const isSelected = dateStr === selectedDate
          return (
            <button
              key={i}
              onClick={() => hasQuiz && onSelectDate(dateStr)}
              disabled={!hasQuiz}
              className={`relative w-7 h-7 mx-auto rounded-full text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-brand-500 text-white'
                  : hasQuiz
                  ? 'hover:bg-brand-50 text-gray-700 cursor-pointer'
                  : 'text-gray-300 cursor-default'
              }`}
            >
              {day}
              {hasQuiz && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SubjectList() {
  const { t } = useLanguage()
  const [allMcqs, setAllMcqs] = useState<MCQRow[]>([])
  const [selectedDate, setSelectedDate] = useState(toDateStr(new Date()))
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set())
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    fetch('/data/mcqs.json')
      .then(r => r.json())
      .then((data: MCQRow[]) => {
        setAllMcqs(data)
        setAvailableDates(new Set(data.map(r => r.date)))
        // If today has no MCQs but data exists, select the closest available date
        const today = toDateStr(new Date())
        const hasToday = data.some(r => r.date === today)
        if (!hasToday && data.length > 0) {
          const sorted = [...new Set(data.map(r => r.date))].sort()
          const future = sorted.find(d => d >= today)
          setSelectedDate(future || sorted[sorted.length - 1])
        }
      })
      .catch(() => {/* use fallback */})
  }, [])

  const todaysMcqs = allMcqs.filter(r => r.date === selectedDate)
  const subjectsForDate = new Set(todaysMcqs.map(r => r.subject))
  const hasJsonQuestions = todaysMcqs.length > 0

  const displayDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('hi-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {t('सभी उपलब्ध टेस्ट', 'All Available Tests')}
      </h1>
      <p className="text-gray-500 mb-6">
        {t('हर विषय में 5 प्रश्न, 10 मिनट का समय', 'Each subject has 5 questions, 10 minutes time')}
      </p>

      {/* Date selector */}
      <div className="mb-6">
        <button
          onClick={() => setShowCalendar(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-brand-300 hover:bg-brand-50 transition-colors shadow-sm"
        >
          <CalendarDays size={16} className="text-brand-500" />
          <span>{t('दिनांक', 'Date')}: {displayDate}</span>
          {availableDates.size > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
              {availableDates.size} {t('दिन', 'days')}
            </span>
          )}
        </button>

        {showCalendar && (
          <div className="mt-3 w-64">
            <MiniCalendar
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={(d) => { setSelectedDate(d); setShowCalendar(false) }}
            />
            {availableDates.size === 0 && (
              <p className="text-xs text-gray-400 mt-2 px-1">
                {t('कोई MCQ डेटा उपलब्ध नहीं। डिफ़ॉल्ट प्रश्न दिखाए जा रहे हैं।', 'No MCQ data found. Showing default questions.')}
              </p>
            )}
          </div>
        )}
      </div>

      {hasJsonQuestions && (
        <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm w-fit">
          <CheckCircle size={14} className="text-emerald-500" />
          {t(`${todaysMcqs.length} नए प्रश्न उपलब्ध`, `${todaysMcqs.length} new questions available`)}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((sub) => {
          const hasNew = hasJsonQuestions && subjectsForDate.has(sub.key)
          return (
            <Link
              key={sub.key}
              href={`/tests?subject=${sub.key}&date=${selectedDate}`}
              className={`flex items-center gap-4 p-5 bg-white rounded-xl border-2 ${sub.color} hover:shadow-lg transition-all group relative`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${sub.iconColor}`}>
                <sub.icon size={26} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg">{t(sub.hi, sub.en)}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>5 {t('प्रश्न', 'Questions')}</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> 10 {t('मिनट', 'mins')}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                {hasNew && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                    {t('नया', 'NEW')}
                  </span>
                )}
                <span className="text-brand-500 font-semibold text-sm flex items-center gap-1">
                  {t('शुरू करें', 'Start')} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function QuizView() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const subjectKey = searchParams.get('subject') || ''
  const dateParam = searchParams.get('date') || toDateStr(new Date())
  const subjectMeta = subjects.find(s => s.key === subjectKey)

  const [questions, setQuestions] = useState<Question[]>([])
  const [loaded, setLoaded] = useState(false)

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<(number | null)[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION)

  useEffect(() => {
    fetch('/data/mcqs.json')
      .then(r => r.json())
      .then((data: MCQRow[]) => {
        const rows = data.filter(r => r.date === dateParam && r.subject === subjectKey)
        if (rows.length > 0) {
          const qs = rows.map(mcqRowToQuestion)
          setQuestions(qs)
          setSelected(Array(qs.length).fill(null))
        } else {
          const fb = fallbackQuestionBank[subjectKey] || []
          setQuestions(fb)
          setSelected(Array(fb.length).fill(null))
        }
        setLoaded(true)
      })
      .catch(() => {
        const fb = fallbackQuestionBank[subjectKey] || []
        setQuestions(fb)
        setSelected(Array(fb.length).fill(null))
        setLoaded(true)
      })
  }, [subjectKey, dateParam])

  const handleSubmit = useCallback(() => setSubmitted(true), [])

  useEffect(() => {
    if (!loaded || submitted || questions.length === 0) return
    if (timeLeft <= 0) { handleSubmit(); return }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, submitted, handleSubmit, loaded, questions.length])

  if (!loaded) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!subjectMeta || questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">{t('यह विषय उपलब्ध नहीं है।', 'This subject is not available.')}</p>
        <Link href="/tests" className="text-brand-500 font-semibold hover:underline">{t('वापस जाएं', 'Go Back')}</Link>
      </div>
    )
  }

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')
  const timerColor = timeLeft < 60 ? 'text-red-600 bg-red-50' : timeLeft < 180 ? 'text-amber-600 bg-amber-50' : 'text-brand-600 bg-brand-50'
  const q = questions[current]
  const score = selected.filter((ans, i) => ans === questions[i].correct).length

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className={`rounded-2xl p-8 text-center mb-6 ${score >= 4 ? 'bg-emerald-50 border-2 border-emerald-200' : score >= 3 ? 'bg-amber-50 border-2 border-amber-200' : 'bg-rose-50 border-2 border-rose-200'}`}>
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md bg-white">
            <Trophy size={36} className={score >= 4 ? 'text-emerald-500' : score >= 3 ? 'text-amber-500' : 'text-rose-400'} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">{score}/{questions.length}</h2>
          <p className="text-gray-500 font-medium mb-2">
            {score >= 4 ? t('शानदार! बहुत बढ़िया।', 'Excellent! Well done.') :
             score >= 3 ? t('अच्छा! और मेहनत करें।', 'Good! Keep practicing.') :
             t('अभ्यास जारी रखें।', 'Keep practicing.')}
          </p>
          <p className="text-sm text-gray-400">{t(subjectMeta.hi, subjectMeta.en)}</p>
        </div>

        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <span className="text-xl">🕐</span>
          <div className="flex-1">
            <p className="font-bold text-amber-800 text-sm">{t('अगला क्विज़ कल सुबह 8 बजे', 'Next quiz tomorrow at 8 AM')}</p>
            <p className="text-amber-600 text-xs">{t('Telegram पर रिमाइंडर पाएं', 'Get reminder on Telegram')}</p>
          </div>
          <a href="https://t.me/gyrussulcus7597647088" target="_blank" rel="noopener noreferrer" className="shrink-0 px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors">
            {t('रिमाइंडर सेट करें', 'Set Reminder')}
          </a>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('विस्तृत समीक्षा', 'Detailed Review')}</h3>
        <div className="flex flex-col gap-4 mb-8">
          {questions.map((qs, i) => {
            const userAns = selected[i]
            const isCorrect = userAns === qs.correct
            return (
              <div key={i} className={`rounded-xl border p-4 ${isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
                <div className="flex items-start gap-2 mb-3">
                  {isCorrect ? <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0" /> : <XCircle size={18} className="text-rose-500 mt-0.5 shrink-0" />}
                  <p className="font-medium text-gray-900 text-sm">{i + 1}. {t(qs.hi, qs.en)}</p>
                </div>
                <div className="ml-6 flex flex-col gap-1.5 mb-3">
                  {qs.options.map((opt, oi) => (
                    <div key={oi} className={`text-xs px-3 py-1.5 rounded-lg ${oi === qs.correct ? 'bg-emerald-200 text-emerald-800 font-semibold' : oi === userAns && !isCorrect ? 'bg-rose-200 text-rose-800' : 'bg-white text-gray-600'}`}>
                      {String.fromCharCode(65 + oi)}. {t(opt.hi, opt.en)}
                      {oi === qs.correct && ' ✓'}
                      {oi === userAns && !isCorrect && ' ✗'}
                    </div>
                  ))}
                </div>
                <div className="ml-6 text-xs text-gray-600 bg-white rounded-lg px-3 py-2">
                  💡 {t(qs.explanationHi, qs.explanationEn)}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { setCurrent(0); setSelected(Array(questions.length).fill(null)); setSubmitted(false); setTimeLeft(QUIZ_DURATION) }}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border-2 border-brand-500 text-brand-600 font-semibold rounded-xl hover:bg-brand-50 transition-colors"
          >
            <RotateCcw size={18} /> {t('दोबारा दें', 'Retry Test')}
          </button>
          <Link href="/tests" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors">
            <Home size={18} /> {t('अन्य टेस्ट', 'Other Tests')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/tests" className="p-2 text-gray-400 hover:text-brand-500 rounded-lg hover:bg-brand-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-xs text-gray-400">{t('विषय', 'Subject')}</p>
            <h2 className="font-bold text-gray-900 text-sm">{t(subjectMeta.hi, subjectMeta.en)}</h2>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono font-bold text-lg ${timerColor}`}>
          <Clock size={18} /> {mins}:{secs}
        </div>
      </div>

      <div className="flex gap-1 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i === current ? 'bg-brand-500' : selected[i] !== null ? 'bg-brand-200' : 'bg-gray-100'}`}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-7 h-7 bg-brand-500 text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">{current + 1}</span>
          <span className="text-xs text-gray-400">{t('प्रश्न', 'Question')} {current + 1}/{questions.length}</span>
        </div>
        <p className="text-gray-900 font-semibold text-lg leading-relaxed mb-6">{t(q.hi, q.en)}</p>

        <div className="flex flex-col gap-3">
          {q.options.map((opt, oi) => {
            const isSelected = selected[current] === oi
            return (
              <button
                key={oi}
                onClick={() => {
                  const newSelected = [...selected]
                  newSelected[current] = oi
                  setSelected(newSelected)
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all text-sm ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-100 hover:border-brand-200 hover:bg-brand-50 text-gray-700'
                }`}
              >
                <span className="mr-3 font-bold text-gray-400">{String.fromCharCode(65 + oi)}.</span>
                {t(opt.hi, opt.en)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrent(c => c - 1)}
          disabled={current === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={16} /> {t('पिछला', 'Previous')}
        </button>

        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                i === current ? 'bg-brand-500 text-white' :
                selected[i] !== null ? 'bg-brand-100 text-brand-600' :
                'bg-gray-100 text-gray-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent(c => c + 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-brand-600 border border-brand-200 rounded-xl hover:bg-brand-50 transition-colors"
          >
            {t('अगला', 'Next')} <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors"
          >
            {t('जमा करें', 'Submit')} <CheckCircle size={16} />
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        {selected.filter(s => s !== null).length}/{questions.length} {t('उत्तर दिए', 'answered')}
        {selected.filter(s => s !== null).length < questions.length && (
          <button onClick={handleSubmit} className="ml-3 text-brand-500 hover:underline font-medium">
            {t('अभी जमा करें', 'Submit now')}
          </button>
        )}
      </p>
    </div>
  )
}

function TestsContent() {
  const searchParams = useSearchParams()
  const subject = searchParams.get('subject')
  if (subject) return <QuizView />
  return <SubjectList />
}

export default function TestsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TestsContent />
    </Suspense>
  )
}
