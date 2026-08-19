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

  // Supabase fallback DISABLED: the DB `articles` table schema does not match the
  // site (content_hi/title_hi vs content/title) and only holds old, superseded
  // content. Articles now come solely from articles.json, so an unknown slug
  // returns a clean 404. Re-enable once the DB table schema is aligned with the site.
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
