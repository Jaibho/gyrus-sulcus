'use client'
import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { FileText, Upload, Info } from 'lucide-react'

const SUBJECTS = [
  { value: 'science_tech', label: 'विज्ञान एवं प्रौद्योगिकी / Science & Technology' },
  { value: 'polity', label: 'भारतीय राजव्यवस्था / Indian Polity' },
  { value: 'economy', label: 'अर्थव्यवस्था / Economy' },
  { value: 'geography', label: 'भूगोल / Geography' },
  { value: 'current_affairs', label: 'समसामयिकी / Current Affairs' },
]

export default function AdminNotesPage() {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('science_tech')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">नोट्स अपलोड / Upload Notes</h1>

      <div className="flex gap-3 items-start bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <Info size={18} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Supabase Storage की आवश्यकता है</p>
          <p className="text-amber-600 text-xs mt-0.5">
            PDF file upload requires Supabase Storage — will be connected soon.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-xl">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">शीर्षक / Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="नोट्स का शीर्षक..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">विषय / Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SUBJECTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">विवरण / Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="नोट्स का विवरण..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">PDF फ़ाइल / PDF File</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <FileText size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-400 mb-3">PDF फ़ाइल चुनें</p>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 file:font-medium file:cursor-pointer"
              />
              {file && (
                <p className="mt-3 text-xs text-emerald-600 font-medium">{file.name} चुना गया</p>
              )}
            </div>
          </div>
          <button
            disabled
            className="w-full py-2.5 bg-gray-200 text-gray-400 font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Upload size={18} />
            अपलोड करें (जल्द) / Upload (Coming Soon)
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
