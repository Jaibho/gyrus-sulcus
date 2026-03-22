'use client'
import { useLanguage } from '@/lib/LanguageContext'
import {
  BookOpen, Download, Youtube, ExternalLink, FileText,
  GraduationCap, Library, PlayCircle, ArrowRight, Star
} from 'lucide-react'

const ncertBooks = [
  { class: 'VI', subjects: [{ name: 'Science', hi: 'विज्ञान', url: 'https://ncert.nic.in/textbook.php?fesc1=0-14' }, { name: 'Social Science', hi: 'सामाजिक विज्ञान', url: 'https://ncert.nic.in/textbook.php?fess1=0-9' }] },
  { class: 'VII', subjects: [{ name: 'Science', hi: 'विज्ञान', url: 'https://ncert.nic.in/textbook.php?gesc1=0-18' }, { name: 'Social Science', hi: 'सामाजिक विज्ञान', url: 'https://ncert.nic.in/textbook.php?gess3=0-9' }] },
  { class: 'VIII', subjects: [{ name: 'Science', hi: 'विज्ञान', url: 'https://ncert.nic.in/textbook.php?hesc1=0-18' }, { name: 'Social Science', hi: 'सामाजिक विज्ञान', url: 'https://ncert.nic.in/textbook.php?hess4=0-10' }] },
  { class: 'IX', subjects: [{ name: 'Science', hi: 'विज्ञान', url: 'https://ncert.nic.in/textbook.php?iesc1=0-15' }, { name: 'Social Science', hi: 'सामाजिक विज्ञान', url: 'https://ncert.nic.in/textbook.php?iess4=0-5' }, { name: 'Economics', hi: 'अर्थशास्त्र', url: 'https://ncert.nic.in/textbook.php?iess3=0-4' }] },
  { class: 'X', subjects: [{ name: 'Science', hi: 'विज्ञान', url: 'https://ncert.nic.in/textbook.php?jesc1=0-16' }, { name: 'Social Science', hi: 'सामाजिक विज्ञान', url: 'https://ncert.nic.in/textbook.php?jess4=0-8' }, { name: 'Economics', hi: 'अर्थशास्त्र', url: 'https://ncert.nic.in/textbook.php?jess3=0-5' }] },
  { class: 'XI', subjects: [{ name: 'Political Science', hi: 'राजनीति विज्ञान', url: 'https://ncert.nic.in/textbook.php?keps1=0-9' }, { name: 'Indian Economic Dev.', hi: 'भारतीय अर्थव्यवस्था', url: 'https://ncert.nic.in/textbook.php?keep1=0-9' }, { name: 'Physical Geography', hi: 'भौतिक भूगोल', url: 'https://ncert.nic.in/textbook.php?kegy1=0-7' }, { name: 'Indian History I', hi: 'इतिहास I', url: 'https://ncert.nic.in/textbook.php?lehs1=0-15' }] },
  { class: 'XII', subjects: [{ name: 'Political Science I', hi: 'राजनीति विज्ञान I', url: 'https://ncert.nic.in/textbook.php?leps1=0-9' }, { name: 'Political Science II', hi: 'राजनीति विज्ञान II', url: 'https://ncert.nic.in/textbook.php?leps2=0-9' }, { name: 'Indian Economy', hi: 'भारतीय अर्थव्यवस्था', url: 'https://ncert.nic.in/textbook.php?leep1=0-9' }, { name: 'Geography I', hi: 'भूगोल I', url: 'https://ncert.nic.in/textbook.php?legy1=0-7' }, { name: 'History III', hi: 'इतिहास III', url: 'https://ncert.nic.in/textbook.php?lehs3=0-15' }] },
]

