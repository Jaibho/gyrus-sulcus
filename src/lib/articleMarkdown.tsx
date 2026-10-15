/**
 * Lightweight Markdown -> JSX used by the Current Affairs section.
 * Mirrors the renderer in articles/[slug]/ArticleContent.tsx so both sections
 * format identically. Kept separate so the existing Articles page is untouched.
 */
import React from 'react'

export function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(<strong key={`${keyBase}-b${i++}`}>{m[1]}</strong>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export function renderMarkdown(md: string): React.ReactNode[] {
  const lines = (md || '').split('\n')
  const out: React.ReactNode[] = []
  let list: string[] = []
  let k = 0
  let table: string[][] = []
  const flushTable = () => {
    if (table.length) {
      const [head, ...rows] = table
      out.push(
        <div key={`tb${k++}`} className="my-4 overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-brand-50 text-gray-900">
              <tr>{head.map((c, i) => <th key={i} className="px-3 py-2 font-semibold border-b border-gray-200">{renderInline(c, `th${k}-${i}`)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className={ri % 2 ? 'bg-gray-50/60' : ''}>
                  {r.map((c, ci) => <td key={ci} className="px-3 py-2 align-top text-gray-700 border-b border-gray-100">{renderInline(c, `td${k}-${ri}-${ci}`)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      table = []
    }
  }
  const flush = () => {
    flushTable()
    if (list.length) {
      out.push(
        <ul key={`ul${k++}`} className="list-disc pl-6 my-3 space-y-1.5 text-gray-700">
          {list.map((li, i) => (
            <li key={i}>{renderInline(li, `li${k}-${i}`)}</li>
          ))}
        </ul>
      )
      list = []
    }
  }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { flush(); continue }
    if (line.startsWith('### ')) {
      flush()
      out.push(<h3 key={`h${k++}`} className="text-lg font-bold text-gray-900 mt-6 mb-2">{renderInline(line.slice(4), `h${k}`)}</h3>)
    } else if (line.startsWith('## ')) {
      flush()
      out.push(<h2 key={`h${k++}`} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{renderInline(line.slice(3), `h${k}`)}</h2>)
    } else if (line.startsWith('# ')) {
      flush()
      out.push(<h2 key={`h${k++}`} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{renderInline(line.slice(2), `h${k}`)}</h2>)
    } else if (line.startsWith('|')) {
      if (!/^\|\s*:?-{2,}/.test(line)) table.push(line.replace(/^\||\|$/g, '').split('|').map(c => c.trim()))
    } else if (line.startsWith('> ')) {
      flush()
      out.push(<blockquote key={`q${k++}`} className="border-l-4 border-brand-300 bg-brand-50/50 pl-4 py-2 my-4 text-sm text-gray-600 italic">{renderInline(line.slice(2), `q${k}`)}</blockquote>)
    } else if (/^[-*]\s+/.test(line)) {
      flushTable()
      list.push(line.replace(/^[-*]\s+/, ''))
    } else {
      flush()
      out.push(<p key={`p${k++}`} className="my-3 text-gray-700 leading-relaxed">{renderInline(line, `p${k}`)}</p>)
    }
  }
  flush()
  return out
}
