'use client'
import { useState } from 'react'

const SUBJECTS = [
  { key: 'science_tech', label: 'Science & Tech' },
  { key: 'polity', label: 'Polity' },
  { key: 'economy', label: 'Economy' },
  { key: 'geography', label: 'Geography' },
  { key: 'current_affairs', label: 'Current Affairs' },
]

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const emptyMcq = () => ({
  date: todayStr(), subject: 'current_affairs',
  question_hi: '', question_en: '',
  option_a_hi: '', option_a_en: '', option_b_hi: '', option_b_en: '',
  option_c_hi: '', option_c_en: '', option_d_hi: '', option_d_en: '',
  correct_answer: 'a', explanation_hi: '', explanation_en: '',
})
const emptyArticle = () => ({
  title: '', title_en: '', slug: '', category: 'समसामयिकी',
  excerpt: '', excerpt_en: '', content: '', content_en: '',
  created_at: new Date().toISOString(), is_published: true,
})

// Filled-in examples so the format is copy-paste obvious.
const SAMPLE_MCQS = [
  {
    date: '2026-08-16', subject: 'polity',
    question_hi: 'निम्नलिखित कथनों पर विचार कीजिए:\n1. राष्ट्रपति संघीय कार्यपालिका का भाग है।\n2. उपराष्ट्रपति राज्यसभा का पदेन सभापति होता है।\n3. राज्यसभा को भंग किया जा सकता है।\nउपर्युक्त में से कौन-से कथन सही हैं?',
    question_en: 'Consider the following statements:\n1. The President is part of the Union Executive.\n2. The Vice-President is the ex-officio Chairman of the Rajya Sabha.\n3. The Rajya Sabha can be dissolved.\nWhich of the statements given above are correct?',
    option_a_hi: '1 और 2 केवल', option_a_en: '1 and 2 only',
    option_b_hi: '2 और 3 केवल', option_b_en: '2 and 3 only',
    option_c_hi: '1 और 3 केवल', option_c_en: '1 and 3 only',
    option_d_hi: '1, 2 और 3', option_d_en: '1, 2 and 3',
    correct_answer: 'a',
    explanation_hi: 'राज्यसभा एक स्थायी सदन है और इसे भंग नहीं किया जा सकता — अतः कथन 3 गलत है।',
    explanation_en: 'The Rajya Sabha is a permanent House and cannot be dissolved — so statement 3 is wrong.',
  },
  {
    date: '2026-08-16', subject: 'geography',
    question_hi: 'भारत की सबसे लंबी नदी कौन-सी है?',
    question_en: 'Which is the longest river in India?',
    option_a_hi: 'गोदावरी', option_a_en: 'Godavari',
    option_b_hi: 'गंगा', option_b_en: 'Ganga',
    option_c_hi: 'यमुना', option_c_en: 'Yamuna',
    option_d_hi: 'नर्मदा', option_d_en: 'Narmada',
    correct_answer: 'b',
    explanation_hi: 'गंगा (लगभग 2,525 किमी) भारत की सबसे लंबी नदी है।',
    explanation_en: 'The Ganga (about 2,525 km) is the longest river in India.',
  },
]
const SAMPLE_ARTICLES = [
  {
    title: 'नमूना लेख शीर्षक', title_en: 'Sample Article Title',
    slug: 'sample-article-slug', category: 'समसामयिकी',
    excerpt: 'यह एक नमूना सारांश है (1–2 पंक्ति)।', excerpt_en: 'This is a sample excerpt (1–2 lines).',
    content: '## नमूना लेख शीर्षक\n\n### चर्चा में क्यों?\nयहाँ लिखें कि यह क्यों चर्चा में है।\n\n### मुख्य तथ्य\n- पहला तथ्य\n- दूसरा तथ्य',
    content_en: '## Sample Article Title\n\n### Why in News?\nWrite here why this is in the news.\n\n### Key Facts\n- First fact\n- Second fact',
    created_at: '2026-08-16T09:00:00.000Z', is_published: true,
  },
]

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'mcq' | 'article' | 'bulk'>('mcq')
  const [status, setStatus] = useState<{ ok?: boolean; msg: string } | null>(null)
  const [busy, setBusy] = useState(false)

  // one-by-one MCQ
  const [mcq, setMcq] = useState(emptyMcq())
  const [mcqList, setMcqList] = useState<ReturnType<typeof emptyMcq>[]>([])
  // one-by-one article
  const [article, setArticle] = useState(emptyArticle())
  // bulk
  const [bulkType, setBulkType] = useState<'mcqs' | 'articles'>('mcqs')
  const [bulkText, setBulkText] = useState('')

  async function publish(type: 'mcqs' | 'articles', items: unknown[]) {
    if (!items.length) { setStatus({ ok: false, msg: 'Nothing to publish.' }); return }
    setBusy(true); setStatus(null)
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, type, items }),
      })
      const data = await res.json()
      if (data.ok) setStatus({ ok: true, msg: `✅ Published ${data.inserted} ${type}. They are now live on the site.` })
      else setStatus({ ok: false, msg: '❌ ' + (data.error || 'Failed') })
      return data.ok
    } catch (e) {
      setStatus({ ok: false, msg: '❌ ' + String(e) })
    } finally { setBusy(false) }
  }

  function download(name: string, data: unknown) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = name; a.click()
    URL.revokeObjectURL(url)
  }

  const field = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm'
  const label = 'block text-xs font-medium text-gray-500 mb-1'

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Content Admin</h1>
      <p className="text-gray-500 text-sm mb-6">Add MCQs & articles yourself. Published items go live immediately.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">
        <label className="block text-xs font-semibold text-amber-800 mb-1">Admin password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Enter admin password" className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      <div className="flex gap-2 mb-6">
        {([['mcq', 'Add MCQs'], ['article', 'Add Article'], ['bulk', 'Bulk Upload']] as const).map(([k, lbl]) => (
          <button key={k} onClick={() => { setMode(k); setStatus(null) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === k ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{lbl}</button>
        ))}
      </div>

      {status && (
        <div className={`rounded-lg px-3 py-2 mb-4 text-sm ${status.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>{status.msg}</div>
      )}

      {/* ---------- ADD MCQs (one by one) ---------- */}
      {mode === 'mcq' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={label}>Date</label><input type="date" value={mcq.date} onChange={e => setMcq({ ...mcq, date: e.target.value })} className={field} /></div>
            <div><label className={label}>Subject</label>
              <select value={mcq.subject} onChange={e => setMcq({ ...mcq, subject: e.target.value })} className={field}>
                {SUBJECTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div><label className={label}>Question (Hindi) — put statements on new lines</label><textarea rows={3} value={mcq.question_hi} onChange={e => setMcq({ ...mcq, question_hi: e.target.value })} className={field} /></div>
          <div><label className={label}>Question (English)</label><textarea rows={3} value={mcq.question_en} onChange={e => setMcq({ ...mcq, question_en: e.target.value })} className={field} /></div>
          {(['a', 'b', 'c', 'd'] as const).map(o => (
            <div key={o} className="grid grid-cols-2 gap-3">
              <div><label className={label}>Option {o.toUpperCase()} (Hindi)</label><input value={(mcq as any)[`option_${o}_hi`]} onChange={e => setMcq({ ...mcq, [`option_${o}_hi`]: e.target.value })} className={field} /></div>
              <div><label className={label}>Option {o.toUpperCase()} (English)</label><input value={(mcq as any)[`option_${o}_en`]} onChange={e => setMcq({ ...mcq, [`option_${o}_en`]: e.target.value })} className={field} /></div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div><label className={label}>Correct answer</label>
              <select value={mcq.correct_answer} onChange={e => setMcq({ ...mcq, correct_answer: e.target.value })} className={field}>
                {['a', 'b', 'c', 'd'].map(x => <option key={x} value={x}>{x.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          <div><label className={label}>Explanation (Hindi)</label><textarea rows={2} value={mcq.explanation_hi} onChange={e => setMcq({ ...mcq, explanation_hi: e.target.value })} className={field} /></div>
          <div><label className={label}>Explanation (English)</label><textarea rows={2} value={mcq.explanation_en} onChange={e => setMcq({ ...mcq, explanation_en: e.target.value })} className={field} /></div>
          <div className="flex gap-2">
            <button onClick={() => { setMcqList([...mcqList, mcq]); setMcq(emptyMcq()) }} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm">Add to list ({mcqList.length})</button>
            <button disabled={busy} onClick={() => publish('mcqs', [...mcqList, ...(mcq.question_en || mcq.question_hi ? [mcq] : [])]).then(ok => { if (ok) { setMcqList([]); setMcq(emptyMcq()) } })} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm disabled:opacity-50">{busy ? 'Publishing…' : 'Publish all'}</button>
          </div>
        </div>
      )}

      {/* ---------- ADD ARTICLE (one by one) ---------- */}
      {mode === 'article' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={label}>Title (Hindi)</label><input value={article.title} onChange={e => setArticle({ ...article, title: e.target.value })} className={field} /></div>
            <div><label className={label}>Title (English)</label><input value={article.title_en} onChange={e => setArticle({ ...article, title_en: e.target.value })} className={field} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={label}>Slug (unique, url)</label><input value={article.slug} onChange={e => setArticle({ ...article, slug: e.target.value })} placeholder="my-article-slug" className={field} /></div>
            <div><label className={label}>Category</label><input value={article.category} onChange={e => setArticle({ ...article, category: e.target.value })} className={field} /></div>
          </div>
          <div><label className={label}>Excerpt (Hindi)</label><input value={article.excerpt} onChange={e => setArticle({ ...article, excerpt: e.target.value })} className={field} /></div>
          <div><label className={label}>Excerpt (English)</label><input value={article.excerpt_en} onChange={e => setArticle({ ...article, excerpt_en: e.target.value })} className={field} /></div>
          <div><label className={label}>Content (Hindi Markdown — ## heading, - bullets)</label><textarea rows={8} value={article.content} onChange={e => setArticle({ ...article, content: e.target.value })} className={field} /></div>
          <div><label className={label}>Content (English Markdown)</label><textarea rows={8} value={article.content_en} onChange={e => setArticle({ ...article, content_en: e.target.value })} className={field} /></div>
          <button disabled={busy} onClick={() => publish('articles', [article]).then(ok => { if (ok) setArticle(emptyArticle()) })} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm disabled:opacity-50">{busy ? 'Publishing…' : 'Publish article'}</button>
        </div>
      )}

      {/* ---------- BULK UPLOAD ---------- */}
      {mode === 'bulk' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <select value={bulkType} onChange={e => setBulkType(e.target.value as any)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="mcqs">MCQs</option>
              <option value="articles">Articles</option>
            </select>
            <button onClick={() => download(`sample-${bulkType}.json`, bulkType === 'mcqs' ? SAMPLE_MCQS : SAMPLE_ARTICLES)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">⬇ Download sample format</button>
            <label className="px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer">
              📤 Upload file
              <input type="file" accept=".json" className="hidden" onChange={async e => {
                const f = e.target.files?.[0]; if (!f) return
                setBulkText(await f.text())
              }} />
            </label>
          </div>
          <p className="text-xs text-gray-500">Upload or paste a JSON array. You can edit it below before publishing.</p>
          <textarea rows={16} value={bulkText} onChange={e => setBulkText(e.target.value)} placeholder='[ { ... }, { ... } ]' className={`${field} font-mono text-xs`} />
          <button disabled={busy} onClick={() => {
            let items: unknown[]
            try { items = JSON.parse(bulkText); if (!Array.isArray(items)) throw new Error('Must be a JSON array') }
            catch (err) { setStatus({ ok: false, msg: '❌ Invalid JSON: ' + String(err) }); return }
            publish(bulkType, items)
          }} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm disabled:opacity-50">{busy ? 'Publishing…' : `Publish ${bulkType}`}</button>
        </div>
      )}
    </div>
  )
}
