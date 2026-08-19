ALTER TABLE public.volumes
    ADD COLUMN IF NOT EXISTS uploader_role smallint;

UPDATE public.volumes v
SET uploader_role = CASE
    WHEN u.user_role IN ('99', '101', '102') THEN u.user_role::smallint
    ELSE NULL
END
FROM public.user_data u
WHERE u.user_email = v.added_by
  AND v.uploader_role IS NULL;

CREATE INDEX IF NOT EXISTS idx_volumes_private_access
    ON public.volumes(added_by, uploader_role, owner_centre_id);

DO $$ BEGIN
    ALTER TABLE public.volumes
        ADD CONSTRAINT volumes_uploader_role_check
        CHECK (uploader_role IS NULL OR uploader_role IN (99, 101, 102)) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
