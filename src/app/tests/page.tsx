'use client'
import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import DateStrip from '@/components/DateStrip'
import { recordAttempt, analyzeGaps, type AttemptTag } from '@/lib/progress'
import {
  Microscope, Scale, BarChart3, Globe, Newspaper,
  Clock, ArrowRight, ArrowLeft, CheckCircle, XCircle,
  Trophy, RotateCcw, Home, Brain, Target
} from 'lucide-react'

const subjects = [
  { key: 'science_tech', icon: Microscope, hi: 'विज्ञान एवं प्रौद्योगिकी', en: 'Science & Technology', color: 'border-blue-200 hover:border-blue-400', iconColor: 'text-blue-600 bg-blue-50' },
  { key: 'polity', icon: Scale, hi: 'भारतीय राजव्यवस्था', en: 'Indian Polity', color: 'border-amber-200 hover:border-amber-400', iconColor: 'text-amber-600 bg-amber-50' },
  { key: 'economy', icon: BarChart3, hi: 'अर्थव्यवस्था', en: 'Economy', color: 'border-emerald-200 hover:border-emerald-400', iconColor: 'text-emerald-600 bg-emerald-50' },
  { key: 'geography', icon: Globe, hi: 'भूगोल एवं पर्यावरण', en: 'Geography & Environment', color: 'border-purple-200 hover:border-purple-400', iconColor: 'text-purple-600 bg-purple-50' },
  { key: 'current_affairs', icon: Newspaper, hi: 'समसामयिकी', en: 'Current Affairs', color: 'border-rose-200 hover:border-rose-400', iconColor: 'text-rose-600 bg-rose-50' },
]

interface Question {
  hi: string
  en: string
  options: { hi: string; en: string }[]
  correct: number
  explanationHi: string
  explanationEn: string
}

