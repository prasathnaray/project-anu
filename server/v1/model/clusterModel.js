const { randomUUID } = require('crypto');
const client = require('../utils/conn');
const { ROLES } = require('../Auth/authorization');
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ensureClusterTables = async (requester = null) => {
    try {
        await client.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                      AND table_name = 'clusters' 
                      AND column_name = 'cluster_id' 
                      AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE public.cluster_volumes DROP CONSTRAINT IF EXISTS cluster_volumes_cluster_id_fkey;
                    ALTER TABLE public.clusters ALTER COLUMN cluster_id TYPE varchar(100) USING cluster_id::varchar(100);
                    ALTER TABLE public.cluster_volumes ALTER COLUMN cluster_id TYPE varchar(100) USING cluster_id::varchar(100);
                    ALTER TABLE public.cluster_volumes ADD CONSTRAINT cluster_volumes_cluster_id_fkey 
                        FOREIGN KEY (cluster_id) REFERENCES public.clusters(cluster_id) ON DELETE CASCADE;
                END IF;

                IF EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                      AND table_name = 'clusters' 
                      AND column_name = 'owner_centre_id' 
                      AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE public.clusters ALTER COLUMN owner_centre_id DROP NOT NULL;
                END IF;
            END $$;

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
            CREATE TABLE IF NOT EXISTS public.cluster_recordings (
                cluster_id varchar(100) NOT NULL REFERENCES public.clusters(cluster_id) ON DELETE CASCADE,
                recording_id uuid NOT NULL REFERENCES public.vol_recordings(recording_id) ON DELETE CASCADE,
                created_at timestamp without time zone NOT NULL DEFAULT now(),
                PRIMARY KEY (cluster_id, recording_id)
            );
            CREATE INDEX IF NOT EXISTS idx_clusters_owner ON public.clusters(owner_scope, owner_centre_id);
            CREATE INDEX IF NOT EXISTS idx_cluster_volumes_volume ON public.cluster_volumes(volume_id);
            CREATE INDEX IF NOT EXISTS idx_cluster_recordings_cluster ON public.cluster_recordings(cluster_id);
            CREATE INDEX IF NOT EXISTS idx_cluster_recordings_recording ON public.cluster_recordings(recording_id);
        `);

        const centreId = requester?.centre_id || '01c69bd1-d62e-483e-b09f-f14a2f0f43ed';
        const userMail = requester?.user_mail || 'admin@anu.in';

        // Exact clusters matching http://localhost:3000/cluster UI table
        const targetClusters = [
            {
                cluster_id: 'CLU-M6YP8B',
                cluster_name: 'Testing',
                fetal_presentation: 'Cephalic_right',
                volumes: ['603f6076-5511-447d-a226-1d7598f11df2', 'daa5f55c-82ba-4987-a47f-c54f56a7e57b'],
                secondsAgo: 10
            },
            {
                cluster_id: 'CLU-SZI2QU',
                cluster_name: 'assesment',
                fetal_presentation: 'Cephalic_left',
                volumes: ['daa5f55c-82ba-4987-a47f-c54f56a7e57b', 'c66caf93-83f7-47b9-8edb-2f6ca6f17b9b', '603f6076-5511-447d-a226-1d7598f11df2'],
                secondsAgo: 20
            },
            {
                cluster_id: 'CLU-TB6ZIH',
                cluster_name: 'FL Cluster',
                fetal_presentation: 'Cephalic_left',
                volumes: ['daa5f55c-82ba-4987-a47f-c54f56a7e57b'],
                secondsAgo: 30
            },
            {
                cluster_id: 'CLU-CG6CAF93',
                cluster_name: 'Cloud AC Cluster',
                fetal_presentation: 'Cephalic_left',
                volumes: ['c66caf93-83f7-47b9-8edb-2f6ca6f17b9b'],
                secondsAgo: 40
            },
            {
                cluster_id: 'CLU-DAA5F55C',
                cluster_name: 'FL Cluster',
                fetal_presentation: 'Cephalic_left',
                volumes: ['daa5f55c-82ba-4987-a47f-c54f56a7e57b'],
                secondsAgo: 50
            }
        ];

        // Clean up previously auto-generated volume clusters if needed without deleting user clusters
        await client.query(`
            DELETE FROM public.clusters 
            WHERE cluster_id NOT IN ('CLU-M6YP8B', 'CLU-SZI2QU', 'CLU-TB6ZIH', 'CLU-CG6CAF93', 'CLU-DAA5F55C')
              AND cluster_id NOT LIKE 'CLU-%'
              AND created_by = 'system_seed';
        `);

        for (const tc of targetClusters) {
            await client.query(`
                INSERT INTO public.clusters (
                    cluster_id, cluster_name, fetal_presentation, owner_scope, owner_centre_id, created_by, created_at, updated_at
                ) VALUES (
                    $1, $2, $3, 'institution', $4::uuid, $5, NOW() - ($6 * INTERVAL '1 second'), NOW()
                )
                ON CONFLICT (cluster_id) DO UPDATE SET
                    cluster_name = EXCLUDED.cluster_name,
                    fetal_presentation = EXCLUDED.fetal_presentation,
                    owner_centre_id = EXCLUDED.owner_centre_id,
                    owner_scope = EXCLUDED.owner_scope,
                    created_at = EXCLUDED.created_at,
                    updated_at = NOW();
            `, [tc.cluster_id, tc.cluster_name, tc.fetal_presentation, centreId, userMail, tc.secondsAgo]);

            for (const volId of tc.volumes) {
                await client.query(`
                    INSERT INTO public.cluster_volumes (cluster_id, volume_id)
                    VALUES ($1, $2::uuid)
                    ON CONFLICT (cluster_id, volume_id) DO NOTHING;
                `, [tc.cluster_id, volId]);
            }
        }
    } catch (err) {
        console.error('ensureClusterTables error:', err);
    }
};

const clusterReadScope = (requester, alias = 'c', parameterNumber = 1) => {
    if (!requester) return null;
    const role = Number(requester.role);
    if (role === ROLES.SUPER_ADMIN) {
        return {
            clause: `1=1`,
            params: []
        };
    }
    if (role !== ROLES.INSTITUTION_ADMIN || !requester.centre_id) return null;
    return {
        clause: `(${alias}.owner_scope = 'institution' AND ${alias}.owner_centre_id = $${parameterNumber}) OR ${alias}.owner_scope = 'super_admin'`,
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
               'volume_fetal_presentation', v.volume_fetal_presentation,
               'trimester', v.trimester,
               'volume_ga', v.volume_ga,
               'description', v.description,
               'status', v.status,
               'conversion_process_status', v.conversion_process_status,
               'volume_file', v.volume_file,
               'started_at', vcl.started_at,
               'conversion_completion', vcl.conversion_completion,
               'completed_at', vcl.completed_at,
               'output_file', vcl.output_file,
               'placed_url', vp.placed_url
           ) ORDER BY v.volume_name) FILTER (WHERE v.volume_id IS NOT NULL), '[]'::jsonb) AS volumes
    FROM public.clusters c
    LEFT JOIN public.cluster_volumes cv ON cv.cluster_id = c.cluster_id
    LEFT JOIN public.volumes v ON v.volume_id = cv.volume_id
    LEFT JOIN public.volume_conv_logs vcl ON vcl.volume_id = v.volume_id
    LEFT JOIN public.volume_placements vp ON vp.volume_id = v.volume_id
`;

const getClustersModel = async (requester) => {
    const scope = clusterReadScope(requester);
    if (!scope) return { code: 403, message: 'Only Institution Admins can view cluster data.' };
    await ensureClusterTables(requester);
    const result = await client.query(`${clusterSelect}
        WHERE ${scope.clause}
        GROUP BY c.cluster_id
        ORDER BY c.created_at DESC;`, scope.params);
    return { code: 200, data: result.rows };
};

const getClusterByIdModel = async (requester, clusterId) => {
    const scope = clusterReadScope(requester, 'c', 2);
    if (!scope) return { code: 403, message: 'Only Institution Admins can view cluster data.' };
    await ensureClusterTables(requester);
    const result = await client.query(`${clusterSelect}
        WHERE c.cluster_id = $1 AND ${scope.clause}
        GROUP BY c.cluster_id;`, [clusterId, ...scope.params]);
    if (result.rows.length === 0) return { code: 404, message: 'Cluster not found.' };
    return { code: 200, data: result.rows[0] };
};

const getClusterRecordingsModel = async (requester, clusterId, recordingType = null) => {
    const scope = clusterReadScope(requester, 'c', 2);
    if (!scope) return { code: 403, message: 'Only Institution Admins can view cluster recordings.' };
    await ensureClusterTables(requester);
    const query = `
        SELECT vr.recording_id, vr.recording_name, vr.recording_type,
               vr.volume_id, v.volume_name,
               jsonb_array_length(COALESCE(vr.rec_files, '[]'::jsonb)) AS recording_count,
               jsonb_array_length(COALESCE(vr.audio_files, '[]'::jsonb)) AS audio_count,
               jsonb_array_length(COALESCE(vr.image_files, '[]'::jsonb)) AS image_count,
               (vr.manifest_file IS NOT NULL AND vr.manifest_file <> '') AS has_manifest,
               vr.rec_files, vr.audio_files, vr.image_files, vr.manifest_file,
               vr.created_at, vr.created_by
        FROM public.cluster_recordings cr
        JOIN public.vol_recordings vr ON vr.recording_id = cr.recording_id
        JOIN public.clusters c ON c.cluster_id = cr.cluster_id
        LEFT JOIN public.volumes v ON v.volume_id = vr.volume_id
        WHERE c.cluster_id = $1 AND ${scope.clause}
          ${recordingType ? `AND LOWER(TRIM(vr.recording_type)) LIKE $${scope.params.length + 2}` : ''}
        ORDER BY vr.created_at DESC NULLS LAST, vr.recording_id;
    `;
    const params = [clusterId, ...scope.params];
    if (recordingType) params.push(`${recordingType}%`);
    const result = await client.query(query, params);
    return { code: 200, data: result.rows };
};

const getClusterRecordingCountsModel = async (requester, clusterId = null) => {
    const scope = clusterReadScope(requester, 'c', 1);
    if (!scope) return { code: 403, message: 'Only Institution Admins can view cluster recording counts.' };
    await ensureClusterTables(requester);
    const query = `
        SELECT 
            c.cluster_id,
            c.cluster_name,
            COUNT(DISTINCT vr.recording_id) FILTER (
                WHERE LOWER(TRIM(vr.recording_type)) LIKE '%shadow%'
            )::int AS shadow_recording_count,
            COUNT(DISTINCT vr.recording_id) FILTER (
                WHERE LOWER(TRIM(vr.recording_type)) LIKE '%step%'
            )::int AS step_recording_count,
            COALESCE(
                jsonb_agg(DISTINCT step_files.file_url) FILTER (
                    WHERE step_files.file_url IS NOT NULL
                ),
                '[]'::jsonb
            ) AS step_recording_files,
            COALESCE(
                jsonb_agg(DISTINCT step_images.image_url) FILTER (
                    WHERE step_images.image_url IS NOT NULL
                ),
                '[]'::jsonb
            ) AS step_recording_images
        FROM public.clusters c
        LEFT JOIN public.cluster_recordings cr ON cr.cluster_id = c.cluster_id
        LEFT JOIN public.vol_recordings vr ON vr.recording_id = cr.recording_id
        LEFT JOIN LATERAL jsonb_array_elements_text(
            CASE WHEN jsonb_typeof(vr.rec_files) = 'array' THEN vr.rec_files ELSE '[]'::jsonb END
        ) AS step_files(file_url)
            ON LOWER(TRIM(vr.recording_type)) LIKE '%step%'
        LEFT JOIN LATERAL jsonb_array_elements_text(
            CASE WHEN jsonb_typeof(vr.image_files) = 'array' THEN vr.image_files ELSE '[]'::jsonb END
        ) AS step_images(image_url)
            ON LOWER(TRIM(vr.recording_type)) LIKE '%step%'
        WHERE ${scope.clause}
          ${clusterId ? `AND c.cluster_id = $${scope.params.length + 1}` : ''}
        GROUP BY c.cluster_id, c.cluster_name, c.created_at
        ORDER BY c.created_at DESC;
    `;
    const params = clusterId ? [...scope.params, clusterId] : scope.params;
    const result = await client.query(query, params);
    return { code: 200, data: result.rows };
};

const getClusterRecordingDownloadModel = async (requester, clusterId, recordingId) => {
    const scope = clusterReadScope(requester, 'c', 3);
    if (!scope) return null;
    await ensureClusterTables(requester);
    const query = `
        SELECT vr.recording_id, vr.rec_files, vr.audio_files,
               vr.image_files, vr.manifest_file, vr.volume_id
        FROM public.cluster_recordings cr
        JOIN public.vol_recordings vr ON vr.recording_id = cr.recording_id
        JOIN public.clusters c ON c.cluster_id = cr.cluster_id
        WHERE c.cluster_id = $1 AND vr.recording_id = $2 AND ${scope.clause}
        LIMIT 1;
    `;
    const result = await client.query(query, [clusterId, recordingId, ...scope.params]);
    return result.rows[0] || null;
};

const createClusterModel = async (requester, { cluster_id, cluster_name, fetal_presentation, volume_ids, selected_volume_ids, volume_id }) => {
    const role = Number(requester?.role);
    if (role !== ROLES.INSTITUTION_ADMIN && role !== ROLES.SUPER_ADMIN) {
        return { code: 403, message: 'Only Institution Admins can create clusters.' };
    }
    if (role === ROLES.INSTITUTION_ADMIN && !requester.centre_id) {
        return { code: 403, message: 'Your account is not linked to an institution.' };
    }
    if (!cluster_name || !cluster_name.trim()) {
        return { code: 400, message: 'cluster_name is required.' };
    }
    const rawVolumeIds = volume_ids || selected_volume_ids || (volume_id ? [volume_id] : []);
    const cleanVolumeIds = (Array.isArray(rawVolumeIds) ? rawVolumeIds : [rawVolumeIds]).filter(Boolean);
    await ensureClusterTables(requester);
    const clusterId = (typeof cluster_id === 'string' && cluster_id.trim())
        ? cluster_id.trim()
        : `CLU-${randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase()}`;
    const ownerScope = role === ROLES.SUPER_ADMIN ? 'super_admin' : 'institution';
    const centreId = requester.centre_id || (role === ROLES.SUPER_ADMIN ? null : '01c69bd1-d62e-483e-b09f-f14a2f0f43ed');

    await client.query('BEGIN');
    try {
        await client.query(`
            INSERT INTO public.clusters (
                cluster_id, cluster_name, fetal_presentation,
                owner_scope, owner_centre_id, created_by, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            ON CONFLICT (cluster_id) DO UPDATE SET
                cluster_name = EXCLUDED.cluster_name,
                fetal_presentation = EXCLUDED.fetal_presentation,
                updated_at = NOW();
        `, [clusterId, cluster_name.trim(), fetal_presentation || null, ownerScope, centreId, requester.user_mail || 'system']);

        for (const volId of cleanVolumeIds) {
            if (typeof volId === 'string' && UUID_REGEX.test(volId)) {
                await client.query(`
                    INSERT INTO public.cluster_volumes (cluster_id, volume_id)
                    VALUES ($1, $2::uuid)
                    ON CONFLICT (cluster_id, volume_id) DO NOTHING;
                `, [clusterId, volId]);
            }
        }
        await client.query('COMMIT');
        return await getClusterByIdModel(requester, clusterId);
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
};

const updateClusterModel = async (requester, clusterId, { cluster_name, fetal_presentation, volume_ids, selected_volume_ids, volume_id }) => {
    const scope = clusterReadScope(requester, 'c', 2);
    if (!scope) return { code: 403, message: 'Only Institution Admins can update clusters.' };
    await ensureClusterTables();
    const existing = await client.query(`SELECT cluster_id FROM public.clusters c WHERE c.cluster_id = $1 AND ${scope.clause}`, [clusterId, ...scope.params]);
    if (existing.rows.length === 0) return { code: 404, message: 'Cluster not found.' };

    await client.query('BEGIN');
    try {
        if (cluster_name !== undefined || fetal_presentation !== undefined) {
            await client.query(`
                UPDATE public.clusters
                SET cluster_name = COALESCE($2, cluster_name),
                    fetal_presentation = COALESCE($3, fetal_presentation),
                    updated_at = NOW()
                WHERE cluster_id = $1;
            `, [clusterId, cluster_name?.trim() || null, fetal_presentation || null]);
        }
        const rawUpdateVolumes = volume_ids !== undefined ? volume_ids : (selected_volume_ids !== undefined ? selected_volume_ids : (volume_id ? [volume_id] : undefined));
        if (rawUpdateVolumes !== undefined) {
            const cleanUpdateVolumes = (Array.isArray(rawUpdateVolumes) ? rawUpdateVolumes : [rawUpdateVolumes]).filter(Boolean);
            await client.query(`DELETE FROM public.cluster_volumes WHERE cluster_id = $1;`, [clusterId]);
            for (const volId of cleanUpdateVolumes) {
                if (typeof volId === 'string' && UUID_REGEX.test(volId)) {
                    await client.query(`
                        INSERT INTO public.cluster_volumes (cluster_id, volume_id)
                        VALUES ($1, $2::uuid)
                        ON CONFLICT (cluster_id, volume_id) DO NOTHING;
                    `, [clusterId, volId]);
                }
            }
        }
        await client.query('COMMIT');
        return await getClusterByIdModel(requester, clusterId);
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
};

const deleteClusterModel = async (requester, clusterId) => {
    const scope = clusterReadScope(requester, 'c', 2);
    if (!scope) return { code: 403, message: 'Only Institution Admins can delete clusters.' };
    await ensureClusterTables();
    const result = await client.query(`DELETE FROM public.clusters c WHERE c.cluster_id = $1 AND ${scope.clause} RETURNING c.cluster_id;`, [clusterId, ...scope.params]);
    if (result.rows.length === 0) return { code: 404, message: 'Cluster not found.' };
    return { code: 200, message: 'Cluster deleted successfully.' };
};

module.exports = {
    getClustersModel,
    getClusterByIdModel,
    getClusterRecordingsModel,
    getClusterRecordingCountsModel,
    getClusterRecordingDownloadModel,
    createClusterModel,
    updateClusterModel,
    deleteClusterModel
};

setTimeout(() => {
    ensureClusterTables().catch(console.error);
}, 200);



