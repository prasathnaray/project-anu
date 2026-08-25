CREATE TABLE IF NOT EXISTS public.course_mapping (
    mapping_id uuid PRIMARY KEY,
    trimester character varying(50) NOT NULL,
    anatomy_type character varying(100) NOT NULL,
    volume_id uuid NOT NULL,
    volume_name character varying(255) NOT NULL,
    course_name character varying(255) NULL,
    description text NULL,
    doctor_name character varying(255) NULL,
    module_name character varying(100) NOT NULL,
    course_type character varying(50) NOT NULL,
    shadow_recording_id uuid NULL,
    step_recording_id uuid NULL,
    created_by character varying(100) NOT NULL,
    owner_scope text NULL,
    owner_centre_id uuid NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.course_mapping
    ADD COLUMN IF NOT EXISTS owner_scope text,
    ADD COLUMN IF NOT EXISTS owner_centre_id uuid;

UPDATE public.course_mapping cm
SET owner_scope = CASE
        WHEN u.user_role = '99' THEN 'super_admin'
        ELSE 'institution'
    END,
    owner_centre_id = CASE
        WHEN u.user_role = '99' THEN NULL
        ELSE u.centre_id
    END
FROM public.user_data u
WHERE u.user_email = cm.created_by
  AND cm.owner_scope IS NULL;

CREATE INDEX IF NOT EXISTS idx_course_mapping_owner
    ON public.course_mapping(owner_scope, owner_centre_id);

DO $$ BEGIN
    ALTER TABLE public.course_mapping
        ADD CONSTRAINT course_mapping_owner_required_check
        CHECK (owner_scope IS NOT NULL) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.course_mapping
        ADD CONSTRAINT course_mapping_owner_scope_check
        CHECK (owner_scope IS NULL OR owner_scope IN ('super_admin', 'institution')) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.course_mapping
        ADD CONSTRAINT course_mapping_owner_consistency_check
        CHECK (
            owner_scope IS NULL
            OR (owner_scope = 'super_admin' AND owner_centre_id IS NULL)
            OR (owner_scope = 'institution' AND owner_centre_id IS NOT NULL)
        ) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.course_mapping
        ADD CONSTRAINT course_mapping_owner_centre_fk
        FOREIGN KEY (owner_centre_id) REFERENCES public.scan_centers(center_id) NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
