# 🚀 GYRUS SULCUS v2 — Deployment Guide
# Dharmendra Sir ke liye step-by-step instructions

## ===== STEP 1: Supabase Tables Setup =====

1. Open: https://supabase.com/dashboard/project/nwzoruewmarehspjkegs/sql
2. "New Query" click karo
3. `supabase-setup.sql` file ka POORA content paste karo
4. "Run" click karo (Ctrl+Enter)
5. Verify karo:
   - SELECT * FROM notes;     → 6 rows dikhni chahiye
   - SELECT * FROM courses;   → 3 rows dikhni chahiye

## ===== STEP 2: Supabase Storage (PDF ke liye) =====

1. Supabase Dashboard → Storage → "New Bucket"
2. Name: notes
3. Public: ON karo
4. Create karo
5. PDFs upload karo is bucket mein (baad mein karna hai)

## ===== STEP 3: Environment Variables =====

`.env.local` file banao project root mein:

```
NEXT_PUBLIC_SUPABASE_URL=https://nwzoruewmarehspjkegs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tumhara_anon_key>
NEXT_PUBLIC_SITE_URL=https://gyrus-sulcus.vercel.app
```

Anon key kahan milega:
Supabase Dashboard → Settings → API → anon public key copy karo

## ===== STEP 4: Local Test =====

```bash
# Unzip karo
cd gyrus-sulcus

# Images copy karo existing project se
# profile.jpg, banner.jpg, logo.jpg → public/ folder mein

# Install
npm install

# Run
npm run dev

# Open: http://localhost:3000
```

Verify karo:
- [ ] Homepage load ho rahi hai
- [ ] Tests page kaam kar raha hai
- [ ] Articles page articles dikha raha hai (Supabase se)
- [ ] Courses page 3 courses dikha raha hai
- [ ] Notes page PDFs dikha raha hai
- [ ] About page kaam kar raha hai (no 404)
- [ ] Privacy page kaam kar raha hai (no 404)
- [ ] Login page form dikha raha hai
- [ ] Search bar header mein hai
- [ ] Language toggle kaam kar raha hai

## ===== STEP 5: Deploy to Vercel =====

### Option A: CLI Deploy (current method)
```bash
# Vercel CLI install (agar nahi hai)
npm i -g vercel

# Deploy
vercel --prod

# Ye poochega project select karo → gyrus-sulcus
# Environment variables bhi set karo Vercel dashboard mein
```

### Option B: Git Connect (RECOMMENDED)
```bash
# GitHub repo banao
git init
git add .
git commit -m "v2 upgrade: all 10 improvements"

# GitHub pe push karo
# (Pehle github.com pe naya repo banao: gyrus-sulcus)
git remote add origin https://github.com/jaibho/gyrus-sulcus.git
git push -u origin main
```

Then Vercel Dashboard mein:
1. gyrus-sulcus project kholo
2. "Connect Git" click karo
3. GitHub repo select karo
4. Environment variables add karo:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_SITE_URL
5. Deploy!

Ab se har git push pe auto-deploy hoga.

## ===== STEP 6: Vercel Environment Variables =====

Vercel Dashboard → gyrus-sulcus → Settings → Environment Variables

Add karo:
| Key | Value |
|-----|-------|
| NEXT_PUBLIC_SUPABASE_URL | https://nwzoruewmarehspjkegs.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | (tumhara anon key) |
| NEXT_PUBLIC_SITE_URL | https://gyrus-sulcus.vercel.app |

## ===== IMAGES NEEDED =====

`public/` folder mein ye files chahiye:
- profile.jpg → Dharmendra Sir ka photo
- banner.jpg → Hero section background
- logo.jpg → GS logo

Ye existing project se copy karo.

## ===== DONE! =====

Website live hogi: https://gyrus-sulcus.vercel.app
All 10 upgrades working:
✅ P0: Dead links fixed (about, privacy pages)
✅ P0: Courses page (IPPON BATCH, LDC, Mains)
✅ P0: Notes/PDF download page
✅ P1: Login/Register button + page
✅ P1: Search bar in header
✅ P1: Lucide React icons (no emoji)
✅ P1: Article thumbnails
✅ P2: 5 nav items
✅ P2: White clean navbar
✅ P2: OG meta tags for WhatsApp/Telegram sharing