const pyqPapers = [
  { year: '2025', exam: 'UPSC CSE Prelims 2025', hi: 'यूपीएससी प्रारंभिक परीक्षा 2025', url: 'https://upsc.gov.in/examinations/exam-notices', badge: 'Latest', badgeColor: 'bg-brand-500' },
  { year: '2024', exam: 'UPSC CSE Prelims 2024', hi: 'यूपीएससी प्रारंभिक परीक्षा 2024', url: 'https://upsc.gov.in/sites/default/files/QP-CSP-24-GS-P-I-26052024.pdf', badge: '2024', badgeColor: 'bg-blue-500' },
  { year: '2023', exam: 'UPSC CSE Prelims 2023', hi: 'यूपीएससी प्रारंभिक परीक्षा 2023', url: 'https://upsc.gov.in/sites/default/files/QP-CSP-23-GS-P-I-04062023.pdf', badge: '2023', badgeColor: 'bg-gray-500' },
  { year: '2025', exam: 'UPSC CSE Mains GS-1 2025', hi: 'यूपीएससी मुख्य परीक्षा GS-1 2025', url: 'https://upsc.gov.in/examinations/exam-notices', badge: 'Mains', badgeColor: 'bg-amber-500' },
  { year: '2025', exam: 'UPSC CSE Mains GS-2 2025', hi: 'यूपीएससी मुख्य परीक्षा GS-2 2025', url: 'https://upsc.gov.in/examinations/exam-notices', badge: 'Mains', badgeColor: 'bg-amber-500' },
  { year: '2025', exam: 'UPSC CSE Mains GS-3 2025', hi: 'यूपीएससी मुख्य परीक्षा GS-3 2025', url: 'https://upsc.gov.in/examinations/exam-notices', badge: 'Mains', badgeColor: 'bg-amber-500' },
]

const recommendedBooks = [
  { title: 'Science & Technology by Dharmendra Sir', author: 'Dharmendra Sir', hi: 'विज्ञान एवं प्रौद्योगिकी — धर्मेन्द्र सर', subject: 'Science', color: 'bg-blue-50 text-blue-700', featured: true },
  { title: 'Indian Polity', author: 'M. Laxmikanth', hi: 'भारतीय राजव्यवस्था', subject: 'Polity', color: 'bg-amber-50 text-amber-700', featured: false },
  { title: 'Certificate Physical & Human Geography', author: 'G.C. Leong', hi: 'भौतिक भूगोल', subject: 'Geography', color: 'bg-purple-50 text-purple-700', featured: false },
  { title: 'Indian Economy', author: 'Ramesh Singh', hi: 'भारतीय अर्थव्यवस्था', subject: 'Economy', color: 'bg-emerald-50 text-emerald-700', featured: false },
  { title: 'History of Modern India', author: 'Bipan Chandra', hi: 'आधुनिक भारत का इतिहास', subject: 'History', color: 'bg-rose-50 text-rose-700', featured: false },
  { title: 'India Year Book', author: 'Publications Division', hi: 'भारत वर्ष पुस्तक', subject: 'Current Affairs', color: 'bg-indigo-50 text-indigo-700', featured: false },
  { title: 'Environment & Ecology', author: 'Majid Husain', hi: 'पर्यावरण एवं पारिस्थितिकी', subject: 'Environment', color: 'bg-green-50 text-green-700', featured: false },
  { title: 'Ancient & Medieval India', author: 'Poonam Dalal Dahiya', hi: 'प्राचीन एवं मध्यकालीन भारत', subject: 'History', color: 'bg-rose-50 text-rose-700', featured: false },
]

const featuredVideos = [
  { id: 'jAiba2Di260', titleHi: 'Critical Thinking — सबसे लोकप्रिय', titleEn: 'Critical Thinking — Most Popular', views: '1.4M+ views', badge: 'Most Popular', badgeColor: 'bg-red-500' },
  { id: 'X8qBR8u5178', titleHi: 'MASTER CLASS — Science & Technology', titleEn: 'MASTER CLASS — Science & Technology', views: '100K+ views', badge: 'Master Class', badgeColor: 'bg-purple-500' },
  { id: 'AaVBjzPR9Jk', titleHi: 'Why NATO is Silent on Iran?', titleEn: 'Why NATO is Silent on Iran?', views: '42K+ views', badge: 'Latest', badgeColor: 'bg-brand-500' },
]

