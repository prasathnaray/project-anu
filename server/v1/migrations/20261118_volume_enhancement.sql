ALTER TABLE public.volumes
  ADD COLUMN IF NOT EXISTS enhancement_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS enhancement_manifest text,
  ADD COLUMN IF NOT EXISTS enhancement_error text,
  ADD COLUMN IF NOT EXISTS enhancement_job_id text;

ALTER TABLE public.volumes
  ADD COLUMN IF NOT EXISTS animated_volume boolean NOT NULL DEFAULT false;

DO $$ BEGIN
  ALTER TABLE public.volumes
    ADD CONSTRAINT volumes_enhancement_status_check
    CHECK (enhancement_status IN ('pending', 'running', 'completed', 'failed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
