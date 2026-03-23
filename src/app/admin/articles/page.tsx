'use client'
import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Plus, Trash2, Edit2 } from 'lucide-react'

const SUBJECTS = [
  { value: 'विज्ञान', label: 'विज्ञान / Science' },
  { value: 'राजव्यवस्था', label: 'राजव्यवस्था / Polity' },
  { value: 'अर्थव्यवस्था', label: 'अर्थव्यवस्था / Economy' },
  { value: 'भूगोल', label: 'भूगोल / Geography' },
  { value: 'समसामयिकी', label: 'समसामयिकी / Current Affairs' },
]

interface LocalArticle {
  id: number
  title: string
  category: string
  content: string
  createdAt: string
}

export default function AdminArticlesPage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('विज्ञान')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [articles, setArticles] = useState<LocalArticle[]>([])
  const [editId, setEditId] = useState<number | null>(null)

  const loadArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/get-articles')
      if (res.ok) {
        const data = await res.json()
        setArticles(data)
      }
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const article: LocalArticle = {
        id: editId ?? Date.now(),
        title,
        category,
        content,
        createdAt: new Date().toISOString(),
      }
      const res = await fetch('/api/admin/save-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article, replace: editId !== null }),
      })
      if (res.ok) {
        setMsg(editId ? 'लेख अपडेट किया! / Article updated!' : 'लेख प्रकाशित! / Article published!')
        setTitle('')
        setCategory('विज्ञान')
        setContent('')
        setEditId(null)
        loadArticles()
      } else {
        setMsg('त्रुटि / Error saving article')
      }
    } catch {
      setMsg('नेटवर्क त्रुटि / Network error')
    }
    setSaving(false)
  }

  async function deleteArticle(id: number) {
    if (!confirm('क्या आप इसे हटाना चाहते हैं? / Delete this article?')) return
    try {
      await fetch('/api/admin/save-article', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      loadArticles()
    } catch {
      // silently fail
    }
  }

  function startEdit(a: LocalArticle) {
    setEditId(a.id)
    setTitle(a.title)
    setCategory(a.category)
    setContent(a.content)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditId(null)
    setTitle('')
    setCategory('विज्ञान')
    setContent('')
    setMsg('')
  }

  const isError = msg.includes('त्रुटि') || msg.includes('Error')

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {editId ? 'लेख संपादित करें / Edit Article' : 'लेख लिखें / Write Article'}
      </h1>

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

      {/* Editor */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <form onSubmit={handlePublish} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">शीर्षक / Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="लेख का शीर्षक..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">विषय / Subject</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              सामग्री / Content * <span className="text-xs text-gray-400">(markdown supported)</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={14}
              placeholder="लेख की सामग्री यहाँ लिखें..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Plus size={18} />
              {saving ? 'सहेज रहे हैं...' : editId ? 'अपडेट करें / Update' : 'प्रकाशित करें / Publish'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                रद्द करें / Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Articles List */}
      <h2 className="text-base font-bold text-gray-800 mb-4">
        प्रकाशित लेख / Published Articles ({articles.length})
      </h2>
      {articles.length === 0 ? (
        <p className="text-gray-400 text-sm">कोई लेख नहीं / No articles yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {articles.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{a.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {a.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleDateString('hi-IN')}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => startEdit(a)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => deleteArticle(a.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
