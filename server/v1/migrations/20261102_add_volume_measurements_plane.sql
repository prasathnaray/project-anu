ALTER TABLE public.volumes
  ADD COLUMN IF NOT EXISTS measurements text,
  ADD COLUMN IF NOT EXISTS plane text;
