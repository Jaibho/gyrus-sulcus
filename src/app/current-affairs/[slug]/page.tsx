import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import CAArticleView, { CAArticle } from './CAArticle'

export const dynamicParams = true

async function getAll(): Promise<CAArticle[]> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'public', 'data', 'articles.json'), 'utf-8')
    const all = JSON.parse(raw) as CAArticle[]
    return all
      .filter((a) => a.is_published !== false)
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  const all = await getAll()
  return all.map((a) => ({ slug: a.slug }))
}

export default async function CurrentAffairsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const all = await getAll()
  const i = all.findIndex((a) => a.slug === slug)
  const article = i >= 0 ? all[i] : null

  if (!article || (!article.content && !article.content_en)) notFound()

  // all[] is newest-first, so the *newer* story sits at a lower index.
  const newer = i > 0 ? all[i - 1] : null
  const older = i < all.length - 1 ? all[i + 1] : null

  const trim = (a: CAArticle | null) =>
    a ? { slug: a.slug, title: a.title, title_en: a.title_en } : null

  const related = all
    .filter((a) => a.slug !== article!.slug && a.category === article!.category)
    .slice(0, 3)

  return (
    <CAArticleView
      article={article!}
      prev={trim(older)}
      next={trim(newer)}
      related={related}
    />
  )
}
