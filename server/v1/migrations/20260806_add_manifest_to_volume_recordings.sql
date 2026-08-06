ALTER TABLE public.vol_recordings
    ADD COLUMN IF NOT EXISTS manifest_file text;
