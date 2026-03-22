-- =====================================================
-- GYRUS SULCUS — Supabase Tables Setup
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. NOTES TABLE (for PDF downloads page)
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL, -- POLITY, HISTORY, ECONOMY, GEOGRAPHY, SCIENCE
  file_url TEXT NOT NULL,
  file_size TEXT DEFAULT '0 MB',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Notes are viewable by everyone"
  ON notes FOR SELECT
  USING (true);

-- Insert sample data
INSERT INTO notes (title, subject, file_url, file_size) VALUES
  ('Indian Polity Highlights', 'POLITY', 'https://nwzoruewmarehspjkegs.supabase.co/storage/v1/object/public/notes/polity-highlights.pdf', '2.4 MB'),
  ('Modern History Compilation', 'HISTORY', 'https://nwzoruewmarehspjkegs.supabase.co/storage/v1/object/public/notes/modern-history.pdf', '5.1 MB'),
  ('Economy Budget Survey 2024', 'ECONOMY', 'https://nwzoruewmarehspjkegs.supabase.co/storage/v1/object/public/notes/economy-budget.pdf', '3.8 MB'),
  ('Geography Maps Guide', 'GEOGRAPHY', 'https://nwzoruewmarehspjkegs.supabase.co/storage/v1/object/public/notes/geography-maps.pdf', '8.2 MB'),
  ('Science & Tech Current Affairs 2026', 'SCIENCE', 'https://nwzoruewmarehspjkegs.supabase.co/storage/v1/object/public/notes/science-current.pdf', '4.5 MB'),
  ('Nuclear Physics Series (A-M)', 'SCIENCE', 'https://nwzoruewmarehspjkegs.supabase.co/storage/v1/object/public/notes/nuclear-physics.pdf', '6.7 MB');


-- 2. COURSES TABLE (for Premium Courses page)
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  price INTEGER DEFAULT 0,
  is_bestseller BOOLEAN DEFAULT false,
  enrollment_url TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (is_active = true);

-- Insert IPPON BATCH + LDC + Mains
INSERT INTO courses (title, description, features, is_bestseller, enrollment_url) VALUES
  (
    'IPPON BATCH 2026 — IAS Prelims S&T',
    'UPSC Prelims के लिए विज्ञान एवं प्रौद्योगिकी का सम्पूर्ण कोर्स। PYQ analysis, daily MCQs, और current affairs integration के साथ।',
    ARRAY['Live & Recorded Classes', 'Weekly Doubt Solving', 'Full Study Material PDF', 'Telegram Group Access', 'PYQ Pattern Analysis'],
    true,
    'https://t.me/gyrussulcus'
  ),
  (
    'LDC Science Special 2026',
    'LDC परीक्षा के लिए विज्ञान का विशेष बैच। सरल भाषा में, परीक्षा-केंद्रित approach के साथ।',
    ARRAY['Live & Recorded Classes', 'Weekly Doubt Solving', 'Full Study Material PDF', 'Practice Tests', 'Bilingual Content'],
    false,
    'https://t.me/gyrussulcus'
  ),
  (
    'Mains Answer Writing Practice',
    'UPSC Mains के लिए उत्तर लेखन अभ्यास। Daily feedback, model answers, और structured approach।',
    ARRAY['Live & Recorded Classes', 'Weekly Doubt Solving', 'Full Study Material PDF', 'Personal Feedback', 'Model Answers'],
    false,
    'https://t.me/gyrussulcus'
  );


-- 3. ADD image_url COLUMN TO articles (if missing)
-- This enables thumbnail images on article cards
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE articles ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- 4. ADD excerpt COLUMN TO articles (if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'excerpt'
  ) THEN
    ALTER TABLE articles ADD COLUMN excerpt TEXT;
  END IF;
END $$;


-- 5. Create storage bucket for notes PDFs (optional)
-- Go to Supabase Dashboard → Storage → Create bucket "notes" → Make it public


-- =====================================================
-- VERIFICATION: Run after executing above
-- =====================================================
-- SELECT * FROM notes;
-- SELECT * FROM courses;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'articles';
