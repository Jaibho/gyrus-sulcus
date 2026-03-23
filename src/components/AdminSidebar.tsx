'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Upload, BookOpen, FileText, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, hi: 'डैशबोर्ड', en: 'Dashboard' },
  { href: '/admin/mcq-upload', icon: Upload, hi: 'MCQ अपलोड', en: 'Upload MCQs' },
  { href: '/admin/articles', icon: BookOpen, hi: 'लेख', en: 'Articles' },
  { href: '/admin/notes', icon: FileText, hi: 'नोट्स', en: 'Notes' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function logout() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_auth')
    }
    router.push('/admin')
  }

  return (
    <aside className="w-56 shrink-0 bg-gray-900 text-white min-h-screen flex flex-col p-4">
      <div className="mb-8 pt-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Admin</p>
        <p className="font-bold text-white text-base leading-tight">Gyrus Sulcus</p>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ' +
                (active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white')
              }
            >
              <Icon size={17} />
              <div>
                <p>{item.hi}</p>
                <p className="text-xs opacity-50">{item.en}</p>
              </div>
            </Link>
          )
        })}
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
      >
        <LogOut size={17} />
        <span>लॉगआउट / Logout</span>
      </button>
    </aside>
  )
}
