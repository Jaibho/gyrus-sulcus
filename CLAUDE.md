# CLAUDE.md — How to Update This Website (read me first)

This file tells **any AI coding assistant** (Claude Code, Cursor, etc.) exactly how to
update **gyrussulcus.com** — a bilingual (Hindi + English) UPSC / IAS / RAS / State-PCS
learning site by *Dharmendra Sir*. The owner's normal request is simply:

> **"Update my website"** — add today's test MCQs and any new articles.

When you get that request, follow **§3 Recipes** below. Everything is file-based, so you
never need database credentials for the core content.

---

## 0. The one rule that matters most: VERIFY BEFORE YOU POST

This is an **educational exam-prep site**. A wrong answer or a fake fact misleads real
students. So, before adding any MCQ, article, or news item:

1. **Confirm every fact** (dates, names, numbers, "correct" option) against a reliable
   source. For current affairs, use web search and cross-check ≥1 credible outlet.
2. **Never invent** YouTube video IDs, statistics, quotes, or events.
3. If you cannot verify something, **leave it out** and say so — do not guess.
4. Prefer timeless, well-established facts for the static subjects; anchor current-affairs
   items to verifiable recent news.

---

## 1. What the site is & how it deploys

- **Framework:** Next.js (App Router) + TypeScript + Tailwind. React 19.
- **Hosting:** Vercel (auto-deploys on push to the production branch).
- **Data:** Content is **file-based JSON** in `public/data/`. Articles are *also* merged
  with an optional Supabase table at runtime, but **you don't need Supabase** — adding to
  the JSON is enough to publish.
- **Languages:** Every user-facing string is bilingual via `t('हिंदी', 'English')`.

