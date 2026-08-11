CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.certification_data
    ADD COLUMN IF NOT EXISTS course_kind text,
    ADD COLUMN IF NOT EXISTS owner_scope text,
    ADD COLUMN IF NOT EXISTS owner_centre_id uuid,
    ADD COLUMN IF NOT EXISTS created_by text,
    ADD COLUMN IF NOT EXISTS publication_status text NOT NULL DEFAULT 'draft',
    ADD COLUMN IF NOT EXISTS visibility_mode text NOT NULL DEFAULT 'none',
    ADD COLUMN IF NOT EXISTS ownership_review_required boolean NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.volumes
    ADD COLUMN IF NOT EXISTS owner_scope text,
    ADD COLUMN IF NOT EXISTS owner_centre_id uuid,
    ADD COLUMN IF NOT EXISTS lifecycle_status text NOT NULL DEFAULT 'uploaded',
    ADD COLUMN IF NOT EXISTS ownership_review_required boolean NOT NULL DEFAULT true;

UPDATE public.volumes v
SET owner_scope = CASE WHEN u.user_role = '99' THEN 'super_admin' ELSE 'institution' END,
    owner_centre_id = CASE WHEN u.user_role = '99' THEN NULL ELSE u.centre_id END,
    ownership_review_required = CASE
        WHEN u.user_role = '99' THEN false
        WHEN u.user_role IN ('101', '102', '103') AND u.centre_id IS NOT NULL THEN false
        ELSE true
    END
FROM public.user_data u
WHERE u.user_email = v.added_by
  AND v.owner_scope IS NULL;

ALTER TABLE public.vol_recordings
    ADD COLUMN IF NOT EXISTS created_by text,
    ADD COLUMN IF NOT EXISTS validation_status text NOT NULL DEFAULT 'draft',
    ADD COLUMN IF NOT EXISTS validated_by text,
    ADD COLUMN IF NOT EXISTS validated_at timestamptz;

CREATE TABLE IF NOT EXISTS public.course_institution_access (
    course_id uuid NOT NULL REFERENCES public.certification_data(certificate_id) ON DELETE CASCADE,
    centre_id uuid NOT NULL REFERENCES public.scan_centers(center_id) ON DELETE CASCADE,
    granted_by text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (course_id, centre_id)
);

CREATE TABLE IF NOT EXISTS public.course_batch_assignments (
    course_id uuid NOT NULL REFERENCES public.certification_data(certificate_id) ON DELETE CASCADE,
    centre_id uuid NOT NULL REFERENCES public.scan_centers(center_id) ON DELETE CASCADE,
    batch_id varchar(20) NOT NULL,
    assigned_by text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (course_id, centre_id, batch_id)
);

CREATE TABLE IF NOT EXISTS public.course_trainee_overrides (
    course_id uuid NOT NULL REFERENCES public.certification_data(certificate_id) ON DELETE CASCADE,
    centre_id uuid NOT NULL REFERENCES public.scan_centers(center_id) ON DELETE CASCADE,
    trainee_id text NOT NULL,
    state text NOT NULL,
    assigned_by text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (course_id, centre_id, trainee_id),
    CONSTRAINT course_trainee_override_state_check CHECK (state IN ('assigned', 'excluded'))
);

CREATE TABLE IF NOT EXISTS public.course_content_links (
    link_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL REFERENCES public.certification_data(certificate_id) ON DELETE CASCADE,
    resource_id uuid,
    volume_id uuid NOT NULL REFERENCES public.volumes(volume_id),
    shadow_recording_id uuid,
    step_recording_id uuid,
    created_by text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (course_id, resource_id, volume_id, shadow_recording_id, step_recording_id)
);

CREATE TABLE IF NOT EXISTS public.course_mapping_migrations (
    mapping_id uuid PRIMARY KEY,
    course_id uuid NOT NULL REFERENCES public.certification_data(certificate_id) ON DELETE CASCADE,
    migrated_by text NOT NULL,
    migrated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tenant_access_audit (
    audit_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email text NOT NULL,
    actor_role text NOT NULL,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id text,
    target_centre_id uuid,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_certification_owner
    ON public.certification_data(owner_scope, owner_centre_id);
CREATE INDEX IF NOT EXISTS idx_certification_publication
    ON public.certification_data(publication_status, course_kind, visibility_mode);
CREATE INDEX IF NOT EXISTS idx_volumes_owner
    ON public.volumes(owner_scope, owner_centre_id);
CREATE INDEX IF NOT EXISTS idx_course_institution_access_centre
    ON public.course_institution_access(centre_id, course_id);
CREATE INDEX IF NOT EXISTS idx_course_batch_assignments_batch
    ON public.course_batch_assignments(centre_id, batch_id, course_id);
CREATE INDEX IF NOT EXISTS idx_course_trainee_overrides_trainee
    ON public.course_trainee_overrides(centre_id, trainee_id, course_id);
CREATE INDEX IF NOT EXISTS idx_course_content_links_course
    ON public.course_content_links(course_id);

DO $$ BEGIN
    ALTER TABLE public.certification_data
        ADD CONSTRAINT certification_course_kind_check
        CHECK (course_kind IS NULL OR course_kind IN ('core', 'specialized', 'institution')) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.certification_data
        ADD CONSTRAINT certification_owner_scope_check
        CHECK (owner_scope IS NULL OR owner_scope IN ('super_admin', 'institution')) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.certification_data
        ADD CONSTRAINT certification_publication_status_check
        CHECK (publication_status IN ('draft', 'published', 'archived')) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.certification_data
        ADD CONSTRAINT certification_visibility_mode_check
        CHECK (visibility_mode IN ('none', 'all', 'selected')) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.volumes
        ADD CONSTRAINT volumes_owner_scope_check
        CHECK (owner_scope IS NULL OR owner_scope IN ('super_admin', 'institution')) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.vol_recordings
        ADD CONSTRAINT recording_validation_status_check
        CHECK (validation_status IN ('draft', 'validated', 'rejected')) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.certification_data
        ADD CONSTRAINT certification_owner_consistency_check
        CHECK (
            owner_scope IS NULL
            OR (owner_scope = 'super_admin' AND owner_centre_id IS NULL AND course_kind IN ('core', 'specialized'))
            OR (owner_scope = 'institution' AND owner_centre_id IS NOT NULL AND course_kind = 'institution')
        ) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.volumes
        ADD CONSTRAINT volumes_owner_consistency_check
        CHECK (
            owner_scope IS NULL
            OR (owner_scope = 'super_admin' AND owner_centre_id IS NULL)
            OR (owner_scope = 'institution' AND owner_centre_id IS NOT NULL)
        ) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.user_data
        ADD CONSTRAINT user_institution_scope_check
        CHECK (
            user_role NOT IN ('99', '101', '102', '103')
            OR (user_role = '99' AND centre_id IS NULL)
            OR (user_role IN ('101', '102', '103') AND centre_id IS NOT NULL)
        ) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.certification_data
        ADD CONSTRAINT certification_owner_centre_fk
        FOREIGN KEY (owner_centre_id) REFERENCES public.scan_centers(center_id) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.volumes
        ADD CONSTRAINT volumes_owner_centre_fk
        FOREIGN KEY (owner_centre_id) REFERENCES public.scan_centers(center_id) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
