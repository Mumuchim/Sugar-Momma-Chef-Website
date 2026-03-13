-- Run this in Supabase SQL Editor after schema.sql
-- Atomic slot increment used by the webhook handler

CREATE OR REPLACE FUNCTION public.increment_booked_slots(class_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.classes
  SET booked_slots = booked_slots + 1
  WHERE id = class_id
    AND booked_slots < total_slots;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- Atomic class booking
-- Checks capacity and inserts the booking in a single transaction to prevent
-- the race condition where two concurrent requests both pass the slot check.
-- Returns: {ok BOOLEAN, booking_id UUID, error_code TEXT}
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.atomic_book_class(
  p_class_id       UUID,
  p_customer_name  TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_class       RECORD;
  v_booking_id  UUID;
BEGIN
  -- Lock the class row for the duration of this transaction
  SELECT id, total_slots, booked_slots, is_published
    INTO v_class
    FROM public.classes
   WHERE id = p_class_id
     FOR UPDATE;

  IF NOT FOUND OR NOT v_class.is_published THEN
    RETURN jsonb_build_object('ok', false, 'error_code', 'NOT_FOUND');
  END IF;

  IF v_class.booked_slots >= v_class.total_slots THEN
    RETURN jsonb_build_object('ok', false, 'error_code', 'FULLY_BOOKED');
  END IF;

  -- Insert the booking
  INSERT INTO public.class_bookings (class_id, customer_name, customer_email, customer_phone, status)
  VALUES (p_class_id, p_customer_name, p_customer_email, p_customer_phone, 'pending')
  RETURNING id INTO v_booking_id;

  RETURN jsonb_build_object('ok', true, 'booking_id', v_booking_id);
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: add quantity + lookup_token to existing shop_orders table
-- Run this if the table already exists (i.e. you already ran schema.sql).
-- Skip if you're doing a fresh install — the columns are already in schema.sql.
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.shop_orders
  ADD COLUMN IF NOT EXISTS quantity     INT  DEFAULT 1 NOT NULL CHECK (quantity >= 1),
  ADD COLUMN IF NOT EXISTS lookup_token UUID DEFAULT uuid_generate_v4() NOT NULL;

-- Back-fill lookup_token for any rows that existed before the migration
UPDATE public.shop_orders SET lookup_token = uuid_generate_v4() WHERE lookup_token IS NULL;

-- Unique constraint + indexes
ALTER TABLE public.shop_orders ADD CONSTRAINT shop_orders_lookup_token_unique UNIQUE (lookup_token);
CREATE INDEX IF NOT EXISTS idx_shop_orders_lookup_token ON public.shop_orders (lookup_token);
