const client = require('../utils/conn');
const {
    ROLES,
    COURSE_EDITOR_ROLES,
    HttpError,
    isSuperAdmin,
    requireRole,
    requireInstitution,
    canEditOwnedEntity
} = require('../Auth/authorization');
const {
    listEffectiveCourses,
    getCourseById,
    assertCourseEligibleForCentre,
    audit
} = require('./ContentAccessm');
const { signPrivateAsset, signPrivateAssets, signedUrlTtlSeconds } = require('../utils/privateAssetUrls');

const getWorkspace = async (requester, requestedCentreId = null) => {
    requireRole(requester, COURSE_EDITOR_ROLES);
    let conditions;
    let values;
    if (isSuperAdmin(requester) && requestedCentreId) {
        conditions = `v.owner_scope = 'institution' AND v.owner_centre_id = $1`;
        values = [requestedCentreId];
        await audit(client, requester, 'workspace.cross_tenant_viewed', 'institution', requestedCentreId, requestedCentreId);
    } else if (isSuperAdmin(requester)) {
        conditions = `v.owner_scope = 'super_admin'`;
        values = [];
    } else {
        conditions = `v.owner_scope = 'institution' AND v.owner_centre_id = $1`;
        values = [requireInstitution(requester)];
    }

    const result = await client.query(
        `SELECT v.volume_id, v.volume_name, v.volume_type, v.trimester, v.volume_ga,
                v.volume_fetal_presentation, v.lifecycle_status, v.status,
                v.conversion_process_status, v.added_by, v.owner_scope, v.owner_centre_id,
                v.created_at,
                COALESCE(jsonb_agg(
                    jsonb_build_object(
                        'recordingId', vr.recording_id,
                        'name', vr.recording_name,
                        'type', vr.recording_type,
                        'validationStatus', vr.validation_status
                    ) ORDER BY vr.recording_name
                ) FILTER (WHERE vr.recording_id IS NOT NULL), '[]'::jsonb) AS recordings
         FROM volumes v
         LEFT JOIN vol_recordings vr ON vr.volume_id = v.volume_id
         WHERE ${conditions} AND v.ownership_review_required = false
         GROUP BY v.volume_id
         ORDER BY v.created_at DESC`,
        values
    );
    return result.rows;
};

const getMrCourses = async (requester) => {
    if (Number(requester.role) === ROLES.TRAINEE) return listEffectiveCourses(requester);
    throw new HttpError(403, 'MR course consumption is available to trainees. Editors should use the MR workspace.');
};

const assertCanUseCourse = async (requester, course) => {
    if (Number(requester.role) === ROLES.TRAINEE) {
        const courses = await listEffectiveCourses(requester);
        if (!courses.some((item) => String(item.certificate_id) === String(course.certificate_id))) {
            throw new HttpError(404, 'Course not found.');
        }
        return;
    }
    requireRole(requester, COURSE_EDITOR_ROLES);
    if (canEditOwnedEntity(requester, course.owner_scope, course.owner_centre_id)) return;
    const centreId = requireInstitution(requester);
    await assertCourseEligibleForCentre(client, course.certificate_id, centreId);
};

const parseJsonArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
        return [];
    }
};

const signRecording = async (row) => ({
    linkId: row.link_id,
    resourceId: row.resource_id,
    volumeId: row.volume_id,
    volumeName: row.volume_name,
    recordingId: row.recording_id,
    recordingName: row.recording_name,
    recordingType: row.recording_type,
    recordingFiles: await signPrivateAssets(parseJsonArray(row.rec_files)),
    audioFiles: await signPrivateAssets(parseJsonArray(row.audio_files)),
    imageFiles: await signPrivateAssets(parseJsonArray(row.image_files)),
    manifestFile: await signPrivateAsset(row.manifest_file)
});

const getCoursePackage = async (requester, courseId) => {
    const course = await getCourseById(client, courseId);
    await assertCanUseCourse(requester, course);
    const result = await client.query(
        `SELECT ccl.link_id, ccl.resource_id, ccl.volume_id, v.volume_name,
                vr.recording_id, vr.recording_name, vr.recording_type,
                vr.rec_files, vr.audio_files, vr.image_files, vr.manifest_file
         FROM course_content_links ccl
         JOIN volumes v ON v.volume_id = ccl.volume_id
         JOIN vol_recordings vr
           ON vr.recording_id IN (ccl.shadow_recording_id, ccl.step_recording_id)
          AND vr.validation_status = 'validated'
         WHERE ccl.course_id = $1
         ORDER BY ccl.created_at, vr.recording_type`,
        [courseId]
    );
    const artifacts = await Promise.all(result.rows.map(signRecording));
    return {
        course: {
            id: course.certificate_id,
            name: course.certificate_name,
            kind: course.course_kind,
            curriculumId: course.curiculum_id
        },
        signedUrlExpiresInSeconds: signedUrlTtlSeconds,
        artifacts
    };
};

