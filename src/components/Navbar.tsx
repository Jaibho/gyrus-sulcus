'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import {
  Home, ClipboardList, BookOpen, GraduationCap, FileText,
  Search, User, Menu, X, Library
} from 'lucide-react'

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navItems = [
    { href: '/', label: t('होम', 'Home'), icon: Home },
    { href: '/tests', label: t('टेस्ट', 'Tests'), icon: ClipboardList },
    { href: '/articles', label: t('लेख', 'Articles'), icon: BookOpen },
    { href: '/courses', label: t('कोर्स', 'Courses'), icon: GraduationCap },
    { href: '/notes', label: t('नोट्स', 'Notes'), icon: FileText },
    { href: '/resources', label: t('संसाधन', 'Resources'), icon: Library },
  ]

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              GS
            </div>
            <span className="text-xl font-bold text-brand-500 hidden sm:block">
              Gyrus Sulcus
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Search + Lang + Login */}
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="relative hidden sm:block">
              {searchOpen ? (
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('लेख खोजें...', 'Search articles...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/articles?search=${encodeURIComponent(searchQuery)}`
                      }
                    }}
                    className="ml-2 bg-transparent outline-none text-sm w-40 placeholder-gray-400"
                    autoFocus
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery('') }}>
                    <X size={14} className="text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-500 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-500 text-white rounded-lg text-xs font-medium hover:bg-brand-600 transition-colors"
            >
              <span className={lang === 'hi' ? 'font-bold' : 'opacity-60'}>हि</span>
              <span className="opacity-40">|</span>
              <span className={lang === 'en' ? 'font-bold' : 'opacity-60'}>En</span>
            </button>

            {/* Login/Register Button */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
            >
              <User size={15} />
              <span className="hidden sm:inline">{t('लॉगिन', 'Login')}</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-brand-500"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2">
            {/* Mobile Search */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-3 mb-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder={t('लेख खोजें...', 'Search articles...')}
                className="ml-2 bg-transparent outline-none text-sm w-full placeholder-gray-400"
              />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-gray-600 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
