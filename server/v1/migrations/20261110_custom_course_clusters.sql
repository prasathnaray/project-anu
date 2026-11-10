-- Custom courses belong to a cluster and may span multiple volumes.
ALTER TABLE public.course_mapping
    ADD COLUMN IF NOT EXISTS cluster_id varchar(100);

ALTER TABLE public.course_mapping
    ALTER COLUMN volume_id DROP NOT NULL,
    ALTER COLUMN volume_name DROP NOT NULL,
    ALTER COLUMN trimester DROP NOT NULL,
    ALTER COLUMN anatomy_type DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_course_mapping_cluster_id
    ON public.course_mapping(cluster_id);

CREATE TABLE IF NOT EXISTS public.course_mapping_placements (
    mapping_id uuid PRIMARY KEY REFERENCES public.course_mapping(mapping_id) ON DELETE CASCADE,
    centre_id uuid NOT NULL,
    certificate_name varchar(100) NOT NULL,
    unit_name varchar(100) NOT NULL,
    tagged_by varchar(100) NOT NULL,
    tagged_at timestamp without time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.course_mapping_placements
    DROP COLUMN IF EXISTS section_name;

CREATE INDEX IF NOT EXISTS idx_course_mapping_placements_centre
    ON public.course_mapping_placements(centre_id, certificate_name, unit_name);
