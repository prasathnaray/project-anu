CREATE TABLE IF NOT EXISTS public.clusters (
    cluster_id varchar(100) PRIMARY KEY,
    cluster_name character varying(255) NOT NULL,
    fetal_presentation character varying(100),
    owner_scope text NOT NULL DEFAULT 'institution',
    owner_centre_id uuid,
    created_by character varying(100) NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluster_volumes (
    cluster_id varchar(100) NOT NULL REFERENCES public.clusters(cluster_id) ON DELETE CASCADE,
    volume_id uuid NOT NULL REFERENCES public.volumes(volume_id) ON DELETE CASCADE,
    PRIMARY KEY (cluster_id, volume_id)
);

CREATE INDEX IF NOT EXISTS idx_clusters_owner ON public.clusters(owner_scope, owner_centre_id);
CREATE INDEX IF NOT EXISTS idx_cluster_volumes_volume ON public.cluster_volumes(volume_id);

