-- ============================================================
-- SUGAR MOMMA — Site Content Migration (idempotent)
-- Safe to run multiple times — won't error if already applied.
-- Run this in your Supabase SQL Editor AFTER the main schema.sql
-- ============================================================

-- ─── SITE CONTENT TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_content (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Drop policies before re-creating so this is safe to re-run
DROP POLICY IF EXISTS "Public can read site content"  ON public.site_content;
DROP POLICY IF EXISTS "Admins manage site content"    ON public.site_content;

CREATE POLICY "Public can read site content"
  ON public.site_content FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins manage site content"
  ON public.site_content FOR ALL
  USING (public.is_admin());

-- Trigger (drop first so re-runs don't error)
DROP TRIGGER IF EXISTS site_content_updated_at ON public.site_content;
CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── SEED DEFAULT CONTENT ────────────────────────────────────
-- ON CONFLICT DO NOTHING means existing edited values are preserved.

INSERT INTO public.site_content (key, value) VALUES
(
  'home_hero',
  '{
    "title_line1":     "Where Japanese",
    "title_line2":     "precision meets",
    "title_highlight": "sweetness.",
    "description":     "Custom catering orders, fresh baked goods, and intimate cooking classes — crafted with the discipline of fine dining."
  }'::jsonb
),
(
  'home_shop_teaser',
  '{
    "label":       "Order Online",
    "title":       "Fresh Baked",
    "title_line2": "Goods",
    "description": "Artisan pastries made to order — available per piece or in bundles. Choose pickup from Rizal or have them delivered to your door."
  }'::jsonb
),
(
  'about_chef',
  '{
    "name":             "Chef Regina Faustino",
    "role":             "Founder & Head Chef, Sugar Momma",
    "portrait_url":     "",
    "philosophy_quote": "A perfect pastry should taste like it came from someone who loves you. The technique is just the beginning.",
    "bio": [
      "Chef Regina Faustino grew up watching her grandmother make kakanin in a small kitchen in Bulacan — measuring nothing, wasting nothing, pouring everything into each piece. That memory became the foundation of everything she would later learn to do with precision.",
      "After graduating from Le Cordon Bleu in Paris with a Patisserie Diploma, she spent three formative years in Tokyo at Nihonbashi Yukari, a restaurant renowned for bridging Japanese kaiseki tradition with French technique. It was there she fell in love with the philosophy of kanso — simplicity as the highest form of refinement.",
      "Returning to Rizal as Executive Head Chef at ABCT Japanese Restaurant, she led the dessert program that earned the restaurant its first appearance in the Asia 50 Best extended list.",
      "Sugar Momma was Regina answer to a simpler question: what if the most exquisite pastry was not locked inside a fine-dining reservation?",
      "Today, Sugar Momma is more than a brand. It is a living archive of Regina journey — recipes she developed in Tokyo, techniques she refined in Paris, and flavors that have always been Filipino at heart."
    ]
  }'::jsonb
),
(
  'about_timeline',
  '[
    {"year": "2009", "title": "Le Cordon Bleu, Paris",                  "detail": "Graduated with Patisserie Grand Diplome"},
    {"year": "2010", "title": "Nihonbashi Yukari, Tokyo",               "detail": "3-year tenure under Chef Kimio Nonaga"},
    {"year": "2013", "title": "LAtelier de Joel Robuchon, Hong Kong",   "detail": "Stage program, dessert innovation"},
    {"year": "2015", "title": "ABCT Japanese Restaurant",               "detail": "Appointed Head Executive Head Chef"},
    {"year": "2019", "title": "Manila Bulletin",                        "detail": "Named Chef to Watch — Class of 2019"},
    {"year": "2021", "title": "Sugar Momma Founded",                    "detail": "Launched as an independent pastry brand"},
    {"year": "2023", "title": "Manila Bulletin",                        "detail": "Featured in The New Filipino Table cover story"}
  ]'::jsonb
),
(
  'about_press',
  '["Manila Bulletin", "Metro Magazine", "Lifestyle Asia", "Manila Times", "CNN Philippines"]'::jsonb
),
(
  'about_socials',
  '[
    {"label": "Instagram", "href": "https://instagram.com"},
    {"label": "Facebook",  "href": "https://facebook.com"},
    {"label": "YouTube",   "href": "https://youtube.com"}
  ]'::jsonb
),
(
  'classes_hero',
  '{
    "label":    "Learn the Craft",
    "title":    "Cooking Classes",
    "subtitle": "Small group sessions where technique meets creativity."
  }'::jsonb
),
(
  'classes_instructor',
  '{
    "name":      "Chef Regina Faustino",
    "photo_url": "",
    "bio":       "With over 12 years in Japanese fine-dining kitchens across Tokyo and Manila, Chef Regina brings the precision and artistry of Michelin-star pastry to intimate group classes designed for serious home cooks and aspiring Head Chefs.",
    "credentials": [
      "Le Cordon Bleu, Paris — Patisserie Diploma",
      "Nihonbashi Yukari, Tokyo — 3-year tenure",
      "ABCT Japanese Restaurant — Executive Head Chef",
      "Featured in Manila Bulletin 2023"
    ]
  }'::jsonb
),
(
  'home_chef',
  '{
    "photo_url":         "",
    "name":              "Chef Regina Faustino",
    "badge_role":        "Executive Head Chef",
    "section_label":     "The Woman Behind Sugar Momma",
    "heading":           "Crafted with",
    "heading_highlight": "passion & precision.",
    "bio_para1":         "Sugar Momma was born from Chef Regina dream of bringing the discipline of Japanese fine-dining pastry to every table in the Philippines. After over 12 years in Michelin-starred kitchens across Tokyo and Manila, she returned home to build something deeply personal — a place where technique and soul coexist.",
    "bio_para2":         "Every recipe, every class, every custom creation carries her signature: meticulous, heartfelt, and unmistakably Sugar Momma."
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- ─── STORAGE BUCKET: site-content ────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-content',
  'site-content',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Drop storage policies before re-creating
DROP POLICY IF EXISTS "Public read site-content"   ON storage.objects;
DROP POLICY IF EXISTS "Admin upload site-content"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update site-content"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete site-content"  ON storage.objects;

CREATE POLICY "Public read site-content"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-content');

CREATE POLICY "Admin upload site-content"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-content' AND public.is_admin());

CREATE POLICY "Admin update site-content"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-content' AND public.is_admin());

CREATE POLICY "Admin delete site-content"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-content' AND public.is_admin());
