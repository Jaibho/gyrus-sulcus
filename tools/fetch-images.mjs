#!/usr/bin/env node
/**
 * fetch-images.mjs — proposes a freely-licensed photograph for each article.
 *
 * Source: Wikimedia Commons only. Accepts public domain and Creative Commons
 * images, records the photographer and licence for attribution, and never
 * touches a news agency photo. Nothing is applied to the site here: this writes
 * proposals plus IMAGE-REVIEW.html, and apply-images.mjs merges only what you
 * have ticked.
 *
 * Run on a machine with internet:  node tools/fetch-images.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const UA = 'GyrusSulcus/1.0 (https://gyrussulcus.com; educational) node-fetch'
const API = 'https://commons.wikimedia.org/w/api.php'

const LIMIT = Number(process.env.LIMIT || 40)          // articles per run
const OK_LICENCE = /^(cc[- ]?by([- ]sa)?([- ]\d(\.\d)?)?|cc0|public domain|pd)/i

const articles = JSON.parse(readFileSync(join(ROOT, 'public/data/articles.json'), 'utf-8'))
const terms = JSON.parse(readFileSync(join(ROOT, 'tools/image-terms.json'), 'utf-8'))

const STOP = new Set(['the','and','for','with','from','india','indian','2026','2025','new','of','a','an','to','in','on','at','guide','complete','study'])

function queryFor(a) {
  for (const [key, val] of Object.entries(terms)) {
    if (key.startsWith('_')) continue
    if (a.slug.includes(key)) return val
  }
  // Fall back to the most meaningful words in the slug.
  const words = a.slug.split('-').filter((w) => w.length > 3 && !STOP.has(w) && !/^\d+$/.test(w))
  return (words.slice(0, 4).join(' ') + ' India').trim()
}

const strip = (html = '') => String(html).replace(/<[^>]*>/g, '').trim()

async function search(q) {
  const url = `${API}?action=query&format=json&origin=*&generator=search` +
    `&gsrsearch=${encodeURIComponent('filetype:bitmap ' + q)}` +
    `&gsrlimit=8&gsrnamespace=6&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1200`
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const pages = Object.values(data?.query?.pages || {})

  const scored = pages.map((p) => {
    const ii = p.imageinfo?.[0] || {}
    const em = ii.extmetadata || {}
    const licence = strip(em.LicenseShortName?.value || em.License?.value || '')
    const artist = strip(em.Artist?.value || '')
    const w = ii.thumbwidth || 0
    const h = ii.thumbheight || 1
    const landscape = w / h
    let score = 0
    if (landscape >= 1.25) score += 3          // suits a 16:9 card
    else if (landscape >= 1.0) score += 1
    if (String(em.Assessments?.value || '').includes('quality')) score += 2
    if (/cc0|public domain/i.test(licence)) score += 1
    return {
      title: p.title,
      url: ii.thumburl?.split('?')[0] || '',
      page: ii.descriptionurl,
      licence,
      artist,
      width: w,
      height: h,
      score,
      ok: OK_LICENCE.test(licence) && landscape >= 1.0 && !!ii.thumburl,
    }
  })

  return scored.filter((c) => c.ok).sort((a, b) => b.score - a.score)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const todo = articles.filter((a) => !a.image_url).slice(0, LIMIT)
console.log(`${todo.length} articles need an image (of ${articles.length} total)\n`)

const proposals = []
for (const [i, a] of todo.entries()) {
  const q = queryFor(a)
  process.stdout.write(`  [${i + 1}/${todo.length}] ${a.slug}  «${q}» … `)
  try {
    const hits = await search(q)
    if (!hits.length) { console.log('no free image found'); }
    else {
      console.log(`${hits.length} candidates`)
      proposals.push({ slug: a.slug, title: a.title, title_en: a.title_en, query: q, candidates: hits.slice(0, 4) })
    }
  } catch (e) {
    console.log(`failed (${e.message})`)
  }
  await sleep(350) // be polite to Commons
}

mkdirSync(join(ROOT, 'content-pending'), { recursive: true })
writeFileSync(join(ROOT, 'content-pending/image-proposals.json'), JSON.stringify(proposals, null, 2))

const esc = (s = '') => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')

const blocks = proposals.map((p) => `
<div class="item" data-slug="${esc(p.slug)}">
  <h3>${esc(p.title)}</h3>
  <p class="meta">${esc(p.title_en || '')} · खोज: <code>${esc(p.query)}</code></p>
  <div class="row">
    <label class="opt none"><input type="radio" name="${esc(p.slug)}" value="" checked>
      <span class="box">कोई नहीं<br><small>डिज़ाइन कार्ड रहने दें</small></span></label>
    ${p.candidates.map((c) => `
    <label class="opt"><input type="radio" name="${esc(p.slug)}"
        value="${esc(JSON.stringify({ url: c.url, credit: `${c.artist || 'Wikimedia Commons'} · ${c.licence}`, licence: c.licence, page: c.page }))}">
      <span class="box"><img src="${esc(c.url)}" loading="lazy" alt="">
        <small>${esc(c.licence)}<br>${esc(c.artist || '—').slice(0, 42)}</small></span></label>`).join('')}
  </div>
</div>`).join('')

writeFileSync(join(ROOT, 'IMAGE-REVIEW.html'), `<!doctype html><meta charset="utf-8">
<title>चित्र समीक्षा — ${proposals.length} लेख</title>
<style>
body{margin:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;color:#0f172a}
header{position:sticky;top:0;background:#fff;border-bottom:1px solid #e2e8f0;padding:14px 20px;display:flex;gap:12px;align-items:center;z-index:5}
h1{font-size:17px;margin:0;flex:1}
button{background:#0033CC;color:#fff;border:0;border-radius:8px;padding:9px 16px;font-weight:600;cursor:pointer}
main{max-width:1100px;margin:0 auto;padding:20px}
.item{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:16px}
.item h3{margin:0 0 4px;font-size:16px}
.meta{margin:0 0 12px;color:#64748b;font-size:12px}
code{background:#f1f5f9;padding:1px 6px;border-radius:4px}
.row{display:flex;gap:10px;flex-wrap:wrap}
.opt input{position:absolute;opacity:0}
.box{display:block;width:190px;border:3px solid transparent;border-radius:10px;overflow:hidden;background:#f1f5f9;cursor:pointer}
.opt input:checked + .box{border-color:#0033CC}
.box img{display:block;width:190px;height:107px;object-fit:cover}
.box small{display:block;padding:6px 8px;font-size:10px;color:#475569;line-height:1.4}
.none .box{display:flex;align-items:center;justify-content:center;height:141px;text-align:center;font-size:12px;color:#475569}
#saved{display:none;background:#f0fdf4;border:1px solid #86efac;color:#166534;padding:10px 14px;border-radius:8px;margin-bottom:16px}
</style>
<header><h1>चित्र समीक्षा — जो चुनेंगे वही लगेगा</h1>
<button onclick="save()">चयन सहेजें</button></header>
<main>
<div id="saved">✓ approved-images.json सहेज लिया। अब <b>Apply-Article-Images.command</b> पर डबल-क्लिक करें।</div>
${blocks || '<p>कोई प्रस्ताव नहीं।</p>'}
</main>
<script>
function save(){
  const out={};
  document.querySelectorAll('.item').forEach(it=>{
    const sel=it.querySelector('input:checked');
    if(sel && sel.value) out[it.dataset.slug]=JSON.parse(sel.value);
  });
  const b=new Blob([JSON.stringify(out,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='approved-images.json';a.click();
  document.getElementById('saved').style.display='block';window.scrollTo({top:0,behavior:'smooth'});
}
</script>`)

console.log(`\nIMAGE-REVIEW.html written — ${proposals.length} articles with candidates`)