const questionBank: Record<string, Question[]> = {
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
      hi: 'प्रकाश की गति लगभग कितनी है?',
      en: 'What is the approximate speed of light?',
      options: [{ hi: '3×10⁸ m/s', en: '3×10⁸ m/s' }, { hi: '3×10⁶ m/s', en: '3×10⁶ m/s' }, { hi: '3×10¹⁰ m/s', en: '3×10¹⁰ m/s' }, { hi: '3×10⁴ m/s', en: '3×10⁴ m/s' }],
      correct: 0,
      explanationHi: 'प्रकाश की गति निर्वात में लगभग 3×10⁸ मीटर प्रति सेकंड (लगभग 3 लाख km/s) होती है।',
      explanationEn: 'The speed of light in vacuum is approximately 3×10⁸ m/s (about 3 lakh km/s).',
    },
    {
      hi: 'ISRO का मुख्यालय कहाँ स्थित है?',
      en: 'Where is ISRO headquartered?',
      options: [{ hi: 'नई दिल्ली', en: 'New Delhi' }, { hi: 'मुंबई', en: 'Mumbai' }, { hi: 'बेंगलुरु', en: 'Bengaluru' }, { hi: 'हैदराबाद', en: 'Hyderabad' }],
      correct: 2,
      explanationHi: 'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) का मुख्यालय बेंगलुरु, कर्नाटक में स्थित है।',
      explanationEn: 'Indian Space Research Organisation (ISRO) is headquartered in Bengaluru, Karnataka.',
    },
    {
      hi: 'चंद्रयान-3 ने चंद्रमा पर कहाँ सॉफ्ट लैंडिंग की?',
      en: 'Where did Chandrayaan-3 make a soft landing on the Moon?',
      options: [{ hi: 'उत्तरी ध्रुव', en: 'North Pole' }, { hi: 'दक्षिणी ध्रुव के निकट', en: 'Near South Pole' }, { hi: 'भूमध्य रेखा', en: 'Equator' }, { hi: 'मारे ट्रैंक्विलिटाटिस', en: 'Mare Tranquillitatis' }],
      correct: 1,
      explanationHi: 'चंद्रयान-3 ने 23 अगस्त 2023 को चंद्रमा के दक्षिणी ध्रुव के निकट सफलतापूर्वक सॉफ्ट लैंडिंग की।',
      explanationEn: 'Chandrayaan-3 successfully soft-landed near the Moon\'s South Pole on August 23, 2023.',
    },
    {
      hi: 'भारत के राष्ट्रीय सुपरकंप्यूटिंग मिशन (NSM) के तहत निम्न में से कौन सी इकाई इसे संचालित करती है?',
      en: 'Under India\'s National Supercomputing Mission (NSM), which entity implements it?',
      options: [{ hi: 'CDAC एवं IISc संयुक्त रूप से', en: 'CDAC and IISc jointly' }, { hi: 'केवल ISRO', en: 'ISRO only' }, { hi: 'केवल DRDO', en: 'DRDO only' }, { hi: 'NIC', en: 'NIC' }],
      correct: 0,
      explanationHi: 'NSM का संचालन CDAC (Pune) एवं IISc (Bengaluru) मिलकर करते हैं। इसे MeitY एवं DST संयुक्त रूप से वित्तपोषित करते हैं।',
      explanationEn: 'The NSM is implemented jointly by CDAC (Pune) and IISc (Bengaluru), funded jointly by MeitY and DST.',
    },
    {
      hi: 'mRNA टीके किस सिद्धांत पर कार्य करते हैं?',
      en: 'On what principle do mRNA vaccines work?',
      options: [{ hi: 'निष्क्रिय वायरस', en: 'Inactivated virus' }, { hi: 'जीवित क्षीण वायरस', en: 'Live attenuated virus' }, { hi: 'कोशिका को स्पाइक प्रोटीन बनाने का निर्देश', en: 'Instructing cells to make spike protein' }, { hi: 'एंटीबॉडी सीधे इंजेक्ट करना', en: 'Direct antibody injection' }],
      correct: 2,
      explanationHi: 'mRNA टीका कोशिकाओं को निर्देशित करता है कि वे वायरस के स्पाइक प्रोटीन का एक भाग बनाएं, जिससे प्रतिरक्षा प्रणाली सक्रिय होती है।',
      explanationEn: 'An mRNA vaccine instructs the body\'s cells to produce a piece of the viral spike protein, triggering an immune response.',
    },
    {
      hi: 'CRISPR-Cas9 का मुख्य उपयोग क्या है?',
      en: 'What is the primary use of CRISPR-Cas9?',
      options: [{ hi: 'कैंसर निदान', en: 'Cancer diagnosis' }, { hi: 'जीन संपादन', en: 'Gene editing' }, { hi: 'टीका निर्माण', en: 'Vaccine production' }, { hi: 'सौर ऊर्जा', en: 'Solar energy' }],
      correct: 1,
      explanationHi: 'CRISPR-Cas9 एक जीन संपादन तकनीक है जो DNA अनुक्रम को सटीक रूप से काटने और बदलने की अनुमति देती है। 2020 का रसायन नोबेल पुरस्कार इसी के लिए था।',
      explanationEn: 'CRISPR-Cas9 is a gene-editing technology that allows precise cutting and modification of DNA sequences. It won the 2020 Nobel Prize in Chemistry.',
    },
    {
      hi: 'किसी पदार्थ की pH मान 7 हो तो वह क्या है?',
      en: 'A substance with a pH of 7 is what?',
      options: [{ hi: 'अम्लीय', en: 'Acidic' }, { hi: 'क्षारीय', en: 'Basic' }, { hi: 'उदासीन', en: 'Neutral' }, { hi: 'लवणीय', en: 'Saline' }],
      correct: 2,
      explanationHi: 'pH 7 उदासीन (न्यूट्रल) है। 7 से कम अम्लीय, 7 से अधिक क्षारीय। शुद्ध जल का pH 7 होता है।',
      explanationEn: 'A pH of 7 is neutral. Below 7 is acidic, above 7 is basic. Pure water has a pH of 7.',
    },
    {
      hi: 'मिशन गगनयान के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. गगनयान का लक्ष्य 3 अंतरिक्ष यात्रियों को 400 km की निम्न-पृथ्वी कक्षा में 3 दिन के लिए भेजना है।\n2. व्योममित्र मानव-रहित परीक्षण उड़ानों के लिए डिज़ाइन किया गया ह्यूमनॉइड रोबोट है।\n3. चयनित अंतरिक्ष-यात्रियों ने रूस के यूरी गगारिन कॉस्मोनॉट प्रशिक्षण केंद्र में प्रशिक्षण लिया।\nइनमें से कौन से कथन सही हैं?',
      en: 'Consider the following statements about Mission Gaganyaan:\n1. Gaganyaan aims to send 3 astronauts to a 400 km low-earth orbit for 3 days.\n2. Vyommitra is a humanoid robot designed for uncrewed test flights.\n3. The selected astronauts trained at Russia\'s Yuri Gagarin Cosmonaut Training Centre.\nWhich of the above are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'तीनों कथन सही हैं। गगनयान भारत का पहला मानव अंतरिक्ष यान कार्यक्रम है।',
      explanationEn: 'All three statements are correct. Gaganyaan is India\'s first crewed spaceflight programme.',
    },
    {
      hi: 'CRISPR-Cas9 तकनीक के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. यह एक जीन-संपादन उपकरण है जो जीवाणु प्रतिरक्षा तंत्र से विकसित हुआ।\n2. 2020 का रसायन विज्ञान का नोबेल पुरस्कार Emmanuelle Charpentier एवं Jennifer Doudna को CRISPR के लिए दिया गया।\n3. \'Casgevy\' (exa-cel) — CRISPR-आधारित पहली अनुमोदित चिकित्सा — सिकल सेल रोग के लिए है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements about CRISPR-Cas9:\n1. It is a gene-editing tool derived from a bacterial immune defense mechanism.\n2. The 2020 Chemistry Nobel was awarded to Emmanuelle Charpentier and Jennifer Doudna for CRISPR.\n3. \'Casgevy\' (exa-cel) — the first approved CRISPR-based therapy — treats sickle cell disease.\nWhich of the above are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'तीनों कथन सही हैं। Casgevy को US FDA ने दिसंबर 2023 में और UK MHRA ने नवंबर 2023 में अनुमोदित किया।',
      explanationEn: 'All three are correct. Casgevy was approved by the US FDA in December 2023 and the UK MHRA in November 2023.',
    },
    {
      hi: 'राष्ट्रीय क्वांटम मिशन के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. इसे केंद्रीय मंत्रिमंडल ने अप्रैल 2023 में स्वीकृति दी।\n2. यह विज्ञान एवं प्रौद्योगिकी विभाग (DST) के अधीन क्रियान्वित है।\n3. इसका लक्ष्य 8 वर्षों में 50 से 1,000 भौतिक qubit वाले क्वांटम कंप्यूटर विकसित करना है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the National Quantum Mission:\n1. It was approved by the Union Cabinet in April 2023.\n2. It is implemented by the Department of Science and Technology (DST).\n3. Its target is to develop quantum computers with 50–1,000 physical qubits within 8 years.\nWhich of the above are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। मिशन का कुल बजट लगभग ₹6,003 करोड़ (2023-31) है।',
      explanationEn: 'All correct. The mission has an outlay of approximately ₹6,003 crore (2023-31).',
    },
    {
      hi: 'भारत सेमीकंडक्टर मिशन (ISM) के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. ISM डिजिटल इंडिया कॉर्पोरेशन के अंतर्गत MeitY द्वारा क्रियान्वित है।\n2. Tata Electronics-PSMC संयुक्त उद्यम भारत की पहली व्यावसायिक सेमीकंडक्टर fabrication इकाई स्थापित कर रहा है।\n3. Micron Technology गुजरात के साणंद में ATMP सुविधा स्थापित कर रही है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the India Semiconductor Mission (ISM):\n1. ISM is implemented by Digital India Corporation under MeitY.\n2. The Tata Electronics-PSMC joint venture is setting up India\'s first commercial semiconductor fabrication unit.\n3. Micron Technology is establishing an ATMP (Assembly, Testing, Marking and Packaging) facility in Sanand, Gujarat.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 3', en: '3 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। Tata-PSMC संयंत्र धोलेरा (गुजरात) में प्रस्तावित। Micron की साणंद ATMP की आधारशिला 2023 में रखी गई।',
      explanationEn: 'All correct. The Tata-PSMC fab is proposed at Dholera (Gujarat); Micron\'s Sanand ATMP was inaugurated in 2023.',
    },
    {
      hi: 'PSLV एवं संबंधित मिशनों पर निम्नलिखित कथनों पर विचार करें:\n1. PSLV का पूर्ण रूप Polar Satellite Launch Vehicle है।\n2. PSLV एक चार-चरण रॉकेट है जिसमें ठोस एवं तरल — दोनों — प्रणोदक मिश्रित हैं।\n3. आदित्य-L1 मिशन को PSLV-C57 द्वारा सितंबर 2023 में लॉन्च किया गया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on PSLV and related missions:\n1. PSLV stands for Polar Satellite Launch Vehicle.\n2. PSLV is a four-stage rocket using a mix of solid and liquid propellants.\n3. The Aditya-L1 mission was launched by PSLV-C57 in September 2023.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। PSLV के चरण 1 एवं 3 ठोस; चरण 2 एवं 4 तरल प्रणोदक का उपयोग करते हैं।',
      explanationEn: 'All correct. PSLV stages 1 and 3 use solid propellants while stages 2 and 4 use liquid propellants.',
    },
    {
      hi: 'मार्स ऑर्बिटर मिशन (मंगलयान) के संदर्भ में निम्न कथनों पर विचार करें:\n1. इसे ISRO ने नवंबर 2013 में लॉन्च किया।\n2. भारत मंगल कक्षा तक पहुँचने वाला पहला एशियाई देश बना।\n3. यह भारत का पहला अंतर-ग्रहीय मिशन था।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements about the Mars Orbiter Mission (Mangalyaan):\n1. ISRO launched it in November 2013.\n2. India became the first Asian nation to reach Mars orbit.\n3. It was India\'s first interplanetary mission.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। MOM ने पहले प्रयास में मंगल कक्षा प्राप्त करने वाला पहला देश बनाकर इतिहास रचा।',
      explanationEn: 'All correct. MOM made history by becoming the first nation to reach Mars orbit on its maiden attempt.',
    },
    {
      hi: 'INS विक्रांत के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह भारत का पहला स्वदेशी रूप से निर्मित विमानवाहक पोत है।\n2. इसे 2022 में कमीशन किया गया।\n3. इसका निर्माण कोचीन शिपयार्ड लिमिटेड (CSL) ने किया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements about INS Vikrant:\n1. It is India\'s first indigenously built aircraft carrier.\n2. It was commissioned in 2022.\n3. It was built by Cochin Shipyard Limited (CSL).\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 3', en: '3 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 2 सितंबर 2022 को कोचीन में कमीशन।',
      explanationEn: 'All correct. Commissioned at Kochi on 2 September 2022.',
    },
    {
      hi: 'NavIC के संदर्भ में निम्न कथनों पर विचार करें:\n1. NavIC भारत की क्षेत्रीय उपग्रह नेविगेशन प्रणाली है।\n2. इसे IRNSS के नाम से भी जाना जाता है।\n3. यह 7 उपग्रहों की नक्षत्र-संरचना पर आधारित है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on NavIC:\n1. NavIC is India\'s regional satellite navigation system.\n2. It is also called IRNSS.\n3. It is based on a constellation of 7 satellites.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। NavIC L5 एवं S-band में सेवा प्रदान करता है।',
      explanationEn: 'All correct. NavIC provides service in L5 and S bands.',
    },
    {
      hi: 'AstroSat के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह भारत का पहला समर्पित बहु-तरंग-दैर्ध्य अंतरिक्ष वेधशाला है।\n2. इसे ISRO ने 2015 में लॉन्च किया।\n3. यह UV, ऑप्टिकल एवं X-ray तरंग-दैर्ध्य में एक साथ अवलोकन कर सकता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on AstroSat:\n1. It is India\'s first dedicated multi-wavelength space observatory.\n2. ISRO launched it in 2015.\n3. It can observe in UV, optical, and X-ray simultaneously.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 28 सितंबर 2015 को PSLV-C30 द्वारा लॉन्च।',
      explanationEn: 'All correct. Launched 28 September 2015 by PSLV-C30.',
    },
    {
      hi: 'तेजस LCA के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह एकल-इंजन बहु-भूमिका हल्का लड़ाकू विमान है।\n2. इसका विकास ADA एवं HAL ने किया।\n3. भारतीय वायुसेना ने 2021 में Mark-1A संस्करण के 83 विमानों का ऑर्डर दिया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Tejas LCA:\n1. It is a single-engine, multi-role light combat aircraft.\n2. It was developed by ADA and HAL.\n3. The IAF placed an order for 83 Mark-1A aircraft in 2021.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 3', en: '3 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। ADA — Aeronautical Development Agency, बेंगलुरु।',
      explanationEn: 'All correct. ADA — Aeronautical Development Agency, Bengaluru.',
    },
    {
      hi: 'राष्ट्रीय हरित हाइड्रोजन मिशन के संदर्भ में निम्न कथनों पर विचार करें:\n1. इसे जनवरी 2023 में स्वीकृति मिली।\n2. इसका कुल परिव्यय लगभग ₹19,744 करोड़ है।\n3. लक्ष्य 2030 तक 5 MMT/वर्ष हरित हाइड्रोजन उत्पादन का है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the National Green Hydrogen Mission:\n1. It was approved in January 2023.\n2. The total outlay is approximately ₹19,744 crore.\n3. The target is 5 MMT per year of green hydrogen production by 2030.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। SIGHT एवं हब इसके दो प्रमुख घटक।',
      explanationEn: 'All correct. SIGHT and Hub are its two main components.',
    },
    {
      hi: 'भारत के अंटार्कटिक मिशन के संदर्भ में निम्न कथनों पर विचार करें:\n1. भारत का पहला अंटार्कटिक स्टेशन \'दक्षिण गंगोत्री\' था।\n2. \'मैत्री\' को 1989 में कमीशन किया गया।\n3. \'भारती\' को 2012 में चालू किया गया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India\'s Antarctic stations:\n1. India\'s first Antarctic station was \'Dakshin Gangotri\'.\n2. \'Maitri\' was commissioned in 1989.\n3. \'Bharati\' was inaugurated in 2012.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। दक्षिण गंगोत्री (1983) अब निष्क्रिय; मैत्री एवं भारती सक्रिय।',
      explanationEn: 'All correct. Dakshin Gangotri (1983) is now decommissioned; Maitri and Bharati remain active.',
    },
    {
      hi: 'CERVAVAC टीके के संदर्भ में निम्न कथनों पर विचार करें:\n1. CERVAVAC भारत का पहला स्वदेशी HPV टीका है।\n2. इसे सीरम इंस्टीट्यूट ऑफ इंडिया (SII) ने विकसित किया।\n3. यह HPV स्ट्रेन 6, 11, 16 एवं 18 के विरुद्ध सुरक्षा प्रदान करता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the CERVAVAC vaccine:\n1. CERVAVAC is India\'s first indigenous HPV vaccine.\n2. It was developed by the Serum Institute of India (SII).\n3. It protects against HPV strains 6, 11, 16, and 18.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 3', en: '3 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 2022 में लॉन्च। यह सर्वाइकल कैंसर रोकथाम में सहायक।',
      explanationEn: 'All correct. Launched in 2022; supports cervical-cancer prevention.',
    },
    {
      hi: 'PSLV एवं GSLV के संदर्भ में निम्न कथनों पर विचार करें:\n1. PSLV का उपयोग मुख्यतः सूर्य-समकालिक एवं ध्रुवीय कक्षाओं के लिए किया जाता है।\n2. GSLV भू-स्थैतिक कक्षाओं के लिए डिज़ाइन है।\n3. GSLV Mark-III स्वदेशी क्रायोजेनिक इंजन का उपयोग करता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on PSLV and GSLV:\n1. PSLV is used mainly for sun-synchronous and polar orbits.\n2. GSLV is designed for geostationary orbits.\n3. GSLV Mark-III uses an indigenous cryogenic engine.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। GSLV Mark-III को LVM3 भी कहा जाता है।',
      explanationEn: 'All correct. GSLV Mark-III is also designated LVM3.',
    },
    {
      hi: 'Drone Rules 2021 के संदर्भ में निम्न कथनों पर विचार करें:\n1. इन नियमों ने मार्च 2021 के UAS Rules को प्रतिस्थापित किया।\n2. इन्होंने \'Digital Sky\' प्लेटफार्म पेश किया।\n3. ड्रोन भार के आधार पर पाँच श्रेणियों में वर्गीकृत हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Drone Rules 2021:\n1. They replaced the UAS Rules of March 2021.\n2. They introduced the \'Digital Sky\' platform.\n3. Drones are categorised into five categories by weight.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी सही। श्रेणियाँ — Nano (<250g), Micro (250g-2kg), Small (2-25kg), Medium (25-150kg), Large (>150kg)।',
      explanationEn: 'All correct. Categories — Nano (<250g), Micro (250g-2kg), Small (2-25kg), Medium (25-150kg), Large (>150kg).',
    },
    {
      hi: 'eSanjeevani के संदर्भ में निम्न कथनों पर विचार करें:\n1. eSanjeevani भारत की राष्ट्रीय टेलीमेडिसिन सेवा है।\n2. इसका संचालन MoHFW द्वारा होता है।\n3. यह आयुष्मान भारत डिजिटल मिशन के तहत संचालित है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on eSanjeevani:\n1. eSanjeevani is India\'s national telemedicine service.\n2. It is operated by MoHFW.\n3. It runs under the Ayushman Bharat Digital Mission.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। eSanjeevani-AB-HWC एवं eSanjeevani-OPD दोनों रूपों में।',
      explanationEn: 'All correct. Operates as both eSanjeevani-AB-HWC and eSanjeevani-OPD.',
    },
    {
      hi: 'भारत की Bharat 6G विज़न के संदर्भ में निम्न कथनों पर विचार करें:\n1. इसे प्रधानमंत्री द्वारा 2023 में लॉन्च किया गया।\n2. इसका लक्ष्य 6G प्रौद्योगिकी में नेतृत्व प्राप्त करना है।\n3. Bharat 6G Alliance भी इसका हिस्सा है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Bharat 6G Vision:\n1. It was launched by the Prime Minister in 2023.\n2. It aims at leadership in 6G technology.\n3. The Bharat 6G Alliance is part of this initiative.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी सही। DoT एवं ITU के साथ साझेदारी।',
      explanationEn: 'All correct. In partnership with DoT and ITU.',
    },
    {
      hi: 'Mission Indradhanush के संदर्भ में निम्न कथनों पर विचार करें:\n1. इसकी शुरुआत 2014 में हुई।\n2. यह सार्वत्रिक टीकाकरण कार्यक्रम (UIP) के तहत आता है।\n3. यह 2 वर्ष से कम आयु के बच्चों एवं गर्भवती महिलाओं को लक्षित करता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Mission Indradhanush:\n1. It was launched in 2014.\n2. It operates under the Universal Immunisation Programme (UIP).\n3. It targets children under 2 years and pregnant women.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 3', en: '3 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। MoHFW के तहत; 12 बीमारियों के विरुद्ध सुरक्षा।',
      explanationEn: 'All correct. Under MoHFW; covers 12 diseases.',
    },
    {
      hi: 'BrahMos मिसाइल के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह भारत-रूस का संयुक्त उपक्रम है।\n2. यह दुनिया की सबसे तेज़ ऑपरेशनल क्रूज़ मिसाइलों में से एक है।\n3. इसका 2022 में पहला बड़ा निर्यात ऑर्डर फिलीपींस से प्राप्त हुआ।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements about BrahMos:\n1. It is an India-Russia joint venture.\n2. It is among the world\'s fastest operational cruise missiles.\n3. Its first major export order, in 2022, was from the Philippines.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी सही। नाम \'ब्रह्मपुत्र\' एवं \'मॉस्कवा\' नदियों पर आधारित।',
      explanationEn: 'All correct. Name combines the rivers Brahmaputra and Moskva.',
    },
    {
      hi: 'Mission Divyastra के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह Agni-V मिसाइल का MIRV परीक्षण था।\n2. इसका सफल परीक्षण मार्च 2024 में हुआ।\n3. MIRV का अर्थ है — Multiple Independently Targetable Re-entry Vehicle।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Mission Divyastra:\n1. It was an MIRV test of the Agni-V missile.\n2. The test was successful in March 2024.\n3. MIRV stands for Multiple Independently Targetable Re-entry Vehicle.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। DRDO द्वारा संचालित। भारत MIRV क्षमता वाला कुछ-गिने देशों में।',
      explanationEn: 'All correct. Conducted by DRDO. India is among the few countries with MIRV capability.',
    },
    {
      hi: 'IndiaAI Mission के संदर्भ में निम्न कथनों पर विचार करें:\n1. इसे केंद्रीय मंत्रिमंडल ने मार्च 2024 में स्वीकृति दी।\n2. इसका कुल परिव्यय लगभग ₹10,372 करोड़ है।\n3. यह MeitY के तहत क्रियान्वित है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the IndiaAI Mission:\n1. The Cabinet approved it in March 2024.\n2. Its total outlay is approximately ₹10,372 crore.\n3. It is implemented under MeitY.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी सही। 7 स्तंभ — IndiaAI Compute, Innovation Centre, Datasets, Application Dev, FutureSkills, Startup Financing, Safe & Trusted AI।',
      explanationEn: 'All correct. Seven pillars — IndiaAI Compute, Innovation Centre, Datasets, Application Dev, FutureSkills, Startup Financing, Safe & Trusted AI.',
    },
    {
      hi: 'Bhuvan प्लेटफार्म के संदर्भ में निम्न कथनों पर विचार करें:\n1. Bhuvan ISRO का भारतीय जियो-प्लेटफार्म है।\n2. इसे 2009 में लॉन्च किया गया।\n3. यह सरकारी विभागों के लिए उपग्रह छवि-आधारित विश्लेषण प्रदान करता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Bhuvan:\n1. Bhuvan is ISRO\'s Indian geo-platform.\n2. It was launched in 2009.\n3. It provides satellite-imagery-based analytics for government departments.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 3', en: '3 only' }],
      correct: 2,
      explanationHi: 'सभी सही। PM Gati Shakti का भू-स्थानिक डेटा-आधार Bhuvan पर निर्भर।',
      explanationEn: 'All correct. The geospatial data layer of PM Gati Shakti relies on Bhuvan.',
    },
  ],
  polity: [
    {
      hi: 'संविधान का कौन सा अनुच्छेद मौलिक अधिकारों से संबंधित है?',
      en: 'Which part of the Constitution deals with Fundamental Rights?',
      options: [{ hi: 'भाग II (अनु. 5-11)', en: 'Part II (Art. 5-11)' }, { hi: 'भाग III (अनु. 12-35)', en: 'Part III (Art. 12-35)' }, { hi: 'भाग IV (अनु. 36-51)', en: 'Part IV (Art. 36-51)' }, { hi: 'भाग V (अनु. 52-151)', en: 'Part V (Art. 52-151)' }],
      correct: 1,
      explanationHi: 'मौलिक अधिकार संविधान के भाग III (अनुच्छेद 12 से 35) में वर्णित हैं।',
      explanationEn: 'Fundamental Rights are enshrined in Part III (Articles 12-35) of the Constitution.',
    },
    {
      hi: 'भारत के प्रधानमंत्री की नियुक्ति कौन करता है?',
      en: 'Who appoints the Prime Minister of India?',
      options: [{ hi: 'उपराष्ट्रपति', en: 'Vice President' }, { hi: 'राष्ट्रपति', en: 'President' }, { hi: 'लोकसभा अध्यक्ष', en: 'Speaker of Lok Sabha' }, { hi: 'सर्वोच्च न्यायालय के मुख्य न्यायाधीश', en: 'Chief Justice of India' }],
      correct: 1,
      explanationHi: 'अनुच्छेद 75 के अनुसार प्रधानमंत्री की नियुक्ति राष्ट्रपति द्वारा की जाती है।',
      explanationEn: 'According to Article 75, the Prime Minister is appointed by the President.',
    },
    {
      hi: 'भारत के संविधान में वर्तमान में कितनी अनुसूचियाँ हैं?',
      en: 'How many schedules are there in the Indian Constitution currently?',
      options: [{ hi: '8', en: '8' }, { hi: '10', en: '10' }, { hi: '12', en: '12' }, { hi: '14', en: '14' }],
      correct: 2,
      explanationHi: 'वर्तमान में भारतीय संविधान में 12 अनुसूचियाँ हैं। मूल रूप से 8 थीं।',
      explanationEn: 'Currently there are 12 schedules in the Indian Constitution. Originally there were 8.',
    },
    {
      hi: 'भारत के संविधान का कौन सा संशोधन \'मिनी-संविधान\' कहलाता है?',
      en: 'Which amendment to the Indian Constitution is called the "Mini-Constitution"?',
      options: [{ hi: '24वां', en: '24th' }, { hi: '42वां', en: '42nd' }, { hi: '44वां', en: '44th' }, { hi: '52वां', en: '52nd' }],
      correct: 1,
      explanationHi: '42वां संशोधन (1976) को मिनी-संविधान कहा जाता है क्योंकि इसने प्रस्तावना सहित संविधान के कई हिस्सों में व्यापक बदलाव किए।',
      explanationEn: 'The 42nd Amendment (1976) is called the Mini-Constitution because it made wide-ranging changes to many parts of the Constitution including the Preamble.',
    },
    {
      hi: 'राज्यसभा के सदस्यों की अधिकतम संख्या कितनी हो सकती है?',
      en: 'What is the maximum strength of the Rajya Sabha?',
      options: [{ hi: '238', en: '238' }, { hi: '245', en: '245' }, { hi: '250', en: '250' }, { hi: '270', en: '270' }],
      correct: 2,
      explanationHi: 'अनुच्छेद 80 के अनुसार राज्यसभा की अधिकतम सदस्य संख्या 250 हो सकती है — 238 निर्वाचित + 12 राष्ट्रपति द्वारा मनोनीत।',
      explanationEn: 'Per Article 80, the Rajya Sabha can have a maximum of 250 members — 238 elected + 12 nominated by the President.',
    },
    {
      hi: 'किस अनुच्छेद के तहत राष्ट्रपति वित्तीय आपातकाल की घोषणा कर सकते हैं?',
      en: 'Under which article can the President proclaim a Financial Emergency?',
      options: [{ hi: 'अनुच्छेद 352', en: 'Article 352' }, { hi: 'अनुच्छेद 356', en: 'Article 356' }, { hi: 'अनुच्छेद 360', en: 'Article 360' }, { hi: 'अनुच्छेद 365', en: 'Article 365' }],
      correct: 2,
      explanationHi: 'अनुच्छेद 360 वित्तीय आपातकाल से संबंधित है। आज तक भारत में इसकी घोषणा कभी नहीं की गई है।',
      explanationEn: 'Article 360 deals with Financial Emergency. It has never been invoked in India\'s history.',
    },
    {
      hi: 'पंचायती राज व्यवस्था को संवैधानिक दर्जा देने वाला संशोधन कौन सा है?',
      en: 'Which amendment gave constitutional status to the Panchayati Raj system?',
      options: [{ hi: '71वां', en: '71st' }, { hi: '73वां', en: '73rd' }, { hi: '74वां', en: '74th' }, { hi: '86वां', en: '86th' }],
      correct: 1,
      explanationHi: '73वां संविधान संशोधन (1992) ने ग्रामीण पंचायतों को संवैधानिक दर्जा दिया तथा भाग IX एवं 11वीं अनुसूची जोड़ी।',
      explanationEn: 'The 73rd Constitutional Amendment (1992) gave constitutional status to rural Panchayats and added Part IX and the Eleventh Schedule.',
    },
    {
      hi: 'भारत में एकल नागरिकता का प्रावधान किस देश के संविधान से लिया गया?',
      en: 'India\'s provision of single citizenship is borrowed from which country\'s constitution?',
      options: [{ hi: 'अमेरिका', en: 'USA' }, { hi: 'ब्रिटेन', en: 'UK' }, { hi: 'कनाडा', en: 'Canada' }, { hi: 'ऑस्ट्रेलिया', en: 'Australia' }],
      correct: 1,
      explanationHi: 'भारत का एकल नागरिकता का प्रावधान ब्रिटिश संविधान से लिया गया है। संघीय व्यवस्था होने के बावजूद भारत में केंद्र और राज्य स्तर पर एक ही नागरिकता है।',
      explanationEn: 'India borrowed the single-citizenship principle from the UK Constitution. Despite a federal structure, India has unified citizenship at Centre and State levels.',
    },
    {
      hi: 'भारत निर्वाचन आयोग के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. इसकी स्थापना संविधान के अनुच्छेद 324 के अंतर्गत हुई।\n2. 1989 तक यह एकल-सदस्यीय निकाय था।\n3. मुख्य निर्वाचन आयुक्त को सर्वोच्च न्यायालय के न्यायाधीश के समान प्रक्रिया से ही हटाया जा सकता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements about the Election Commission of India:\n1. It is established under Article 324 of the Constitution.\n2. Until 1989 it was a single-member body.\n3. The Chief Election Commissioner can be removed only by a process similar to that of a Supreme Court judge.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'तीनों कथन सही। 1989 में पहली बार ECI को बहु-सदस्यीय निकाय बनाया गया (फिर 1990 में एकल किया, फिर 1993 से स्थायी रूप से बहु-सदस्यीय)।',
      explanationEn: 'All three are correct. The ECI first became multi-member in 1989, briefly reverted in 1990, and has been multi-member since 1993.',
    },
    {
      hi: 'अनुच्छेद 368 एवं संविधान संशोधन पर निम्नलिखित कथनों पर विचार करें:\n1. अनुच्छेद 368 संविधान संशोधन की प्रक्रिया से संबंधित है।\n2. संविधान के कुछ प्रावधानों में अनुच्छेद 368 का प्रयोग किए बिना संसद के साधारण बहुमत से संशोधन संभव है।\n3. \'मूल संरचना\' (Basic Structure) सिद्धांत सर्वप्रथम केशवानंद भारती (1973) मामले में स्पष्ट किया गया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements about Article 368 and constitutional amendment:\n1. Article 368 deals with the procedure of amendment.\n2. Some constitutional provisions can be amended by simple parliamentary majority without invoking Article 368.\n3. The Basic Structure doctrine was first articulated in Kesavananda Bharati (1973).\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 3', en: '3 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। उदाहरण: नए राज्यों का गठन, राज्यसभा सदस्यों की संख्या में परिवर्तन — साधारण बहुमत से संभव।',
      explanationEn: 'All correct. Examples of simple-majority amendments include creating new states or altering Rajya Sabha membership.',
    },
    {
      hi: 'दलबदल विरोधी कानून के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. इसे 52वें संविधान संशोधन (1985) द्वारा लागू किया गया।\n2. यह संविधान की दसवीं अनुसूची में निहित है।\n3. इसके तहत स्पीकर का निर्णय न्यायिक समीक्षा से बाहर है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Anti-Defection Law:\n1. It was enacted by the 52nd Constitutional Amendment, 1985.\n2. It is contained in the Tenth Schedule of the Constitution.\n3. The Speaker\'s decision under this law is not subject to judicial review.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — Kihoto Hollohan v. Zachillhu (1992) में SC ने स्पष्ट किया कि स्पीकर का निर्णय न्यायिक समीक्षा के अधीन है।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — in Kihoto Hollohan v. Zachillhu (1992), the SC held that the Speaker\'s decision is subject to judicial review.',
    },
    {
      hi: 'लोकपाल के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. लोकपाल एवं लोकायुक्त अधिनियम 2013 में पारित हुआ।\n2. प्रधानमंत्री के विरुद्ध जाँच के लिए लोकपाल की पूर्ण पीठ के दो-तिहाई बहुमत की पूर्व स्वीकृति आवश्यक है।\n3. न्यायमूर्ति पिनाकी चंद्र घोष भारत के पहले लोकपाल थे।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Lokpal:\n1. The Lokpal and Lokayuktas Act was passed in 2013.\n2. To investigate the Prime Minister, prior approval of two-thirds of the full Lokpal bench is required.\n3. Justice Pinaki Chandra Ghose was India\'s first Lokpal.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। न्यायमूर्ति घोष ने मार्च 2019 में पहले लोकपाल के रूप में शपथ ली।',
      explanationEn: 'All correct. Justice Ghose was sworn in as the first Lokpal in March 2019.',
    },
    {
      hi: 'नागरिकता संशोधन अधिनियम (CAA) 2019 के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. CAA 2019 ने नागरिकता अधिनियम 1955 में संशोधन किया।\n2. यह पाकिस्तान, बांग्लादेश एवं अफगानिस्तान के सताए गए अल्पसंख्यकों के लिए नागरिकता का मार्ग प्रदान करता है।\n3. इसके नियमों की अधिसूचना 11 मार्च 2024 को जारी की गई जिसके बाद यह प्रभावी हुआ।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Citizenship Amendment Act (CAA) 2019:\n1. CAA 2019 amended the Citizenship Act, 1955.\n2. It provides a path to citizenship for persecuted minorities from Pakistan, Bangladesh and Afghanistan.\n3. Its rules were notified on 11 March 2024, after which the Act came into force.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। CAA 2019 हिंदू, सिख, बौद्ध, जैन, पारसी एवं ईसाई — छह समुदायों — को 31 दिसंबर 2014 तक के प्रवासियों के लिए कवर करता है।',
      explanationEn: 'All correct. CAA 2019 covers six communities — Hindus, Sikhs, Buddhists, Jains, Parsis and Christians — who entered before 31 December 2014.',
    },
    {
      hi: 'भारत के संविधान की प्रस्तावना के संदर्भ में निम्न कथनों पर विचार करें:\n1. \'समाजवादी\' एवं \'धर्मनिरपेक्ष\' शब्द 42वें संशोधन (1976) से जोड़े गए।\n2. प्रस्तावना संविधान का भाग है।\n3. प्रस्तावना न्यायपालिका द्वारा संशोधित नहीं की जा सकती।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Preamble of the Indian Constitution:\n1. The words \'Socialist\' and \'Secular\' were added by the 42nd Amendment (1976).\n2. The Preamble is part of the Constitution.\n3. The Preamble cannot be amended by the judiciary.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। Kesavananda Bharati (1973) ने प्रस्तावना को संविधान का भाग माना।',
      explanationEn: 'All correct. Kesavananda Bharati (1973) held the Preamble to be part of the Constitution.',
    },
    {
      hi: 'राष्ट्रपति की क्षमादान शक्ति (अनुच्छेद 72) के संदर्भ में निम्न कथनों पर विचार करें:\n1. राष्ट्रपति केवल मंत्रिमंडल की सलाह पर ही क्षमादान दे सकते हैं।\n2. राष्ट्रपति की क्षमा शक्ति न्यायिक समीक्षा से बाहर है।\n3. राष्ट्रपति केवल सैन्य न्यायालय (court martial) के निर्णय में क्षमादान दे सकते हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the President\'s pardoning power (Article 72):\n1. The President can pardon only on the advice of the Cabinet.\n2. The President\'s pardon power is beyond judicial review.\n3. The President can pardon only court-martial decisions.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 3,
      explanationHi: 'केवल कथन 1 सही। कथन 2 गलत — Maru Ram (1981) एवं Kehar Singh (1989) में SC ने न्यायिक समीक्षा का अधिकार स्थापित किया। कथन 3 गलत — राष्ट्रपति court martial, मृत्युदंड, संघ-कानून के तहत अपराधों में क्षमादान दे सकते हैं।',
      explanationEn: 'Only statement 1 is correct. Statement 2 is wrong — Maru Ram (1981) and Kehar Singh (1989) established judicial review. Statement 3 is wrong — the President can pardon court martial, death sentence, and offences under Union law.',
    },
    {
      hi: 'भारत के नियंत्रक एवं महालेखा परीक्षक (CAG) के संदर्भ में निम्न कथनों पर विचार करें:\n1. CAG की नियुक्ति राष्ट्रपति द्वारा होती है।\n2. CAG को सर्वोच्च न्यायालय के न्यायाधीश के समान प्रक्रिया से ही हटाया जा सकता है।\n3. CAG का कार्यकाल 6 वर्ष या 65 वर्ष आयु — जो पहले हो — तक होता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the CAG (Comptroller and Auditor General):\n1. The CAG is appointed by the President.\n2. The CAG can be removed only via the same process as a Supreme Court judge.\n3. The tenure is 6 years or up to age 65, whichever is earlier.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। डॉ. अम्बेडकर ने CAG को \'संविधान की चार स्तंभों में सबसे महत्वपूर्ण\' कहा।',
      explanationEn: 'All correct. Dr. Ambedkar called the CAG \'the most important\' of the Constitution\'s four pillars.',
    },
    {
      hi: 'राष्ट्रीय मानवाधिकार आयोग (NHRC) के संदर्भ में निम्न कथनों पर विचार करें:\n1. NHRC की स्थापना मानवाधिकार संरक्षण अधिनियम 1993 के तहत हुई।\n2. NHRC अध्यक्ष पूर्व सर्वोच्च न्यायालय मुख्य न्यायाधीश या SC न्यायाधीश हो सकते हैं।\n3. NHRC की अनुशंसाएँ बाध्यकारी हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the NHRC:\n1. NHRC was established under the Protection of Human Rights Act 1993.\n2. The NHRC chair can be a former Chief Justice or a former Supreme Court judge.\n3. NHRC recommendations are binding.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — NHRC की अनुशंसाएँ सलाहकारी (recommendatory) हैं, बाध्यकारी नहीं।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — NHRC recommendations are advisory, not binding.',
    },
    {
      hi: 'मनी बिल (अनुच्छेद 110) के संदर्भ में निम्न कथनों पर विचार करें:\n1. मनी बिल केवल लोकसभा में प्रस्तुत किया जा सकता है।\n2. राज्यसभा मनी बिल को 14 दिनों तक रोक सकती है — संशोधन कर भी सकती है।\n3. लोकसभा अध्यक्ष यह प्रमाणित करते हैं कि बिल मनी बिल है या नहीं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on a Money Bill (Article 110):\n1. A Money Bill can be introduced only in the Lok Sabha.\n2. The Rajya Sabha may delay a Money Bill for up to 14 days and can also amend it.\n3. The Lok Sabha Speaker certifies whether a bill is a Money Bill.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: 'केवल 1 और 3', en: '1 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }],
      correct: 2,
      explanationHi: 'कथन 1 एवं 3 सही। कथन 2 आंशिक रूप से गलत — राज्यसभा मनी बिल को 14 दिनों तक रोक सकती है पर संशोधन की सिफारिश ही कर सकती है, जिसे लोकसभा स्वीकार/अस्वीकार कर सकती है।',
      explanationEn: 'Statements 1 and 3 are correct. Statement 2 is partly wrong — the Rajya Sabha may hold the Money Bill for up to 14 days but only recommend amendments, which the Lok Sabha may accept or reject.',
    },
    {
      hi: 'संसद के संयुक्त बैठक (अनुच्छेद 108) के संदर्भ में निम्न कथनों पर विचार करें:\n1. संयुक्त बैठक की अध्यक्षता लोकसभा अध्यक्ष करते हैं।\n2. राष्ट्रपति संयुक्त बैठक बुलाते हैं।\n3. मनी बिल पर संयुक्त बैठक का प्रावधान है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on a Joint Sitting of Parliament (Article 108):\n1. The Lok Sabha Speaker presides over the joint sitting.\n2. The President convenes the joint sitting.\n3. A joint sitting is provided for Money Bills.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: 'केवल 1 और 3', en: '1 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — संयुक्त बैठक का प्रावधान सामान्य विधेयकों के लिए है (अनुच्छेद 108); मनी बिल एवं संविधान संशोधन के लिए नहीं। 1961, 1978, 2002 — तीन ऐतिहासिक संयुक्त बैठकें।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — joint sittings apply to ordinary bills (Article 108), not to Money Bills or constitutional amendments. Three historical joint sittings: 1961, 1978, 2002.',
    },
    {
      hi: 'भारत के राष्ट्रीय आपातकाल (अनुच्छेद 352) के संदर्भ में निम्न कथनों पर विचार करें:\n1. राष्ट्रपति केवल मंत्रिमंडल की लिखित सिफारिश पर ही आपातकाल घोषित कर सकते हैं।\n2. भारत में अब तक तीन बार राष्ट्रीय आपातकाल लागू हो चुका है।\n3. राष्ट्रीय आपातकाल अनुच्छेद 20 एवं 21 को निलंबित कर सकता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on a National Emergency (Article 352):\n1. The President can declare an Emergency only on the written recommendation of the Cabinet.\n2. India has imposed a National Emergency three times.\n3. A National Emergency can suspend Articles 20 and 21.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: 'केवल 1 और 3', en: '1 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। तीन बार: 1962, 1971, 1975-77। कथन 3 गलत — 44वें संशोधन (1978) के बाद अनुच्छेद 20 एवं 21 निलंबित नहीं हो सकते।',
      explanationEn: 'Statements 1 and 2 are correct. Three times: 1962, 1971, 1975-77. Statement 3 is wrong — after the 44th Amendment (1978), Articles 20 and 21 cannot be suspended.',
    },
    {
      hi: 'मूल कर्तव्यों (अनुच्छेद 51A) के संदर्भ में निम्न कथनों पर विचार करें:\n1. मूल कर्तव्य 42वें संविधान संशोधन (1976) से जोड़े गए।\n2. इन्हें स्वर्ण सिंह समिति की सिफारिश पर जोड़ा गया।\n3. वर्तमान में 11 मूल कर्तव्य हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Fundamental Duties (Article 51A):\n1. The Fundamental Duties were added by the 42nd Amendment (1976).\n2. They were added on the recommendation of the Swaran Singh Committee.\n3. There are currently 11 Fundamental Duties.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 11वाँ कर्तव्य 86वें संशोधन (2002) से जोड़ा गया — 6-14 आयु के बच्चों को शिक्षा का अवसर।',
      explanationEn: 'All correct. The 11th duty was added by the 86th Amendment (2002) — opportunity for education for children aged 6-14.',
    },
    {
      hi: 'भारत के राष्ट्रपति के निर्वाचन के संदर्भ में निम्न कथनों पर विचार करें:\n1. राष्ट्रपति का चुनाव अप्रत्यक्ष रूप से निर्वाचक मंडल द्वारा होता है।\n2. निर्वाचक मंडल में संसद के दोनों सदनों एवं राज्य विधानसभाओं के निर्वाचित सदस्य शामिल हैं।\n3. राष्ट्रपति चुनाव \'एकल हस्तांतरणीय वोट\' (Single Transferable Vote) प्रणाली से होता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the election of the President of India:\n1. The President is elected indirectly by an Electoral College.\n2. The Electoral College includes elected members of both Houses of Parliament and the State Legislative Assemblies.\n3. The election uses the Single Transferable Vote system.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी सही। 70वें संशोधन (1992) से दिल्ली एवं पुडुचेरी की विधानसभाएँ भी निर्वाचक मंडल का हिस्सा।',
      explanationEn: 'All correct. The 70th Amendment (1992) added the Delhi and Puducherry Legislative Assemblies to the Electoral College.',
    },
    {
      hi: 'सर्वोच्च न्यायालय की मूल अधिकारिता (Original Jurisdiction) अनुच्छेद 131 के संदर्भ में निम्न कथनों पर विचार करें:\n1. केंद्र एवं राज्य के बीच विवाद SC की मूल अधिकारिता में आते हैं।\n2. राज्यों के बीच विवाद भी इसमें शामिल हैं।\n3. केंद्र एवं किसी निजी पक्ष के बीच विवाद भी अनुच्छेद 131 के अंतर्गत आते हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Supreme Court\'s Original Jurisdiction (Article 131):\n1. Centre-State disputes fall under the SC\'s original jurisdiction.\n2. Inter-State disputes are included.\n3. Disputes between the Centre and a private party also come under Article 131.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — अनुच्छेद 131 केवल संघ-राज्य या राज्य-राज्य विवादों तक सीमित।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — Article 131 is limited to Union-State or inter-State disputes.',
    },
    {
      hi: 'मौलिक अधिकारों (Part III) के संदर्भ में निम्न कथनों पर विचार करें:\n1. \'समानता का अधिकार\' अनुच्छेद 14-18 में है।\n2. \'स्वतंत्रता का अधिकार\' अनुच्छेद 19-22 में है।\n3. \'सम्पत्ति का अधिकार\' (Right to Property) अब मौलिक अधिकार नहीं है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Fundamental Rights (Part III):\n1. The Right to Equality is in Articles 14-18.\n2. The Right to Freedom is in Articles 19-22.\n3. The Right to Property is no longer a Fundamental Right.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी सही। 44वें संशोधन (1978) ने सम्पत्ति के अधिकार को मौलिक अधिकार से हटाकर अनुच्छेद 300A के तहत वैधानिक अधिकार बनाया।',
      explanationEn: 'All correct. The 44th Amendment (1978) removed Right to Property from Fundamental Rights and made it a legal right under Article 300A.',
    },
    {
      hi: 'संविधान की 9वीं अनुसूची के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह 1951 के पहले संविधान संशोधन से जोड़ी गई।\n2. इसमें शामिल कानून मौलिक अधिकारों के उल्लंघन की चुनौती से बाहर हैं।\n3. I.R. Coelho (2007) के बाद 24 अप्रैल 1973 के बाद जोड़े गए कानून न्यायिक समीक्षा के अधीन हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Ninth Schedule:\n1. It was added by the First Constitutional Amendment (1951).\n2. Laws placed in it are immune from challenge for violating Fundamental Rights.\n3. After I.R. Coelho (2007), laws added after 24 April 1973 are subject to judicial review.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 24 अप्रैल 1973 — Kesavananda Bharati निर्णय की तिथि।',
      explanationEn: 'All correct. 24 April 1973 — date of the Kesavananda Bharati judgment.',
    },
    {
      hi: 'महाभियोग (Impeachment) के संदर्भ में निम्न कथनों पर विचार करें:\n1. राष्ट्रपति पर महाभियोग का आधार \'संविधान का उल्लंघन\' है।\n2. महाभियोग प्रस्ताव संसद के किसी भी सदन में लाया जा सकता है।\n3. भारत में आज तक किसी राष्ट्रपति पर सफल महाभियोग नहीं हुआ।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Impeachment:\n1. The ground for impeaching the President is \'violation of the Constitution\'.\n2. The impeachment motion can originate in either House of Parliament.\n3. No President of India has been successfully impeached.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। दोनों सदनों में 2/3 बहुमत आवश्यक।',
      explanationEn: 'All correct. A 2/3 majority in both Houses is required.',
    },
    {
      hi: 'विशेष अधिकार (अनुच्छेद 105 एवं 194) — संसदीय विशेषाधिकार — के संदर्भ में निम्न कथनों पर विचार करें:\n1. संसद सदस्यों को सदन में बोलने की पूर्ण स्वतंत्रता प्राप्त है।\n2. यह विशेषाधिकार न्यायालय में चुनौती से बाहर है।\n3. किसी भी सदस्य पर रिश्वत के मामले में भी अनुच्छेद 105 की सुरक्षा प्राप्त है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on parliamentary privileges (Articles 105 and 194):\n1. MPs enjoy absolute freedom of speech within the House.\n2. The privilege is beyond challenge in courts.\n3. The protection of Article 105 also applies in cases of bribery against members.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — Sita Soren v. UoI (2024) में 7-न्यायाधीश पीठ ने P.V. Narasimha Rao (1998) निर्णय को पलटा; रिश्वत के मामलों में अनुच्छेद 105 की सुरक्षा नहीं।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — in Sita Soren v. UoI (2024), a 7-judge bench overturned P.V. Narasimha Rao (1998); no Article 105 protection applies in bribery cases.',
    },
    {
      hi: 'भारत के संविधान की मूल विशेषताओं — \'संसदीय लोकतंत्र\' — के स्रोतों पर निम्न कथनों पर विचार करें:\n1. संसदीय शासन प्रणाली ब्रिटिश संविधान से ली गई।\n2. प्रस्तावना की भाषा अमेरिकी संविधान से प्रेरित है।\n3. मौलिक अधिकार आयरिश संविधान से लिए गए।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on borrowings in the Indian Constitution:\n1. The parliamentary system of government is borrowed from the UK.\n2. The language of the Preamble is inspired by the US Constitution.\n3. Fundamental Rights are borrowed from the Irish Constitution.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — मौलिक अधिकार अमेरिका से; निदेशक तत्त्व आयरलैंड से।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — Fundamental Rights are from the US; Directive Principles from Ireland.',
    },
    {
      hi: 'भारतीय वायु सेना अनुसूची एवं अल्पसंख्यक अधिकारों — अनुच्छेद 29 एवं 30 — के संदर्भ में निम्न कथनों पर विचार करें:\n1. अनुच्छेद 29 भाषाई एवं सांस्कृतिक अल्पसंख्यकों की रक्षा करता है।\n2. अनुच्छेद 30 अल्पसंख्यकों को शैक्षिक संस्थान स्थापित एवं संचालित करने का अधिकार देता है।\n3. अनुच्छेद 30 केवल धार्मिक अल्पसंख्यकों पर लागू होता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on minority rights (Articles 29 and 30):\n1. Article 29 protects linguistic and cultural minorities.\n2. Article 30 gives minorities the right to establish and administer educational institutions.\n3. Article 30 applies only to religious minorities.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — अनुच्छेद 30 धार्मिक एवं भाषाई — दोनों — अल्पसंख्यकों पर लागू।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — Article 30 covers both religious and linguistic minorities.',
    },
    {
      hi: 'भारत में आरक्षण के संदर्भ में निम्न कथनों पर विचार करें:\n1. इंदिरा साहनी (Mandal) निर्णय (1992) ने आरक्षण की 50% सीमा निर्धारित की।\n2. 103वें संविधान संशोधन (2019) ने EWS को 10% आरक्षण दिया।\n3. EWS आरक्षण को SC ने Janhit Abhiyan (2022) में संवैधानिक माना।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on reservation in India:\n1. Indira Sawhney (Mandal) (1992) set the 50% reservation cap.\n2. The 103rd Constitutional Amendment (2019) provided 10% EWS reservation.\n3. The Supreme Court upheld EWS reservation as constitutional in Janhit Abhiyan (2022).\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी सही। SC ने 3:2 बहुमत से EWS आरक्षण की संवैधानिकता बरकरार रखी।',
      explanationEn: 'All correct. The SC upheld EWS reservation by a 3:2 majority.',
    },
  ],
  economy: [
    {
      hi: 'भारतीय रिजर्व बैंक (RBI) का मुख्यालय कहाँ है?',
      en: 'Where is the Reserve Bank of India (RBI) headquartered?',
      options: [{ hi: 'नई दिल्ली', en: 'New Delhi' }, { hi: 'मुंबई', en: 'Mumbai' }, { hi: 'कोलकाता', en: 'Kolkata' }, { hi: 'चेन्नई', en: 'Chennai' }],
      correct: 1,
      explanationHi: 'भारतीय रिजर्व बैंक का केंद्रीय कार्यालय मुंबई में स्थित है। इसकी स्थापना 1935 में हुई थी।',
      explanationEn: 'The central office of Reserve Bank of India is in Mumbai. It was established in 1935.',
    },
    {
      hi: 'GST कब से लागू हुआ?',
      en: 'When was GST implemented?',
      options: [{ hi: '1 अप्रैल 2016', en: '1 April 2016' }, { hi: '1 जनवरी 2017', en: '1 January 2017' }, { hi: '1 जुलाई 2017', en: '1 July 2017' }, { hi: '1 अक्टूबर 2017', en: '1 October 2017' }],
      correct: 2,
      explanationHi: 'GST (वस्तु एवं सेवा कर) 1 जुलाई 2017 से पूरे भारत में लागू हुआ।',
      explanationEn: 'GST (Goods and Services Tax) was implemented across India from 1 July 2017.',
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
      hi: 'भारत की राष्ट्रीय आय आँकड़ों का प्रकाशन कौन करता है?',
      en: 'Who publishes India\'s national-income (GDP) data?',
      options: [{ hi: 'RBI', en: 'RBI' }, { hi: 'NSO (पूर्व में CSO)', en: 'NSO (formerly CSO)' }, { hi: 'NITI Aayog', en: 'NITI Aayog' }, { hi: 'वित्त मंत्रालय', en: 'Ministry of Finance' }],
      correct: 1,
      explanationHi: 'राष्ट्रीय सांख्यिकी कार्यालय (NSO) — पूर्व में Central Statistics Office (CSO) — सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI) के अधीन GDP एवं अन्य राष्ट्रीय खातों का अनुमान प्रकाशित करता है।',
      explanationEn: 'The National Statistical Office (NSO) — formerly the Central Statistics Office (CSO) — under MoSPI publishes GDP and other national-account estimates.',
    },
    {
      hi: 'मुद्रास्फीति को नियंत्रित करने हेतु RBI मुख्यतः किस उपकरण का प्रयोग करता है?',
      en: 'Which is RBI\'s primary tool to control inflation?',
      options: [{ hi: 'CRR', en: 'CRR' }, { hi: 'SLR', en: 'SLR' }, { hi: 'रेपो रेट', en: 'Repo Rate' }, { hi: 'बैंक दर', en: 'Bank Rate' }],
      correct: 2,
      explanationHi: 'रेपो रेट RBI की प्रमुख नीतिगत दर है। इसे बढ़ाने से उधार महंगा होता है, मांग घटती है और मुद्रास्फीति नियंत्रित होती है।',
      explanationEn: 'The Repo Rate is RBI\'s key policy rate. Raising it makes borrowing costlier, reduces demand, and helps cool inflation.',
    },
    {
      hi: '\'जन धन योजना\' किस वर्ष शुरू हुई?',
      en: 'In which year was the Jan Dhan Yojana launched?',
      options: [{ hi: '2012', en: '2012' }, { hi: '2014', en: '2014' }, { hi: '2016', en: '2016' }, { hi: '2018', en: '2018' }],
      correct: 1,
      explanationHi: 'प्रधानमंत्री जन धन योजना 28 अगस्त 2014 को वित्तीय समावेशन के लिए शुरू की गई। इसमें शून्य बैलेंस खाते खोले गए।',
      explanationEn: 'Pradhan Mantri Jan Dhan Yojana was launched on August 28, 2014, for financial inclusion. It allowed opening of zero-balance accounts.',
    },
    {
      hi: 'भारत में \'मुद्रा बैंक\' किस उद्देश्य से स्थापित किया गया?',
      en: 'For what purpose was MUDRA Bank established in India?',
      options: [{ hi: 'कृषि ऋण', en: 'Agricultural loans' }, { hi: 'सूक्ष्म एवं लघु उद्यम वित्त', en: 'Micro & small enterprise finance' }, { hi: 'गृह ऋण', en: 'Home loans' }, { hi: 'विदेशी मुद्रा भंडार', en: 'Forex reserves' }],
      correct: 1,
      explanationHi: 'MUDRA (Micro Units Development & Refinance Agency) 2015 में सूक्ष्म, लघु एवं मध्यम उद्यमों के लिए स्थापित। मूल सीमा ₹10 लाख थी; बजट 2024 में \'तरुण प्लस\' के तहत यह सीमा ₹20 लाख तक बढ़ाई गई।',
      explanationEn: 'MUDRA (Micro Units Development & Refinance Agency) was established in 2015 for micro, small and medium enterprises. The original ceiling was ₹10 lakh; Budget 2024 raised it to ₹20 lakh under the new "Tarun Plus" category.',
    },
    {
      hi: 'PLI (Production Linked Incentive) योजना का उद्देश्य क्या है?',
      en: 'What is the objective of the PLI (Production Linked Incentive) scheme?',
      options: [{ hi: 'किसानों को सब्सिडी', en: 'Subsidy to farmers' }, { hi: 'घरेलू विनिर्माण को बढ़ावा देना', en: 'Boost domestic manufacturing' }, { hi: 'IT सेवा निर्यात बढ़ाना', en: 'Boost IT services exports' }, { hi: 'पर्यटन को बढ़ावा देना', en: 'Promote tourism' }],
      correct: 1,
      explanationHi: 'PLI योजना घरेलू विनिर्माण को प्रोत्साहित करने और आयात पर निर्भरता घटाने के लिए लागू की गई — मोबाइल, सेमीकंडक्टर, ऑटो आदि क्षेत्रों में।',
      explanationEn: 'The PLI scheme incentivises domestic manufacturing and reduces import dependence — covering sectors like mobiles, semiconductors, auto, and more.',
    },
    {
      hi: 'किस संगठन के द्वारा \'Doing Business\' रिपोर्ट प्रकाशित की जाती थी?',
      en: 'Which organisation used to publish the "Doing Business" report?',
      options: [{ hi: 'IMF', en: 'IMF' }, { hi: 'विश्व बैंक', en: 'World Bank' }, { hi: 'WTO', en: 'WTO' }, { hi: 'ADB', en: 'ADB' }],
      correct: 1,
      explanationHi: 'विश्व बैंक की Doing Business रिपोर्ट 2003-2021 तक प्रकाशित होती थी, जिसे 2022 में बंद कर दिया गया। अब इसका स्थान B-READY रिपोर्ट लेगी।',
      explanationEn: 'The World Bank\'s Doing Business report was published from 2003 to 2021, then discontinued in 2022. Its replacement is the B-READY report.',
    },
    {
      hi: 'UPI के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. UPI को NPCI ने विकसित किया और 2016 में लॉन्च किया गया।\n2. NEFT एवं RTGS प्रणालियाँ NPCI द्वारा संचालित हैं।\n3. UPI वर्तमान में फ्रांस, UAE, श्रीलंका एवं मॉरीशस सहित कई देशों में स्वीकार्य है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on UPI:\n1. UPI was developed by NPCI and launched in 2016.\n2. NEFT and RTGS systems are operated by NPCI.\n3. UPI is currently accepted in countries including France, UAE, Sri Lanka and Mauritius.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: 'केवल 1 और 3', en: '1 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }],
      correct: 2,
      explanationHi: 'कथन 2 गलत — NEFT एवं RTGS RBI द्वारा संचालित हैं, NPCI द्वारा नहीं। NPCI UPI, IMPS, RuPay संचालित करता है।',
      explanationEn: 'Statement 2 is wrong — NEFT and RTGS are operated by RBI, not NPCI. NPCI runs UPI, IMPS, and RuPay.',
    },
    {
      hi: 'GST के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. GST एक गंतव्य-आधारित (destination-based) उपभोग कर है।\n2. GST परिषद की अध्यक्षता केंद्रीय वित्त मंत्री करते हैं।\n3. GST ने सीमा शुल्क (customs duty) सहित सभी अप्रत्यक्ष करों को समाहित किया है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on GST:\n1. GST is a destination-based consumption tax.\n2. The GST Council is chaired by the Union Finance Minister.\n3. GST has subsumed all indirect taxes including customs duty.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 3', en: '3 only' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — सीमा शुल्क (Basic Customs Duty) GST के अंतर्गत नहीं आता; यह केंद्र द्वारा अलग से लगाया जाता है।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — Basic Customs Duty is not subsumed under GST; it is levied separately by the Centre.',
    },
    {
      hi: 'दिवाला एवं शोधन अक्षमता संहिता (IBC) के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. IBC 2016 में समय-बद्ध दिवाला समाधान के लिए अधिनियमित किया गया।\n2. राष्ट्रीय कंपनी विधि न्यायाधिकरण (NCLT) कॉर्पोरेट दिवाला हेतु निर्णायक प्राधिकारी है।\n3. IBC की धारा 238 के अनुसार किसी भी अन्य कानून से असंगति होने पर IBC को प्राथमिकता मिलती है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Insolvency and Bankruptcy Code (IBC):\n1. IBC was enacted in 2016 for time-bound resolution of insolvency.\n2. The National Company Law Tribunal (NCLT) is the adjudicating authority for corporate insolvency.\n3. Section 238 gives IBC overriding effect over any inconsistent law.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। IBC ने भारत की दिवाला प्रणाली को व्यापक रूप से सुधारा।',
      explanationEn: 'All correct. The IBC fundamentally reformed India\'s insolvency framework.',
    },
    {
      hi: 'प्रत्यक्ष लाभ अंतरण (DBT) के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. DBT को 2013 में लॉन्च किया गया।\n2. PM-KISAN योजना पात्र किसानों को ₹6,000 प्रति वर्ष — तीन बराबर किश्तों में — हस्तांतरित करती है।\n3. DBT JAM त्रिमूर्ति — जन धन, आधार, मोबाइल — के माध्यम से क्रियान्वित होती है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Direct Benefit Transfer (DBT):\n1. DBT was launched in 2013.\n2. PM-KISAN transfers ₹6,000 per year to eligible farmers in three equal instalments.\n3. DBT operates through the JAM Trinity — Jan Dhan, Aadhaar, and Mobile.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 3', en: '3 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। JAM त्रिमूर्ति के माध्यम से रिसाव कम होकर लक्ष्यित वितरण सुनिश्चित होता है।',
      explanationEn: 'All correct. The JAM Trinity reduces leakage and ensures targeted delivery.',
    },
    {
      hi: 'PMJDY के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. प्रधानमंत्री जन धन योजना 28 अगस्त 2014 को लॉन्च हुई।\n2. PMJDY खातों में RuPay डेबिट कार्ड एवं अंतर्निर्मित दुर्घटना बीमा शामिल है।\n3. 2024 तक 50 करोड़ से अधिक लाभार्थी जोड़े जा चुके हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on PMJDY:\n1. Pradhan Mantri Jan Dhan Yojana was launched on 28 August 2014.\n2. PMJDY accounts come with a RuPay debit card and an inbuilt accident insurance cover.\n3. By 2024, more than 50 crore beneficiaries had been added under PMJDY.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। PMJDY भारत के सबसे बड़े वित्तीय समावेशन कार्यक्रमों में से एक है।',
      explanationEn: 'All correct. PMJDY is one of India\'s largest financial-inclusion programmes.',
    },
    {
      hi: 'मौद्रिक नीति समिति (MPC) के संदर्भ में निम्न कथनों पर विचार करें:\n1. MPC में कुल 6 सदस्य होते हैं।\n2. MPC की अध्यक्षता RBI गवर्नर करते हैं।\n3. RBI Act 1934 के 2016 संशोधन ने MPC को विधिक आधार दिया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Monetary Policy Committee (MPC):\n1. The MPC has 6 members.\n2. The MPC is chaired by the RBI Governor.\n3. The 2016 amendment to the RBI Act 1934 gave statutory backing to the MPC.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 3 सदस्य RBI से, 3 केंद्र-नियुक्त। टाई-ब्रेकिंग वोट गवर्नर के पास।',
      explanationEn: 'All correct. 3 members from RBI, 3 nominated by the Centre. The Governor has the casting vote.',
    },
    {
      hi: 'FRBM Act 2003 के संदर्भ में निम्न कथनों पर विचार करें:\n1. FRBM का पूरा नाम — Fiscal Responsibility and Budget Management Act।\n2. यह केंद्रीय सरकार को मध्यम-कालिक वित्तीय अनुशासन के लक्ष्यों के लिए बाध्य करता है।\n3. इसमें \'Escape Clause\' का प्रावधान है जो असाधारण परिस्थितियों में सीमाओं से छूट देता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the FRBM Act 2003:\n1. FRBM stands for Fiscal Responsibility and Budget Management Act.\n2. It binds the central government to medium-term fiscal-discipline targets.\n3. It contains an \'Escape Clause\' permitting deviations in exceptional circumstances.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। N.K. Singh Committee (2017) के बाद \'Escape Clause\' संहिताबद्ध।',
      explanationEn: 'All correct. The \'Escape Clause\' was codified after the N.K. Singh Committee (2017).',
    },
    {
      hi: 'SEBI के संदर्भ में निम्न कथनों पर विचार करें:\n1. SEBI की स्थापना 1988 में गैर-सांविधिक निकाय के रूप में हुई।\n2. SEBI Act 1992 ने इसे सांविधिक दर्जा दिया।\n3. SEBI के अध्यक्ष की नियुक्ति केंद्र सरकार करती है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on SEBI:\n1. SEBI was set up as a non-statutory body in 1988.\n2. The SEBI Act 1992 gave it statutory status.\n3. The SEBI Chair is appointed by the Central Government.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। SEBI के तीन उद्देश्य — निवेशक संरक्षण, बाज़ार विकास, विनियमन।',
      explanationEn: 'All correct. SEBI\'s three objectives — investor protection, market development, regulation.',
    },
    {
      hi: 'NABARD के संदर्भ में निम्न कथनों पर विचार करें:\n1. NABARD की स्थापना 1982 में हुई।\n2. इसका मुख्यालय मुंबई में है।\n3. यह कृषि एवं ग्रामीण विकास के लिए शीर्ष विकास बैंक है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on NABARD:\n1. NABARD was established in 1982.\n2. It is headquartered in Mumbai.\n3. It is the apex development bank for agriculture and rural development.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। CRAFICARD समिति (Sivaraman Committee) की सिफारिश पर स्थापित।',
      explanationEn: 'All correct. Established on the recommendation of the CRAFICARD (Sivaraman) Committee.',
    },
    {
      hi: 'राष्ट्रीय पेंशन प्रणाली (NPS) के संदर्भ में निम्न कथनों पर विचार करें:\n1. NPS को 2004 में सरकारी कर्मचारियों के लिए शुरू किया गया।\n2. 2009 से इसे सभी नागरिकों के लिए खोल दिया गया।\n3. इसका विनियमन PFRDA करता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the National Pension System (NPS):\n1. NPS was launched in 2004 for government employees.\n2. It was opened to all citizens in 2009.\n3. It is regulated by PFRDA.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। PFRDA Act 2013 ने PFRDA को सांविधिक दर्जा दिया।',
      explanationEn: 'All correct. The PFRDA Act 2013 gave PFRDA statutory status.',
    },
    {
      hi: 'GST परिषद (अनुच्छेद 279A) के संदर्भ में निम्न कथनों पर विचार करें:\n1. GST परिषद की अध्यक्षता केंद्रीय वित्त मंत्री करते हैं।\n2. प्रत्येक राज्य से एक सदस्य परिषद का हिस्सा होता है।\n3. GST परिषद की सिफारिशें केंद्र एवं राज्यों — दोनों — पर बाध्यकारी हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the GST Council (Article 279A):\n1. The GST Council is chaired by the Union Finance Minister.\n2. Each State has one member on the Council.\n3. GST Council recommendations are binding on both Centre and States.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — Mohit Minerals v. UoI (2022) में SC ने स्पष्ट किया कि GST परिषद की सिफारिशें केवल सलाहकारी हैं।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — in Mohit Minerals v. UoI (2022), the SC held that GST Council recommendations are merely recommendatory.',
    },
    {
      hi: 'भारत में बजट के संदर्भ में निम्न कथनों पर विचार करें:\n1. केंद्रीय बजट अनुच्छेद 112 के तहत प्रस्तुत किया जाता है।\n2. 2017 से रेल बजट को आम बजट में मिला दिया गया है।\n3. \'राजकोषीय घाटा\' (Fiscal Deficit) कुल व्यय एवं कुल राजस्व प्राप्तियों के बीच का अंतर है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Indian Budget:\n1. The Union Budget is presented under Article 112.\n2. From 2017, the Railway Budget has been merged with the General Budget.\n3. \'Fiscal Deficit\' is the gap between total expenditure and total revenue receipts.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — राजकोषीय घाटा = कुल व्यय - (राजस्व + गैर-ऋण पूंजी प्राप्तियाँ)।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — Fiscal Deficit = Total Expenditure - (Revenue + Non-debt Capital Receipts).',
    },
    {
      hi: 'Insolvency and Bankruptcy Code 2016 के संदर्भ में निम्न कथनों पर विचार करें:\n1. IBC ने Companies Act 1956 एवं अन्य कई कानूनों के दिवाला-संबंधी प्रावधानों को प्रतिस्थापित किया।\n2. NCLT कॉर्पोरेट दिवाला के लिए न्यायाधीकरण है।\n3. IBC की धारा 29A दिवालिया promoters को संपत्ति वापस खरीदने से रोकती है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the IBC 2016:\n1. IBC replaced insolvency-related provisions in the Companies Act 1956 and several other laws.\n2. NCLT is the adjudicating authority for corporate insolvency.\n3. Section 29A of IBC bars defaulting promoters from buying back assets.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। धारा 29A 2018 संशोधन से जोड़ी गई।',
      explanationEn: 'All correct. Section 29A was introduced by the 2018 amendment.',
    },
    {
      hi: 'भारत के विदेशी मुद्रा भंडार के संदर्भ में निम्न कथनों पर विचार करें:\n1. भारतीय विदेशी मुद्रा भंडार का प्रबंधन RBI करता है।\n2. इसके चार घटक हैं — Foreign Currency Assets, Gold, SDR, Reserve Position with IMF।\n3. भारत विश्व के शीर्ष-5 विदेशी मुद्रा भंडार वाले देशों में है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India\'s foreign exchange reserves:\n1. India\'s forex reserves are managed by the RBI.\n2. The four components are Foreign Currency Assets, Gold, SDR, and Reserve Position with IMF.\n3. India is among the world\'s top-5 holders of forex reserves.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। RBI Act 1934 के तहत प्रबंधन।',
      explanationEn: 'All correct. Managed under the RBI Act 1934.',
    },
    {
      hi: 'CRR एवं SLR के संदर्भ में निम्न कथनों पर विचार करें:\n1. CRR वह न्यूनतम नकद अनुपात है जो वाणिज्यिक बैंकों को RBI के पास रखना अनिवार्य है।\n2. SLR वह न्यूनतम सरकारी प्रतिभूति निवेश है जो बैंक की कुल जमा राशि के अनुपात में रखना होता है।\n3. CRR पर बैंकों को RBI से ब्याज मिलता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on CRR and SLR:\n1. CRR is the minimum cash ratio that commercial banks must keep with RBI.\n2. SLR is the minimum government-securities investment relative to total deposits.\n3. Banks earn interest from RBI on CRR balances.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — CRR पर RBI से कोई ब्याज नहीं मिलता।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — no interest is paid on CRR balances by RBI.',
    },
    {
      hi: 'राष्ट्रीय आय की अवधारणाओं के संदर्भ में निम्न कथनों पर विचार करें:\n1. GDP देश की भौगोलिक सीमा के भीतर उत्पादित वस्तुओं एवं सेवाओं का कुल मूल्य है।\n2. GNP = GDP + विदेशों से शुद्ध कारक आय।\n3. NNP = GNP - मूल्य-ह्रास (Depreciation)।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on national-income concepts:\n1. GDP is the total value of goods and services produced within a country\'s geographical territory.\n2. GNP = GDP + Net Factor Income from Abroad.\n3. NNP = GNP - Depreciation.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। राष्ट्रीय आय गणना के तीन सूत्र: उत्पादन, आय, व्यय विधि।',
      explanationEn: 'All correct. National income is computed by three methods: production, income, and expenditure.',
    },
    {
      hi: 'भारत में आयकर के संदर्भ में निम्न कथनों पर विचार करें:\n1. आयकर अधिनियम 1961 केंद्रीय अधिनियम है।\n2. आयकर एक प्रत्यक्ष कर (Direct Tax) है।\n3. केंद्रीय प्रत्यक्ष कर बोर्ड (CBDT) इसका प्रशासन करता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Income Tax in India:\n1. The Income Tax Act 1961 is a central statute.\n2. Income tax is a direct tax.\n3. The Central Board of Direct Taxes (CBDT) administers it.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। CBDT — Department of Revenue, वित्त मंत्रालय के तहत।',
      explanationEn: 'All correct. CBDT is under the Department of Revenue, Ministry of Finance.',
    },
    {
      hi: 'PM-KISAN के संदर्भ में निम्न कथनों पर विचार करें:\n1. PM-KISAN को 2019 में शुरू किया गया।\n2. यह केंद्रीय क्षेत्र की योजना है।\n3. प्रत्येक पात्र किसान-परिवार को ₹6,000/वर्ष DBT द्वारा हस्तांतरित किया जाता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on PM-KISAN:\n1. PM-KISAN was launched in 2019.\n2. It is a Central Sector Scheme.\n3. Eligible farmer families receive ₹6,000 per year via DBT.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। तीन समान किश्तों में — हर 4 महीने।',
      explanationEn: 'All correct. Paid in three equal instalments — every four months.',
    },
    {
      hi: 'MSME वर्गीकरण (2020 संशोधन) के संदर्भ में निम्न कथनों पर विचार करें:\n1. वर्गीकरण निवेश एवं टर्नओवर — दोनों — मानदंडों पर आधारित है।\n2. यह विनिर्माण एवं सेवा क्षेत्रों — दोनों — पर समान रूप से लागू है।\n3. \'सूक्ष्म\' की सीमा निवेश ₹1 करोड़ एवं टर्नओवर ₹5 करोड़ तक है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the MSME classification (revised 2020):\n1. The classification is based on both investment and turnover.\n2. It applies uniformly to both manufacturing and services.\n3. \'Micro\' is investment up to ₹1 crore and turnover up to ₹5 crore.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 2020 के पहले विनिर्माण एवं सेवा के लिए अलग सीमाएँ थीं।',
      explanationEn: 'All correct. Before 2020, manufacturing and services had separate thresholds.',
    },
    {
      hi: 'PM Vishwakarma योजना के संदर्भ में निम्न कथनों पर विचार करें:\n1. इसे सितंबर 2023 में लॉन्च किया गया।\n2. यह 18 पारंपरिक व्यवसायों को कवर करती है।\n3. लाभार्थियों को कौशल प्रशिक्षण, टूलकिट एवं रियायती ऋण मिलता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the PM Vishwakarma scheme:\n1. It was launched in September 2023.\n2. It covers 18 traditional trades.\n3. Beneficiaries receive skill training, toolkits, and concessional credit.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 17 सितंबर 2023 (विश्वकर्मा जयंती) को लॉन्च।',
      explanationEn: 'All correct. Launched on 17 September 2023 (Vishwakarma Jayanti).',
    },
    {
      hi: 'PLI योजना के संदर्भ में निम्न कथनों पर विचार करें:\n1. PLI का अर्थ है — Production Linked Incentive।\n2. यह 14 क्षेत्रों में लागू है।\n3. यह घरेलू विनिर्माण को बढ़ावा देने एवं आयात-निर्भरता घटाने का उद्देश्य रखती है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the PLI scheme:\n1. PLI stands for Production Linked Incentive.\n2. It covers 14 sectors.\n3. It aims to boost domestic manufacturing and reduce import dependence.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। मोबाइल, सेमीकंडक्टर, ऑटो, फार्मा, टेक्सटाइल आदि।',
      explanationEn: 'All correct. Sectors include mobiles, semiconductors, auto, pharma, textiles, etc.',
    },
    {
      hi: 'भारत में बैंकिंग के 2020 के मर्जर के संदर्भ में निम्न कथनों पर विचार करें:\n1. अप्रैल 2020 में 10 PSBs को 4 बड़े बैंकों में मर्ज किया गया।\n2. इसके बाद कुल PSB संख्या 27 से घटकर 12 हो गई।\n3. SBI में 2017 में 5 सहयोगी बैंकों एवं भारतीय महिला बैंक का मर्जर हुआ।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on bank mergers in India:\n1. In April 2020, 10 PSBs were merged into 4 large banks.\n2. PSB count fell from 27 to 12 after this.\n3. SBI absorbed five associate banks and Bharatiya Mahila Bank in 2017.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। उद्देश्य — परिचालन क्षमता एवं वैश्विक आकार।',
      explanationEn: 'All correct. Aims included operational efficiency and global scale.',
    },
    {
      hi: 'भारत के डिजिटल भुगतान में UPI के संदर्भ में निम्न कथनों पर विचार करें:\n1. UPI को NPCI ने विकसित किया।\n2. UPI का पहला अंतर्राष्ट्रीय एकीकरण भूटान के साथ था।\n3. UPI लेनदेन की कोई न्यूनतम राशि-सीमा नहीं है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on UPI:\n1. UPI was developed by NPCI.\n2. UPI\'s first international integration was with Bhutan.\n3. UPI transactions have no minimum-amount limit.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 2021 में भूटान UPI लाइव — पहला अंतर्राष्ट्रीय रोलआउट।',
      explanationEn: 'All correct. Bhutan went live with UPI in 2021 — the first international rollout.',
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
      explanationHi: 'गुजरात की तटरेखा लगभग 1,600 km है जो भारत के किसी भी राज्य में सबसे लंबी है।',
      explanationEn: 'Gujarat has a coastline of approximately 1,600 km, the longest of any Indian state.',
    },
    {
      hi: 'सुंदरबन वन किन देशों में फैला है?',
      en: 'The Sundarbans forest spreads across which countries?',
      options: [{ hi: 'भारत और नेपाल', en: 'India and Nepal' }, { hi: 'भारत और बांग्लादेश', en: 'India and Bangladesh' }, { hi: 'भारत और म्यांमार', en: 'India and Myanmar' }, { hi: 'भारत और श्रीलंका', en: 'India and Sri Lanka' }],
      correct: 1,
      explanationHi: 'सुंदरबन विश्व का सबसे बड़ा मैंग्रोव वन है जो भारत (पश्चिम बंगाल) और बांग्लादेश में फैला है।',
      explanationEn: 'Sundarbans is the world\'s largest mangrove forest, spread across India (West Bengal) and Bangladesh.',
    },
    {
      hi: 'भारत का सबसे ऊँचा पर्वत शिखर कौन सा है?',
      en: 'Which is the highest mountain peak in India?',
      options: [{ hi: 'माउंट एवरेस्ट', en: 'Mount Everest' }, { hi: 'K2', en: 'K2' }, { hi: 'कंचनजंघा', en: 'Kangchenjunga' }, { hi: 'नंदा देवी', en: 'Nanda Devi' }],
      correct: 2,
      explanationHi: 'कंचनजंघा (8,586 m) पूर्णतः भारत में स्थित सबसे ऊँचा पर्वत शिखर है। K2 भारत के नियंत्रण वाले POK में है।',
      explanationEn: 'Kangchenjunga (8,586 m) is the highest peak entirely within India. K2 is in POK controlled by India.',
    },
    {
      hi: 'भारत की सबसे बड़ी खारे पानी की लैगून (brackish-water lagoon) कौन सी है?',
      en: 'Which is India\'s largest brackish-water lagoon?',
      options: [{ hi: 'चिल्का झील', en: 'Chilika Lake' }, { hi: 'सांभर झील', en: 'Sambhar Lake' }, { hi: 'पुलिकट झील', en: 'Pulicat Lake' }, { hi: 'वुलर झील', en: 'Wular Lake' }],
      correct: 0,
      explanationHi: 'चिल्का झील (ओडिशा) भारत की सबसे बड़ी खारे पानी की लैगून है। सांभर भारत की सबसे बड़ी अंतर्देशीय खारी झील (inland salt lake) है — दोनों अलग श्रेणियाँ हैं।',
      explanationEn: 'Chilika Lake (Odisha) is India\'s largest brackish-water lagoon. Sambhar is India\'s largest inland salt lake — they are different categories.',
    },
    {
      hi: 'भारत में मानसून का आगमन सबसे पहले किस राज्य में होता है?',
      en: 'In which state does the monsoon arrive first in India?',
      options: [{ hi: 'गोवा', en: 'Goa' }, { hi: 'केरल', en: 'Kerala' }, { hi: 'कर्नाटक', en: 'Karnataka' }, { hi: 'महाराष्ट्र', en: 'Maharashtra' }],
      correct: 1,
      explanationHi: 'दक्षिण-पश्चिम मानसून सामान्यतः 1 जून के आसपास केरल पहुंचता है, फिर पूरे देश में फैलता है।',
      explanationEn: 'The Southwest Monsoon usually reaches Kerala around June 1 and then spreads across the country.',
    },
    {
      hi: 'भारत के किस राज्य में कोडाईकनाल हिल स्टेशन स्थित है?',
      en: 'In which state is the Kodaikanal hill station located?',
      options: [{ hi: 'कर्नाटक', en: 'Karnataka' }, { hi: 'केरल', en: 'Kerala' }, { hi: 'तमिलनाडु', en: 'Tamil Nadu' }, { hi: 'आंध्र प्रदेश', en: 'Andhra Pradesh' }],
      correct: 2,
      explanationHi: 'कोडाईकनाल तमिलनाडु के डिंडीगुल जिले में पलनी पहाड़ियों पर स्थित प्रसिद्ध हिल स्टेशन है।',
      explanationEn: 'Kodaikanal is a famous hill station in the Palani Hills of Dindigul district, Tamil Nadu.',
    },
    {
      hi: 'भारत-पाकिस्तान के बीच रेडक्लिफ रेखा कब खींची गई?',
      en: 'When was the Radcliffe Line drawn between India and Pakistan?',
      options: [{ hi: '1945', en: '1945' }, { hi: '1947', en: '1947' }, { hi: '1948', en: '1948' }, { hi: '1950', en: '1950' }],
      correct: 1,
      explanationHi: 'रेडक्लिफ रेखा 17 अगस्त 1947 को सर सिरिल रेडक्लिफ द्वारा खींची गई, जो भारत-पाकिस्तान की अंतर्राष्ट्रीय सीमा है।',
      explanationEn: 'The Radcliffe Line was drawn on August 17, 1947 by Sir Cyril Radcliffe — it is the international boundary between India and Pakistan.',
    },
    {
      hi: 'भारत में \'सात बहनें\' किसे कहा जाता है?',
      en: 'What are the "Seven Sisters" of India?',
      options: [{ hi: 'दक्षिण भारत के सात राज्य', en: 'Seven southern states' }, { hi: 'उत्तर-पूर्व के सात राज्य', en: 'Seven north-eastern states' }, { hi: 'सात प्रमुख नदियाँ', en: 'Seven major rivers' }, { hi: 'सात केंद्रशासित प्रदेश', en: 'Seven Union Territories' }],
      correct: 1,
      explanationHi: 'सात बहनें — असम, अरुणाचल प्रदेश, मणिपुर, मेघालय, मिज़ोरम, नागालैंड और त्रिपुरा — भारत के उत्तर-पूर्वी राज्य हैं।',
      explanationEn: 'The Seven Sisters are India\'s north-eastern states — Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland and Tripura.',
    },
    {
      hi: 'पश्चिमी घाट के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. यह UNESCO World Heritage Site है।\n2. यह दुनिया के आठ \'सबसे गर्म\' जैव विविधता हॉटस्पॉट्स में से एक है।\n3. पश्चिमी घाट 6 भारतीय राज्यों से होकर गुजरता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements about the Western Ghats:\n1. It is a UNESCO World Heritage Site.\n2. It is one of the eight \'hottest hotspots\' of biological diversity in the world.\n3. The Western Ghats runs through 6 Indian states.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। ये राज्य हैं — गुजरात, महाराष्ट्र, गोवा, कर्नाटक, केरल, तमिलनाडु।',
      explanationEn: 'All correct. The states are Gujarat, Maharashtra, Goa, Karnataka, Kerala, Tamil Nadu.',
    },
    {
      hi: 'भारतीय मानक समय (IST) के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. IST 82°30\'E देशांतर के स्थानीय समय से गणना किया जाता है।\n2. यह संदर्भ देशांतर उत्तर प्रदेश के मिर्जापुर से होकर गुजरता है।\n3. भारत GMT से 5 घंटे 30 मिनट आगे है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements about Indian Standard Time (IST):\n1. IST is calculated as the local time at 82°30\'E longitude.\n2. The reference longitude passes through Mirzapur in Uttar Pradesh.\n3. India is 5 hours and 30 minutes ahead of GMT.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 3', en: '3 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। IST का संदर्भ बिंदु मिर्जापुर के निकट है।',
      explanationEn: 'All correct. IST is anchored near Mirzapur.',
    },
    {
      hi: 'भारत में चक्रवात (Cyclones) पर निम्नलिखित कथनों पर विचार करें:\n1. बंगाल की खाड़ी में चक्रवात अरब सागर की तुलना में अधिक बार आते हैं।\n2. उत्तरी हिंद महासागर के चक्रवातों के नाम IMD द्वारा समन्वयित होते हैं।\n3. उष्णकटिबंधीय चक्रवात की \'आँख\' (eye) सर्वाधिक हवा-वेग का क्षेत्र होती है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements about cyclones in India:\n1. Cyclones in the Bay of Bengal are more frequent than in the Arabian Sea.\n2. Cyclone names in the North Indian Ocean are coordinated by the IMD.\n3. The eye of a tropical cyclone is the region of highest wind speed.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 0,
      explanationHi: 'कथन 1 एवं 2 सही। कथन 3 गलत — चक्रवात की \'आँख\' शांत क्षेत्र है; eyewall (आँख की दीवार) में सर्वाधिक हवा-वेग होती है।',
      explanationEn: 'Statements 1 and 2 are correct. Statement 3 is wrong — the eye is a calm region; the eyewall has the highest wind speed.',
    },
    {
      hi: 'काली मिट्टी (Black Soil) के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. इसे \'रेगुर\' या \'कपास की काली मिट्टी\' भी कहते हैं।\n2. यह दक्कन के पठार में सबसे विस्तृत है।\n3. उच्च मृत्तिका (clay) सामग्री के कारण इसमें जल-धारण क्षमता अधिक होती है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements about Black Soil:\n1. It is also known as Regur or Black Cotton soil.\n2. It is most extensive in the Deccan Plateau.\n3. Due to high clay content, it has high water-retaining capacity.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। काली मिट्टी कपास की खेती के लिए आदर्श मानी जाती है।',
      explanationEn: 'All correct. Black soil is considered ideal for cotton cultivation.',
    },
    {
      hi: 'प्रोजेक्ट टाइगर के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. इसे भारत सरकार ने 1973 में लॉन्च किया।\n2. इस परियोजना के अंतर्गत पहला टाइगर रिज़र्व जिम कॉर्बेट राष्ट्रीय उद्यान था।\n3. 2023 तक भारत में 50 से अधिक टाइगर रिज़र्व हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Project Tiger:\n1. It was launched by the Government of India in 1973.\n2. The first Tiger Reserve under this project was Jim Corbett National Park.\n3. By 2023, India had more than 50 Tiger Reserves.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 2023 तक भारत में 54 टाइगर रिज़र्व हैं।',
      explanationEn: 'All correct. India has 54 Tiger Reserves as of 2023.',
    },
    {
      hi: 'भारतीय हिमालय के संदर्भ में निम्न कथनों पर विचार करें:\n1. हिमालय की तीन मुख्य श्रेणियाँ हैं — Himadri, Himachal, Shivalik।\n2. \'पीर पंजाल\' एवं \'धौलाधार\' हिमाचल का भाग हैं।\n3. हिमालय एक नवीन वलित पर्वत श्रेणी है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Indian Himalayas:\n1. The Himalayas have three main ranges — Himadri, Himachal, Shivalik.\n2. The Pir Panjal and Dhauladhar form part of the Himachal range.\n3. The Himalayas are a young fold-mountain range.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। Himadri (Greater Himalaya) सर्वाधिक ऊँचा।',
      explanationEn: 'All correct. Himadri (Greater Himalaya) is the loftiest.',
    },
    {
      hi: 'दक्कन के पठार के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह विश्व का सबसे बड़ा बेसाल्ट प्रवाह क्षेत्र है।\n2. यह क्रेटेशियस-तृतीयक काल के ज्वालामुखी विस्फोटों से बना।\n3. यह काली मिट्टी (Regur) के लिए प्रसिद्ध है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Deccan Plateau:\n1. It is one of the world\'s largest basaltic-flow regions.\n2. It was formed by Cretaceous-Tertiary volcanic eruptions.\n3. It is known for black soil (Regur).\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी सही। Deccan Traps लगभग 6.6 करोड़ वर्ष पुराने।',
      explanationEn: 'All correct. The Deccan Traps are about 66 million years old.',
    },
    {
      hi: 'भारत के तटीय मैदानों के संदर्भ में निम्न कथनों पर विचार करें:\n1. पश्चिमी तटीय मैदान — कोंकण, मलाबार, कन्नड़ — संकरे हैं।\n2. पूर्वी तटीय मैदान चौड़े एवं समतल हैं।\n3. कोरोमंडल तट उत्तर-पूर्व मानसून से अधिक वर्षा प्राप्त करता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India\'s coastal plains:\n1. The Western Coastal Plain — Konkan, Malabar, Kannad — is narrow.\n2. The Eastern Coastal Plain is broad and flat.\n3. The Coromandel Coast receives most rainfall from the Northeast monsoon.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही।',
      explanationEn: 'All correct.',
    },
    {
      hi: 'सिंधु जल संधि (1960) के संदर्भ में निम्न कथनों पर विचार करें:\n1. इसकी मध्यस्थता विश्व बैंक ने की।\n2. भारत को पूर्वी नदियों — Sutlej, Beas, Ravi — का अनन्य उपयोग दिया गया।\n3. पाकिस्तान को पश्चिमी नदियों — Indus, Jhelum, Chenab — का प्रमुख उपयोग दिया गया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Indus Waters Treaty (1960):\n1. The treaty was brokered by the World Bank.\n2. India was given exclusive use of the Eastern rivers — Sutlej, Beas, Ravi.\n3. Pakistan was given primary use of the Western rivers — Indus, Jhelum, Chenab.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। संधि पर पंडित नेहरू एवं अयूब खान ने हस्ताक्षर किए।',
      explanationEn: 'All correct. The treaty was signed by Pandit Nehru and Ayub Khan.',
    },
    {
      hi: 'भारत की मिट्टियों के संदर्भ में निम्न कथनों पर विचार करें:\n1. जलोढ़ मिट्टी सबसे विस्तृत है।\n2. लाल मिट्टी में लोहे की अधिकता के कारण रंग होता है।\n3. लैटेराइट मिट्टी अधिक वर्षा वाले उष्णकटिबंधीय क्षेत्रों में बनती है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Indian soils:\n1. Alluvial soil is the most extensive.\n2. Red soil owes its colour to high iron content.\n3. Laterite soil forms in tropical regions of high rainfall.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही।',
      explanationEn: 'All correct.',
    },
    {
      hi: 'जैव विविधता हॉटस्पॉट के संदर्भ में निम्न कथनों पर विचार करें:\n1. भारत में चार जैव विविधता हॉटस्पॉट हैं।\n2. ये — पश्चिमी घाट, हिमालय, इंडो-बर्मा एवं सुंडालैंड हैं।\n3. हॉटस्पॉट की अवधारणा Norman Myers ने दी।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Biodiversity Hotspots:\n1. India has four biodiversity hotspots.\n2. They are — Western Ghats, Himalaya, Indo-Burma and Sundaland.\n3. The hotspot concept was given by Norman Myers.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। Sundaland में भारत का निकोबार द्वीप समूह।',
      explanationEn: 'All correct. Sundaland includes India\'s Nicobar Islands.',
    },
    {
      hi: 'भारत के राष्ट्रीय उद्यानों एवं वन्यजीव अभयारण्यों के संदर्भ में निम्न कथनों पर विचार करें:\n1. जिम कॉर्बेट राष्ट्रीय उद्यान भारत का पहला राष्ट्रीय उद्यान (1936) है।\n2. नागरहोल राष्ट्रीय उद्यान कर्नाटक में स्थित है।\n3. काज़ीरंगा एक UNESCO World Heritage Site है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India\'s National Parks and Wildlife Sanctuaries:\n1. Jim Corbett National Park is India\'s first (1936).\n2. Nagarhole National Park is in Karnataka.\n3. Kaziranga is a UNESCO World Heritage Site.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। काज़ीरंगा 1985 में UNESCO में सूचीबद्ध।',
      explanationEn: 'All correct. Kaziranga was inscribed by UNESCO in 1985.',
    },
    {
      hi: 'Ramsar Sites के संदर्भ में निम्न कथनों पर विचार करें:\n1. Ramsar सम्मेलन 1971 में ईरान के Ramsar शहर में हस्ताक्षरित।\n2. यह आर्द्रभूमियों (wetlands) के संरक्षण से संबंधित है।\n3. भारत 1982 में Ramsar सम्मेलन का सदस्य बना।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Ramsar Sites:\n1. The Ramsar Convention was signed in 1971 in Ramsar, Iran.\n2. It deals with the conservation of wetlands.\n3. India joined the Ramsar Convention in 1982.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। चिल्का एवं केवलादेव भारत के पहले Ramsar Sites (1981)।',
      explanationEn: 'All correct. Chilika and Keoladeo were India\'s first Ramsar Sites (1981).',
    },
    {
      hi: 'भारत के द्वीप समूहों के संदर्भ में निम्न कथनों पर विचार करें:\n1. लक्षद्वीप अरब सागर में स्थित प्रवाल-द्वीप समूह है।\n2. अंडमान-निकोबार द्वीप समूह बंगाल की खाड़ी में है।\n3. अंडमान-निकोबार में सक्रिय ज्वालामुखी — Barren Island — मौजूद है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India\'s island groups:\n1. Lakshadweep is a coralline archipelago in the Arabian Sea.\n2. The Andaman-Nicobar Islands lie in the Bay of Bengal.\n3. The Andaman-Nicobar group has an active volcano — Barren Island.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। Barren Island भारत का एकमात्र पुष्ट सक्रिय ज्वालामुखी है।',
      explanationEn: 'All correct. Barren Island is India\'s only confirmed active volcano.',
    },
    {
      hi: 'मानसून के संदर्भ में निम्न कथनों पर विचार करें:\n1. दक्षिण-पश्चिम मानसून जून-सितंबर में सक्रिय रहता है।\n2. लौटता हुआ मानसून (उत्तर-पूर्व) मुख्यतः तमिलनाडु को वर्षा देता है।\n3. \'मानसून विस्फोट\' (Burst of Monsoon) सामान्यतः 1 जून के आसपास केरल में।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Indian monsoon:\n1. The Southwest monsoon is active from June to September.\n2. The retreating (Northeast) monsoon mainly brings rainfall to Tamil Nadu.\n3. The \'burst of monsoon\' typically occurs around 1 June in Kerala.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। IMD दीर्घ-अवधि पूर्वानुमान अप्रैल में जारी करता है।',
      explanationEn: 'All correct. IMD issues its long-range forecast in April.',
    },
    {
      hi: 'भारत के खनिज क्षेत्रों के संदर्भ में निम्न कथनों पर विचार करें:\n1. ओडिशा भारत में लौह अयस्क का सबसे बड़ा उत्पादक है।\n2. कोडरमा (झारखंड) अभ्रक के लिए प्रसिद्ध है।\n3. खेत्री (राजस्थान) तांबा-बेल्ट का प्रसिद्ध केंद्र है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India\'s mineral regions:\n1. Odisha is India\'s largest producer of iron ore.\n2. Koderma (Jharkhand) is famous for mica.\n3. Khetri (Rajasthan) is a well-known copper belt.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही।',
      explanationEn: 'All correct.',
    },
    {
      hi: 'भारतीय कृषि के संदर्भ में निम्न कथनों पर विचार करें:\n1. \'खरीफ\' फसलें जून-अक्टूबर के मानसून के दौरान बोई जाती हैं।\n2. \'रबी\' फसलें अक्टूबर-मार्च की सर्दियों में बोई जाती हैं।\n3. \'जायद\' फसलें ग्रीष्म ऋतु (मार्च-जून) में बोई जाती हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Indian agriculture:\n1. Kharif crops are sown during the June-October monsoon.\n2. Rabi crops are sown in winter, October-March.\n3. Zaid crops are sown in summer, March-June.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। उदाहरण: खरीफ — चावल; रबी — गेहूँ; जायद — तरबूज़।',
      explanationEn: 'All correct. Examples: Kharif — rice; Rabi — wheat; Zaid — watermelon.',
    },
    {
      hi: 'IMD (भारत मौसम विज्ञान विभाग) के संदर्भ में निम्न कथनों पर विचार करें:\n1. IMD की स्थापना 1875 में हुई।\n2. इसका मुख्यालय नई दिल्ली में है।\n3. IMD उत्तरी हिंद महासागर के चक्रवातों के नामकरण का RSMC है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the IMD:\n1. The IMD was established in 1875.\n2. Its headquarters is in New Delhi.\n3. The IMD is the RSMC for naming North Indian Ocean cyclones.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। RSMC — Regional Specialized Meteorological Centre।',
      explanationEn: 'All correct. RSMC — Regional Specialized Meteorological Centre.',
    },
    {
      hi: 'भारत के सिंचाई स्रोतों के संदर्भ में निम्न कथनों पर विचार करें:\n1. नहर सिंचाई उत्तर भारत के मैदानों में अधिक प्रचलित है।\n2. कुएँ एवं ट्यूबवेल पूरे देश में उपयोग किए जाते हैं।\n3. तालाब सिंचाई दक्षिण भारत — विशेषकर तमिलनाडु — में अधिक।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India\'s irrigation sources:\n1. Canal irrigation is more prevalent in the North Indian plains.\n2. Wells and tubewells are used countrywide.\n3. Tank irrigation is more common in South India, especially Tamil Nadu.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही।',
      explanationEn: 'All correct.',
    },
    {
      hi: 'भारत में जलवायु परिवर्तन के संदर्भ में निम्न कथनों पर विचार करें:\n1. भारत 2070 तक Net Zero लक्ष्य की प्रतिज्ञा कर चुका है।\n2. NAPCC के अंतर्गत 8 राष्ट्रीय मिशन हैं।\n3. International Solar Alliance (ISA) का मुख्यालय गुरुग्राम में है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India and climate change:\n1. India has pledged Net Zero by 2070.\n2. There are 8 national missions under NAPCC.\n3. The International Solar Alliance (ISA) is headquartered in Gurugram.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। Glasgow CoP-26 में मोदी जी ने Net Zero 2070 की घोषणा की।',
      explanationEn: 'All correct. PM Modi announced Net Zero 2070 at Glasgow CoP-26.',
    },
    {
      hi: 'मैंग्रोव वनों के संदर्भ में निम्न कथनों पर विचार करें:\n1. सुंदरबन (पश्चिम बंगाल) विश्व का सबसे बड़ा सतत मैंग्रोव वन है।\n2. भितरकनिका (ओडिशा) मैंग्रोव संरक्षण के लिए प्रसिद्ध है।\n3. MISHTI मिशन 2023 में शुरू किया गया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on mangroves:\n1. The Sundarbans (West Bengal) is the world\'s largest contiguous mangrove forest.\n2. Bhitarkanika (Odisha) is famous for mangrove conservation.\n3. MISHTI mission was launched in 2023.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। MISHTI — Mangrove Initiative for Shoreline Habitats & Tangible Incomes।',
      explanationEn: 'All correct. MISHTI — Mangrove Initiative for Shoreline Habitats & Tangible Incomes.',
    },
    {
      hi: 'भारत के UNESCO World Heritage Sites के संदर्भ में निम्न कथनों पर विचार करें:\n1. भारत में 40 से अधिक UNESCO World Heritage Sites हैं।\n2. \'काज़ीरंगा\' एवं \'मानस\' दोनों — असम में हैं।\n3. \'पश्चिमी घाट\' एक प्राकृतिक UNESCO Site है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on UNESCO World Heritage Sites in India:\n1. India has more than 40 UNESCO World Heritage Sites.\n2. \'Kaziranga\' and \'Manas\' are both in Assam.\n3. The \'Western Ghats\' is a UNESCO Natural Heritage Site.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। शांतिनिकेतन (2023) एवं होयसल मंदिर (2023) हाल के समावेश।',
      explanationEn: 'All correct. Recent additions include Santiniketan (2023) and Hoysala Temples (2023).',
    },
    {
      hi: 'भारत के मुख्य नदी-तंत्रों के संदर्भ में निम्न कथनों पर विचार करें:\n1. गंगा-ब्रह्मपुत्र-मेघना तंत्र भारत का सबसे बड़ा नदी-बेसिन है।\n2. ब्रह्मपुत्र को असम में \'लोहित\' एवं तिब्बत में \'त्संगपो\' कहा जाता है।\n3. कृष्णा एवं गोदावरी प्रायद्वीपीय नदियाँ हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India\'s major river systems:\n1. The Ganga-Brahmaputra-Meghna system is India\'s largest river basin.\n2. The Brahmaputra is called \'Lohit\' in Assam and \'Tsangpo\' in Tibet.\n3. The Krishna and Godavari are peninsular rivers.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही।',
      explanationEn: 'All correct.',
    },
  ],
  current_affairs: [
    {
      hi: 'भारत ने G20 की अध्यक्षता किस वर्ष की?',
      en: 'In which year did India hold the G20 Presidency?',
      options: [{ hi: '2022', en: '2022' }, { hi: '2023', en: '2023' }, { hi: '2024', en: '2024' }, { hi: '2025', en: '2025' }],
      correct: 1,
      explanationHi: 'भारत ने 2023 में G20 की अध्यक्षता की। शिखर सम्मेलन 9-10 सितंबर 2023 को नई दिल्ली में आयोजित हुआ।',
      explanationEn: 'India held the G20 Presidency in 2023. The summit was held on September 9-10, 2023 in New Delhi.',
    },
    {
      hi: 'प्रधानमंत्री मोदी का \'विकसित भारत 2047\' लक्ष्य किस पर आधारित है?',
      en: 'PM Modi\'s \'Viksit Bharat 2047\' goal is based on which target year?',
      options: [{ hi: 'भारत की आजादी के 100 साल', en: 'India\'s 100 years of independence' }, { hi: 'संयुक्त राष्ट्र SDG लक्ष्य', en: 'UN SDG goals' }, { hi: 'G20 प्रतिबद्धताएँ', en: 'G20 commitments' }, { hi: 'BRICS रोडमैप', en: 'BRICS roadmap' }],
      correct: 0,
      explanationHi: 'विकसित भारत 2047 की परिकल्पना 2047 तक भारत को एक विकसित राष्ट्र बनाने की है, जो भारत की स्वतंत्रता के 100 वर्ष पूरे होने का वर्ष है।',
      explanationEn: 'Viksit Bharat 2047 envisions making India a developed nation by 2047, the year of India\'s 100th year of independence.',
    },
    {
      hi: 'Operation Sindoor (2025) किससे संबंधित है?',
      en: 'What is Operation Sindoor (2025) related to?',
      options: [{ hi: 'बाढ़ राहत अभियान', en: 'Flood relief operation' }, { hi: 'पाकिस्तान में आतंकी ठिकानों पर भारतीय सैन्य हमला', en: 'Indian military strikes on terror camps in Pakistan' }, { hi: 'साइबर सुरक्षा अभियान', en: 'Cybersecurity campaign' }, { hi: 'अंतरिक्ष मिशन', en: 'Space mission' }],
      correct: 1,
      explanationHi: 'ऑपरेशन सिंदूर मई 2025 में पाकिस्तान और POK में आतंकी ठिकानों पर भारत द्वारा किया गया सटीक सैन्य हमला था।',
      explanationEn: 'Operation Sindoor was a precise Indian military strike on terror camps in Pakistan and POK in May 2025.',
    },
    {
      hi: '2024 में रसायन विज्ञान का नोबेल पुरस्कार किस उपलब्धि के लिए दिया गया?',
      en: 'For what achievement was the 2024 Nobel Prize in Chemistry awarded?',
      options: [{ hi: 'mRNA टीके', en: 'mRNA vaccines' }, { hi: 'प्रोटीन संरचना भविष्यवाणी (AlphaFold)', en: 'Protein structure prediction (AlphaFold)' }, { hi: 'क्वांटम कंप्यूटिंग', en: 'Quantum computing' }, { hi: 'जीन संपादन', en: 'Gene editing' }],
      correct: 1,
      explanationHi: '2024 का रसायन नोबेल डेविड बेकर, डेमिस हसाबिस तथा जॉन जम्पर को कंप्यूटेशनल प्रोटीन डिज़ाइन और AlphaFold द्वारा प्रोटीन संरचना भविष्यवाणी के लिए दिया गया।',
      explanationEn: 'The 2024 Chemistry Nobel went to David Baker, Demis Hassabis and John Jumper for computational protein design and protein structure prediction via AlphaFold.',
    },
    {
      hi: 'भारत की पहली आदिवासी महिला राष्ट्रपति कौन हैं?',
      en: 'Who is India\'s first tribal woman President?',
      options: [{ hi: 'राम नाथ कोविंद', en: 'Ram Nath Kovind' }, { hi: 'द्रौपदी मुर्मू', en: 'Droupadi Murmu' }, { hi: 'प्रतिभा पाटिल', en: 'Pratibha Patil' }, { hi: 'सुषमा स्वराज', en: 'Sushma Swaraj' }],
      correct: 1,
      explanationHi: 'द्रौपदी मुर्मू ने 25 जुलाई 2022 को 15वीं राष्ट्रपति के रूप में शपथ ली। वे भारत की पहली आदिवासी महिला राष्ट्रपति हैं और दूसरी महिला राष्ट्रपति (प्रतिभा पाटिल के बाद)।',
      explanationEn: 'Droupadi Murmu was sworn in as the 15th President of India on 25 July 2022. She is the first tribal woman President and only the second woman President (after Pratibha Patil).',
    },
    {
      hi: '2024 का पेरिस ओलंपिक में भारत को कितने पदक मिले?',
      en: 'How many medals did India win at the 2024 Paris Olympics?',
      options: [{ hi: '4', en: '4' }, { hi: '6', en: '6' }, { hi: '7', en: '7' }, { hi: '10', en: '10' }],
      correct: 1,
      explanationHi: 'पेरिस 2024 में भारत ने 6 पदक जीते — 1 रजत और 5 कांस्य। नीरज चोपड़ा को भालाफेंक में रजत मिला।',
      explanationEn: 'India won 6 medals at Paris 2024 — 1 silver and 5 bronze. Neeraj Chopra won silver in javelin throw.',
    },
    {
      hi: 'भारत का \'चंद्रयान-4\' मिशन किस उद्देश्य से प्रस्तावित है?',
      en: 'What is the proposed objective of India\'s "Chandrayaan-4" mission?',
      options: [{ hi: 'चंद्रमा पर मानव भेजना', en: 'Send humans to the Moon' }, { hi: 'चंद्रमा से नमूना लाकर पृथ्वी पर लौटना', en: 'Bring samples from Moon back to Earth' }, { hi: 'चंद्रमा पर स्थायी कॉलोनी', en: 'Permanent colony on Moon' }, { hi: 'चंद्रमा का मानचित्रण', en: 'Map the Moon' }],
      correct: 1,
      explanationHi: 'चंद्रयान-4 का प्रस्तावित उद्देश्य चंद्रमा से नमूने एकत्र कर पृथ्वी पर लौटाना है — यह भारत का पहला lunar sample-return मिशन होगा।',
      explanationEn: 'Chandrayaan-4\'s objective is to collect lunar samples and return them to Earth — making it India\'s first lunar sample-return mission.',
    },
    {
      hi: '\'One Nation, One Election\' विधेयक की समीक्षा हेतु बनी समिति की अध्यक्षता किसने की?',
      en: 'Who chaired the committee that reviewed the "One Nation, One Election" proposal?',
      options: [{ hi: 'सोनिया गांधी', en: 'Sonia Gandhi' }, { hi: 'राम नाथ कोविंद', en: 'Ram Nath Kovind' }, { hi: 'अमित शाह', en: 'Amit Shah' }, { hi: 'मनमोहन सिंह', en: 'Manmohan Singh' }],
      correct: 1,
      explanationHi: 'पूर्व राष्ट्रपति राम नाथ कोविंद की अध्यक्षता वाली उच्च-स्तरीय समिति ने सितंबर 2023 में \'एक राष्ट्र, एक चुनाव\' पर अपनी रिपोर्ट प्रस्तुत की।',
      explanationEn: 'A high-level committee chaired by former President Ram Nath Kovind submitted its report on "One Nation, One Election" in September 2023.',
    },
    {
      hi: 'भारत की जलवायु प्रतिबद्धताओं पर निम्नलिखित कथनों पर विचार करें:\n1. भारत ने 2022 में UNFCCC को अपने अद्यतन NDCs प्रस्तुत किए।\n2. भारत ने 2070 तक Net Zero का लक्ष्य निर्धारित किया है।\n3. भारत अंतर्राष्ट्रीय सौर गठबंधन (ISA) का सदस्य है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India\'s climate commitments:\n1. India submitted its updated NDCs to the UNFCCC in 2022.\n2. India has pledged to achieve Net Zero by 2070.\n3. India is a member of the International Solar Alliance (ISA).\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। ISA की सह-स्थापना भारत एवं फ्रांस ने 2015 में की थी; इसका मुख्यालय गुरुग्राम में है।',
      explanationEn: 'All correct. ISA was co-founded by India and France in 2015; its headquarters is in Gurugram.',
    },
    {
      hi: 'Quad (Quadrilateral Security Dialogue) के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. Quad में भारत, USA, जापान एवं ऑस्ट्रेलिया शामिल हैं।\n2. पहला व्यक्तिगत Quad शिखर सम्मेलन 2021 में आयोजित हुआ।\n3. Quad की उत्पत्ति 2004 के हिंद महासागर सुनामी के लिए राहत समन्वय में निहित है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Quad:\n1. The Quad consists of India, the USA, Japan and Australia.\n2. The first in-person Quad summit was held in 2021.\n3. The Quad has its origin in the relief-coordination response to the 2004 Indian Ocean tsunami.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। पहला व्यक्तिगत Quad शिखर सम्मेलन सितंबर 2021 में वाशिंगटन D.C. में हुआ।',
      explanationEn: 'All correct. The first in-person Quad summit was held in Washington D.C. in September 2021.',
    },
    {
      hi: 'BRICS के विस्तार पर निम्नलिखित कथनों पर विचार करें:\n1. BRIC की स्थापना 2009 में पहली शिखर बैठक के साथ हुई।\n2. दक्षिण अफ्रीका 2010 में BRIC में शामिल हुआ — समूह BRICS बन गया।\n3. जनवरी 2024 से मिस्र, ईरान, UAE एवं इथियोपिया पूर्ण BRICS सदस्य बने।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the BRICS expansion:\n1. BRIC was founded with its first summit in 2009.\n2. South Africa joined BRIC in 2010, making it BRICS.\n3. Egypt, Iran, the UAE, and Ethiopia became full BRICS members from January 2024.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। सऊदी अरब को आमंत्रित किया गया था परंतु प्रारंभ में औपचारिक रूप से शामिल नहीं हुआ; अर्जेंटीना ने प्रस्ताव अस्वीकार किया।',
      explanationEn: 'All correct. Saudi Arabia was invited but did not formally join initially; Argentina declined.',
    },
    {
      hi: 'दिल्ली G20 शिखर सम्मेलन (2023) के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. भारत ने 2023 में G20 की अध्यक्षता की।\n2. नई दिल्ली शिखर सम्मेलन में \'दिल्ली घोषणापत्र\' अपनाया गया।\n3. अफ्रीकी संघ (AU) को नई दिल्ली शिखर सम्मेलन में G20 का स्थायी सदस्य बनाया गया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Delhi G20 Summit (2023):\n1. India held the G20 Presidency in 2023.\n2. The Delhi Declaration was adopted at the New Delhi Summit.\n3. The African Union (AU) was made a permanent member of the G20 at the New Delhi Summit.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। शिखर सम्मेलन 9-10 सितंबर 2023 को आयोजित हुआ।',
      explanationEn: 'All correct. The summit was held on 9-10 September 2023.',
    },
    {
      hi: 'वंदे भारत ट्रेनों के संदर्भ में निम्नलिखित कथनों पर विचार करें:\n1. वंदे भारत भारत की पहली semi-high-speed ट्रेन है।\n2. पहली वंदे भारत नई दिल्ली-वाराणसी मार्ग पर चली।\n3. वंदे भारत का निर्माण ICF (Integral Coach Factory) चेन्नई में होता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Vande Bharat trains:\n1. Vande Bharat is India\'s first semi-high-speed train.\n2. The first Vande Bharat ran on the New Delhi–Varanasi route.\n3. Vande Bharat is manufactured at the Integral Coach Factory (ICF), Chennai.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। पहली वंदे भारत (Train 18) फरवरी 2019 में नई दिल्ली-वाराणसी पर लॉन्च हुई।',
      explanationEn: 'All correct. The first Vande Bharat (Train 18) was launched on the New Delhi–Varanasi route in February 2019.',
    },
    {
      hi: 'IMEC (India-Middle East-Europe Economic Corridor) के संदर्भ में निम्न कथनों पर विचार करें:\n1. IMEC की घोषणा G20 दिल्ली शिखर सम्मेलन (सितंबर 2023) में हुई।\n2. इसमें भारत, UAE, सऊदी अरब, EU, USA सदस्य हैं।\n3. यह रेल एवं समुद्री मार्ग का संयोजन प्रस्तावित करता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on IMEC (India-Middle East-Europe Economic Corridor):\n1. IMEC was announced at the G20 Delhi Summit (September 2023).\n2. Members include India, UAE, Saudi Arabia, EU, and USA.\n3. It proposes a combination of rail and sea routes.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। चीन के BRI के विकल्प के रूप में देखा जा रहा।',
      explanationEn: 'All correct. Viewed as an alternative to China\'s Belt and Road Initiative.',
    },
    {
      hi: 'चंद्रयान-3 मिशन के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह 14 जुलाई 2023 को LVM3 द्वारा लॉन्च किया गया।\n2. \'विक्रम\' लैंडर ने 23 अगस्त 2023 को चंद्रमा के दक्षिणी ध्रुव क्षेत्र के निकट सॉफ्ट लैंडिंग की।\n3. इस मिशन ने भारत को चंद्रमा पर सॉफ्ट-लैंडिंग करने वाला चौथा देश बनाया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Chandrayaan-3 mission:\n1. It was launched on 14 July 2023 aboard LVM3.\n2. The Vikram lander made a soft landing near the Moon\'s south-pole region on 23 August 2023.\n3. This made India the fourth country to soft-land on the Moon.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। पहले: अमेरिका, सोवियत संघ/रूस, चीन।',
      explanationEn: 'All correct. Earlier — USA, USSR/Russia, China.',
    },
    {
      hi: 'Digital Personal Data Protection (DPDP) Act 2023 के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह भारत का पहला समर्पित डेटा-सुरक्षा कानून है।\n2. यह डिजिटल व्यक्तिगत डेटा के प्रसंस्करण को विनियमित करता है।\n3. यह बाल-डेटा (children\'s data) के प्रसंस्करण के लिए माता-पिता की सहमति अनिवार्य करता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the DPDP Act 2023:\n1. It is India\'s first dedicated data-protection law.\n2. It governs the processing of digital personal data.\n3. It mandates parental consent for processing children\'s data.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। डेटा-संरक्षण बोर्ड (Data Protection Board) इसका प्रवर्तन निकाय।',
      explanationEn: 'All correct. The Data Protection Board is its enforcement body.',
    },
    {
      hi: 'Bharatiya Nyaya Sanhita (BNS) 2023 के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह भारतीय दंड संहिता (IPC) 1860 का स्थान लेगी।\n2. इसके साथ Bharatiya Nagarik Suraksha Sanhita एवं Bharatiya Sakshya Adhiniyam — दो अन्य अधिनियम भी आए।\n3. ये तीनों अधिनियम 1 जुलाई 2024 से लागू हुए।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Bharatiya Nyaya Sanhita (BNS) 2023:\n1. It replaces the Indian Penal Code (IPC) 1860.\n2. It is accompanied by the Bharatiya Nagarik Suraksha Sanhita and the Bharatiya Sakshya Adhiniyam.\n3. The three laws came into force on 1 July 2024.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। BNSS एवं BSA, CrPC एवं Indian Evidence Act का स्थान लेते हैं।',
      explanationEn: 'All correct. The BNSS and BSA replace the CrPC and the Indian Evidence Act respectively.',
    },
    {
      hi: 'Nari Shakti Vandan Adhiniyam (106वाँ संविधान संशोधन, 2023) के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह लोकसभा एवं विधानसभाओं में महिलाओं के लिए 33% सीटें आरक्षित करता है।\n2. यह राज्यसभा एवं विधान परिषदों पर भी लागू होता है।\n3. इसका कार्यान्वयन परिसीमन (delimitation) के बाद होगा।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Nari Shakti Vandan Adhiniyam (106th Constitutional Amendment, 2023):\n1. It reserves 33% of seats for women in the Lok Sabha and State Legislative Assemblies.\n2. It applies to the Rajya Sabha and Legislative Councils as well.\n3. Its implementation will follow delimitation.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: 'केवल 1 और 3', en: '1 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }],
      correct: 2,
      explanationHi: 'कथन 1 एवं 3 सही। कथन 2 गलत — यह राज्यसभा एवं विधान परिषदों पर लागू नहीं।',
      explanationEn: 'Statements 1 and 3 are correct. Statement 2 is wrong — it does not apply to the Rajya Sabha and Legislative Councils.',
    },
    {
      hi: 'PM Surya Ghar: Muft Bijli Yojana के संदर्भ में निम्न कथनों पर विचार करें:\n1. इसे फरवरी 2024 में लॉन्च किया गया।\n2. इसका लक्ष्य 1 करोड़ घरों के लिए रूफटॉप सौर ऊर्जा है।\n3. यह प्रत्येक पात्र परिवार को 300 यूनिट तक मुफ्त बिजली देने का लक्ष्य रखती है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on PM Surya Ghar: Muft Bijli Yojana:\n1. It was launched in February 2024.\n2. It aims to provide rooftop solar to 1 crore households.\n3. It targets up to 300 units of free electricity per eligible household.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। MNRE द्वारा क्रियान्वित।',
      explanationEn: 'All correct. Implemented by MNRE.',
    },
    {
      hi: 'अनुच्छेद 370 के निरसन के संदर्भ में निम्न कथनों पर विचार करें:\n1. इसे 5-6 अगस्त 2019 को निरस्त किया गया।\n2. जम्मू-कश्मीर पुनर्गठन अधिनियम 2019 ने राज्य को दो UTs में पुनर्गठित किया।\n3. SC ने In re: Article 370 (दिसंबर 2023) में निरसन को संवैधानिक माना।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the abrogation of Article 370:\n1. It was abrogated on 5-6 August 2019.\n2. The J&K Reorganisation Act 2019 split the State into two UTs.\n3. The SC upheld the abrogation as constitutional in In re: Article 370 (December 2023).\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। Two UTs — Jammu & Kashmir एवं Ladakh।',
      explanationEn: 'All correct. The two UTs — Jammu & Kashmir and Ladakh.',
    },
    {
      hi: 'India-EFTA TEPA (मार्च 2024) के संदर्भ में निम्न कथनों पर विचार करें:\n1. EFTA में स्विट्ज़रलैंड, नॉर्वे, आइसलैंड एवं लिकटेंस्टीन शामिल हैं।\n2. TEPA — Trade and Economic Partnership Agreement।\n3. EFTA ने 15 वर्षों में $100 बिलियन निवेश की प्रतिबद्धता दी है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India-EFTA TEPA (March 2024):\n1. EFTA comprises Switzerland, Norway, Iceland, and Liechtenstein.\n2. TEPA stands for Trade and Economic Partnership Agreement.\n3. EFTA has committed $100 billion in investments over 15 years.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। निवेश-संबंधी प्रतिबद्धता पहला FTA जिसमें ऐसा प्रावधान।',
      explanationEn: 'All correct. The first FTA to include such an investment commitment.',
    },
    {
      hi: 'Cheetah Reintroduction Project के संदर्भ में निम्न कथनों पर विचार करें:\n1. इस परियोजना के तहत Cheetahs को मध्य प्रदेश के कुनो राष्ट्रीय उद्यान में बसाया गया।\n2. पहला बैच नामीबिया से सितंबर 2022 में आया।\n3. यह विश्व का पहला अंतर-महाद्वीपीय बड़े मांसाहारी का translocation है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Cheetah Reintroduction Project:\n1. Cheetahs were settled at Kuno National Park in Madhya Pradesh.\n2. The first batch arrived from Namibia in September 2022.\n3. It is the world\'s first intercontinental translocation of a large carnivore.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 1952 में भारत में Cheetah को विलुप्त घोषित किया गया था।',
      explanationEn: 'All correct. Cheetahs were declared extinct in India in 1952.',
    },
    {
      hi: 'International Year of Millets 2023 के संदर्भ में निम्न कथनों पर विचार करें:\n1. इसका प्रस्ताव भारत ने UN में दिया।\n2. भारत विश्व का सबसे बड़ा मिलेट्स उत्पादक है।\n3. \'श्री अन्न\' मिलेट्स के लिए सरकारी ब्रांड नाम है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the International Year of Millets 2023:\n1. India proposed it at the UN.\n2. India is the world\'s largest producer of millets.\n3. \'Shree Anna\' is the government\'s branding for millets.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 73 देशों के समर्थन से 2021 में UN ने 2023 घोषित किया।',
      explanationEn: 'All correct. The UN declared 2023 with backing from 73 countries (in 2021).',
    },
    {
      hi: 'Ayushman Bharat के संदर्भ में निम्न कथनों पर विचार करें:\n1. PM-JAY (Pradhan Mantri Jan Arogya Yojana) इसका हिस्सा है।\n2. यह प्रति परिवार ₹5 लाख तक का स्वास्थ्य कवर देता है।\n3. आयुष्मान भारत में Health & Wellness Centres (HWCs) भी शामिल हैं।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Ayushman Bharat:\n1. PM-JAY (Pradhan Mantri Jan Arogya Yojana) is a part of it.\n2. It provides health cover of up to ₹5 lakh per family.\n3. Health and Wellness Centres (HWCs) are part of Ayushman Bharat.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 2018 में लॉन्च। MoHFW द्वारा क्रियान्वित।',
      explanationEn: 'All correct. Launched in 2018; implemented by MoHFW.',
    },
    {
      hi: 'India\'s G20 Presidency के संदर्भ में निम्न कथनों पर विचार करें:\n1. भारत की अध्यक्षता-थीम \'वसुधैव कुटुंबकम्\' / \'One Earth, One Family, One Future\' थी।\n2. New Delhi Leaders\' Declaration सर्वसम्मति से अपनाया गया।\n3. African Union को इसी शिखर सम्मेलन में G20 का स्थायी सदस्य बनाया गया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India\'s G20 Presidency:\n1. India\'s presidency theme was \'Vasudhaiva Kutumbakam\' / \'One Earth, One Family, One Future\'.\n2. The New Delhi Leaders\' Declaration was adopted by consensus.\n3. The African Union was made a permanent G20 member at this summit.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 9-10 सितंबर 2023, भारत मंडपम।',
      explanationEn: 'All correct. 9-10 September 2023, Bharat Mandapam.',
    },
    {
      hi: 'भारत के Critical Minerals Mission के संदर्भ में निम्न कथनों पर विचार करें:\n1. भारत ने 2023 में 30 critical minerals की राष्ट्रीय सूची जारी की।\n2. KABIL विदेशी अधिग्रहण के लिए स्थापित संयुक्त उपक्रम है।\n3. भारत 2023 में Mineral Security Partnership (MSP) में शामिल हुआ।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on India\'s Critical Minerals Mission:\n1. India released a national list of 30 critical minerals in 2023.\n2. KABIL is a joint venture set up for overseas acquisition.\n3. India joined the Mineral Security Partnership (MSP) in 2023.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। KABIL — NALCO + HCL + MECL का संयुक्त उपक्रम।',
      explanationEn: 'All correct. KABIL is a joint venture of NALCO + HCL + MECL.',
    },
    {
      hi: 'Tele-MANAS के संदर्भ में निम्न कथनों पर विचार करें:\n1. इसे 10 अक्टूबर 2022 (World Mental Health Day) को MoHFW ने लॉन्च किया।\n2. NIMHANS इसका तकनीकी एंकर है।\n3. इसकी टोल-फ्री हेल्पलाइन 14416 है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Tele-MANAS:\n1. MoHFW launched it on 10 October 2022 (World Mental Health Day).\n2. NIMHANS is its technical anchor.\n3. The toll-free helpline is 14416.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 24×7 बहुभाषी सेवा।',
      explanationEn: 'All correct. 24×7 multilingual service.',
    },
    {
      hi: 'PM Vishwakarma Yojana के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह सितंबर 2023 में लॉन्च हुई।\n2. यह 18 पारंपरिक व्यवसायों के कारीगरों एवं शिल्पकारों को कवर करती है।\n3. लाभार्थियों को कौशल प्रशिक्षण, टूलकिट प्रोत्साहन एवं ₹3 लाख तक का रियायती ऋण मिलता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on PM Vishwakarma:\n1. It was launched in September 2023.\n2. It covers artisans and craftspersons in 18 traditional trades.\n3. Beneficiaries receive skill training, toolkit incentive, and concessional credit up to ₹3 lakh.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 17 सितंबर 2023 को विश्वकर्मा जयंती पर लॉन्च।',
      explanationEn: 'All correct. Launched on Vishwakarma Jayanti, 17 September 2023.',
    },
    {
      hi: 'Operation Ganga (2022) के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह यूक्रेन में फँसे भारतीय नागरिकों — विशेषकर छात्रों — की निकासी हेतु संचालित था।\n2. यह 2022 के रूस-यूक्रेन युद्ध के संदर्भ में था।\n3. इसका संचालन MEA एवं भारतीय वायुसेना ने मिलकर किया।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on Operation Ganga (2022):\n1. It evacuated Indian nationals — especially students — stranded in Ukraine.\n2. It took place during the 2022 Russia-Ukraine war.\n3. It was jointly run by the MEA and the Indian Air Force.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। 22,500+ नागरिकों को सुरक्षित निकाला गया।',
      explanationEn: 'All correct. Over 22,500 citizens were safely evacuated.',
    },
    {
      hi: 'Quad Critical and Emerging Technologies Working Group के संदर्भ में निम्न कथनों पर विचार करें:\n1. यह 2021 में स्थापित हुआ।\n2. इसमें भारत, USA, जापान एवं ऑस्ट्रेलिया शामिल हैं।\n3. यह सेमीकंडक्टर, AI, क्वांटम तकनीक एवं Critical Minerals पर सहयोग करता है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on the Quad Critical and Emerging Technologies Working Group:\n1. It was established in 2021.\n2. India, USA, Japan, and Australia are members.\n3. It cooperates on semiconductors, AI, quantum technology, and critical minerals.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही।',
      explanationEn: 'All correct.',
    },
    {
      hi: 'NEP 2020 (राष्ट्रीय शिक्षा नीति) के संदर्भ में निम्न कथनों पर विचार करें:\n1. NEP 2020 ने 1986 की शिक्षा नीति का स्थान लिया।\n2. इसने 5+3+3+4 की नई स्कूल संरचना का प्रस्ताव दिया।\n3. यह 2035 तक उच्च शिक्षा GER 50% का लक्ष्य रखती है।\nइनमें से कौन से सही हैं?',
      en: 'Consider the following statements on NEP 2020:\n1. NEP 2020 replaced the National Policy on Education 1986.\n2. It proposed the new 5+3+3+4 school structure.\n3. It targets 50% Gross Enrolment Ratio in higher education by 2035.\nWhich are correct?',
      options: [{ hi: 'केवल 1 और 2', en: '1 and 2 only' }, { hi: 'केवल 2 और 3', en: '2 and 3 only' }, { hi: '1, 2 और 3', en: '1, 2 and 3' }, { hi: 'केवल 1', en: '1 only' }],
      correct: 2,
      explanationHi: 'सभी कथन सही। K. Kasturirangan समिति की सिफारिश पर तैयार।',
      explanationEn: 'All correct. Drafted on the recommendation of the K. Kasturirangan Committee.',
    },
  ],
}

