import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import type { Article } from '@/lib/supabase'
import {
  Youtube, Send, Instagram, Mail, Phone, ArrowRight, GraduationCap,
  Award, Users, BookOpen, ShieldCheck, FileText,
} from 'lucide-react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gyrussulcus.com'

export const metadata: Metadata = {
  title: 'Dharmendra Sir — Founder & Editor-in-Chief | Gyrus Sulcus',
  description:
    'Dharmendra Sir — B.Pharmacy graduate, founder of Gyrus Sulcus, with 13L+ YouTube subscribers teaching UPSC, IAS and RAS aspirants for over a decade.',
  alternates: { canonical: `${SITE_URL}/authors/dharmendra-sir` },
  openGraph: {
    type: 'profile',
    title: 'Dharmendra Sir — Founder, Gyrus Sulcus',
    description: 'Founder & Editor-in-Chief of Gyrus Sulcus. B.Pharmacy graduate. 13L+ YouTube subscribers.',
    url: `${SITE_URL}/authors/dharmendra-sir`,
    images: [{ url: `${SITE_URL}/profile.jpg`, width: 400, height: 400, alt: 'Dharmendra Sir' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dharmendra Sir — Founder, Gyrus Sulcus',
    description: 'Founder & Editor-in-Chief. B.Pharmacy. 13L+ YouTube subscribers teaching UPSC.',
    images: [`${SITE_URL}/profile.jpg`],
  },
}

async function loadArticles(): Promise<Article[]> {
  try {
    const file = await fs.readFile(path.join(process.cwd(), 'public', 'data', 'articles.json'), 'utf-8')
    const all: Article[] = JSON.parse(file)
    return all.filter(a => a.is_published)
  } catch {
    return []
  }
}

export default async function AuthorPage() {
  const articles = await loadArticles()
  const recent = [...articles]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6)

  // Person schema for E-E-A-T
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Dharmendra Sir',
    alternateName: 'Dharmendra (Gyrus Sulcus)',
    description:
      'Founder & Editor-in-Chief at Gyrus Sulcus. B.Pharmacy graduate, educator with 13 lakh+ YouTube subscribers teaching UPSC, IAS, RAS and State PCS aspirants for over a decade.',
    image: `${SITE_URL}/profile.jpg`,
    url: `${SITE_URL}/authors/dharmendra-sir`,
    jobTitle: 'Founder & Editor-in-Chief',
    worksFor: {
      '@type': 'EducationalOrganization',
      name: 'Gyrus Sulcus',
      url: SITE_URL,
    },
    sameAs: [
      'https://www.youtube.com/@gyrussulcus1908',
      'https://www.instagram.com/dharmendrasir12/',
      'https://t.me/gyrussulcus7597647088',
    ],
    knowsAbout: [
      'UPSC Civil Services Examination',
      'Indian Polity',
      'Indian Economy',
      'Indian Geography',
      'Current Affairs',
      'Critical Thinking',
      'Mental Health (educational)',
      'Sexual Health (educational)',
    ],
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Image
            src="/profile.jpg"
            alt="Dharmendra Sir — Founder, Gyrus Sulcus"
            width={180}
            height={180}
            className="w-44 h-44 rounded-2xl object-cover shadow-lg"
            priority
          />
          <div className="flex-1">
            <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">Author</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Dharmendra Sir</h1>
            <p className="text-brand-600 font-semibold text-sm mb-3">
              Founder & Editor-in-Chief — Gyrus Sulcus
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                <GraduationCap size={12} /> B. Pharmacy
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Users size={12} /> 13L+ subscribers
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                <Award size={12} /> 10+ years teaching
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                <ShieldCheck size={12} /> 2-pass review
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Dharmendra Sir is a B. Pharmacy graduate and the founder of Gyrus Sulcus. He has been
              teaching UPSC, IAS, RAS and State PCS aspirants for over a decade. His YouTube channel
              with 13 lakh+ subscribers is among the most trusted Hindi-medium educational channels in
              India. He is known for two distinctive teaching styles: Critical Thinking — explaining the
              logical structure behind every question — and the &ldquo;I know that I don&rsquo;t know&rdquo;
              philosophy that places curiosity at the centre of learning.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              <a href="https://www.youtube.com/@gyrussulcus1908" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-semibold">
                <Youtube size={16} /> YouTube
              </a>
              <a href="https://t.me/gyrussulcus7597647088" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-semibold">
                <Send size={16} /> Telegram
              </a>
              <a href="https://www.instagram.com/dharmendrasir12/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 text-sm font-semibold">
                <Instagram size={16} /> Instagram
              </a>
              <a href="mailto:editor@gyrussulcus.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-semibold">
                <Mail size={16} /> editor@gyrussulcus.com
              </a>
              <a href="https://wa.me/917597647088" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-semibold">
                <Phone size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Areas of expertise */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Areas of Expertise</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            'UPSC Polity & Governance',
            'Indian Economy & RBI',
            'Geography & Environment',
            'Science & Technology',
            'Current Affairs',
            'Mental Health (educational)',
            'Sexual & Reproductive Health',
            'Critical Thinking',
          ].map((s) => (
            <div key={s} className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 text-gray-700 font-medium">
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* Editorial standards */}
      <section className="mb-10 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={18} className="text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900">Editorial Standards</h2>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Every article on Gyrus Sulcus is researched against primary government sources — PIB, RBI,
          ISRO, NACO, NIMHANS, MoHFW — and passes a two-pass review (one for accuracy, one for current
          relevance). Outdated or time-bound questions are retired or rewritten within seven days of
          detection.{' '}
          <Link href="/editorial-policy" className="text-indigo-600 hover:underline font-semibold inline-flex items-center gap-1">
            Read the full Editorial Policy <ArrowRight size={12} />
          </Link>
        </p>
      </section>

      {/* Recent articles */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-brand-500" /> Recent Articles
          </h2>
          <Link href="/articles" className="text-sm font-semibold text-brand-600 hover:underline inline-flex items-center gap-1">
            All articles <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recent.map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.slug}`}
              className="group rounded-xl border border-gray-100 bg-white p-4 hover:border-brand-200 hover:shadow-md transition-all"
            >
              <span className="inline-block text-[10px] uppercase tracking-wider text-brand-600 font-bold mb-1.5">
                {a.category}
              </span>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-brand-600 leading-snug mb-1">
                {a.title_en || a.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">{a.excerpt_en || a.excerpt}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-brand-600">
                Read <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <BookOpen size={22} className="text-brand-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-gray-900">Take today&rsquo;s daily quiz</h3>
            <p className="text-sm text-gray-600">10 minutes — 30+ questions per subject — 2-pass reviewed.</p>
          </div>
        </div>
        <Link
          href="/tests"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 text-sm shrink-0"
        >
          Start <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
