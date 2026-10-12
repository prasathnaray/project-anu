-- OTP verification for newly created and re-enabled trainees/instructors.
ALTER TABLE public.user_data
  ADD COLUMN IF NOT EXISTS phone_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verification_required boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.account_verification_challenges (
  challenge_id bigserial PRIMARY KEY,
  user_email_lookup text NOT NULL,
  purpose text NOT NULL CHECK (purpose IN ('activation', 'reactivation')),
  otp_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempt_count integer NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS account_verification_challenges_lookup_idx
  ON public.account_verification_challenges (user_email_lookup, purpose, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS account_verification_challenges_active_uidx
  ON public.account_verification_challenges (user_email_lookup, purpose)
  WHERE consumed_at IS NULL;

-- Extend the legacy user status constraint for OTP-gated account lifecycle states.
ALTER TABLE public.user_data
  DROP CONSTRAINT IF EXISTS status_check;

ALTER TABLE public.user_data
  ADD CONSTRAINT status_check
  CHECK (status IN (
    'active',
    'inactive',
    'suspended',
    'disabled',
    'pending_verification',
    'pending_reverification'
  ));

