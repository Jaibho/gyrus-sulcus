'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import SmartSearch from '@/components/SmartSearch'
import { getStreak } from '@/lib/progress'
import {
  Home, ClipboardList, BookOpen, GraduationCap, FileText,
  Search, User, Menu, X, Library, ShoppingCart, Flame, HeartPulse
} from 'lucide-react'

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setStreak(getStreak().count)
  }, [])

  // Global Cmd/Ctrl+K opens search from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navItems = [
    {
      href: '/', label: t('होम', 'Home'), icon: Home,
      iconCls: 'text-blue-500',
      baseCls: 'text-blue-700 hover:bg-blue-50 hover:text-blue-700',
      mobileCls: 'text-blue-700 hover:bg-blue-50',
    },
    {
      href: '/tests', label: t('टेस्ट', 'Tests'), icon: ClipboardList,
      iconCls: 'text-emerald-500',
      baseCls: 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700',
      mobileCls: 'text-emerald-700 hover:bg-emerald-50',
    },
    {
      href: '/articles', label: t('लेख', 'Articles'), icon: BookOpen,
      iconCls: 'text-purple-500',
      baseCls: 'text-purple-700 hover:bg-purple-50 hover:text-purple-700',
      mobileCls: 'text-purple-700 hover:bg-purple-50',
    },
    {
      href: '/courses', label: t('कोर्स', 'Courses'), icon: GraduationCap,
      iconCls: 'text-teal-500',
      baseCls: 'text-teal-700 hover:bg-teal-50 hover:text-teal-700',
      mobileCls: 'text-teal-700 hover:bg-teal-50',
    },
    {
      href: '/notes', label: t('नोट्स', 'Notes'), icon: FileText,
      iconCls: 'text-amber-500',
      baseCls: 'text-amber-700 hover:bg-amber-50 hover:text-amber-700',
      mobileCls: 'text-amber-700 hover:bg-amber-50',
    },
    {
      href: '/resources', label: t('संसाधन', 'Resources'), icon: Library,
      iconCls: 'text-indigo-500',
      baseCls: 'text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700',
      mobileCls: 'text-indigo-700 hover:bg-indigo-50',
    },
    {
      href: '/wellness', label: t('Wellness', 'Wellness'), icon: HeartPulse,
      iconCls: 'text-rose-500',
      baseCls: 'text-rose-700 hover:bg-rose-50 hover:text-rose-700',
      mobileCls: 'text-rose-700 hover:bg-rose-50',
    },
    {
      href: '/store', label: t('स्टोर', 'Store'), icon: ShoppingCart,
      iconCls: 'text-amber-500',
      baseCls: 'text-amber-700 hover:bg-amber-50 hover:text-amber-700 ring-1 ring-amber-300 bg-amber-50',
      mobileCls: 'text-amber-700 hover:bg-amber-50 bg-amber-50',
      special: true,
    },
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
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${item.baseCls}`}
              >
                <item.icon size={15} className={item.iconCls} />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Search + Streak + Lang + Login */}
          <div className="flex items-center gap-2">
            {/* Smart search trigger — unified across articles, tests, resources */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors"
              aria-label="Search"
            >
              <Search size={15} />
              <span>{t('सब कुछ खोजें...', 'Search everything...')}</span>
              <kbd className="ml-2 text-[10px] font-mono bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-400">⌘K</kbd>
            </button>

            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 text-gray-500 hover:text-brand-500 hover:bg-brand-50 rounded-lg"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Streak badge — only shown when user has a streak */}
            {streak > 0 && (
              <Link
                href="/leaderboard"
                className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold hover:opacity-90 transition-opacity"
                title={t('लीडरबोर्ड पर जाएं', 'Go to leaderboard')}
              >
                <Flame size={12} /> {streak}
              </Link>
            )}

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
            {/* Streak pill in mobile menu */}
            {streak > 0 && (
              <Link
                href="/leaderboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between gap-2 my-3 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white"
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  <Flame size={14} /> {t(`${streak}-दिन की स्ट्रीक`, `${streak}-day streak`)}
                </span>
                <span className="text-xs font-semibold">{t('लीडरबोर्ड', 'Leaderboard')} →</span>
              </Link>
            )}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 font-semibold rounded-lg transition-colors ${item.mobileCls}`}
              >
                <item.icon size={18} className={item.iconCls} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Smart search modal, portal-style */}
      <SmartSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  )
}
