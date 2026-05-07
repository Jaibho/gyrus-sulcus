import { MetadataRoute } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import type { Article } from '@/lib/supabase'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gyrussulcus.com'

/**
 * Dynamic sitemap. Includes every static route plus every published article slug.
 * Next.js will serve this at /sitemap.xml automatically.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                  lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/articles`,          lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/tests`,             lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/notes`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/courses`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/resources`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/resources-hub`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/store`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${SITE_URL}/leaderboard`,       lastModified: now, changeFrequency: 'daily',   priority: 0.6 },
    { url: `${SITE_URL}/wellness`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/archive`,           lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${SITE_URL}/authors/dharmendra-sir`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about`,             lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/editorial-policy`,  lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/ras-english`,       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/login`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
  ]

  // Article routes — read from local JSON; degrade gracefully if missing
  let articleRoutes: MetadataRoute.Sitemap = []
  try {
    const file = await fs.readFile(
      path.join(process.cwd(), 'public', 'data', 'articles.json'),
      'utf-8'
    )
    const articles: Article[] = JSON.parse(file)
    articleRoutes = articles
      .filter(a => a.is_published)
      .map(a => ({
        url: `${SITE_URL}/articles/${a.slug}`,
        lastModified: a.updated_at ? new Date(a.updated_at) : new Date(a.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
  } catch {
    // ignore — sitemap still useful with static routes only
  }

  return [...staticRoutes, ...articleRoutes]
}