const validateRecording = async (requester, recordingId, state) => {
    requireRole(requester, COURSE_EDITOR_ROLES);
    if (!['validated', 'rejected', 'draft'].includes(state)) throw new HttpError(400, 'Invalid validation state.');
    const found = await client.query(
        `SELECT vr.recording_id, v.volume_id, v.owner_scope, v.owner_centre_id
         FROM vol_recordings vr JOIN volumes v ON v.volume_id = vr.volume_id
         WHERE vr.recording_id = $1`,
        [recordingId]
    );
    if (found.rows.length === 0) throw new HttpError(404, 'Recording not found.');
    const volume = found.rows[0];
    if (!canEditOwnedEntity(requester, volume.owner_scope, volume.owner_centre_id)) throw new HttpError(404, 'Recording not found.');
    const result = await client.query(
        `UPDATE vol_recordings
         SET validation_status = $1,
             validated_by = CASE WHEN $1 = 'validated' THEN $2 ELSE NULL END,
             validated_at = CASE WHEN $1 = 'validated' THEN now() ELSE NULL END
         WHERE recording_id = $3 RETURNING *`,
        [state, requester.user_mail, recordingId]
    );
    if (state === 'validated') {
        await client.query("UPDATE volumes SET lifecycle_status = 'validated' WHERE volume_id = $1", [volume.volume_id]);
    }
    await audit(client, requester, `recording.${state}`, 'recording', recordingId, volume.owner_centre_id);
    return result.rows[0];
};

const attachContent = async (requester, courseId, input) => {
    requireRole(requester, COURSE_EDITOR_ROLES);
    const course = await getCourseById(client, courseId);
    if (!canEditOwnedEntity(requester, course.owner_scope, course.owner_centre_id)) throw new HttpError(404, 'Course not found.');
    if (!input.volumeId || (!input.shadowRecordingId && !input.stepRecordingId)) {
        throw new HttpError(400, 'volumeId and at least one recording ID are required.');
    }
    const volumeResult = await client.query(
        `SELECT volume_id, owner_scope, owner_centre_id, ownership_review_required
         FROM volumes WHERE volume_id = $1`,
        [input.volumeId]
    );
    if (volumeResult.rows.length === 0) throw new HttpError(404, 'Volume not found.');
    const volume = volumeResult.rows[0];
    if (!canEditOwnedEntity(requester, volume.owner_scope, volume.owner_centre_id)) throw new HttpError(404, 'Volume not found.');
    if (course.owner_scope !== volume.owner_scope || String(course.owner_centre_id || '') !== String(volume.owner_centre_id || '')) {
        throw new HttpError(409, 'Course content must have the same owner as the course.');
    }
    if (volume.ownership_review_required) throw new HttpError(409, 'Resolve volume ownership before attaching it.');
    const recordingIds = [input.shadowRecordingId, input.stepRecordingId].filter(Boolean);
    const recordings = await client.query(
        `SELECT recording_id FROM vol_recordings
         WHERE volume_id = $1 AND recording_id = ANY($2::uuid[]) AND validation_status = 'validated'`,
        [input.volumeId, recordingIds]
    );
    if (recordings.rows.length !== recordingIds.length) throw new HttpError(409, 'Every attached recording must belong to the volume and be validated.');
    const result = await client.query(
        `INSERT INTO course_content_links
            (course_id, resource_id, volume_id, shadow_recording_id, step_recording_id, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [courseId, input.resourceId || null, input.volumeId, input.shadowRecordingId || null, input.stepRecordingId || null, requester.user_mail]
    );
    await audit(client, requester, 'course.content_attached', 'course', courseId, course.owner_centre_id, { linkId: result.rows[0].link_id });
    return result.rows[0];
};

module.exports = { getWorkspace, getMrCourses, getCoursePackage, validateRecording, attachContent };
