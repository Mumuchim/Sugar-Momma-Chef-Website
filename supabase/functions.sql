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
