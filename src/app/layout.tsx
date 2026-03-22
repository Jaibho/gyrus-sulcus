import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: 'Gyrus Sulcus | UPSC NEET Preparation - Daily MCQs & Articles',
  description: 'UPSC, NEET और State PCS की तैयारी के लिए रोज़ 100+ MCQs, लेख, हस्तलिखित नोट्स। हिंदी और English दोनों में। Daily MCQs, articles, handwritten notes for UPSC, NEET, RAS, LDC preparation.',
  keywords: ['UPSC', 'NEET', 'MCQ', 'Gyrus Sulcus', 'RAS', 'LDC', 'competitive exam', 'Hindi preparation'],
  authors: [{ name: 'Dharmendra Sir - Gyrus Sulcus' }],
  openGraph: {
    title: 'Gyrus Sulcus | UPSC NEET Preparation',
    description: 'रोज़ 100+ MCQs, लेख, और नोट्स — UPSC, NEET, RAS, LDC की तैयारी के लिए',
    url: 'https://gyrus-sulcus.vercel.app',
    siteName: 'Gyrus Sulcus',
    images: [
      {
        url: '/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Gyrus Sulcus - I know that I don\'t know',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gyrus Sulcus | UPSC NEET Preparation',
    description: 'रोज़ 100+ MCQs, लेख, और नोट्स',
    images: ['/banner.jpg'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gyrus-sulcus.vercel.app'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body>
        <ClientLayout>{children}</ClientLayout>
        <a
          href="/"
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '16px',
            zIndex: 9999,
            display: 'block',
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.20)',
          }}
          aria-label="Gyrus Sulcus Home"
        >
          <img src="/logo.jpg" alt="Gyrus Sulcus" width={56} height={56} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </a>
      </body>
    </html>
  )
}
