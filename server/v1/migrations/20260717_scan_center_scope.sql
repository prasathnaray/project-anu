CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.scan_centers (
    center_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    center_name text NOT NULL,
    center_email text NOT NULL UNIQUE,
    center_phone text NOT NULL,
    center_address text NOT NULL,
    admin_user_email text NOT NULL,
    status text NOT NULL DEFAULT 'Pending',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_data
    ADD COLUMN IF NOT EXISTS centre_id uuid,
    ADD COLUMN IF NOT EXISTS center_name text;

ALTER TABLE public.batch_data
    ADD COLUMN IF NOT EXISTS centre_id uuid;

CREATE INDEX IF NOT EXISTS idx_user_data_centre_id
    ON public.user_data (centre_id);

CREATE INDEX IF NOT EXISTS idx_user_data_centre_role
    ON public.user_data (centre_id, user_role);

CREATE INDEX IF NOT EXISTS idx_batch_data_centre_id
    ON public.batch_data (centre_id);

CREATE INDEX IF NOT EXISTS idx_scan_centers_admin_user_email
    ON public.scan_centers (admin_user_email);