const QUIZ_DURATION = 10 * 60 // 10 minutes in seconds
const ARCHIVE_QUESTIONS_PER_TEST = 10

// --- Seeded shuffle (xmur3 + Mulberry32) — deterministic per (subject, date) ---
function dateSeed(s: string): number {
  let h = 1779033703 ^ s.length
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return ((h ^= h >>> 16) >>> 0)
}
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed)
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Per-question topic labels for Gap Analysis. Parallel to questionBank above.
const TOPICS: Record<string, Array<{ hi: string; en: string }>> = {
  science_tech: [
    { hi: 'भारतीय अंतरिक्ष कार्यक्रम', en: 'Indian Space Program' },
    { hi: 'भौतिकी — प्रकाश की गति',      en: 'Physics — Speed of Light' },
    { hi: 'ISRO एवं संस्थान',            en: 'ISRO & Institutions' },
    { hi: 'चंद्रयान मिशन',               en: 'Chandrayaan Missions' },
    { hi: 'सुपरकंप्यूटिंग',              en: 'Supercomputing' },
    { hi: 'टीका प्रौद्योगिकी',           en: 'Vaccine Technology' },
    { hi: 'जीन संपादन — CRISPR',         en: 'Gene Editing — CRISPR' },
    { hi: 'रसायन — pH एवं अम्ल-क्षार',    en: 'Chemistry — pH & Acid-Base' },
    { hi: 'गगनयान कार्यक्रम',             en: 'Gaganyaan Programme' },
    { hi: 'CRISPR एवं जीन-थेरेपी',         en: 'CRISPR & Gene Therapy' },
    { hi: 'राष्ट्रीय क्वांटम मिशन',         en: 'National Quantum Mission' },
    { hi: 'सेमीकंडक्टर मिशन',              en: 'Semiconductor Mission' },
    { hi: 'PSLV एवं प्रक्षेपण यान',          en: 'PSLV & Launch Vehicles' },
    { hi: 'मार्स ऑर्बिटर मिशन',             en: 'Mars Orbiter Mission' },
    { hi: 'INS विक्रांत',                  en: 'INS Vikrant' },
    { hi: 'NavIC',                         en: 'NavIC' },
    { hi: 'AstroSat',                      en: 'AstroSat' },
    { hi: 'तेजस LCA',                       en: 'Tejas LCA' },
    { hi: 'राष्ट्रीय हरित हाइड्रोजन मिशन',   en: 'National Green Hydrogen Mission' },
    { hi: 'भारतीय अंटार्कटिक मिशन',          en: 'Indian Antarctic Programme' },
    { hi: 'CERVAVAC टीका',                  en: 'CERVAVAC Vaccine' },
    { hi: 'PSLV vs GSLV',                  en: 'PSLV vs GSLV' },
    { hi: 'Drone Rules 2021',              en: 'Drone Rules 2021' },
    { hi: 'eSanjeevani',                   en: 'eSanjeevani' },
    { hi: 'Bharat 6G विज़न',                en: 'Bharat 6G Vision' },
    { hi: 'Mission Indradhanush',          en: 'Mission Indradhanush' },
    { hi: 'BrahMos मिसाइल',                 en: 'BrahMos Missile' },
    { hi: 'Mission Divyastra',             en: 'Mission Divyastra' },
    { hi: 'IndiaAI Mission',               en: 'IndiaAI Mission' },
    { hi: 'Bhuvan',                        en: 'Bhuvan' },
  ],
  polity: [
    { hi: 'मौलिक अधिकार',               en: 'Fundamental Rights' },
    { hi: 'कार्यपालिका — PM',            en: 'Executive — Prime Minister' },
    { hi: 'अनुसूचियाँ',                  en: 'Schedules of the Constitution' },
    { hi: 'संविधान संशोधन',              en: 'Constitutional Amendments' },
    { hi: 'राज्यसभा',                    en: 'Rajya Sabha' },
    { hi: 'आपातकालीन प्रावधान',          en: 'Emergency Provisions' },
    { hi: 'पंचायती राज',                 en: 'Panchayati Raj' },
    { hi: 'नागरिकता',                    en: 'Citizenship' },
    { hi: 'भारत निर्वाचन आयोग',           en: 'Election Commission of India' },
    { hi: 'अनुच्छेद 368 — संशोधन',         en: 'Article 368 — Amendment' },
    { hi: 'दलबदल विरोधी कानून',           en: 'Anti-Defection Law' },
    { hi: 'लोकपाल',                       en: 'Lokpal' },
    { hi: 'CAA 2019',                     en: 'CAA 2019' },
    { hi: 'प्रस्तावना',                    en: 'Preamble' },
    { hi: 'राष्ट्रपति की क्षमादान शक्ति',    en: 'Presidential Pardon Power' },
    { hi: 'CAG',                          en: 'CAG' },
    { hi: 'NHRC',                         en: 'NHRC' },
    { hi: 'मनी बिल',                      en: 'Money Bill' },
    { hi: 'संसद की संयुक्त बैठक',           en: 'Joint Sitting of Parliament' },
    { hi: 'राष्ट्रीय आपातकाल',              en: 'National Emergency' },
    { hi: 'मूल कर्तव्य',                    en: 'Fundamental Duties' },
    { hi: 'राष्ट्रपति का निर्वाचन',          en: 'Election of President' },
    { hi: 'SC मूल अधिकारिता',              en: 'SC Original Jurisdiction' },
    { hi: 'मौलिक अधिकार',                  en: 'Fundamental Rights' },
    { hi: '9वीं अनुसूची',                   en: 'Ninth Schedule' },
    { hi: 'महाभियोग',                      en: 'Impeachment' },
    { hi: 'संसदीय विशेषाधिकार',             en: 'Parliamentary Privileges' },
    { hi: 'संविधान के स्रोत',                en: 'Sources of Constitution' },
    { hi: 'अल्पसंख्यक अधिकार',              en: 'Minority Rights' },
    { hi: 'आरक्षण एवं EWS',                 en: 'Reservation & EWS' },
  ],
  economy: [
    { hi: 'भारतीय बैंकिंग — RBI',         en: 'Indian Banking — RBI' },
    { hi: 'अप्रत्यक्ष कर — GST',          en: 'Indirect Tax — GST' },
    { hi: 'योजना एवं NITI Aayog',        en: 'Planning & NITI Aayog' },
    { hi: 'वैश्विक अर्थव्यवस्था में भारत', en: 'India in World Economy' },
    { hi: 'मौद्रिक नीति',                 en: 'Monetary Policy' },
    { hi: 'वित्तीय समावेशन',              en: 'Financial Inclusion' },
    { hi: 'MUDRA एवं MSME',               en: 'MUDRA & MSME' },
    { hi: 'PLI योजना',                    en: 'PLI Scheme' },
    { hi: 'विश्व बैंक रिपोर्ट्स',          en: 'World Bank Reports' },
    { hi: 'UPI एवं डिजिटल भुगतान',         en: 'UPI & Digital Payments' },
    { hi: 'GST परिषद',                    en: 'GST Council' },
    { hi: 'दिवाला संहिता — IBC',           en: 'Insolvency Code — IBC' },
    { hi: 'DBT एवं JAM त्रिमूर्ति',         en: 'DBT & JAM Trinity' },
    { hi: 'PMJDY',                        en: 'PMJDY' },
    { hi: 'मौद्रिक नीति समिति (MPC)',       en: 'Monetary Policy Committee' },
    { hi: 'FRBM Act',                     en: 'FRBM Act' },
    { hi: 'SEBI',                         en: 'SEBI' },
    { hi: 'NABARD',                       en: 'NABARD' },
    { hi: 'राष्ट्रीय पेंशन प्रणाली (NPS)',    en: 'National Pension System (NPS)' },
    { hi: 'GST परिषद — Mohit Minerals',     en: 'GST Council — Mohit Minerals' },
    { hi: 'केंद्रीय बजट',                   en: 'Union Budget' },
    { hi: 'IBC — Section 29A',             en: 'IBC — Section 29A' },
    { hi: 'विदेशी मुद्रा भंडार',             en: 'Forex Reserves' },
    { hi: 'CRR एवं SLR',                   en: 'CRR and SLR' },
    { hi: 'राष्ट्रीय आय अवधारणाएँ',          en: 'National Income Concepts' },
    { hi: 'आयकर अधिनियम',                  en: 'Income Tax Act' },
    { hi: 'PM-KISAN',                     en: 'PM-KISAN' },
    { hi: 'MSME वर्गीकरण',                 en: 'MSME Classification' },
    { hi: 'PM Vishwakarma',               en: 'PM Vishwakarma' },
    { hi: 'PLI योजना',                     en: 'PLI Scheme' },
    { hi: 'PSB समेकन',                     en: 'PSB Consolidation' },
    { hi: 'UPI अंतर्राष्ट्रीयकरण',           en: 'UPI Internationalisation' },
  ],
  geography: [
    { hi: 'भारतीय नदी तंत्र',            en: 'Indian River System' },
    { hi: 'भारतीय तटरेखा',               en: 'Indian Coastline' },
    { hi: 'मैंग्रोव एवं सुंदरबन',         en: 'Mangroves & Sundarbans' },
    { hi: 'हिमालय के शिखर',              en: 'Himalayan Peaks' },
    { hi: 'झीलें — चिल्का',               en: 'Lakes — Chilika' },
    { hi: 'मानसून',                       en: 'Monsoon' },
    { hi: 'हिल स्टेशन',                   en: 'Hill Stations' },
    { hi: 'अंतर्राष्ट्रीय सीमाएँ',         en: 'International Boundaries' },
    { hi: 'पूर्वोत्तर भारत',               en: 'North-East India' },
    { hi: 'पश्चिमी घाट',                   en: 'Western Ghats' },
    { hi: 'भारतीय मानक समय',               en: 'Indian Standard Time' },
    { hi: 'चक्रवात एवं IMD',                en: 'Cyclones & IMD' },
    { hi: 'काली मिट्टी',                    en: 'Black Soil' },
    { hi: 'प्रोजेक्ट टाइगर',                en: 'Project Tiger' },
    { hi: 'भारतीय हिमालय',                  en: 'Indian Himalayas' },
    { hi: 'दक्कन का पठार',                  en: 'Deccan Plateau' },
    { hi: 'भारतीय तटीय मैदान',              en: 'Indian Coastal Plains' },
    { hi: 'सिंधु जल संधि',                   en: 'Indus Waters Treaty' },
    { hi: 'भारत की मिट्टियाँ',                en: 'Indian Soils' },
    { hi: 'जैव विविधता हॉटस्पॉट',           en: 'Biodiversity Hotspots' },
    { hi: 'राष्ट्रीय उद्यान एवं अभयारण्य',     en: 'National Parks & Sanctuaries' },
    { hi: 'Ramsar Sites',                  en: 'Ramsar Sites' },
    { hi: 'भारत के द्वीप समूह',              en: 'Indian Island Groups' },
    { hi: 'भारतीय मानसून',                  en: 'Indian Monsoon' },
    { hi: 'खनिज क्षेत्र',                    en: 'Mineral Regions' },
    { hi: 'भारतीय कृषि — खरीफ/रबी/जायद',     en: 'Indian Agriculture — Kharif/Rabi/Zaid' },
    { hi: 'IMD',                          en: 'IMD' },
    { hi: 'सिंचाई स्रोत',                    en: 'Irrigation Sources' },
    { hi: 'भारत एवं जलवायु परिवर्तन',         en: 'India & Climate Change' },
    { hi: 'मैंग्रोव वन',                     en: 'Mangrove Forests' },
    { hi: 'UNESCO विश्व विरासत स्थल',         en: 'UNESCO World Heritage Sites' },
    { hi: 'भारतीय नदी तंत्र — विस्तृत',       en: 'Indian River Systems — Detailed' },
  ],
  current_affairs: [
    { hi: 'G20 शिखर सम्मेलन',            en: 'G20 Summit' },
    { hi: 'विकसित भारत 2047',            en: 'Viksit Bharat 2047' },
    { hi: 'ऑपरेशन सिंदूर',               en: 'Operation Sindoor' },
    { hi: 'नोबेल पुरस्कार 2024',          en: 'Nobel Prize 2024' },
    { hi: 'भारत के राष्ट्रपति',           en: 'Presidents of India' },
    { hi: 'ओलंपिक 2024',                  en: 'Olympics 2024' },
    { hi: 'भविष्य के अंतरिक्ष मिशन',      en: 'Future Space Missions' },
    { hi: 'एक राष्ट्र, एक चुनाव',          en: 'One Nation, One Election' },
    { hi: 'भारत की जलवायु नीति',           en: 'India\'s Climate Policy' },
    { hi: 'Quad',                          en: 'Quad' },
    { hi: 'BRICS विस्तार',                 en: 'BRICS Expansion' },
    { hi: 'दिल्ली G20 शिखर सम्मेलन',       en: 'Delhi G20 Summit' },
    { hi: 'वंदे भारत',                     en: 'Vande Bharat' },
    { hi: 'IMEC',                         en: 'IMEC' },
    { hi: 'चंद्रयान-3',                     en: 'Chandrayaan-3' },
    { hi: 'DPDP Act 2023',                en: 'DPDP Act 2023' },
    { hi: 'Bharatiya Nyaya Sanhita',      en: 'Bharatiya Nyaya Sanhita' },
    { hi: 'Nari Shakti Vandan Adhiniyam', en: 'Nari Shakti Vandan Adhiniyam' },
    { hi: 'PM Surya Ghar Yojana',         en: 'PM Surya Ghar Yojana' },
    { hi: 'अनुच्छेद 370 निरसन',             en: 'Article 370 Abrogation' },
    { hi: 'India-EFTA TEPA',              en: 'India-EFTA TEPA' },
    { hi: 'Cheetah Reintroduction',       en: 'Cheetah Reintroduction' },
    { hi: 'अंतर्राष्ट्रीय मिलेट्स वर्ष',      en: 'International Year of Millets' },
    { hi: 'Ayushman Bharat',              en: 'Ayushman Bharat' },
    { hi: 'India\'s G20 Presidency',       en: 'India\'s G20 Presidency' },
    { hi: 'Critical Minerals Mission',    en: 'Critical Minerals Mission' },
    { hi: 'Tele-MANAS',                   en: 'Tele-MANAS' },
    { hi: 'PM Vishwakarma Yojana',        en: 'PM Vishwakarma Yojana' },
    { hi: 'Operation Ganga',              en: 'Operation Ganga' },
    { hi: 'Quad Critical Tech',           en: 'Quad Critical Tech' },
    { hi: 'NEP 2020',                     en: 'NEP 2020' },
  ],
}

