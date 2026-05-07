import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'
import SocialBar from '@/components/SocialBar'
import Analytics from '@/components/Analytics'
import Chatbot from '@/components/Chatbot'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gyrussulcus.com'

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Gyrus Sulcus',
    alternateName: 'Gyrus Sulcus by Dharmendra Sir',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.jpg`,
    image: `${SITE_URL}/banner.jpg`,
    description:
      "India's daily companion for UPSC, IAS, RAS and State PCS preparation. 100+ MCQs, articles, and handwritten notes in Hindi and English.",
    founder: { '@type': 'Person', name: 'Dharmendra Sir' },
    sameAs: [
      'https://www.youtube.com/@gyrussulcus1908',
      'https://www.instagram.com/dharmendrasir12/',
      'https://t.me/gyrussulcus7597647088',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-7597647088',
      contactType: 'customer service',
      availableLanguage: ['Hindi', 'English'],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gyrus Sulcus',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/articles?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'UPSC / IAS / RAS Daily MCQ Preparation',
    description:
      'Daily 5-question quizzes across Science & Technology, Polity, Economy, Geography, and Current Affairs — bilingual (Hindi + English), aligned with the UPSC syllabus.',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Gyrus Sulcus',
      sameAs: SITE_URL,
    },
    inLanguage: ['hi', 'en'],
    educationalLevel: 'Undergraduate / Competitive Exam',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'PT10M',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  },
]

export const metadata: Metadata = {
  title: 'Gyrus Sulcus | UPSC/IAS/RAS Preparation - Daily MCQs & Articles',
  description: 'UPSC, IAS, RAS और State PCS की तैयारी के लिए रोज़ 100+ MCQs, लेख, हस्तलिखित नोट्स। हिंदी और English दोनों में। Daily MCQs, articles, handwritten notes for UPSC, IAS, RAS, LDC preparation.',
  keywords: ['UPSC', 'IAS', 'RAS', 'MCQ', 'Gyrus Sulcus', 'LDC', 'competitive exam', 'Hindi preparation'],
  authors: [{ name: 'Dharmendra Sir - Gyrus Sulcus' }],
  openGraph: {
    title: 'Gyrus Sulcus | UPSC/IAS/RAS Preparation',
    description: 'रोज़ 100+ MCQs, लेख, और नोट्स — UPSC, IAS, RAS, LDC की तैयारी के लिए',
    url: SITE_URL,
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
  metadataBase: new URL(SITE_URL),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" translate="no" className="notranslate">
      <head>
        <meta name="google" content="notranslate" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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

        {/* Global watermark — fixed behind all content so it never overlays banner/images */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='180'%3E%3Ctext transform='rotate(-30 150 90)' x='10' y='100' font-family='Arial' font-size='22' font-weight='700' fill='%231e40af' opacity='0.04' letter-spacing='4'%3EGYRUS SULCUS%3C/text%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Analytics: GA4 + Microsoft Clarity (loaded only if env vars present) */}
        <Analytics />
        {/* Tawk.to live-chat widget (loaded only if env vars present) */}
        <Chatbot />

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
