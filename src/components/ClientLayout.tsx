'use client'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </LanguageProvider>
  )
}
