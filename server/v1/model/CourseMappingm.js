const client = require('../utils/conn');
const { randomUUID } = require('crypto');

const ALLOWED_TRIMESTERS = [
    'First Trimester',
    'Second Trimester',
    'Third Trimester'
];

const ALLOWED_MODULES = [
    'Biometry',
    'Six Step',
    '20 + 2 planes'
];

const ALLOWED_COURSE_TYPES = [
    'Practice',
    'Test',
    'Free scan'
];

const isPrivilegedUser = (requester) => [99, 101, 102].includes(Number(requester.role));

const ensureCourseMappingTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS public.course_mapping (
            mapping_id uuid PRIMARY KEY,
            trimester character varying(50) NOT NULL,
            anatomy_type character varying(100) NOT NULL,
            volume_id uuid NOT NULL,
            volume_name character varying(255) NOT NULL,
            module_name character varying(100) NOT NULL,
            course_type character varying(50) NOT NULL,
            shadow_recording_id uuid NULL,
            step_recording_id uuid NULL,
            created_by character varying(100) NOT NULL,
            created_at timestamp without time zone DEFAULT now(),
            updated_at timestamp without time zone DEFAULT now()
        );

        CREATE INDEX IF NOT EXISTS idx_course_mapping_volume_id
            ON public.course_mapping(volume_id);

        CREATE INDEX IF NOT EXISTS idx_course_mapping_course_type
            ON public.course_mapping(course_type);

        CREATE INDEX IF NOT EXISTS idx_course_mapping_module_name
            ON public.course_mapping(module_name);
    `;

    await client.query(query);
};

const resolveVolume = async (trimester, anatomy_type, volume_name) => {
    const exactQuery = `
        SELECT volume_id, volume_name, volume_type, trimester
        FROM public.volumes
        WHERE LOWER(TRIM(volume_name)) = LOWER(TRIM($1))
          AND LOWER(TRIM(volume_type)) = LOWER(TRIM($2))
          AND LOWER(TRIM(trimester)) = LOWER(TRIM($3));
    `;

    const exactResult = await client.query(exactQuery, [volume_name, anatomy_type, trimester]);

    if (exactResult.rows.length === 1) {
        return { data: exactResult.rows[0] };
    }

    if (exactResult.rows.length > 1) {
        return {
            code: 409,
            message: 'Multiple volumes match the provided trimester, anatomy type, and volume name. Use more specific data.'
        };
    }

    // Fallback for legacy rows created before trimester started being persisted.
    const fallbackQuery = `
        SELECT volume_id, volume_name, volume_type, trimester
        FROM public.volumes
        WHERE LOWER(TRIM(volume_name)) = LOWER(TRIM($1))
          AND LOWER(TRIM(volume_type)) = LOWER(TRIM($2))
        ORDER BY created_at DESC NULLS LAST;
    `;

    const fallbackResult = await client.query(fallbackQuery, [volume_name, anatomy_type]);

    if (fallbackResult.rows.length === 0) {
        return {
            code: 404,
            message: 'No volume found for the provided anatomy type and volume name.'
        };
    }

    if (fallbackResult.rows.length > 1) {
        return {
            code: 409,
            message: 'Multiple legacy volumes match the provided anatomy type and volume name. Update the volume data or use a unique volume name.'
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

    const fallbackQuery = `
        SELECT recording_id, recording_type, volume_id
        FROM public.vol_recordings
        WHERE recording_id = $1
        LIMIT 1;
    `;

    const fallbackResult = await client.query(fallbackQuery, [recordingId]);

    if (fallbackResult.rows.length === 0) {
        return {
            code: 404,
            message: `${fieldName} does not exist in vol_recordings.`
        };
    }

    const matchedRecording = fallbackResult.rows[0];

    if (matchedRecording.volume_id !== volumeId) {
        return {
            code: 409,
            message: `${fieldName} belongs to a different volume.`
        };
    }

    return {
        code: 409,
        message: `${fieldName} exists for this volume, but its recording_type is '${matchedRecording.recording_type}', not '${recordingType}'.`
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
    step_recording_id
) => {
    if (!isPrivilegedUser(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to create course mappings.'
        };
    }

    await ensureCourseMappingTable();

    const volumeResult = await resolveVolume(trimester, anatomy_type, volume_name);
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
        LIMIT 1;
    `;

    const duplicateResult = await client.query(duplicateQuery, [
        volume.volume_id,
        module_name,
        course_type,
        shadow_recording_id || null,
        step_recording_id || null
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
            module_name,
            course_type,
            shadow_recording_id,
            step_recording_id,
            created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;

    const result = await client.query(insertQuery, [
        mapping_id,
        trimester,
        anatomy_type,
        volume.volume_id,
        volume.volume_name,
        module_name,
        course_type,
        shadow_recording_id || null,
        step_recording_id || null,
        requester.user_mail
    ]);

    return {
        status: 'Success',
        code: 201,
        data: result.rows[0]
    };
};

const getCourseMappingsModel = async (requester, filters = {}) => {
    if (!isPrivilegedUser(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view course mappings.'
        };
    }

    await ensureCourseMappingTable();

    const conditions = [];
    const values = [];

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

    const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const query = `
        SELECT
            cm.*,
            ud.user_name AS created_by_name
        FROM public.course_mapping cm
        LEFT JOIN public.user_data ud
            ON ud.user_email = cm.created_by
        ${whereClause}
        ORDER BY cm.created_at DESC;
    `;

    const result = await client.query(query, values);

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
    getCourseMappingsModel
};
