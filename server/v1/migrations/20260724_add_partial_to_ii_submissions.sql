BEGIN;

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS partial numeric(2, 1);

ALTER TABLE public.submissions
  ALTER COLUMN is_correct DROP NOT NULL;

ALTER TABLE public.submissions
  DROP CONSTRAINT IF EXISTS submissions_partial_check;

ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_partial_check
  CHECK (partial IS NULL OR partial IN (0, 0.5, 1));

COMMIT;
