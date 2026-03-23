import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'public', 'data', 'articles-local.json')

export async function GET() {
  try {
    if (!fs.existsSync(filePath)) return NextResponse.json([])
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([])
  }
}
