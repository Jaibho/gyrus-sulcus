'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase, Article } from '@/lib/supabase'
import { Calendar, ArrowRight, Loader2, BookOpen, CalendarDays, X } from 'lucide-react'
import DailyCalendar, { generateFullAvailability } from '@/components/DailyCalendar'

const categories = [
  { key: 'all', hi: 'सभी', en: 'All' },
  { key: 'विज्ञान', hi: 'विज्ञान', en: 'Science' },
  { key: 'राजव्यवस्था', hi: 'राजव्यवस्था', en: 'Polity' },
  { key: 'अर्थव्यवस्था', hi: 'अर्थव्यवस्था', en: 'Economy' },
  { key: 'भूगोल', hi: 'भूगोल', en: 'Geography' },
  { key: 'समसामयिकी', hi: 'समसामयिकी', en: 'Current Affairs' },
]

const HI_MONTHS = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्तूबर','नवंबर','दिसंबर']
const EN_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function friendlyDate(dateStr: string, lang: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return lang === 'hi'
    ? `${d} ${HI_MONTHS[m - 1]} ${y}`
    : `${d} ${EN_MONTHS[m - 1]} ${y}`
}

export default function ArticlesPage() {
  const { t, lang } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const availableDates = useMemo(() => generateFullAvailability(), [])

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) setArticles(data)
    setLoading(false)
  }

  const filtered = useMemo(() => {
    let list = activeCategory === 'all' ? articles : articles.filter(a => a.category === activeCategory)
    if (selectedDate) {
      list = list.filter(a => {
        const d = new Date(a.created_at)
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        return iso === selectedDate
      })
    }
    return list
  }, [articles, activeCategory, selectedDate])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Sidebar: calendar (desktop always visible, mobile togglable) ── */}
        <div className="lg:w-64 shrink-0">
          {/* Mobile toggle */}
          <button
            onClick={() => setCalendarOpen(o => !o)}
            className="lg:hidden flex items-center gap-2 mb-3 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 w-full"
          >
            <CalendarDays size={16} className="text-brand-500" />
            {selectedDate
              ? `📅 ${friendlyDate(selectedDate, lang)}`
              : t('📅 तारीख से फ़िल्टर करें', '📅 Filter by date')}
            {selectedDate && (
              <span
                onClick={e => { e.stopPropagation(); setSelectedDate(null) }}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </span>
            )}
          </button>

          <div className={`${calendarOpen ? 'block' : 'hidden'} lg:block space-y-3`}>
            <div className="hidden lg:flex items-center gap-2 mb-1">
              <CalendarDays size={16} className="text-brand-500" />
              <span className="text-sm font-bold text-gray-700">{t('तारीख से फ़िल्टर करें', 'Filter by date')}</span>
            </div>

            <DailyCalendar
              mode="article"
              selectedDate={selectedDate ?? new Date().toISOString().slice(0, 10)}
              onSelectDate={(d) => {
                setSelectedDate(prev => prev === d ? null : d)
                setCalendarOpen(false)
              }}
              availableDates={availableDates}
            />

            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="w-full text-xs font-semibold text-gray-500 hover:text-brand-500 flex items-center justify-center gap-1 py-2"
              >
                <X size={12} /> {t('फ़िल्टर हटाएं', 'Clear filter')}
              </button>
            )}
          </div>
        </div>

        {/* ── Main content ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1 gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedDate
                  ? `${friendlyDate(selectedDate, lang)} ${t('के लेख', 'Articles')}`
                  : t('नवीनतम लेख', 'Latest Articles')}
              </h1>
              <p className="text-gray-500 mt-1">
                {t('गहन विश्लेषण और परीक्षा-उन्मुख अध्ययन सामग्री।', 'In-depth analysis and exam-oriented study material.')}
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-5 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t(cat.hi, cat.en)}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-brand-500" />
              <span className="ml-3 text-gray-500">{t('लोड हो रहा है...', 'Loading...')}</span>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <BookOpen size={48} className="mx-auto mb-3 opacity-40" />
              <p>{t('कोई लेख नहीं मिला', 'No articles found')}</p>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="mt-3 text-brand-500 text-sm font-semibold hover:underline"
                >
                  {t('सभी लेख देखें', 'View all articles')}
                </button>
              )}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-brand-100 to-brand-200 overflow-hidden">
                    {article.image_url ? (
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={48} className="text-brand-300" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-brand-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      {article.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{article.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(article.created_at).toLocaleDateString('hi-IN')}
                      </span>
                      <span className="text-brand-500 text-sm font-medium flex items-center gap-1">
                        {t('पढ़ें', 'Read')} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>{/* end flex-1 */}
      </div>{/* end flex row */}
    </div>{/* end page container */}
  )
}
