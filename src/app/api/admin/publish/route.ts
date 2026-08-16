import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Secure content-publish endpoint for the owner's /admin panel.
// Auth: a shared admin password (env ADMIN_PASSWORD). Writes use the Supabase
// SERVICE ROLE key (server-only) so the browser never holds write credentials.

export const dynamic = 'force-dynamic'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

type Article = {
  title: string; title_en?: string; slug: string; category?: string
  excerpt?: string; excerpt_en?: string; content: string; content_en?: string
  is_published?: boolean; created_at?: string; image_url?: string
}
type Mcq = {
  date: string; subject: string; question_hi: string; question_en: string
  option_a_hi: string; option_a_en: string; option_b_hi: string; option_b_en: string
  option_c_hi: string; option_c_en: string; option_d_hi: string; option_d_en: string
  correct_answer: string; explanation_hi?: string; explanation_en?: string
}

const SUBJECTS = ['science_tech', 'polity', 'economy', 'geography', 'current_affairs']

function bad(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code })
}

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SERVICE_KEY) return bad('Server not configured: missing Supabase service key.', 500)
  if (!ADMIN_PASSWORD) return bad('Server not configured: missing ADMIN_PASSWORD.', 500)

  let body: { password?: string; type?: string; items?: unknown[] }
  try {
    body = await request.json()
  } catch {
    return bad('Invalid JSON body.')
  }

  if (body.password !== ADMIN_PASSWORD) return bad('Wrong admin password.', 401)
  const items = Array.isArray(body.items) ? body.items : []
  if (items.length === 0) return bad('No items to publish.')

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

  if (body.type === 'articles') {
    const rows: Article[] = []
    for (const raw of items as Article[]) {
      if (!raw?.title || !raw?.slug || !raw?.content) return bad('Each article needs at least title, slug and content.')
      rows.push({
        title: raw.title,
        title_en: raw.title_en || raw.title,
        slug: String(raw.slug).toLowerCase().trim().replace(/\s+/g, '-'),
        category: raw.category || 'समसामयिकी',
        excerpt: raw.excerpt || '',
        excerpt_en: raw.excerpt_en || raw.excerpt || '',
        content: raw.content,
        content_en: raw.content_en || raw.content,
        is_published: raw.is_published ?? true,
        created_at: raw.created_at || new Date().toISOString(),
        image_url: raw.image_url,
      })
    }
    const { error, count } = await supabase.from('articles').insert(rows, { count: 'exact' })
    if (error) return bad('Supabase error: ' + error.message, 500)
    return NextResponse.json({ ok: true, inserted: count ?? rows.length, type: 'articles' })
  }

  if (body.type === 'mcqs') {
    const rows: Mcq[] = []
    for (const raw of items as Mcq[]) {
      const ca = String(raw?.correct_answer || '').toLowerCase().trim()
      if (!raw?.date || !SUBJECTS.includes(raw?.subject)) return bad('Each MCQ needs a date and a valid subject (' + SUBJECTS.join(', ') + ').')
      if (!raw?.question_en && !raw?.question_hi) return bad('Each MCQ needs a question.')
      if (!['a', 'b', 'c', 'd'].includes(ca)) return bad('correct_answer must be a, b, c or d.')
      rows.push({
        date: raw.date, subject: raw.subject,
        question_hi: raw.question_hi || raw.question_en,
        question_en: raw.question_en || raw.question_hi,
        option_a_hi: raw.option_a_hi || raw.option_a_en, option_a_en: raw.option_a_en || raw.option_a_hi,
        option_b_hi: raw.option_b_hi || raw.option_b_en, option_b_en: raw.option_b_en || raw.option_b_hi,
        option_c_hi: raw.option_c_hi || raw.option_c_en, option_c_en: raw.option_c_en || raw.option_c_hi,
        option_d_hi: raw.option_d_hi || raw.option_d_en, option_d_en: raw.option_d_en || raw.option_d_hi,
        correct_answer: ca,
        explanation_hi: raw.explanation_hi || raw.explanation_en || '',
        explanation_en: raw.explanation_en || raw.explanation_hi || '',
      })
    }
    const { error, count } = await supabase.from('mcqs').insert(rows, { count: 'exact' })
    if (error) return bad('Supabase error: ' + error.message, 500)
    return NextResponse.json({ ok: true, inserted: count ?? rows.length, type: 'mcqs' })
  }

  return bad('Unknown type — use "articles" or "mcqs".')
}
