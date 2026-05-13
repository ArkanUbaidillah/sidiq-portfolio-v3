-- ============================================
--  PORTFOLIO MUHAMAD SIDIQ — SUPABASE SCHEMA
-- ============================================

-- 1. COURSES (Mata Kuliah)
CREATE TABLE IF NOT EXISTS public.courses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. LAB REPORTS (Laporan Praktikum dengan blok JSONB)
CREATE TABLE IF NOT EXISTS public.lab_reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL,
  week_number INTEGER NOT NULL DEFAULT 1,
  blocks      JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, slug)
);

-- 3. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  tech_stack    TEXT[] DEFAULT '{}',
  github_url    TEXT,
  live_url      TEXT,
  thumbnail_url TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 4. CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  issuer         TEXT NOT NULL,
  issued_date    DATE,
  credential_url TEXT,
  image_url      TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- Ensure existing databases created from older schema versions get this column too.
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS issued_date DATE;

-- ============================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.courses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates   ENABLE ROW LEVEL SECURITY;

-- ---- COURSES ----
-- Public: read only
CREATE POLICY "courses_public_read" ON public.courses
  FOR SELECT USING (true);

-- Authenticated (admin): full CRUD
CREATE POLICY "courses_admin_all" ON public.courses
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ---- LAB REPORTS ----
CREATE POLICY "reports_public_read" ON public.lab_reports
  FOR SELECT USING (true);

CREATE POLICY "reports_admin_all" ON public.lab_reports
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ---- PROJECTS ----
CREATE POLICY "projects_public_read" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "projects_admin_all" ON public.projects
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ---- CERTIFICATES ----
CREATE POLICY "certificates_public_read" ON public.certificates
  FOR SELECT USING (true);

CREATE POLICY "certificates_admin_all" ON public.certificates
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
--  STORAGE BUCKET untuk upload gambar
-- ============================================
-- Jalankan ini setelah membuat bucket 'images' di Supabase Dashboard > Storage

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('images', 'images', true)
-- ON CONFLICT DO NOTHING;

-- CREATE POLICY "images_public_read" ON storage.objects
--   FOR SELECT USING (bucket_id = 'images');

-- CREATE POLICY "images_admin_upload" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- CREATE POLICY "images_admin_delete" ON storage.objects
--   FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- ============================================
--  INDEX untuk performa
-- ============================================
CREATE INDEX IF NOT EXISTS idx_lab_reports_course_id ON public.lab_reports(course_id);
CREATE INDEX IF NOT EXISTS idx_lab_reports_slug ON public.lab_reports(slug);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
