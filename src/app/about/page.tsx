'use client'
import { useLanguage } from '@/lib/LanguageContext'

// About page — the founder's own words. English kept verbatim; Hindi written as
// natural, living Hindi in the founder's own voice (not a literal translation).
export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('मेरे बारे में', 'About Us')}
      </h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-5 text-gray-700 leading-relaxed">
        <p className="text-xl font-bold text-gray-900">
          {t('मैं धर्मेंद्र हूँ।', 'I am Dharmendra.')}
        </p>
        <p>
          {t(
            'क़रीब दो दशक हो चले पढ़ाते हुए — और सच कहूँ तो, पढ़ाया कम है, सीखा कहीं ज़्यादा है। दिल से शुक्रगुज़ार हूँ उन हज़ारों बच्चों का, जिन्होंने मुझे “धर्मेंद्र सर” बना दिया। यह नाम मेरा कमाया हुआ नहीं, उन्हीं का दिया हुआ तोहफ़ा है — और इसी नाम की छाँव में यह वेबसाइट साँस लेती है।',
            'I have been teaching for nearly two decades — and to be honest, I have learnt far more than I have taught. I am heartfelt grateful to the thousands of students who made me “Dharmendra Sir”. This name is not mine; it is their gift — and it is on this name that this website rests.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-2">{t('शुरुआत', 'The Beginning')}</h2>
        <p>
          {t(
            'यह सिलसिला कॉलेज के दिनों में शुरू हुआ, जब मैंने अपने जूनियर्स को फ़ार्माकोलॉजी पढ़ाना शुरू किया। उसी दिन पहली बार जाना — किसी विषय की तह तक मैं तभी पहुँच पाता हूँ, जब उसे किसी और को समझा रहा होता हूँ। पढ़ना और पढ़ाना — बस यही दो चीज़ें हैं जो मुझे भीतर तक जगा देती हैं; कहिए तो, मेरा डोपामाइन।',
            'It began in my college days, when I started teaching pharmacology to my juniors. That day I realised for the first time that I understand a subject most deeply only while explaining it. Teaching and reading — these two things are dopamine for me.'
          )}
        </p>
        <p>
          {t(
            'पिछले डेढ़ दशक से भी ज़्यादा वक़्त से मैं सिविल सेवा और दूसरी प्रतियोगी परीक्षाओं की तैयारी करते विद्यार्थियों के साथ क़दम-से-क़दम मिलाकर चल रहा हूँ। ख़ुद को ख़ुशनसीब मानता हूँ कि बहुत जल्दी जान गया — असली ख़ुशी मुझे किसमें मिलती है: इन्हीं युवा दोस्तों के साथ में, जिन्हें दुनिया “विद्यार्थी” कहती है। किताबों से कहीं ज़्यादा मैं उनकी ज़िंदगियों से सीखता हूँ — उन्हीं अनुभवों से, जिन्हें हम बड़ी विनम्रता से “समस्याएँ” कह देते हैं, और जो अक्सर हमारे अपने ही किए के “नतीजे” होते हैं।',
            'For more than a decade and a half I have walked alongside students preparing for the civil services and other competitive examinations. I count myself fortunate that I learnt early what truly gives me joy — the company of these young friends whom the world calls students. More than from books, I learn from their lives — from the experiences we humbly call “problems”, and which we call the “consequences” of our own actions.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-2">{t('कक्षा के बाहर का मैं', 'Me, Outside the Classroom')}</h2>
        <p>
          {t(
            'मैं ठहरा मिनिमलिस्ट — जितना कम सामान, सोचने के लिए उतनी ही ज़्यादा जगह। जंगल मुझे अपनी ओर खींच लेते हैं — नेमोफ़िलिया का पक्का मरीज़ हूँ। जूडो, और दूर-दराज़ के जंगलों में अकेले तंबू गाड़ना — ये मेरे पहले इश्क़ हैं; उसके बाद आते हैं घुड़सवारी और बच्चों के साथ खेलना। नौवीं-दसवीं से लिखता आ रहा हूँ — कविताएँ भी, किताबें भी — और पहली किताब अब बस छपने ही वाली है। कुल मिलाकर, एक सीधा-सादा किताबों का कीड़ा हूँ।',
            'I am a minimalist — the fewer the belongings, the more the room to think. Forests pull me towards them — I am a serious case of nemophilia. Judo and camping alone in remote forests are my first loves; after that, horse-riding and playing with children. I have been writing since class nine or ten — poems and books — and my first book is very close to publication. I am a plain, simple bookworm.'
          )}
        </p>
        <p>
          {t(
            'जब कोई मुश्किल सवाल मन में अटक जाता है, तो मेरा तरीक़ा बड़ा सीधा है: एक किताब पढ़ता हूँ, उसे बंद करता हूँ, और अकेला जंगल की ओर निकल पड़ता हूँ। पेड़ों से अपना सवाल पूछता हूँ। जवाब उसी घड़ी नहीं मिलता — और प्रकृति का असली जादू यही है। कुछ रातें बीतती हैं, और फिर नींद में ही मन ख़ुद जवाब थमा जाता है।',
            'When a difficult question gets stuck in my mind, my method is very simple: I read a book, close it, and set off alone into the forest. I ask the trees my question. The answer does not come at once — that is the very miracle of nature. A few nights later, the mind delivers the answer on its own, in sleep.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-2">{t('Gyrus Sulcus क्यों?', 'Why Gyrus Sulcus?')}</h2>
        <p>
          {t(
            'मेरा एक बहुत सादा-सा यक़ीन है: हम यहाँ इसलिए हैं कि इस दुनिया को, जैसा पाया था उससे थोड़ा बेहतर बनाकर जाएँ। इस वेबसाइट का हर MCQ, हर लेख उसी ओर उठा एक नन्हा-सा क़दम है — उन विद्यार्थियों के ज़रिए, जो कल अपनी जगह बनाकर आगे किसी और के काम आएँगे। बस इसी कड़ी में मेरा विश्वास है।',
            'I hold one very simple belief: we are here to leave this world a little better than we found it. Every MCQ and every article on this website is a small contribution in that direction — through the students who will tomorrow find their place and make their own contribution. This is the chain I believe in.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-2">{t('मेरी चार इच्छाएँ', 'My Four Wishes')}</h2>
        <p>
          {t(
            'कभी अलादीन का जिन्न सामने आकर मेरी इच्छाएँ पूछ बैठे, तो ये रहीं मेरी चार:',
            'If Aladdin’s genie ever appeared and asked for my wishes, here they are:'
          )}
        </p>
        <p>
          {t(
            'पहली — एक पूरा जीवन, जंगल का शागिर्द बनकर। कभी अमेज़न के जंगलों के लोगों के बीच, तो कभी अंडमान के जारवा समुदाय के साथ — सारी उम्र वन का शिष्य बनकर बिता दूँ, और यह जान पाऊँ कि जब इंसान और धरती के बीच कुछ भी नहीं बचता, तब इंसान असल में होता क्या है।',
            'One — a life as a student of the forest. To spend a whole life as a disciple of the wild — among the people of the Amazon forests, or with the Jarawa community of the Andamans — and to know what a human truly is when nothing stands between human and earth.'
          )}
        </p>
        <p>
          {t(
            'दूसरी — उस सबसे महँगे वाक्य से आज़ादी। हर कोई — और सबसे पहले मैं ख़ुद — उस सबसे महँगे वाक्य से मुक्त हो जाए, जो इंसान कभी-न-कभी ज़रूर कहता है: “काश, मैंने तब फ़ैसला कर लिया होता।” मैं ऐसी ज़िंदगी जीना और सिखाना चाहता हूँ, जिसमें कोई ग़लत दरवाज़े पर खड़ा उस हिम्मत का इंतज़ार करते-करते न रह जाए — जो कभी आई ही नहीं।',
            'Two — freedom from the costliest sentence. That everyone — myself first of all — be freed from the costliest sentence a human ever says: “I wish I had decided then.” I want to live and teach a life in which no one stands at the wrong door, waiting for a courage that never came.'
          )}
        </p>
        <p>
          {t(
            'तीसरी — दुनिया को थोड़ा कोमल छोड़ जाना। इस दुनिया से गुज़रने वाला हर इंसान इसे ज़रा नरम, ज़रा कोमल बनाकर जाए — एक मीठे बोल से, एक सिखाए हुए सबक़ से, एक लगाए हुए पेड़ से, एक बेज़ुबान को डाले हुए दाने से, या एक ऐसे विद्यार्थी से — जो आगे चलकर यही भलाई किसी और को लौटा दे।',
            'Three — to leave the world a little gentler. That everyone who passes through this world leaves it a little gentler — with a kind word, a lesson taught, a tree planted, a grain fed to a voiceless creature, a student who goes on to return the same kindness to someone else.'
          )}
        </p>
        <p>
          {t(
            'चौथी — जानवरों की ज़बान सीखना। मैं जानवरों की भाषा सीखना चाहता हूँ — बोलने के लिए नहीं, सुनने के लिए — ताकि वे बेज़ुबान प्राणी, जो हमारे ही जैसा दर्द भीतर ढोते हैं पर उसे नाम तक नहीं दे पाते, आख़िरकार सुने जा सकें — और भर सकें, चंगे हो सकें।',
            'Four — to learn the language of animals. I want to learn the language of animals — not to speak, but to listen — so that those mute creatures who carry the same pain as us but cannot name it may finally be heard, and be healed.'
          )}
        </p>

        <h2 className="text-lg font-bold text-gray-900 pt-2">{t('अंत में', 'In the End')}</h2>
        <p>
          {t(
            'अगर पढ़ते-पढ़ते आप यहाँ तक आ पहुँचे हैं, तो शायद आप भी उन्हीं विद्यार्थियों में से एक हैं, जिनसे मैं हर रोज़ कुछ-न-कुछ सीखता हूँ। आपका दिल से स्वागत है।',
            'If you have reached this far, then perhaps you too are one of those students from whom I learn something every day. You are warmly welcome.'
          )}
        </p>
        <p className="font-semibold text-gray-900">{t('— धर्मेंद्र', '— Dharmendra')}</p>
      </div>
    </div>
  )
}