const freeResources = [
  { title: 'UPSC Syllabus 2024', hi: 'यूपीएससी पाठ्यक्रम 2024', type: 'PDF', url: 'https://upsc.gov.in/sites/default/files/Syllabus-CSP-2024.pdf', color: 'text-brand-600' },
  { title: 'UPSC Calendar 2025', hi: 'यूपीएससी कैलेंडर 2025', type: 'PDF', url: 'https://upsc.gov.in/sites/default/files/Ann-Cal-2025.pdf', color: 'text-brand-600' },
  { title: 'Economic Survey 2023-24', hi: 'आर्थिक सर्वेक्षण 2023-24', type: 'PDF', url: 'https://www.indiabudget.gov.in/economicsurvey/', color: 'text-emerald-600' },
  { title: 'India Budget 2024-25', hi: 'भारत बजट 2024-25', type: 'Link', url: 'https://www.indiabudget.gov.in/', color: 'text-emerald-600' },
  { title: 'PIB (Press Info Bureau)', hi: 'पत्र सूचना कार्यालय', type: 'Link', url: 'https://pib.gov.in/', color: 'text-indigo-600' },
  { title: 'Yojana Magazine', hi: 'योजना पत्रिका', type: 'Link', url: 'https://yojana.gov.in/', color: 'text-purple-600' },
]

