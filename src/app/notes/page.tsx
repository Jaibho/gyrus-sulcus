'use client'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase, Note } from '@/lib/supabase'
import { FileText, Download, Loader2, HardDrive, Calendar } from 'lucide-react'

// Fallback demo data if Supabase table doesn't exist yet
const demoNotes: Note[] = [
  { id: '1', title: 'Indian Polity Highlights', subject: 'POLITY', file_url: '#', file_size: '2.4 MB', created_at: '2024-10-25' },
  { id: '2', title: 'Modern History Compilation', subject: 'HISTORY', file_url: '#', file_size: '5.1 MB', created_at: '2024-10-20' },
  { id: '3', title: 'Economy Budget Survey 2024', subject: 'ECONOMY', file_url: '#', file_size: '3.8 MB', created_at: '2024-10-15' },
  { id: '4', title: 'Geography Maps Guide', subject: 'GEOGRAPHY', file_url: '#', file_size: '8.2 MB', created_at: '2024-10-10' },
  { id: '5', title: 'Science & Tech Current Affairs', subject: 'SCIENCE', file_url: '#', file_size: '4.5 MB', created_at: '2024-10-05' },
  { id: '6', title: 'Nuclear Physics Series (A-M)', subject: 'SCIENCE', file_url: '#', file_size: '6.7 MB', created_at: '2024-09-28' },
]

const subjectColors: Record<string, string> = {
  POLITY: 'bg-amber-50 text-amber-700',
  HISTORY: 'bg-purple-50 text-purple-700',
  ECONOMY: 'bg-emerald-50 text-emerald-700',
  GEOGRAPHY: 'bg-blue-50 text-blue-700',
  SCIENCE: 'bg-rose-50 text-rose-700',
}

export default function NotesPage() {
  const { t } = useLanguage()
  const [notes, setNotes] = useState<Note[]>(demoNotes)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotes() {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        setNotes(data)
      }
      // If error or empty, keep demo data
      setLoading(false)
    }
    fetchNotes()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        {t('PDF नोट्स एवं सामग्री', 'PDF Notes & Materials')}
      </h1>
      <p className="text-gray-500 mb-8">
        {t('उच्च गुणवत्ता के हस्तलिखित नोट्स और संकलन डाउनलोड करें।', 'Download high quality handwritten notes and compilations.')}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-brand-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                  <FileText size={22} className="text-red-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 leading-snug">{note.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${subjectColors[note.subject] || 'bg-gray-100 text-gray-600'}`}>
                      {note.subject}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <HardDrive size={10} /> {note.file_size}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={11} />
                  {new Date(note.created_at).toLocaleDateString('hi-IN')}
                </span>
                <a
                  href={note.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-brand-500 font-semibold text-sm hover:underline"
                >
                  <Download size={15} /> {t('डाउनलोड', 'Download')}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
