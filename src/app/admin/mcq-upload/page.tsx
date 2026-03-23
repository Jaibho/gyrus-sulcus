'use client'
import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Plus, FileText, Upload } from 'lucide-react'

const SUBJECTS = [
  { value: 'science_tech', label: 'विज्ञान एवं प्रौद्योगिकी / Science & Technology' },
  { value: 'polity', label: 'भारतीय राजव्यवस्था / Indian Polity' },
  { value: 'economy', label: 'अर्थव्यवस्था / Economy' },
  { value: 'geography', label: 'भूगोल / Geography' },
  { value: 'current_affairs', label: 'समसामयिकी / Current Affairs' },
]

interface OptionPair {
  hi: string
  en: string
}

interface MCQForm {
  subject: string
  questionHi: string
  questionEn: string
  options: OptionPair[]
  correct: number
  explanationHi: string
  explanationEn: string
}

function emptyForm(): MCQForm {
  return {
    subject: 'science_tech',
    questionHi: '',
    questionEn: '',
    options: [
      { hi: '', en: '' },
      { hi: '', en: '' },
      { hi: '', en: '' },
      { hi: '', en: '' },
    ],
    correct: 0,
    explanationHi: '',
    explanationEn: '',
  }
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  return lines.slice(1).map((line) => {
    const values = line.match(/(".*?"|[^,]+|(?<=,)(?=,))/g) || line.split(',')
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = (values[i] || '').replace(/^"|"$/g, '').trim()
    })
    return obj
  })
}

export default function MCQUploadPage() {
  const [form, setForm] = useState<MCQForm>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([])

  function setField(key: keyof Omit<MCQForm, 'options'>, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function setOption(idx: number, field: 'hi' | 'en', value: string) {
    setForm((f) => {
      const opts = f.options.map((o, i) =>
        i === idx ? { ...o, [field]: value } : o
      )
      return { ...f, options: opts }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const mcq = { id: Date.now(), ...form }
      const res = await fetch('/api/admin/save-mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mcq),
      })
      if (res.ok) {
        setMsg('MCQ सफलतापूर्वक सहेजा गया! / MCQ saved successfully!')
        setForm(emptyForm())
      } else {
        setMsg('सहेजने में त्रुटि / Error saving')
      }
    } catch {
      setMsg('नेटवर्क त्रुटि / Network error')
    }
    setSaving(false)
  }

  function handleCSVFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setCsvRows(parseCSV(text))
    }
    reader.readAsText(file)
  }

  async function uploadCSV() {
    if (!csvRows.length) return
    setSaving(true)
    setMsg('')
    try {
      const mcqs = csvRows.map((row, i) => ({
        id: Date.now() + i,
        subject: row.subject || 'science_tech',
        questionHi: row.questionHi || row.question_hi || '',
        questionEn: row.questionEn || row.question_en || '',
        options: [
          { hi: row.option1Hi || row.option1_hi || '', en: row.option1En || row.option1_en || '' },
          { hi: row.option2Hi || row.option2_hi || '', en: row.option2En || row.option2_en || '' },
          { hi: row.option3Hi || row.option3_hi || '', en: row.option3En || row.option3_en || '' },
          { hi: row.option4Hi || row.option4_hi || '', en: row.option4En || row.option4_en || '' },
        ],
        correct: parseInt(row.correct || '0'),
        explanationHi: row.explanationHi || row.explanation_hi || '',
        explanationEn: row.explanationEn || row.explanation_en || '',
      }))
      const res = await fetch('/api/admin/save-mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mcqs),
      })
      if (res.ok) {
        setMsg(`${csvRows.length} MCQs सहेजे गए! / ${csvRows.length} MCQs saved!`)
        setCsvRows([])
      } else {
        setMsg('CSV अपलोड त्रुटि / CSV upload error')
      }
    } catch {
      setMsg('नेटवर्क त्रुटि / Network error')
    }
    setSaving(false)
  }

  const isError = msg.includes('त्रुटि') || msg.includes('Error')

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">MCQ अपलोड / Upload MCQs</h1>

      {msg && (
        <div
          className={
            'mb-5 px-4 py-3 rounded-xl text-sm font-medium border ' +
            (isError
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200')
          }
        >
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single MCQ Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">
            <Plus size={18} /> एक MCQ जोड़ें / Add Single MCQ
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">विषय / Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setField('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">प्रश्न (हिन्दी) *</label>
                <textarea
                  value={form.questionHi}
                  onChange={(e) => setField('questionHi', e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Question (English)</label>
                <textarea
                  value={form.questionEn}
                  onChange={(e) => setField('questionEn', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {form.options.map((opt, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  value={opt.hi}
                  onChange={(e) => setOption(idx, 'hi', e.target.value)}
                  placeholder={`विकल्प ${idx + 1} (हिन्दी) *`}
                  required
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  value={opt.en}
                  onChange={(e) => setOption(idx, 'en', e.target.value)}
                  placeholder={`Option ${idx + 1} (English)`}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                सही उत्तर / Correct Answer
              </label>
              <select
                value={form.correct}
                onChange={(e) => setField('correct', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>A — विकल्प 1</option>
                <option value={1}>B — विकल्प 2</option>
                <option value={2}>C — विकल्प 3</option>
                <option value={3}>D — विकल्प 4</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">व्याख्या (हिन्दी)</label>
                <textarea
                  value={form.explanationHi}
                  onChange={(e) => setField('explanationHi', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Explanation (English)</label>
                <textarea
                  value={form.explanationEn}
                  onChange={(e) => setField('explanationEn', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'सहेज रहे हैं...' : 'MCQ जोड़ें / Add MCQ'}
            </button>
          </form>
        </div>

        {/* CSV Bulk Upload */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">
            <FileText size={18} /> CSV बल्क अपलोड / Bulk Upload
          </h2>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center mb-4">
            <Upload size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 mb-3">CSV फ़ाइल चुनें / Choose CSV file</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVFile}
              className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium file:cursor-pointer hover:file:bg-blue-700"
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">CSV कॉलम / Columns:</p>
            <p className="text-xs text-gray-500 font-mono leading-relaxed">
              subject, questionHi, questionEn,<br />
              option1Hi, option1En, option2Hi, option2En,<br />
              option3Hi, option3En, option4Hi, option4En,<br />
              correct (0-3), explanationHi, explanationEn
            </p>
          </div>

          {csvRows.length > 0 && (
            <>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-3 text-sm text-emerald-700">
                {csvRows.length} MCQs पार्स किए / {csvRows.length} MCQs ready
              </div>
              <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-xl mb-4">
                {csvRows.slice(0, 5).map((row, i) => (
                  <div key={i} className="px-3 py-2 border-b border-gray-50 text-xs text-gray-600 last:border-0">
                    <span className="font-semibold text-gray-400 mr-2">{i + 1}.</span>
                    {row.questionHi || row.question_hi || '—'}
                  </div>
                ))}
                {csvRows.length > 5 && (
                  <div className="px-3 py-2 text-xs text-gray-400">
                    + {csvRows.length - 5} और MCQs / more MCQs
                  </div>
                )}
              </div>
              <button
                onClick={uploadCSV}
                disabled={saving}
                className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {saving
                  ? 'अपलोड हो रहा है...'
                  : `सभी ${csvRows.length} MCQs अपलोड करें / Upload All`}
              </button>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