export default function ResourcesPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('अध्ययन संसाधन', 'Study Resources')}
        </h1>
        <p className="text-gray-500 text-lg">
          {t('UPSC तैयारी के लिए सर्वश्रेष्ठ संसाधन — NCERT पुस्तकें, प्रश्नपत्र, अनुशंसित पुस्तकें और YouTube प्लेलिस्ट।', 'Best resources for UPSC preparation — NCERT books, question papers, recommended books and YouTube playlists.')}
        </p>
      </div>

      {/* YouTube Videos */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <Youtube size={22} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('YouTube वीडियो', 'YouTube Videos')}</h2>
              <p className="text-sm text-gray-500">{t('Gyrus Sulcus चैनल के चुनिंदा वीडियो', 'Featured videos from Gyrus Sulcus channel')}</p>
            </div>
          </div>
          <a
            href="https://www.youtube.com/@gyrussulcus1908"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            <Youtube size={16} /> {t('चैनल देखें', 'Visit Channel')}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredVideos.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.titleEn}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle size={22} className="text-white" />
                  </div>
                </div>
                <span className={`absolute top-2 left-2 ${video.badgeColor} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                  {video.badge}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-red-600 transition-colors">{t(video.titleHi, video.titleEn)}</h3>
                <p className="text-xs text-gray-400 mt-1">{video.views}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <a
            href="https://www.youtube.com/@gyrussulcus1908"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            <Youtube size={18} /> {t('पूरा चैनल देखें', 'Visit Full Channel')} <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* NCERT Books */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
            <Library size={22} className="text-brand-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('NCERT पुस्तकें', 'NCERT Books')}</h2>
            <p className="text-sm text-gray-500">{t('कक्षा 6 से 12 तक की सभी UPSC-प्रासंगिक पुस्तकें', 'All UPSC-relevant books from Class 6 to 12')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ncertBooks.map((cls) => (
            <div key={cls.class} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-10 h-10 bg-brand-500 text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                  {cls.class}
                </span>
                <span className="font-semibold text-gray-800">{t(`कक्षा ${cls.class}`, `Class ${cls.class}`)}</span>
              </div>
              <div className="flex flex-col gap-2">
                {cls.subjects.map((sub) => (
                  <a
                    key={sub.name}
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm px-3 py-2 rounded-lg bg-gray-50 hover:bg-brand-50 hover:text-brand-600 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen size={14} className="text-gray-400 group-hover:text-brand-400" />
                      {t(sub.hi, sub.name)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 group-hover:text-brand-500 text-xs font-medium">
                      <Download size={12} /> {t('डाउनलोड', 'Download')}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          {t('सभी पुस्तकें NCERT की आधिकारिक वेबसाइट (ncert.nic.in) से लिंक की गई हैं।', 'All books are linked from the official NCERT website (ncert.nic.in).')}
        </p>
      </section>

      {/* Previous Year Papers */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <FileText size={22} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('पिछले वर्षों के प्रश्नपत्र', 'Previous Year Papers')}</h2>
            <p className="text-sm text-gray-500">{t('UPSC की आधिकारिक वेबसाइट से सीधे लिंक', 'Direct links from UPSC official website')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pyqPapers.map((paper, i) => (
            <a
              key={i}
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-red-400" />
                </div>
                <span className={`${paper.badgeColor} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                  {paper.badge}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm leading-snug">{t(paper.hi, paper.exam)}</p>
                <p className="text-xs text-gray-400 mt-1">UPSC Official PDF</p>
              </div>
              <div className="flex items-center gap-1 text-brand-500 text-xs font-semibold group-hover:underline">
                <Download size={13} /> {t('डाउनलोड करें', 'Download PDF')}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Recommended Books */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <GraduationCap size={22} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('अनुशंसित पुस्तकें', 'Recommended Books')}</h2>
            <p className="text-sm text-gray-500">{t('UPSC टॉपर्स और विशेषज्ञों द्वारा सुझाई गई पुस्तकें', 'Books recommended by UPSC toppers and experts')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedBooks.map((book, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 hover:shadow-md transition-all flex flex-col ${
                book.featured
                  ? 'bg-blue-50 border-2 border-blue-300 ring-2 ring-blue-100'
                  : 'bg-white border border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${book.featured ? 'bg-blue-100' : 'bg-gray-50'}`}>
                  <BookOpen size={20} className={book.featured ? 'text-blue-600' : 'text-gray-400'} />
                </div>
                {book.featured && (
                  <span className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">
                    <Star size={10} fill="white" /> {t('हमारी किताब', 'Our Book')}
                  </span>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit mb-2 ${book.color}`}>
                {book.subject}
              </span>
              <h3 className={`font-bold text-sm leading-snug flex-1 ${book.featured ? 'text-blue-900' : 'text-gray-900'}`}>{t(book.hi, book.title)}</h3>
              <p className={`text-xs mt-2 ${book.featured ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{book.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Free Online Resources */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <ExternalLink size={22} className="text-indigo-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('मुफ़्त ऑनलाइन संसाधन', 'Free Online Resources')}</h2>
            <p className="text-sm text-gray-500">{t('सरकारी वेबसाइट और आधिकारिक स्रोत', 'Government websites and official sources')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {freeResources.map((res, i) => (
            <a
              key={i}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
                  {res.type === 'PDF' ? <FileText size={18} className={res.color} /> : <ExternalLink size={18} className={res.color} />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t(res.hi, res.title)}</p>
                  <span className="text-xs text-gray-400">{res.type}</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
            </a>
          ))}
        </div>
      </section>

      {/* Telegram CTA */}
      <section>
        <div className="bg-gradient-to-r from-brand-500 to-brand-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">{t('और संसाधन चाहिए?', 'Need More Resources?')}</h3>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            {t('Telegram चैनल से जुड़ें और रोज़ नए नोट्स, MCQ और करंट अफेयर्स अपडेट पाएं।', 'Join our Telegram channel and get daily new notes, MCQs and current affairs updates.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://t.me/gyrussulcus7597647088"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-md"
            >
              {t('Telegram से जुड़ें', 'Join Telegram')} <ArrowRight size={16} />
            </a>
            <a
              href="/notes"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              {t('नोट्स डाउनलोड करें', 'Download Notes')}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
