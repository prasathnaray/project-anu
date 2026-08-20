UPDATE public.volumes
SET approver_id = NULL
WHERE uploader_role = 99
  AND approver_id IS NOT NULL;

DO $$ BEGIN
    ALTER TABLE public.volumes
        ADD CONSTRAINT volumes_super_admin_has_no_approver_check
        CHECK (uploader_role IS DISTINCT FROM 99 OR approver_id IS NULL) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
