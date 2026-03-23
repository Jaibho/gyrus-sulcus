import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'public', 'data', 'articles-local.json')

function readArticles() {
  try {
    if (!fs.existsSync(filePath)) return []
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return []
  }
}

function writeArticles(data: unknown[]) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { article, replace } = body as { article: { id: number; [key: string]: unknown }; replace: boolean }
    let existing = readArticles() as { id: number }[]
    if (replace) {
      existing = existing.map((a) => (a.id === article.id ? article : a))
    } else {
      existing.push(article)
    }
    writeArticles(existing)
    return NextResponse.json({ success: true, count: existing.length })
  } catch {
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    let existing = readArticles() as { id: number }[]
    existing = existing.filter((a) => a.id !== id)
    writeArticles(existing)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
