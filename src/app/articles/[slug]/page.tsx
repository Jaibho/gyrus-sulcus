import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Article } from '@/lib/supabase'
import ArticleContent from './ArticleContent'
import { createClient } from '@supabase/supabase-js'
import { promises as fs } from 'fs'
import path from 'path'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gyrussulcus.com'

async function getAllArticles(): Promise<Article[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'articles.json')
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function getArticle(slug: string): Promise<Article | null> {
  // Try Supabase first
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseKey && !supabaseKey.includes('your_')) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()
      if (!error && data) return data
    }
  } catch {
    // fall through
  }

  // Fallback: read from JSON file
  const articles = await getAllArticles()
  return articles.find(a => a.slug === slug && a.is_published) ?? null
}

function pickRelated(all: Article[], current: Article, limit = 3): Article[] {
  // Same category first; if not enough, fill with most recent.
  const sameCategory = all
    .filter(a => a.is_published && a.slug !== current.slug && a.category === current.category)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const fillers = all
    .filter(a => a.is_published && a.slug !== current.slug && a.category !== current.category)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return [...sameCategory, ...fillers].slice(0, limit)
}

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.filter(a => a.is_published).map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) {
    return { title: 'Article Not Found | Gyrus Sulcus' }
  }

  const titleEn = article.title_en || article.title
  const excerptEn = article.excerpt_en || article.excerpt || ''
  const url = `${SITE_URL}/articles/${article.slug}`
  const ogImage = article.image_url || `${SITE_URL}/banner.jpg`

  return {
    title: `${titleEn} | Gyrus Sulcus`,
    description: excerptEn,
    keywords: ['UPSC', 'IAS', 'RAS', article.category, 'Gyrus Sulcus'],
    authors: [{ name: 'Dharmendra Sir', url: `${SITE_URL}/authors/dharmendra-sir` }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: titleEn,
      description: excerptEn,
      siteName: 'Gyrus Sulcus',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at || article.created_at,
      authors: ['Dharmendra Sir'],
      tags: [article.category, 'UPSC', 'IAS', 'RAS'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: titleEn }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleEn,
      description: excerptEn,
      images: [ogImage],
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const allArticles = await getAllArticles()
  const related = pickRelated(allArticles, article)

  // Article schema for E-E-A-T (Experience-Expertise-Authoritativeness-Trustworthiness)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title_en || article.title,
    description: article.excerpt_en || article.excerpt,
    image: article.image_url ? [article.image_url] : [`${SITE_URL}/banner.jpg`],
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Person',
      name: 'Dharmendra Sir',
      url: `${SITE_URL}/authors/dharmendra-sir`,
      sameAs: [
        'https://www.youtube.com/@gyrussulcus1908',
        'https://www.instagram.com/dharmendrasir12/',
        'https://t.me/gyrussulcus7597647088',
      ],
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'Gyrus Sulcus',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.jpg` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/articles/${article.slug}`,
    },
    articleSection: article.category,
    inLanguage: ['hi', 'en'],
    isAccessibleForFree: true,
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE_URL}/articles` },
      { '@type': 'ListItem', position: 3, name: article.title_en || article.title, item: `${SITE_URL}/articles/${article.slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, breadcrumbSchema]) }}
      />
      <ArticleContent article={article} related={related} />
    </>
  )
}
