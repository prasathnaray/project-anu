CREATE TABLE IF NOT EXISTS public.streaming_stages (
    centre_id uuid PRIMARY KEY REFERENCES public.scan_centers(center_id) ON DELETE CASCADE,
    stage_arn text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.streaming_trainee_stages (
    user_email varchar(100) PRIMARY KEY REFERENCES public.user_data(user_email) ON DELETE CASCADE,
    centre_id uuid NOT NULL REFERENCES public.scan_centers(center_id) ON DELETE CASCADE,
    stage_arn text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.streaming_publishers (
    user_email varchar(100) PRIMARY KEY REFERENCES public.user_data(user_email) ON DELETE CASCADE,
    centre_id uuid NOT NULL REFERENCES public.scan_centers(center_id) ON DELETE CASCADE,
    session_id uuid NOT NULL UNIQUE,
    participant_id text NOT NULL UNIQUE,
    started_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.streaming_publishers
    ADD COLUMN IF NOT EXISTS source_stage_arn text;

ALTER TABLE public.streaming_publishers
    ADD COLUMN IF NOT EXISTS activated_at timestamptz;

CREATE INDEX IF NOT EXISTS streaming_publishers_centre_idx
    ON public.streaming_publishers (centre_id, started_at DESC);

CREATE INDEX IF NOT EXISTS streaming_trainee_stages_centre_idx
    ON public.streaming_trainee_stages (centre_id);
