import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Article } from '@/lib/supabase'
import ArticleContent from './ArticleContent'
import { createClient } from '@supabase/supabase-js'
import { promises as fs } from 'fs'
import path from 'path'

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
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'articles.json')
    const raw = await fs.readFile(filePath, 'utf-8')
    const articles: Article[] = JSON.parse(raw)
    return articles.find(a => a.slug === slug && a.is_published) ?? null
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'articles.json')
    const raw = await fs.readFile(filePath, 'utf-8')
    const articles: Article[] = JSON.parse(raw)
    return articles.filter(a => a.is_published).map(a => ({ slug: a.slug }))
  } catch {
    return []
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()
  return <ArticleContent article={article} />
}
