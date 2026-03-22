'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'hi' | 'en'

interface LanguageContextType {
  lang: Language
  toggleLang: () => void
  t: (hi: string, en: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('hi')

  const toggleLang = () => setLang(prev => (prev === 'hi' ? 'en' : 'hi'))
  const t = (hi: string, en: string) => (lang === 'hi' ? hi : en)

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