function SubjectList() {
  const { t } = useLanguage()
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {t('सभी उपलब्ध टेस्ट', 'All Available Tests')}
      </h1>
      <p className="text-gray-500 mb-4">
        {t('हर विषय में 30+ प्रश्न (70%+ कथन-प्रकार) — 10 मिनट का समय', 'Each subject has 30+ questions (70%+ statement-type) — 10 minutes')}
      </p>

      <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            📅 {t('दिनांक से टेस्ट', 'Test by date')}
          </h2>
          <span className="text-[10px] text-gray-400">
            {t('पुरानी तिथि दबाएँ — आर्काइव अभ्यास', 'Tap a past date — Archive practice')}
          </span>
        </div>
        <DateStrip variant="tests" />
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((sub) => (
          <Link
            key={sub.key}
            href={`/tests?subject=${sub.key}`}
            className={`flex items-center gap-4 p-5 bg-white rounded-xl border-2 ${sub.color} hover:shadow-lg transition-all group`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${sub.iconColor}`}>
              <sub.icon size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg">{t(sub.hi, sub.en)}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>10 {t('प्रश्न', 'Questions')}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> 10 {t('मिनट', 'mins')}</span>
              </div>
            </div>
            <span className="text-brand-500 font-semibold text-sm flex items-center gap-1 shrink-0">
              {t('शुरू करें', 'Start')} <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function QuizView() {
  const { t, lang } = useLanguage()
  const searchParams = useSearchParams()
  const subjectKey = searchParams.get('subject') || ''
  const dateParam = searchParams.get('date')   // YYYY-MM-DD when launched from Archive
  const subjectMeta = subjects.find(s => s.key === subjectKey)

  // Build (question, topic) pairs once and either keep all (live) or take a date-seeded subset.
  const { questions, topicTable, isArchive, archiveLabel } = (() => {
    const allQs = questionBank[subjectKey] || []
    const allTopics = TOPICS[subjectKey] || []
    const pairs = allQs.map((q, i) => ({
      q,
      topic: allTopics[i] || { hi: subjectMeta?.hi || subjectKey, en: subjectMeta?.en || subjectKey },
    }))
    // Validate date param shape — only YYYY-MM-DD
    const dateOk = !!dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) && !isNaN(new Date(dateParam).getTime())
    if (!dateOk) {
      return { questions: pairs.map(p => p.q), topicTable: pairs.map(p => p.topic), isArchive: false, archiveLabel: '' }
    }
    const seed = dateSeed(`${subjectKey}-${dateParam}`)
    const subset = shuffleSeeded(pairs, seed).slice(0, ARCHIVE_QUESTIONS_PER_TEST)
    const d = new Date(dateParam!)
    const label = d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    return { questions: subset.map(p => p.q), topicTable: subset.map(p => p.topic), isArchive: true, archiveLabel: label }
  })()

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION)
  const [showExplanation, setShowExplanation] = useState(false)
  const [gaps, setGaps] = useState<ReturnType<typeof analyzeGaps>>([])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    // Persist this attempt and compute gap analysis across ALL attempts (local only)
    const wrongIndices: number[] = []
    const wrongTopicsHi: string[] = []
    const wrongTopicsEn: string[] = []
    selected.forEach((ans, i) => {
      if (ans !== questions[i].correct) {
        wrongIndices.push(i)
        const topic = topicTable[i] || { hi: subjectMeta?.hi || subjectKey, en: subjectMeta?.en || subjectKey }
        wrongTopicsHi.push(topic.hi)
        wrongTopicsEn.push(topic.en)
      }
    })
    const score = selected.filter((ans, i) => ans === questions[i].correct).length
    recordAttempt({
      subject: subjectKey as AttemptTag,
      score,
      total: questions.length,
      wrongIndices,
      wrongTopicsHi,
      wrongTopicsEn,
      atISO: new Date().toISOString(),
    })
    setGaps(analyzeGaps())
  }, [selected, questions, topicTable, subjectKey, subjectMeta])

  // Timer
  useEffect(() => {
    if (submitted) return
    if (timeLeft <= 0) { handleSubmit(); return }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, submitted, handleSubmit])

  // If subject not found, go back to list
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
        {/* Score Card */}
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
          {isArchive && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              <Clock size={11} /> {t('आर्काइव अभ्यास', 'Archive Practice')} · {archiveLabel}
            </p>
          )}
        </div>

        {/* Daily quiz CTA */}
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

        {/* AI-style Gap Analysis — aggregated across all attempts in localStorage */}
        {gaps.length > 0 && (
          <div className="mb-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {t('व्यक्तिगत Gap Analysis', 'Personalised Gap Analysis')}
                </h3>
                <p className="text-xs text-indigo-600">
                  {t('आपके सभी प्रयासों के आधार पर', 'Based on all your attempts so far')}
                </p>
              </div>
            </div>
            <ul className="flex flex-col gap-2">
              {gaps.map((g, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg bg-white border border-indigo-100 px-3 py-2.5">
                  <Target size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{t(g.topicHi, g.topicEn)}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{t(g.suggestionHi, g.suggestionEn)}</p>
                  </div>
                  <Link
                    href={`/articles?search=${encodeURIComponent(g.topicEn)}`}
                    className="shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline self-center"
                  >
                    {t('पढ़ें →', 'Study →')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Answer Review */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('विस्तृत समीक्षा', 'Detailed Review')}</h3>
        <div className="flex flex-col gap-4 mb-8">
          {questions.map((qs, i) => {
            const userAns = selected[i]
            const isCorrect = userAns === qs.correct
            return (
              <div key={i} className={`rounded-xl border p-4 ${isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
                <div className="flex items-start gap-2 mb-3">
                  {isCorrect ? <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0" /> : <XCircle size={18} className="text-rose-500 mt-0.5 shrink-0" />}
                  <p className="font-medium text-gray-900 text-sm whitespace-pre-line">{i + 1}. {t(qs.hi, qs.en)}</p>
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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { setCurrent(0); setSelected(Array(questions.length).fill(null)); setSubmitted(false); setTimeLeft(QUIZ_DURATION); setShowExplanation(false) }}
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
      {/* Archive-mode banner — only shown when launched from a calendar with ?date= */}
      {isArchive && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 text-white shrink-0">
              <Clock size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider font-bold text-amber-700">
                {t('आर्काइव अभ्यास', 'Archive Practice')}
              </p>
              <p className="text-sm font-semibold text-amber-900 truncate">{archiveLabel}</p>
            </div>
          </div>
          <Link
            href="/archive"
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline shrink-0"
          >
            {t('कैलेंडर', 'Calendar')} →
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href={isArchive ? '/archive' : '/tests'} className="p-2 text-gray-400 hover:text-brand-500 rounded-lg hover:bg-brand-50 transition-colors">
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

      {/* Progress Bar */}
      <div className="flex gap-1 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i === current ? 'bg-brand-500' : selected[i] !== null ? 'bg-brand-200' : 'bg-gray-100'}`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-7 h-7 bg-brand-500 text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">{current + 1}</span>
          <span className="text-xs text-gray-400">{t('प्रश्न', 'Question')} {current + 1}/{questions.length}</span>
        </div>
        <p className="text-gray-900 font-semibold text-lg leading-relaxed mb-6 whitespace-pre-line">{t(q.hi, q.en)}</p>

        {/* Options */}
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
                  setShowExplanation(false)
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

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => { setCurrent(c => c - 1); setShowExplanation(false) }}
          disabled={current === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={16} /> {t('पिछला', 'Previous')}
        </button>

        {/* Question dots */}
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setShowExplanation(false) }}
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
            onClick={() => { setCurrent(c => c + 1); setShowExplanation(false) }}
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

      {/* Answered count */}
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
