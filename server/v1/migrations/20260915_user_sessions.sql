CREATE TABLE IF NOT EXISTS public.user_sessions (
    id uuid PRIMARY KEY,
    user_email varchar(100) NOT NULL,
    role varchar(20) NOT NULL,
    centre_id uuid,
    device varchar(40) NOT NULL DEFAULT 'browser',
    os varchar(40) NOT NULL DEFAULT 'Unknown',
    login_source varchar(40) NOT NULL DEFAULT 'Normal Browser',
    ip_address inet,
    logged_in_at timestamptz NOT NULL DEFAULT now(),
    last_seen_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz
);

CREATE INDEX IF NOT EXISTS user_sessions_user_history_idx
    ON public.user_sessions (user_email, logged_in_at DESC);
CREATE INDEX IF NOT EXISTS user_sessions_centre_history_idx
    ON public.user_sessions (centre_id, logged_in_at DESC);
