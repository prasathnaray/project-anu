ALTER TABLE public.vol_recordings
    ADD COLUMN IF NOT EXISTS image_files jsonb NOT NULL DEFAULT '[]'::jsonb;
