'use client'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { Upload, BookOpen, FileText, BarChart3 } from 'lucide-react'

const stats = [
  { label: 'कुल MCQs', en: 'Total MCQs', value: '150+', icon: BarChart3, color: 'bg-blue-50 text-blue-600' },
  { label: 'कुल लेख', en: 'Total Articles', value: '45+', icon: BookOpen, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'कुल नोट्स', en: 'Total Notes', value: '12+', icon: FileText, color: 'bg-purple-50 text-purple-600' },
]

const quickLinks = [
  { href: '/admin/mcq-upload', label: 'MCQ अपलोड करें', en: 'Upload MCQs', icon: Upload, color: 'bg-blue-600 hover:bg-blue-700' },
  { href: '/admin/articles', label: 'लेख लिखें', en: 'Write Article', icon: BookOpen, color: 'bg-emerald-600 hover:bg-emerald-700' },
  { href: '/admin/notes', label: 'नोट्स अपलोड', en: 'Upload Notes', icon: FileText, color: 'bg-purple-600 hover:bg-purple-700' },
]

export default function DashboardPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">डैशबोर्ड / Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-xs text-gray-400">{s.en}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <h2 className="text-base font-bold text-gray-700 mb-3">
        त्वरित क्रियाएं / Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map((l) => {
          const Icon = l.icon
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-5 py-4 text-white font-semibold rounded-2xl transition-colors ${l.color}`}
            >
              <Icon size={20} />
              <div>
                <p>{l.label}</p>
                <p className="text-xs opacity-75">{l.en}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </AdminLayout>
  )
}
