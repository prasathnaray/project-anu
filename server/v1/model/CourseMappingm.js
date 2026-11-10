const client = require('../utils/conn');
const { randomUUID } = require('crypto');
const { volumeAccessScope } = require('../Auth/volumeAuthorization');
const { courseMappingOwnership, courseMappingReadScope } = require('../Auth/courseMappingAuthorization');

const ALLOWED_TRIMESTERS = [
    'First Trimester',
    'Second Trimester',
    'Third Trimester'
];

const ALLOWED_MODULES = [
    'Biometry',
    'Six Step',
    '20 + 2 planes',
    'SVT Course',
    'Custom Course'
];

const ALLOWED_COURSE_TYPES = [
    'p1',
    'p2',
    'p3',
    'p4',
    't1',
    't2',
    'Practice',
    'Test',
    'Free scan',
    'Free Scan',
    'Single Plane'
];

const isPrivilegedUser = (requester) => [99, 101, 102].includes(Number(requester.role));

const ensureCourseMappingTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS public.course_mapping (
            mapping_id uuid PRIMARY KEY,
            trimester character varying(50) NOT NULL,
            anatomy_type character varying(100) NOT NULL,
            volume_id uuid NULL,
            volume_name character varying(255) NULL,
            cluster_id varchar(100) NULL,
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

        CREATE INDEX IF NOT EXISTS idx_course_mapping_volume_id
            ON public.course_mapping(volume_id);

        CREATE INDEX IF NOT EXISTS idx_course_mapping_course_type
            ON public.course_mapping(course_type);

        CREATE INDEX IF NOT EXISTS idx_course_mapping_module_name
            ON public.course_mapping(module_name);

        ALTER TABLE public.course_mapping
            ADD COLUMN IF NOT EXISTS course_name character varying(255);

        ALTER TABLE public.course_mapping
            ADD COLUMN IF NOT EXISTS description text;

        ALTER TABLE public.course_mapping
            ADD COLUMN IF NOT EXISTS doctor_name character varying(255);

        ALTER TABLE public.course_mapping
            ADD COLUMN IF NOT EXISTS owner_scope text;

        ALTER TABLE public.course_mapping
            ADD COLUMN IF NOT EXISTS owner_centre_id uuid;

        ALTER TABLE public.course_mapping
            ADD COLUMN IF NOT EXISTS cluster_id varchar(100);

        ALTER TABLE public.course_mapping
            ALTER COLUMN volume_id DROP NOT NULL,
            ALTER COLUMN volume_name DROP NOT NULL,
            ALTER COLUMN trimester DROP NOT NULL,
            ALTER COLUMN anatomy_type DROP NOT NULL;

        CREATE INDEX IF NOT EXISTS idx_course_mapping_cluster_id
            ON public.course_mapping(cluster_id);

        CREATE INDEX IF NOT EXISTS idx_course_mapping_owner
            ON public.course_mapping(owner_scope, owner_centre_id);

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
    `;

    await client.query(query);
};

const tagCustomCourseModel = async (requester, mappingId, { certificate_name, unit_name }) => {
    const ownership = courseMappingOwnership(requester);
    if (!ownership || ownership.ownerScope !== 'institution') {
        return { code: 403, message: 'Only scan center staff can tag custom courses.' };
    }
    if (certificate_name !== 'BTC' || !['BPD & HC', 'AC', 'FL'].includes(unit_name)) {
        return { code: 400, message: 'Choose BTC and a supported unit.' };
    }
    await ensureCourseMappingTable();
    const mapping = await client.query(`
        SELECT mapping_id FROM public.course_mapping
        WHERE mapping_id = $1::uuid AND module_name = 'Custom Course'
          AND owner_scope = 'institution' AND owner_centre_id = $2::uuid
        LIMIT 1;
    `, [mappingId, ownership.ownerCentreId]);
    if (!mapping.rows.length) return { code: 404, message: 'Custom course not found.' };

    const result = await client.query(`
        INSERT INTO public.course_mapping_placements
            (mapping_id, centre_id, certificate_name, unit_name, tagged_by)
        VALUES ($1::uuid, $2::uuid, $3, $4, $5)
        ON CONFLICT (mapping_id) DO UPDATE SET
            certificate_name = EXCLUDED.certificate_name,
            unit_name = EXCLUDED.unit_name,
            tagged_by = EXCLUDED.tagged_by,
            tagged_at = now()
        RETURNING mapping_id, centre_id, certificate_name, unit_name;
    `, [mappingId, ownership.ownerCentreId, certificate_name, unit_name, requester.user_mail]);
    return { code: 200, data: result.rows[0] };
};

const resolveVolume = async (requester, trimester, anatomy_type, volume_name) => {
    const exactScope = volumeAccessScope(requester, 'volumes', 3);
    if (!exactScope) return { code: 403, message: 'You do not have permission to use volumes.' };
    const exactQuery = `
        SELECT volume_id, volume_name, volume_type, trimester
        FROM public.volumes
        WHERE LOWER(TRIM(volume_name)) = LOWER(TRIM($1))
          AND LOWER(TRIM(trimester)) = LOWER(TRIM($2))
          AND ${exactScope.clause}
          AND ownership_review_required = false;
    `;

    const exactResult = await client.query(exactQuery, [volume_name, trimester, ...exactScope.params]);

    if (exactResult.rows.length === 1) {
        return { data: exactResult.rows[0] };
    }

    if (exactResult.rows.length > 1) {
        const unitMatch = exactResult.rows.find(
            (row) => row.volume_type?.trim().toLowerCase() === anatomy_type.trim().toLowerCase()
        );

        if (unitMatch) {
            return { data: unitMatch };
        }

        return {
            code: 409,
            message: 'Multiple volumes match the provided trimester and volume name. Use a volume with a matching unit/type.'
        };
    }

    // Fallback for legacy rows created before trimester started being persisted.
    const fallbackScope = volumeAccessScope(requester, 'volumes', 2);
    const fallbackQuery = `
        SELECT volume_id, volume_name, volume_type, trimester
        FROM public.volumes
        WHERE LOWER(TRIM(volume_name)) = LOWER(TRIM($1))
          AND ${fallbackScope.clause}
          AND ownership_review_required = false
        ORDER BY created_at DESC NULLS LAST;
    `;

    const fallbackResult = await client.query(fallbackQuery, [volume_name, ...fallbackScope.params]);

    if (fallbackResult.rows.length === 0) {
        return {
            code: 404,
            message: 'No volume found for the provided volume name.'
        };
    }

    if (fallbackResult.rows.length > 1) {
        const unitMatch = fallbackResult.rows.find(
            (row) => row.volume_type?.trim().toLowerCase() === anatomy_type.trim().toLowerCase()
        );

        if (unitMatch) {
            return { data: unitMatch };
        }

        return {
            code: 409,
            message: 'Multiple legacy volumes match the provided volume name. Update the volume data or use a unique volume name.'
        };
    }

    return { data: fallbackResult.rows[0] };
};

const validateRecording = async (recordingId, volumeId, recordingType, fieldName) => {
    if (!recordingId) {
        return null;
    }

    const typePrefix = recordingType === 'shadow' ? 'shadow%' : 'step%';

    const query = `
        SELECT recording_id, recording_type
        FROM public.vol_recordings
        WHERE recording_id = $1
          AND volume_id = $2
          AND LOWER(TRIM(recording_type)) LIKE $3
        LIMIT 1;
    `;

    const result = await client.query(query, [recordingId, volumeId, typePrefix]);

    if (result.rows.length === 1) {
        return null;
    }

    return {
        code: 404,
        message: `${fieldName} was not found for this volume.`
    };
};

const createCourseMappingModel = async (
    requester,
    trimester,
    anatomy_type,
    volume_name,
    module_name,
    course_type,
    shadow_recording_id,
    step_recording_id,
    course_name,
    description,
    doctor_name,
    cluster_id = null
) => {
    if (!isPrivilegedUser(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to create course mappings.'
        };
    }

    const ownership = courseMappingOwnership(requester);
    if (!ownership) {
        return {
            status: 'Forbidden',
            code: 403,
            message: 'Your account is not linked to an institution.'
        };
    }

    await ensureCourseMappingTable();

    if (module_name === 'Custom Course') {
        if (!cluster_id || typeof cluster_id !== 'string') {
            return { code: 400, message: 'cluster_id is required for a custom course.' };
        }
        const clusterResult = await client.query(`
            SELECT cluster_id FROM public.clusters
            WHERE cluster_id = $1 AND (
                ($2 = 'super_admin') OR
                ($2 = 'institution' AND (
                    (owner_scope = 'institution' AND owner_centre_id = $3::uuid)
                    OR owner_scope = 'super_admin'))
            ) LIMIT 1;
        `, [cluster_id, ownership.ownerScope, ownership.ownerCentreId]);
        if (!clusterResult.rows.length) return { code: 404, message: 'Cluster not found.' };

        for (const [recordingId, type] of [[shadow_recording_id, 'shadow'], [step_recording_id, 'step']]) {
            if (!recordingId) continue;
            const recording = await client.query(`
                SELECT vr.recording_id FROM public.cluster_recordings cr
                JOIN public.vol_recordings vr ON vr.recording_id = cr.recording_id
                WHERE cr.cluster_id = $1 AND cr.recording_id = $2::uuid
                  AND LOWER(TRIM(vr.recording_type)) LIKE $3 LIMIT 1;
            `, [cluster_id, recordingId, `${type}%`]);
            if (!recording.rows.length) return { code: 404, message: `${type} recording was not found in this cluster.` };
        }

        const duplicate = await client.query(`
            SELECT mapping_id FROM public.course_mapping
            WHERE cluster_id = $1 AND module_name = 'Custom Course'
              AND LOWER(TRIM(course_type)) = LOWER(TRIM($2))
              AND shadow_recording_id IS NOT DISTINCT FROM $3::uuid
              AND step_recording_id IS NOT DISTINCT FROM $4::uuid
              AND owner_scope = $5 AND owner_centre_id IS NOT DISTINCT FROM $6::uuid
            LIMIT 1;
        `, [cluster_id, course_type, shadow_recording_id || null, step_recording_id || null, ownership.ownerScope, ownership.ownerCentreId]);
        if (duplicate.rows.length) return { code: 409, message: 'A course already exists for this cluster, course type, and recording combination.' };

        const result = await client.query(`
            INSERT INTO public.course_mapping (
                mapping_id, cluster_id, course_name, description, doctor_name,
                module_name, course_type, shadow_recording_id, step_recording_id,
                created_by, owner_scope, owner_centre_id
            ) VALUES ($1, $2, $3, $4, $5, 'Custom Course', $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `, [randomUUID(), cluster_id, course_name || null, description || null, doctor_name || null,
            course_type, shadow_recording_id || null, step_recording_id || null,
            requester.user_mail, ownership.ownerScope, ownership.ownerCentreId]);
        return { status: 'Success', code: 201, data: result.rows[0] };
    }

    const volumeResult = await resolveVolume(requester, trimester, anatomy_type, volume_name);
    if (volumeResult.code) {
        return volumeResult;
    }

    const volume = volumeResult.data;

    const shadowValidation = await validateRecording(
        shadow_recording_id,
        volume.volume_id,
        'shadow',
        'shadow_recording_id'
    );
    if (shadowValidation) {
        return shadowValidation;
    }

    const stepValidation = await validateRecording(
        step_recording_id,
        volume.volume_id,
        'step',
        'step_recording_id'
    );
    if (stepValidation) {
        return stepValidation;
    }

    const duplicateQuery = `
        SELECT mapping_id
        FROM public.course_mapping
        WHERE volume_id = $1
          AND LOWER(TRIM(module_name)) = LOWER(TRIM($2))
          AND LOWER(TRIM(course_type)) = LOWER(TRIM($3))
          AND (
                ($4::uuid IS NULL AND shadow_recording_id IS NULL) OR
                shadow_recording_id = $4::uuid
              )
          AND (
                ($5::uuid IS NULL AND step_recording_id IS NULL) OR
                step_recording_id = $5::uuid
              )
          AND owner_scope = $6
          AND owner_centre_id IS NOT DISTINCT FROM $7::uuid
        LIMIT 1;
    `;

    const duplicateResult = await client.query(duplicateQuery, [
        volume.volume_id,
        module_name,
        course_type,
        shadow_recording_id || null,
        step_recording_id || null,
        ownership.ownerScope,
        ownership.ownerCentreId
    ]);

    if (duplicateResult.rows.length > 0) {
        return {
            code: 409,
            message: 'A course mapping already exists for this volume, module, course type, and recording combination.'
        };
    }

    const mapping_id = randomUUID();

    const insertQuery = `
        INSERT INTO public.course_mapping (
            mapping_id,
            trimester,
            anatomy_type,
            volume_id,
            volume_name,
            course_name,
            description,
            doctor_name,
            module_name,
            course_type,
            shadow_recording_id,
            step_recording_id,
            created_by,
            owner_scope,
            owner_centre_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *;
    `;

    const result = await client.query(insertQuery, [
        mapping_id,
        trimester,
        anatomy_type,
        volume.volume_id,
        volume.volume_name,
        course_name || null,
        description || null,
        doctor_name || null,
        module_name,
        course_type,
        shadow_recording_id || null,
        step_recording_id || null,
        requester.user_mail,
        ownership.ownerScope,
        ownership.ownerCentreId
    ]);

    return {
        status: 'Success',
        code: 201,
        data: result.rows[0]
    };
};

const buildCourseMappingListScope = (requester, filters = {}) => {
    const scope = courseMappingReadScope(requester, 'cm', 1);
    if (!scope) return null;

    const conditions = [scope.clause, '(cm.cluster_id IS NOT NULL OR v.ownership_review_required = false)'];
    const values = [...scope.params];

    if (filters.trimester) {
        values.push(filters.trimester);
        conditions.push(`LOWER(TRIM(cm.trimester)) = LOWER(TRIM($${values.length}))`);
    }

    if (filters.anatomy_type) {
        values.push(filters.anatomy_type);
        conditions.push(`LOWER(TRIM(cm.anatomy_type)) = LOWER(TRIM($${values.length}))`);
    }

    if (filters.volume_name) {
        values.push(`%${filters.volume_name.trim()}%`);
        conditions.push(`cm.volume_name ILIKE $${values.length}`);
    }

    if (filters.module_name) {
        values.push(filters.module_name);
        conditions.push(`LOWER(TRIM(cm.module_name)) = LOWER(TRIM($${values.length}))`);
    }

    if (filters.course_type) {
        values.push(filters.course_type);
        conditions.push(`LOWER(TRIM(cm.course_type)) = LOWER(TRIM($${values.length}))`);
    }

    return {
        whereClause: `WHERE ${conditions.join(' AND ')}`,
        values
    };
};

const getCourseMappingsModel = async (requester, filters = {}) => {
    const queryScope = buildCourseMappingListScope(requester, filters);
    if (!queryScope) return { status: 'Forbidden', code: 403, message: 'You do not have permission to view course mappings.' };

    await ensureCourseMappingTable();

    const query = `
        SELECT
            cm.*,
            c.cluster_name,
            cmp.certificate_name AS tagged_certificate_name,
            cmp.unit_name AS tagged_unit_name,
            ud.user_name AS created_by_name
        FROM public.course_mapping cm
        LEFT JOIN public.volumes v ON v.volume_id = cm.volume_id
        LEFT JOIN public.clusters c ON c.cluster_id = cm.cluster_id
        LEFT JOIN public.course_mapping_placements cmp ON cmp.mapping_id = cm.mapping_id
        LEFT JOIN public.user_data ud
            ON ud.user_email = cm.created_by
        ${queryScope.whereClause}
        ORDER BY cm.created_at DESC;
    `;

    const result = await client.query(query, queryScope.values);

    return {
        status: 'Success',
        code: 200,
        data: result.rows
    };
};

const getCourseMappingsWithRecordingsModel = async (requester, filters = {}) => {
    const queryScope = buildCourseMappingListScope(requester, filters);
    if (!queryScope) return { status: 'Forbidden', code: 403, message: 'You do not have permission to view course mappings.' };

    await ensureCourseMappingTable();

    const query = `
        SELECT
            cm.*,
            c.cluster_name,
            cmp.certificate_name AS tagged_certificate_name,
            cmp.unit_name AS tagged_unit_name,
            ud.user_name AS created_by_name,
            CASE WHEN shadow_vr.recording_id IS NULL THEN NULL ELSE jsonb_build_object(
                'recording_id', shadow_vr.recording_id,
                'recording_name', shadow_vr.recording_name,
                'recording_type', shadow_vr.recording_type,
                'rec_files', shadow_vr.rec_files,
                'audio_files', shadow_vr.audio_files,
                'image_files', shadow_vr.image_files,
                'manifest_file', shadow_vr.manifest_file,
                'validation_status', shadow_vr.validation_status,
                'created_at', shadow_vr.created_at,
                'created_by', shadow_vr.created_by
            ) END AS shadow_recording,
            CASE WHEN step_vr.recording_id IS NULL THEN NULL ELSE jsonb_build_object(
                'recording_id', step_vr.recording_id,
                'recording_name', step_vr.recording_name,
                'recording_type', step_vr.recording_type,
                'rec_files', step_vr.rec_files,
                'audio_files', step_vr.audio_files,
                'image_files', step_vr.image_files,
                'manifest_file', step_vr.manifest_file,
                'validation_status', step_vr.validation_status,
                'created_at', step_vr.created_at,
                'created_by', step_vr.created_by
            ) END AS step_recording
        FROM public.course_mapping cm
        LEFT JOIN public.volumes v ON v.volume_id = cm.volume_id
        LEFT JOIN public.clusters c ON c.cluster_id = cm.cluster_id
        LEFT JOIN public.course_mapping_placements cmp ON cmp.mapping_id = cm.mapping_id
        LEFT JOIN public.user_data ud
            ON ud.user_email = cm.created_by
        LEFT JOIN public.vol_recordings shadow_vr
            ON shadow_vr.recording_id = cm.shadow_recording_id
           AND (shadow_vr.volume_id = cm.volume_id OR EXISTS (
               SELECT 1 FROM public.cluster_recordings cr
               WHERE cr.cluster_id = cm.cluster_id AND cr.recording_id = shadow_vr.recording_id))
           AND LOWER(TRIM(shadow_vr.recording_type)) LIKE 'shadow%'
        LEFT JOIN public.vol_recordings step_vr
            ON step_vr.recording_id = cm.step_recording_id
           AND (step_vr.volume_id = cm.volume_id OR EXISTS (
               SELECT 1 FROM public.cluster_recordings cr
               WHERE cr.cluster_id = cm.cluster_id AND cr.recording_id = step_vr.recording_id))
           AND LOWER(TRIM(step_vr.recording_type)) LIKE 'step%'
        ${queryScope.whereClause}
        ORDER BY cm.created_at DESC;
    `;

    const result = await client.query(query, queryScope.values);

    return {
        status: 'Success',
        code: 200,
        data: result.rows
    };
};

module.exports = {
    ALLOWED_TRIMESTERS,
    ALLOWED_MODULES,
    ALLOWED_COURSE_TYPES,
    createCourseMappingModel,
    getCourseMappingsModel,
    getCourseMappingsWithRecordingsModel,
    tagCustomCourseModel
};
