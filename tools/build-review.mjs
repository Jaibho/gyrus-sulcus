#!/usr/bin/env node
/**
 * build-review.mjs — turns the day's pending content into REVIEW.html.
 *
 * Nothing in content-pending/ is live. This renders every pending article and
 * MCQ exactly as it will appear, with a tick box each. Ticking and saving
 * produces approved.json, which apply-approvals.mjs then merges into the real
 * data files. Anything left unticked is simply never published.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf-8')) : [])

const articles = read(join(ROOT, 'content-pending', 'articles.json'))
const mcqs = read(join(ROOT, 'content-pending', 'mcqs.json'))

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const PALETTES = {
  'समसामयिकी': ['#0033CC', '#001966'],
  'विज्ञान': ['#0E7490', '#083344'],
  'भूगोल': ['#15803D', '#052E16'],
  'राजव्यवस्था': ['#6D28D9', '#2E1065'],
  'अर्थव्यवस्था': ['#B45309', '#451A03'],
}
const pal = (c) => PALETTES[c] || ['#334155', '#0F172A']

// Same simple Markdown subset the site renders.
function md(src = '') {
  const out = []
  let list = []
  const flush = () => { if (list.length) { out.push('<ul>' + list.map((l) => `<li>${l}</li>`).join('') + '</ul>'); list = [] } }
  for (const raw of String(src).split('\n')) {
    const line = raw.trim()
    const bold = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    if (!line) { flush(); continue }
    if (line.startsWith('### ')) { flush(); out.push(`<h4>${bold(line.slice(4))}</h4>`) }
    else if (line.startsWith('## ')) { flush(); out.push(`<h3>${bold(line.slice(3))}</h3>`) }
    else if (/^[-*]\s+/.test(line)) { list.push(bold(line.replace(/^[-*]\s+/, ''))) }
    else { flush(); out.push(`<p>${bold(line)}</p>`) }
  }
  flush()
  return out.join('')
}

const articleCards = articles.map((a, i) => {
  const [from, to] = pal(a.category)
  return `
  <div class="item" data-kind="article" data-id="${esc(a.slug)}">
    <label class="head">
      <input type="checkbox" class="tick" checked>
      <span class="badge">${esc(a.category || '')}</span>
      <span class="date">${esc((a.created_at || '').slice(0, 10))}</span>
      <span class="slug">${esc(a.slug)}</span>
    </label>
    <div class="thumb" style="background:linear-gradient(135deg,${from},${to})">
      <div class="thumb-cat">${esc(a.category || '')}</div>
      <div class="thumb-title">${esc(a.title)}</div>
      <div class="thumb-foot"><span>${esc((a.created_at || '').slice(0, 10))}</span><span>GYRUS SULCUS</span></div>
    </div>
    <h2>${esc(a.title)}</h2>
    <p class="en-title">${esc(a.title_en || '')}</p>
    <details open><summary>हिंदी</summary><div class="body">${md(a.content)}</div></details>
    <details><summary>English</summary><div class="body">${md(a.content_en)}</div></details>
  </div>`
}).join('')

const mcqCards = mcqs.map((q, i) => {
  const letters = ['a', 'b', 'c', 'd']
  const opts = letters.map((L) => {
    const ok = String(q.correct_answer).toLowerCase() === L
    return `<li class="${ok ? 'correct' : ''}"><b>${L.toUpperCase()}.</b> ${esc(q['option_' + L + '_hi'])}
      <span class="en">${esc(q['option_' + L + '_en'])}</span>${ok ? '<span class="tag">सही</span>' : ''}</li>`
  }).join('')
  return `
  <div class="item" data-kind="mcq" data-id="${esc(q.subject + '|' + q.date + '|' + i)}">
    <label class="head">
      <input type="checkbox" class="tick" checked>
      <span class="badge">${esc(q.subject)}</span>
      <span class="date">${esc(q.date)}</span>
      <span class="slug">#${i + 1}</span>
    </label>
    <div class="q">${esc(q.question_hi).replace(/\n/g, '<br>')}</div>
    <div class="q en">${esc(q.question_en).replace(/\n/g, '<br>')}</div>
    <ul class="opts">${opts}</ul>
    <details><summary>व्याख्या / Explanation</summary>
      <div class="body"><p>${esc(q.explanation_hi)}</p><p class="en">${esc(q.explanation_en)}</p></div>
    </details>
  </div>`
}).join('')

const html = `<!doctype html>
<html lang="hi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>समीक्षा — Gyrus Sulcus (${articles.length} लेख, ${mcqs.length} प्रश्न)</title>
<style>
:root{--ink:#0f172a;--mut:#64748b;--line:#e2e8f0;--brand:#0033CC;--ok:#15803d}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#f8fafc;color:var(--ink)}
header{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--line);padding:14px 20px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;z-index:10}
h1{font-size:17px;margin:0;flex:1}
button{background:var(--brand);color:#fff;border:0;border-radius:8px;padding:9px 16px;font-size:14px;font-weight:600;cursor:pointer}
button.ghost{background:#fff;color:var(--ink);border:1px solid var(--line)}
.count{font-size:13px;color:var(--mut)}
main{max-width:860px;margin:0 auto;padding:20px}
h2.sec{font-size:15px;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);margin:28px 0 12px}
.item{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px;margin-bottom:14px}
.item.off{opacity:.42}
.head{display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:10px;flex-wrap:wrap}
.tick{width:18px;height:18px;accent-color:var(--brand)}
.badge{background:#eef2ff;color:var(--brand);font-size:11px;font-weight:600;padding:3px 9px;border-radius:99px}
.date{font-size:12px;color:var(--mut)}
.slug{font-size:11px;color:#94a3b8;font-family:ui-monospace,monospace;margin-left:auto}
.thumb{aspect-ratio:16/9;border-radius:10px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;color:#fff;margin-bottom:12px}
.thumb-cat{font-size:11px;font-weight:600;background:rgba(255,255,255,.18);padding:3px 10px;border-radius:99px;align-self:flex-start}
.thumb-title{font-size:17px;font-weight:700;line-height:1.35;text-shadow:0 1px 8px rgba(0,0,0,.35)}
.thumb-foot{display:flex;justify-content:space-between;font-size:10px;opacity:.85;letter-spacing:.08em}
.item h2{font-size:18px;margin:4px 0}
.en-title,.en{color:var(--mut)}
.en-title{font-size:13px;margin:0 0 10px}
details{border-top:1px solid var(--line);padding-top:8px;margin-top:8px}
summary{cursor:pointer;font-size:13px;font-weight:600;color:var(--brand)}
.body{font-size:14px;line-height:1.7}
.body h3,.body h4{font-size:14px;margin:14px 0 6px}
.body ul{padding-left:20px}
.q{font-size:15px;line-height:1.7;white-space:normal;margin-bottom:6px}
.q.en{font-size:13px}
.opts{list-style:none;padding:0;margin:10px 0}
.opts li{border:1px solid var(--line);border-radius:8px;padding:8px 11px;margin-bottom:6px;font-size:14px}
.opts li.correct{border-color:var(--ok);background:#f0fdf4}
.opts .en{display:block;font-size:12px}
.tag{float:right;background:var(--ok);color:#fff;font-size:10px;padding:2px 8px;border-radius:99px}
#saved{display:none;background:#f0fdf4;border:1px solid #86efac;color:#166534;padding:10px 14px;border-radius:8px;margin:16px 0;font-size:14px}
</style></head><body>
<header>
  <h1>समीक्षा — जो टिक रहेगा वही प्रकाशित होगा</h1>
  <span class="count"><b id="n">0</b> चुने गए</span>
  <button class="ghost" onclick="all(true)">सभी चुनें</button>
  <button class="ghost" onclick="all(false)">सभी हटाएँ</button>
  <button onclick="save()">स्वीकृति सहेजें</button>
</header>
<main>
  <div id="saved">✓ approved.json सहेज लिया गया। अब <b>Approve-And-Publish.command</b> पर डबल-क्लिक करें।</div>
  <h2 class="sec">लेख — Articles (${articles.length})</h2>
  ${articleCards || '<p class="count">कोई लेख लंबित नहीं।</p>'}
  <h2 class="sec">प्रश्न — MCQs (${mcqs.length})</h2>
  ${mcqCards || '<p class="count">कोई प्रश्न लंबित नहीं।</p>'}
</main>
<script>
const items=[...document.querySelectorAll('.item')];
function sync(){
  let n=0;
  items.forEach(it=>{const c=it.querySelector('.tick').checked;it.classList.toggle('off',!c);if(c)n++});
  document.getElementById('n').textContent=n;
}
items.forEach(it=>it.querySelector('.tick').addEventListener('change',sync));
function all(v){items.forEach(it=>it.querySelector('.tick').checked=v);sync()}
function save(){
  const out={articles:[],mcqs:[]};
  items.forEach(it=>{
    if(!it.querySelector('.tick').checked)return;
    (it.dataset.kind==='article'?out.articles:out.mcqs).push(it.dataset.id);
  });
  const blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='approved.json';a.click();
  document.getElementById('saved').style.display='block';
  window.scrollTo({top:0,behavior:'smooth'});
}
sync();
</script></body></html>`

writeFileSync(join(ROOT, 'REVIEW.html'), html, 'utf-8')
console.log(`REVIEW.html written — ${articles.length} articles, ${mcqs.length} MCQs pending`)
