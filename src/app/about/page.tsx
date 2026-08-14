'use client'
import { useLanguage } from '@/lib/LanguageContext'

// About page — the founder's own words, restored verbatim from the original site.
export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('हमारे बारे में', 'About Us')}
      </h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-5 text-gray-700 leading-relaxed">
        <p className="text-xl font-bold text-gray-900">
          {t('मैं धर्मेंद्र हूँ।', 'I am Dharmendra.')}
        </p>
        <p>
          {t(
            'लगभग दो दशकों से पढ़ा रहा हूँ — और सच कहूँ तो, जितना पढ़ाया, उससे कहीं अधिक सीखा है। उन हज़ारों विद्यार्थियों का हृदय से आभारी हूँ जिन्होंने मुझे “धर्मेंद्र सर” बना दिया। यह नाम मेरा नहीं, उन्हीं का दिया हुआ उपहार है — और इसी नाम पर यह वेबसाइट टिकी है।',
            'I have been teaching for nearly two decades — and to be honest, I have learnt far more than I have taught. I am heartfelt grateful to the thousands of students who made me “Dharmendra Sir”. This name is not mine; it is their gift — and it is on this name that this website rests.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-2">{t('शुरुआत', 'The Beginning')}</h2>
        <p>
          {t(
            'सिलसिला कॉलेज के दिनों में आरम्भ हुआ, जब मैंने अपने जूनियर्स को फ़ार्माकोलॉजी पढ़ाना शुरू किया। उस दिन पहली बार महसूस हुआ कि किसी विषय को समझाते समय ही मैं उसे सबसे गहराई से समझ पाता हूँ। पढ़ाना और पढ़ना — ये दो चीज़ें मेरे लिए डोपामाइन हैं।',
            'It began in my college days, when I started teaching pharmacology to my juniors. That day I realised for the first time that I understand a subject most deeply only while explaining it. Teaching and reading — these two things are dopamine for me.'
          )}
        </p>
        <p>
          {t(
            'पिछले डेढ़ दशक से अधिक समय से सिविल सेवा और अन्य प्रतियोगी परीक्षाओं की तैयारी कर रहे विद्यार्थियों के साथ चल रहा हूँ। मैं स्वयं को सौभाग्यशाली मानता हूँ कि मैंने जल्दी ही जान लिया कि मुझे सच में क्या ख़ुशी देता है — इन प्रतियोगी रूप से मुझसे युवा मित्रों का साथ, जिन्हें दुनिया विद्यार्थी कहती है। किताबों से अधिक मैं उनके जीवन से सीखता हूँ — जिन अनुभवों को हम विनम्रता से ‘समस्याएँ’ कहते हैं, और जिन्हें अपने ही कर्मों के ‘परिणाम’ कहते हैं।',
            'For more than a decade and a half I have walked alongside students preparing for the civil services and other competitive examinations. I count myself fortunate that I learnt early what truly gives me joy — the company of these young friends whom the world calls students. More than from books, I learn from their lives — from the experiences we humbly call “problems”, and which we call the “consequences” of our own actions.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-2">{t('कक्षा के बाहर का मैं', 'Me, Outside the Classroom')}</h2>
        <p>
          {t(
            'मैं एक मिनिमलिस्ट हूँ — जितना कम सामान, उतनी अधिक जगह सोचने के लिए। जंगल मुझे अपनी ओर खींचते हैं — नेमोफ़िलिया का गंभीर मामला हूँ। जूडो और दूरस्थ वनों में अकेले शिविर लगाना मेरे पहले प्रेम हैं; उसके बाद घुड़सवारी और बच्चों के साथ खेलना। नौवीं-दसवीं कक्षा से लिख रहा हूँ — कविताएँ और किताबें — पहली पुस्तक प्रकाशन के बहुत निकट है। एक सीधा-सादा बुकवर्म हूँ।',
            'I am a minimalist — the fewer the belongings, the more the room to think. Forests pull me towards them — I am a serious case of nemophilia. Judo and camping alone in remote forests are my first loves; after that, horse-riding and playing with children. I have been writing since class nine or ten — poems and books — and my first book is very close to publication. I am a plain, simple bookworm.'
          )}
        </p>
        <p>
          {t(
            'जब कोई कठिन प्रश्न मन में अटक जाता है, तो मेरी पद्धति बहुत सरल है: एक किताब पढ़ता हूँ, उसे बंद करता हूँ, और अकेला जंगल में निकल जाता हूँ। पेड़ों से प्रश्न पूछता हूँ। उत्तर तुरंत नहीं मिलता — प्रकृति का यही चमत्कार है। कुछ रातों बाद, मस्तिष्क स्वयं नींद में उत्तर दे जाता है।',
            'When a difficult question gets stuck in my mind, my method is very simple: I read a book, close it, and set off alone into the forest. I ask the trees my question. The answer does not come at once — that is the very miracle of nature. A few nights later, the mind delivers the answer on its own, in sleep.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-2">{t('Gyrus Sulcus क्यों?', 'Why Gyrus Sulcus?')}</h2>
        <p>
          {t(
            'मेरी एक बहुत सीधी-सी मान्यता है: हम यहाँ इसलिए हैं कि इस दुनिया को थोड़ा बेहतर बनाकर जाएँ। इस वेबसाइट का हर MCQ, हर लेख उसी दिशा में एक छोटा-सा योगदान है — उन विद्यार्थियों के माध्यम से जो कल अपनी जगह बनाकर अपना योगदान देंगे। यही श्रृंखला है जिसमें मैं विश्वास करता हूँ।',
            'I hold one very simple belief: we are here to leave this world a little better than we found it. Every MCQ and every article on this website is a small contribution in that direction — through the students who will tomorrow find their place and make their own contribution. This is the chain I believe in.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-2">{t('मेरी चार इच्छाएँ', 'My Four Wishes')}</h2>
        <p>
          {t(
            'यदि अलादीन का जिन्न कभी सामने आकर इच्छाएँ पूछे, तो ये रहीं मेरी:',
            'If Aladdin’s genie ever appeared and asked for my wishes, here they are:'
          )}
        </p>
        <p>
          {t(
            'एक — जंगल का शिष्य बनकर एक जीवन। एक पूरा जीवन वन का शिष्य बनकर बिताऊँ — अमेज़न के जंगलों के लोगों के बीच, या अंडमान के जारवा समुदाय के साथ — और यह जान सकूँ कि जब मनुष्य और धरती के बीच कुछ नहीं होता, तब मनुष्य वास्तव में क्या होता है।',
            'One — a life as a student of the forest. To spend a whole life as a disciple of the wild — among the people of the Amazon forests, or with the Jarawa community of the Andamans — and to know what a human truly is when nothing stands between human and earth.'
          )}
        </p>
        <p>
          {t(
            'दो — सबसे महँगे वाक्य से मुक्ति। हर कोई — सबसे पहले मैं स्वयं — उस सबसे महँगे वाक्य से मुक्त हो जाए जो कोई मनुष्य कभी कहता है: “काश मैंने तब निर्णय ले लिया होता।” मैं ऐसा जीवन जीना और सिखाना चाहता हूँ जिसमें कोई गलत दरवाज़े पर खड़ा होकर उस साहस की प्रतीक्षा न करे जो कभी नहीं आया।',
            'Two — freedom from the costliest sentence. That everyone — myself first of all — be freed from the costliest sentence a human ever says: “I wish I had decided then.” I want to live and teach a life in which no one stands at the wrong door, waiting for a courage that never came.'
          )}
        </p>
        <p>
          {t(
            'तीन — दुनिया को थोड़ा कोमल छोड़ जाएँ। इस दुनिया से गुज़रने वाला हर व्यक्ति इसे थोड़ा कोमल बनाकर जाए — एक मीठे शब्द से, एक पढ़ाए हुए पाठ से, एक लगाए हुए पेड़ से, एक बेज़ुबान को खिलाए हुए दाने से, एक ऐसे विद्यार्थी से जो आगे जाकर यही उपकार किसी और को लौटाए।',
            'Three — to leave the world a little gentler. That everyone who passes through this world leaves it a little gentler — with a kind word, a lesson taught, a tree planted, a grain fed to a voiceless creature, a student who goes on to return the same kindness to someone else.'
          )}
        </p>
        <p>
          {t(
            'चार — पशुओं की भाषा सीखूँ। मैं पशुओं की भाषा सीखना चाहता हूँ — बोलने के लिए नहीं, सुनने के लिए — ताकि वे मूक प्राणी जो हमारे जैसा ही दर्द ढोते हैं पर उसे नाम नहीं दे सकते, अंततः सुने जा सकें, और चंगे हो सकें।',
            'Four — to learn the language of animals. I want to learn the language of animals — not to speak, but to listen — so that those mute creatures who carry the same pain as us but cannot name it may finally be heard, and be healed.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-2">{t('अंत में', 'In the End')}</h2>
        <p>
          {t(
            'यदि आप यहाँ तक पहुँचे हैं, तो शायद आप भी उन्हीं विद्यार्थियों में से एक हैं जिनसे मैं हर रोज़ कुछ सीखता हूँ। आपका हार्दिक स्वागत है।',
            'If you have reached this far, then perhaps you too are one of those students from whom I learn something every day. You are warmly welcome.'
          )}
        </p>
        <p className="font-semibold text-gray-900">{t('— धर्मेंद्र', '— Dharmendra')}</p>
      </div>
    </div>
  )
}
