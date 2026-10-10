-- Test/staging migration for AES-256-GCM companion fields.
-- Do not replace the existing columns until application reads are migrated.
ALTER TABLE public.user_data
  ADD COLUMN IF NOT EXISTS user_name_enc text,
  ADD COLUMN IF NOT EXISTS user_email_enc text,
  ADD COLUMN IF NOT EXISTS user_contact_num_enc text,
  ADD COLUMN IF NOT EXISTS user_email_lookup text;

CREATE UNIQUE INDEX IF NOT EXISTS user_data_email_lookup_uidx
  ON public.user_data (user_email_lookup)
  WHERE user_email_lookup IS NOT NULL;
