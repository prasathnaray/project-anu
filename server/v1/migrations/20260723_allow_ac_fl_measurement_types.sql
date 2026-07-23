BEGIN;

ALTER TABLE public.measurements
  DROP CONSTRAINT IF EXISTS measurements_measurement_type_check;

ALTER TABLE public.measurements
  ADD CONSTRAINT measurements_measurement_type_check
  CHECK (measurement_type IN ('BPD', 'HC', 'AC', 'FL'));

COMMIT;
