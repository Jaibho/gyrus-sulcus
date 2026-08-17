import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import ArticleContent, { Article } from './ArticleContent'

export const dynamicParams = true // allow slugs not pre-rendered (e.g. Supabase) to render on demand

async function getJsonArticles(): Promise<Article[]> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'public', 'data', 'articles.json'), 'utf-8')
    return JSON.parse(raw) as Article[]
  } catch {
    return []
  }
}

async function getArticle(slug: string): Promise<Article | null> {
  // 1) JSON file (covers all file-based articles, including today's)
  const arts = await getJsonArticles()
  const fromJson = arts.find((a) => a.slug === slug && a.is_published !== false)
  if (fromJson) return fromJson

  // 2) Supabase fallback (for any DB-only article), if configured.
  // Guarded with an abort/timeout so a slow or unhealthy database can never
  // hang the request into a function timeout (which surfaces as a 500).
  // A missing article must fall through to a clean 404, not a server error.
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key && !key.includes('your_') && !url.includes('placeholder')) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(url, key)
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 3000)
      try {
        const { data, error } = await supabase
          .from('articles').select('*').eq('slug', slug).eq('is_published', true)
          .abortSignal(controller.signal).single()
        if (!error && data) return data as Article
      } finally {
        clearTimeout(timer)
      }
    }
  } catch {
    // DB slow/unhealthy/not-found -> treat as no article (clean 404).
  }
  return null
}

export async function generateStaticParams() {
  const arts = await getJsonArticles()
  return arts.filter((a) => a.is_published !== false).map((a) => ({ slug: a.slug }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)
  // Treat a missing OR content-less article (e.g. a stale/incomplete row left in
  // the DB after removal) as a clean 404 — never let it fall through and crash
  // the renderer into a 500.
  if (!article || (!article.content && !article.content_en)) notFound()
  return <ArticleContent article={article} />
}
