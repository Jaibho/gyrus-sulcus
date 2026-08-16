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
> ✅ **Domain (cutover DONE, 15 Aug 2026):** `gyrussulcus.com` now serves the Vercel `live`
> build through Cloudflare — apex A-record → `76.76.21.21` (proxied), Cloudflare SSL mode
> **Full (Strict)**, `www` → apex 301. See §7 for the full current state (admin panel, ads,
> counters, env vars). `main` is a separate, diverged, non-deployed branch — ignore it.

---

## 2. Where content lives (exact schemas)

### 2a. Daily quiz MCQs → `public/data/mcqs.json`

A **flat JSON array**. The quiz page (`src/app/tests/page.tsx`) shows questions filtered by
`date` + `subject`. **Each day needs 25 questions: 5 per subject × 5 subjects.**

- **Subject keys (use exactly these):** `science_tech`, `polity`, `economy`, `geography`,
  `current_affairs`.
- **Date format:** `YYYY-MM-DD` (e.g. today's date).
- **`correct_answer`:** one lowercase letter — `"a"`, `"b"`, `"c"`, or `"d"`.
- **⭐ FORMAT RULE (owner preference): at least 50% of each day's MCQs must be
  UPSC "statement-based" questions** — the `question_*` lists 4 numbered statements and asks
  *"Which of the statements given above are correct?"*, with options like
  "1, 2 and 3 only" / "1, 2 and 4 only" / etc. Put each statement on its own line using `\n`
  (`Consider the following statements:\n1. …\n2. …\n3. …\n4. …\nWhich … are correct?`).
  **Every individual statement must be independently fact-checked** (true or false on
  purpose), and `correct_answer` must match the option listing exactly the true statements.
  The remaining questions can be direct single-fact MCQs.

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

---

## 7. Features & setup added Aug 2026 (read this for the full current state)

**Live deploy:** push to branch **`live`** → Vercel project `gyrus-sulcus` auto-builds → served at `gyrussulcus.com` (Cloudflare in front, **SSL mode = Full (Strict)**, apex proxied to Vercel `76.76.21.21`; `www` 301-redirects to apex).

### Content locations (recap)
- **MCQs:** `public/data/mcqs.json` (flat array, `date`+`subject`) **merged at runtime with the Supabase `mcqs` table** (admin-added). Quiz shows today's local-date set; if today's is empty it shows the latest available day.
- **Articles:** `public/data/articles.json` **merged with the Supabase `articles` table**. Newest-first. **Future-dated articles are hidden until their `created_at`** (date-based scheduling).

### Scheduling (no cron)
Date-based: MCQs dated a future day appear when the quiz asks for that day; articles with a future `created_at` are filtered out of the list/homepage until then. So you can post today + "schedule" tomorrow just by setting the dates.

### /admin self-upload panel (`src/app/admin/page.tsx` + `src/app/api/admin/publish/route.ts`)
- Password-gated (env `ADMIN_PASSWORD`). Writes go through the server route using `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS; browser never holds write creds).
- Modes: add MCQ one-by-one, add Article one-by-one, or **bulk upload** (download filled sample JSON → edit → publish).
- **Setup once:** (1) create the `mcqs` table (SQL at bottom of `supabase-setup.sql`); (2) set env vars `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSWORD` in Vercel; (3) redeploy.

### Live counters
- Homepage stat badges show **live YouTube subscribers + Telegram members** via `src/app/api/stats/route.ts` (keyless: mixerno.space + t.me public page), refreshed ~2 min.
- **Visitor counter** in the footer via `src/app/api/visits/route.ts` (keyless abacus.jasoncameron.dev), once-per-session.
- **Auto-updating "Latest Videos"** ribbon via `src/app/api/latest-videos/route.ts` (channel RSS/scrape + oEmbed).

### Monetization — Google AdSense
- Publisher id lives in env `NEXT_PUBLIC_ADSENSE_CLIENT` (currently `ca-pub-5138579700576493`). The loader + `google-adsense-account` meta emit only when it's set (`src/app/layout.tsx`). `public/ads.txt` is published.
- Ad units: `src/components/AdSlot.tsx` + slot ids in `src/lib/ads.ts` (env `NEXT_PUBLIC_AD_SLOT_*`). Placed on the **quiz results page** and **article footer** (content-rich, policy-safe). They render nothing until a slot id is set — do that only AFTER AdSense approves.
- ⚠️ Never stack ads on the live quiz-taking screen or near answer buttons (accidental clicks = account ban). Results/article pages only.

### All environment variables (set in Vercel)
| Var | Purpose | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase read | public |
| `SUPABASE_SERVICE_ROLE_KEY` | admin writes (server only) | **secret** |
| `ADMIN_PASSWORD` | `/admin` login | **secret** |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher id | public |
| `NEXT_PUBLIC_AD_SLOT_TESTS` / `_RESULTS` / `_ARTICLE` | AdSense ad-unit slot ids (after approval) | public |

### Privacy rule (learned the hard way)
Never put the owner's personal data (email, address, education, phone beyond the public brand number) on the site or in git without explicit permission. The About page (`src/app/about/page.tsx`) is the owner's own words — do not rewrite it.
