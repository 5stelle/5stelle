-- Phase 12: Google Reviews Tracking
-- Run this in Supabase SQL Editor

-- 1. Create review_snapshots table
CREATE TABLE public.review_snapshots (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  fetched_at  timestamptz DEFAULT now() NOT NULL,
  rating      numeric(2,1),
  review_count integer,
  recent_reviews jsonb,
  is_baseline boolean DEFAULT false NOT NULL
);

-- 2. Index for efficient queries (latest snapshots per restaurant)
CREATE INDEX idx_review_snapshots_restaurant_date
  ON public.review_snapshots(restaurant_id, fetched_at DESC);

-- 3. Enable RLS
ALTER TABLE public.review_snapshots ENABLE ROW LEVEL SECURITY;

-- 4. Owner can read their own snapshots
CREATE POLICY "Owner can read own snapshots"
  ON public.review_snapshots
  FOR SELECT
  USING (
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
    )
  );

-- 5. Service role can insert (cron job + onboarding baseline)
-- No explicit policy needed — service_role bypasses RLS

-- 6. Grant permissions
GRANT ALL ON TABLE public.review_snapshots TO service_role;
GRANT SELECT ON TABLE public.review_snapshots TO authenticated;
