ALTER TABLE public.clusters
  ADD COLUMN IF NOT EXISTS planes jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS measurements jsonb NOT NULL DEFAULT '[]'::jsonb;