> ✅ **Deployment (confirmed 13 Aug 2026):** The Vercel project **`gyrus-sulcus`**
> (account: jaibho) deploys the **`live`** branch to production. **To publish any change:
> commit and `git push origin HEAD:live`** — Vercel auto-builds and deploys. The working
> copy here tracks that content; keep editing it and pushing to `live`.
>
> ⚠️ **Custom domain caveat:** `gyrussulcus.com` runs on **Cloudflare** and (as of this
> writing) still points at an older Cloudflare-hosted copy, **not** the Vercel project. The
> domain has been added to the Vercel project but needs a **DNS cutover at Cloudflare**
> (point the apex `@` A-record to Vercel's IP shown in the Vercel domain settings) to go
> fully live. Until then, the deployed result is visible at **`gyrus-sulcus.vercel.app`**.
> `main` is a separate, diverged, non-deployed branch — ignore it.

---

## 2. Where content lives (exact schemas)

### 2a. Daily quiz MCQs → `public/data/mcqs.json`

A **flat JSON array**. The quiz page (`src/app/tests/page.tsx`) shows questions filtered by
`date` + `subject`. **Each day needs 25 questions: 5 per subject × 5 subjects.**

- **Subject keys (use exactly these):** `science_tech`, `polity`, `economy`, `geography`,
  `current_affairs`.
- **Date format:** `YYYY-MM-DD` (e.g. today's date).
- **`correct_answer`:** one lowercase letter — `"a"`, `"b"`, `"c"`, or `"d"`.

One item's shape:

```json
{
  "date": "2026-08-13",
  "subject": "polity",
  "question_hi": "प्रश्न हिंदी में …",
  "question_en": "Question in English …",
  "option_a_hi": "…", "option_a_en": "…",
  "option_b_hi": "…", "option_b_en": "…",
  "option_c_hi": "…", "option_c_en": "…",
  "option_d_hi": "…", "option_d_en": "…",
  "correct_answer": "c",
  "explanation_hi": "व्याख्या हिंदी में …",
  "explanation_en": "Explanation in English …"
}
```

### 2b. Articles / news → `public/data/articles.json`

A JSON array, rendered **newest-first**. New articles go at the **top**. The article page
merges this file with Supabase, so JSON entries always appear. Content is **Markdown**
(`##` headings, `**bold**`, `-` lists, `\n` for line breaks).

One article's shape:

```json
{
  "id": "art-news-2026-08-13-my-topic",
  "title": "शीर्षक हिंदी में",
  "title_en": "Title in English",
  "slug": "unique-url-slug",
  "category": "समसामयिकी",
  "excerpt": "1–2 पंक्ति सारांश (हिंदी)",
  "excerpt_en": "1–2 line summary (English)",
  "content": "## हिंदी लेख …\n\nमार्कडाउन …",
  "content_en": "## English article …\n\nMarkdown …",
  "is_published": true,
  "created_at": "2026-08-13T09:00:00.000Z"
}
```

- **`slug`** must be unique, lowercase, hyphenated (it becomes `/articles/<slug>`).
- **`category`** (Hindi) is typically one of: `समसामयिकी` (Current Affairs), `विज्ञान`
  (Science), `राजव्यवस्था` (Polity), `अर्थव्यवस्था` (Economy), `भूगोल` (Geography).
- For news, add a short **"स्रोत/Note"** line stating it's based on public reports; if a
  matter is ongoing (e.g. a court case), say it is *sub-judice*.

### 2c. Homepage YouTube ribbons → `src/app/page.tsx` + `src/app/api/latest-videos/route.ts`

- **Channel:** GYRUS SULCUS — `https://www.youtube.com/@gyrussulcus1908`
  (channel id `UCpBRZ6j0oAkjyd3FLr4yPtA`).
- **"Latest Videos" ribbon = automatic.** `src/app/api/latest-videos/route.ts` reads the
  channel's newest uploads (RSS → HTML fallback) and resolves titles via YouTube oEmbed,
  revalidating hourly. **When a new video is posted, it appears automatically and the oldest
  drops off — no code change needed.** The `latestVideos` array in `page.tsx` is only a
  static fallback if that fetch fails; refresh it occasionally with real newest IDs.
- **"Most Watched" ribbon = curated** (`mostViewedVideos` in `page.tsx`). YouTube does not
  expose reliable view counts to us, so this list is hand-picked. Only put **real, verified
  video IDs** here (open `https://www.youtube.com/watch?v=<ID>` to confirm it resolves and
  belongs to the channel). Never fabricate an ID or a view count.

---

## 3. Recipes (do exactly this for common requests)

### "Update my website" / "Add today's test" / "New MCQs for all subjects"
1. Determine **today's date** → `YYYY-MM-DD`.
2. Write **25 MCQs (5 per subject)**, bilingual, with correct answers + explanations.
   **Verify every answer.** Anchor `current_affairs` to real, recent, checked news.
3. Append them to `public/data/mcqs.json` (a script is safest — see
   `scripts`/prior commits for the pattern; keep JSON valid, `indent=2`, `ensure_ascii=false`).
4. Idempotency: if re-running for the same date, remove existing rows for that date first.
5. Validate JSON, run `npm run build`, then commit & push (see §4).

### "Add a news article about X"
1. **Research and verify X** with web search (cross-check facts, dates, names, numbers).
2. Write a bilingual, exam-oriented article (Markdown) matching §2b.
3. Insert it at the **top** of `public/data/articles.json` with a unique `slug` and
   `created_at` = now (ISO). Add a sources/sub-judice note where relevant.
4. Validate JSON, `npm run build`, commit & push.

### "Add YouTube videos"
- Add only **verified real IDs** to `mostViewedVideos` (curated). The Latest ribbon already
  auto-updates — you usually don't need to touch it. Optionally refresh the `latestVideos`
  fallback with the current newest IDs.

---

## 4. Build, verify, deploy

```bash
npm install          # first time
npm run build        # MUST pass with no errors before pushing
```

Then publish:

```bash
git add -A && git commit -m "content: update for <date>" && git push origin HEAD:live
```

Vercel auto-builds and deploys the `live` branch to production. After deploy, spot-check on
`gyrus-sulcus.vercel.app` (and `gyrussulcus.com` once the DNS cutover in §1 is done):
`/tests` (today's quiz shows 25 new Qs), `/articles` (new pieces at top), homepage ribbons.

---

## 5. Monetization (Google AdSense)

Wired but **off until you provide a publisher id** (`src/app/layout.tsx`):

1. Get approved at <https://adsense.google.com> and copy your id `ca-pub-XXXXXXXXXXXXXXXX`.
2. In Vercel → Project → Settings → Environment Variables, add:
   `NEXT_PUBLIC_ADSENSE_CLIENT = ca-pub-XXXXXXXXXXXXXXXX`
3. Redeploy. The AdSense loader + `google-adsense-account` meta then emit automatically, and
   **Auto Ads** (enable them in the AdSense dashboard) will place ads site-wide.
4. Add an `ads.txt` at the site root containing the line AdSense gives you, e.g.
   `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0` (put it in `public/ads.txt`).
5. Keep content original and useful — AdSense rejects thin/auto-generated-only sites.

When the env var is **unset**, no ad code loads (the site stays clean).

---

## 6. Guardrails / don'ts

- ❌ Don't post unverified facts, fake video IDs, or invented statistics.
- ❌ Don't add a reader "submit your article" flow — the site is intentionally **one-way**
  (owner-published only). Keep it that way.
- ❌ Don't break bilingual coverage — every visible string needs `hi` + `en`.
- ❌ Don't commit secrets. Public config uses `NEXT_PUBLIC_*` env vars only.
- ✅ Always `npm run build` before pushing.
- ✅ Keep `mcqs.json` and `articles.json` valid JSON (validate after editing).
