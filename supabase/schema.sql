-- ============================================================
-- SUGAR MOMMA — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES (extends Supabase auth.users) ─────────────────
CREATE TABLE public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  is_admin    BOOLEAN DEFAULT FALSE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── NEWSLETTER SUBSCRIBERS ──────────────────────────────────
CREATE TABLE public.newsletter_subscribers (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── RECIPES ─────────────────────────────────────────────────
CREATE TABLE public.recipes (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  subtitle        TEXT,
  story           TEXT,                          -- Rich narrative / intro text
  banner_url      TEXT,                          -- Supabase Storage URL
  thumbnail_url   TEXT,
  video_url       TEXT,                          -- YouTube/Vimeo embed URL
  category        TEXT NOT NULL DEFAULT 'pastry',
  difficulty      TEXT CHECK (difficulty IN ('beginner','intermediate','advanced')) DEFAULT 'intermediate',
  prep_time_mins  INTEGER,
  cook_time_mins  INTEGER,
  total_time_mins INTEGER GENERATED ALWAYS AS (COALESCE(prep_time_mins,0) + COALESCE(cook_time_mins,0)) STORED,
  base_servings   INTEGER DEFAULT 4,
  is_published    BOOLEAN DEFAULT FALSE NOT NULL,
  is_premium      BOOLEAN DEFAULT FALSE NOT NULL,
  collection_id   UUID,                          -- FK set after collections table
  meta_keywords   TEXT[],
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── INGREDIENTS ─────────────────────────────────────────────
CREATE TABLE public.ingredients (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipe_id   UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  quantity    NUMERIC,
  unit        TEXT,
  name        TEXT NOT NULL,
  notes       TEXT
);

-- ─── INSTRUCTIONS ────────────────────────────────────────────
CREATE TABLE public.instructions (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipe_id   UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  step_number INTEGER NOT NULL,
  body        TEXT NOT NULL,
  photo_url   TEXT                               -- Supabase Storage URL
);

-- ─── COLLECTIONS (Premium locked groups) ─────────────────────
CREATE TABLE public.collections (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  tagline       TEXT,
  description   TEXT,
  cover_url     TEXT,
  price_php     NUMERIC(10,2) NOT NULL,
  is_published  BOOLEAN DEFAULT FALSE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Now we can add the FK from recipes → collections
ALTER TABLE public.recipes
  ADD CONSTRAINT fk_recipe_collection
  FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE SET NULL;

-- ─── USER COLLECTION ACCESS (granted after payment) ──────────
CREATE TABLE public.user_collection_access (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  granted_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  payment_ref   TEXT,                            -- PayMongo payment intent ID
  UNIQUE(user_id, collection_id)
);

-- ─── ORDERS (Custom Pastry Orders) ───────────────────────────
CREATE TABLE public.orders (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name     TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  customer_phone    TEXT,
  occasion          TEXT,
  event_date        DATE,
  notes             TEXT,
  status            TEXT CHECK (status IN ('pending','deposit_paid','in_progress','ready','completed','cancelled')) DEFAULT 'pending',
  deposit_amount    NUMERIC(10,2),
  total_amount      NUMERIC(10,2),
  paymongo_ref      TEXT,
  paymongo_checkout_url TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── COOKING CLASSES ─────────────────────────────────────────
CREATE TABLE public.classes (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  cover_url       TEXT,
  level           TEXT CHECK (level IN ('beginner','intermediate','advanced','all')) DEFAULT 'all',
  schedule_date   TIMESTAMPTZ NOT NULL,
  duration_hours  NUMERIC(4,1),
  location        TEXT,
  is_online       BOOLEAN DEFAULT FALSE,
  meeting_link    TEXT,
  price_php       NUMERIC(10,2) NOT NULL,
  total_slots     INTEGER NOT NULL DEFAULT 10,
  booked_slots    INTEGER NOT NULL DEFAULT 0,
  is_published    BOOLEAN DEFAULT FALSE NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── CLASS BOOKINGS ──────────────────────────────────────────
CREATE TABLE public.class_bookings (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_id         UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT,
  status           TEXT CHECK (status IN ('pending','paid','cancelled')) DEFAULT 'pending',
  paymongo_ref     TEXT,
  paymongo_checkout_url TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── CONTACT MESSAGES ────────────────────────────────────────
CREATE TABLE public.contact_messages (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE public.profiles                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructions              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_collection_access    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_bookings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers    ENABLE ROW LEVEL SECURITY;

-- ─── HELPER: is_admin() function ─────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
$$;

-- ─── PROFILES ────────────────────────────────────────────────
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL USING (public.is_admin());

-- ─── RECIPES — PUBLIC posts are readable by everyone ─────────
CREATE POLICY "Anyone can read published non-premium recipes"
  ON public.recipes FOR SELECT
  USING (is_published = TRUE AND is_premium = FALSE);

CREATE POLICY "Users with collection access can read premium recipes"
  ON public.recipes FOR SELECT
  USING (
    is_published = TRUE AND is_premium = TRUE AND (
      public.is_admin() OR
      EXISTS (
        SELECT 1 FROM public.user_collection_access uca
        WHERE uca.user_id = auth.uid()
          AND uca.collection_id = recipes.collection_id
      )
    )
  );

CREATE POLICY "Admins have full recipe access"
  ON public.recipes FOR ALL USING (public.is_admin());

-- ─── INGREDIENTS ─────────────────────────────────────────────
CREATE POLICY "Ingredients visible with recipe access"
  ON public.ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.recipes r
      WHERE r.id = ingredients.recipe_id
        AND r.is_published = TRUE
        AND (
          r.is_premium = FALSE OR
          public.is_admin() OR
          EXISTS (
            SELECT 1 FROM public.user_collection_access uca
            WHERE uca.user_id = auth.uid()
              AND uca.collection_id = r.collection_id
          )
        )
    )
  );

CREATE POLICY "Admins manage ingredients"
  ON public.ingredients FOR ALL USING (public.is_admin());

-- ─── INSTRUCTIONS ────────────────────────────────────────────
CREATE POLICY "Instructions visible with recipe access"
  ON public.instructions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.recipes r
      WHERE r.id = instructions.recipe_id
        AND r.is_published = TRUE
        AND (
          r.is_premium = FALSE OR
          public.is_admin() OR
          EXISTS (
            SELECT 1 FROM public.user_collection_access uca
            WHERE uca.user_id = auth.uid()
              AND uca.collection_id = r.collection_id
          )
        )
    )
  );

CREATE POLICY "Admins manage instructions"
  ON public.instructions FOR ALL USING (public.is_admin());

-- ─── COLLECTIONS ─────────────────────────────────────────────
CREATE POLICY "Anyone can view published collections metadata"
  ON public.collections FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins manage collections"
  ON public.collections FOR ALL USING (public.is_admin());

-- ─── USER COLLECTION ACCESS ──────────────────────────────────
CREATE POLICY "Users can view their own access"
  ON public.user_collection_access FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all access"
  ON public.user_collection_access FOR ALL USING (public.is_admin());

-- ─── ORDERS ──────────────────────────────────────────────────
CREATE POLICY "Anyone can insert an order"
  ON public.orders FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins manage all orders"
  ON public.orders FOR ALL USING (public.is_admin());

-- ─── CLASSES ─────────────────────────────────────────────────
CREATE POLICY "Anyone can view published classes"
  ON public.classes FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins manage classes"
  ON public.classes FOR ALL USING (public.is_admin());

-- ─── CLASS BOOKINGS ──────────────────────────────────────────
CREATE POLICY "Anyone can insert a booking"
  ON public.class_bookings FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can view their own bookings"
  ON public.class_bookings FOR SELECT
  USING (auth.uid() = user_id OR customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins manage all bookings"
  ON public.class_bookings FOR ALL USING (public.is_admin());

-- ─── CONTACT MESSAGES ────────────────────────────────────────
CREATE POLICY "Anyone can send a message"
  ON public.contact_messages FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins manage messages"
  ON public.contact_messages FOR ALL USING (public.is_admin());

-- ─── NEWSLETTER ──────────────────────────────────────────────
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins manage subscribers"
  ON public.newsletter_subscribers FOR ALL USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════
-- TRIGGERS & FUNCTIONS
-- ═══════════════════════════════════════════════════════════

-- Auto-create profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER recipes_updated_at BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER collections_updated_at BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════════════════════
-- STORAGE BUCKETS (Run in Dashboard > Storage OR SQL)
-- ═══════════════════════════════════════════════════════════

-- Create buckets via Dashboard > Storage > New Bucket:
--   Name: recipe-media    | Public: YES
--   Name: collection-covers | Public: YES
--   Name: class-covers    | Public: YES
--   Name: step-photos     | Public: YES

-- OR run these SQL statements:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('recipe-media',       'recipe-media',       true, 52428800, ARRAY['image/jpeg','image/png','image/webp','video/mp4']),
  ('collection-covers',  'collection-covers',  true, 10485760, ARRAY['image/jpeg','image/png','image/webp']),
  ('class-covers',       'class-covers',       true, 10485760, ARRAY['image/jpeg','image/png','image/webp']),
  ('step-photos',        'step-photos',        true, 10485760, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: anyone can read, only admins can upload
CREATE POLICY "Public read recipe-media"
  ON storage.objects FOR SELECT USING (bucket_id = 'recipe-media');
CREATE POLICY "Admin upload recipe-media"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'recipe-media' AND public.is_admin());
CREATE POLICY "Admin delete recipe-media"
  ON storage.objects FOR DELETE USING (bucket_id = 'recipe-media' AND public.is_admin());

CREATE POLICY "Public read collection-covers"
  ON storage.objects FOR SELECT USING (bucket_id = 'collection-covers');
CREATE POLICY "Admin upload collection-covers"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'collection-covers' AND public.is_admin());

CREATE POLICY "Public read class-covers"
  ON storage.objects FOR SELECT USING (bucket_id = 'class-covers');
CREATE POLICY "Admin upload class-covers"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'class-covers' AND public.is_admin());

CREATE POLICY "Public read step-photos"
  ON storage.objects FOR SELECT USING (bucket_id = 'step-photos');
CREATE POLICY "Admin upload step-photos"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'step-photos' AND public.is_admin());
