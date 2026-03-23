import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'public', 'data', 'mcqs.json')

function readMCQs() {
  try {
    if (!fs.existsSync(filePath)) return []
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return []
  }
}

function writeMCQs(data: unknown[]) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const existing = readMCQs()
    if (Array.isArray(body)) {
      existing.push(...body)
    } else {
      existing.push(body)
    }
    writeMCQs(existing)
    return NextResponse.json({ success: true, count: existing.length })
  } catch {
    return NextResponse.json({ error: 'Failed to save MCQ' }, { status: 500 })
  }
}
