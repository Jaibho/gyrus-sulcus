import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'
import SocialBar from '@/components/SocialBar'

export const metadata: Metadata = {
  title: 'Gyrus Sulcus | UPSC/IAS/RAS Preparation - Daily MCQs & Articles',
  description: 'UPSC, IAS, RAS और State PCS की तैयारी के लिए रोज़ 100+ MCQs, लेख, हस्तलिखित नोट्स। हिंदी और English दोनों में। Daily MCQs, articles, handwritten notes for UPSC, IAS, RAS, LDC preparation.',
  keywords: ['UPSC', 'IAS', 'RAS', 'MCQ', 'Gyrus Sulcus', 'LDC', 'competitive exam', 'Hindi preparation'],
  authors: [{ name: 'Dharmendra Sir - Gyrus Sulcus' }],
  openGraph: {
    title: 'Gyrus Sulcus | UPSC/IAS/RAS Preparation',
    description: 'रोज़ 100+ MCQs, लेख, और नोट्स — UPSC, IAS, RAS, LDC की तैयारी के लिए',
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
    title: 'Gyrus Sulcus | UPSC/IAS/RAS Preparation',
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
        {/* Fixed logo — bottom-left */}
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

        {/* Fixed social bar — right side, vertically centered */}
        <SocialBar />

        {/* Global watermark — fixed, full-page, pointer-events none, z-index below logo/social */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9997,
            pointerEvents: 'none',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='180'%3E%3Ctext transform='rotate(-30 150 90)' x='10' y='100' font-family='Arial' font-size='22' font-weight='700' fill='%231e40af' opacity='0.045' letter-spacing='4'%3EGYRUS SULCUS%3C/text%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
          }}
        />

        {/* noscript fallback */}
        <noscript>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#1e3a8a', color: 'white', padding: '12px', textAlign: 'center', zIndex: 99999, fontSize: '14px' }}>
            This site requires JavaScript to function properly. Please enable JavaScript in your browser.
          </div>
        </noscript>
      </body>
    </html>
  )
}
