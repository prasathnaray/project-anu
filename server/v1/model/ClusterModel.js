const client = require('../utils/conn');
const { ROLES } = require('../Auth/authorization');

const ensureClusterTables = async () => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS public.clusters (
            cluster_id uuid PRIMARY KEY,
            cluster_name character varying(255) NOT NULL,
            fetal_presentation character varying(100),
            owner_scope text NOT NULL DEFAULT 'institution',
            owner_centre_id uuid NOT NULL,
            created_by character varying(100) NOT NULL,
            created_at timestamp without time zone NOT NULL DEFAULT now(),
            updated_at timestamp without time zone NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS public.cluster_volumes (
            cluster_id uuid NOT NULL REFERENCES public.clusters(cluster_id) ON DELETE CASCADE,
            volume_id uuid NOT NULL REFERENCES public.volumes(volume_id) ON DELETE CASCADE,
            PRIMARY KEY (cluster_id, volume_id)
        );
        CREATE INDEX IF NOT EXISTS idx_clusters_owner ON public.clusters(owner_scope, owner_centre_id);
        CREATE INDEX IF NOT EXISTS idx_cluster_volumes_volume ON public.cluster_volumes(volume_id);
    `);
};

const clusterReadScope = (requester, alias = 'c', parameterNumber = 1) => {
    if (Number(requester?.role) !== ROLES.INSTITUTION_ADMIN || !requester?.centre_id) return null;
    return {
        clause: `${alias}.owner_scope = 'institution' AND ${alias}.owner_centre_id = $${parameterNumber}`,
        params: [requester.centre_id]
    };
};

const clusterSelect = `
    SELECT c.cluster_id, c.cluster_name, c.fetal_presentation,
           c.owner_scope, c.owner_centre_id, c.created_by, c.created_at, c.updated_at,
           COALESCE(jsonb_agg(jsonb_build_object(
               'volume_id', v.volume_id,
               'volume_name', v.volume_name,
               'volume_type', v.volume_type,
               'volume_fetal_presentation', v.volume_fetal_presentation
           ) ORDER BY v.volume_name) FILTER (WHERE v.volume_id IS NOT NULL), '[]'::jsonb) AS volumes
    FROM public.clusters c
    LEFT JOIN public.cluster_volumes cv ON cv.cluster_id = c.cluster_id
    LEFT JOIN public.volumes v ON v.volume_id = cv.volume_id
`;

const getClustersModel = async (requester) => {
    const scope = clusterReadScope(requester);
    if (!scope) return { code: 403, message: 'Only Institution Admins can view cluster data.' };
    await ensureClusterTables();
    const result = await client.query(`${clusterSelect}
        WHERE ${scope.clause}
        GROUP BY c.cluster_id
        ORDER BY c.created_at DESC;`, scope.params);
    return { code: 200, data: result.rows };
};

const getClusterByIdModel = async (requester, clusterId) => {
    const scope = clusterReadScope(requester, 'c', 2);
    if (!scope) return { code: 403, message: 'Only Institution Admins can view cluster data.' };
    await ensureClusterTables();
    const result = await client.query(`${clusterSelect}
        WHERE c.cluster_id = $1 AND ${scope.clause}
        GROUP BY c.cluster_id;`, [clusterId, ...scope.params]);
    if (result.rows.length === 0) return { code: 404, message: 'Cluster not found.' };
    return { code: 200, data: result.rows[0] };
};

module.exports = { getClustersModel, getClusterByIdModel };
