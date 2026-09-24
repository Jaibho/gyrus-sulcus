#!/usr/bin/env node
/**
 * apply-images.mjs — merges the images you ticked in IMAGE-REVIEW.html into
 * articles.json. Only slugs present in approved-images.json are touched, and
 * only their image fields. Article text is never modified.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = join(ROOT, 'public/data/articles.json')

const approvedPath = process.argv[2] || join(process.env.HOME || '', 'Downloads', 'approved-images.json')
if (!existsSync(approvedPath)) {
  console.error(`No approvals found at ${approvedPath}`)
  console.error('Open IMAGE-REVIEW.html, choose your images, click "चयन सहेजें", then run this again.')
  process.exit(1)
}

const approved = JSON.parse(readFileSync(approvedPath, 'utf-8'))
const articles = JSON.parse(readFileSync(DATA, 'utf-8'))

copyFileSync(DATA, DATA + '.backup')

let applied = 0
for (const a of articles) {
  const pick = approved[a.slug]
  if (!pick || !pick.url) continue
  a.image_url = pick.url
  a.image_credit = pick.credit
  a.image_license = pick.licence
  a.image_source = pick.page
  applied++
}

writeFileSync(DATA, JSON.stringify(articles, null, 2), 'utf-8')
console.log(`Applied images to ${applied} article(s).`)
console.log(`Untouched: ${articles.length - applied}. Backup at articles.json.backup`)
