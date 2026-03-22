'use client'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RasAnnouncementBar from '@/components/RasAnnouncementBar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Navbar />
      <RasAnnouncementBar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </LanguageProvider>
  )
}
