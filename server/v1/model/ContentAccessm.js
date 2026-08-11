const client = require('../utils/conn');
const {
    ROLES,
    COURSE_EDITOR_ROLES,
    HttpError,
    roleOf,
    isSuperAdmin,
    isInstitutionEditor,
    requireRole,
    requireInstitution,
    canEditOwnedEntity
} = require('../Auth/authorization');

const COURSE_KINDS = ['core', 'specialized', 'institution'];
const PUBLICATION_STATES = ['draft', 'published', 'archived'];
const VISIBILITY_MODES = ['none', 'all', 'selected'];

const audit = async (db, requester, action, entityType, entityId, targetCentreId = null, metadata = {}) => {
    await db.query(
        `INSERT INTO tenant_access_audit
            (actor_email, actor_role, action, entity_type, entity_id, target_centre_id, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)`,
        [requester.user_mail, String(requester.role), action, entityType, entityId ? String(entityId) : null, targetCentreId, JSON.stringify(metadata)]
    );
};

const courseEligibilitySql = (courseAlias, centreParam) => `
    ${courseAlias}.publication_status = 'published'
    AND ${courseAlias}.ownership_review_required = false
    AND (
        (${courseAlias}.course_kind = 'core' AND ${courseAlias}.owner_scope = 'super_admin')
        OR (
            ${courseAlias}.course_kind = 'specialized'
            AND ${courseAlias}.owner_scope = 'super_admin'
            AND (
                ${courseAlias}.visibility_mode = 'all'
                OR (
                    ${courseAlias}.visibility_mode = 'selected'
                    AND EXISTS (
                        SELECT 1 FROM course_institution_access cia
                        WHERE cia.course_id = ${courseAlias}.certificate_id
                          AND cia.centre_id = ${centreParam}
                    )
                )
            )
        )
        OR (
            ${courseAlias}.course_kind = 'institution'
            AND ${courseAlias}.owner_scope = 'institution'
            AND ${courseAlias}.owner_centre_id = ${centreParam}
        )
    )`;

const assignmentSql = (courseAlias, centreParam, traineeParam) => `
    EXISTS (
        SELECT 1
        FROM course_trainee_overrides cto
        WHERE cto.course_id = ${courseAlias}.certificate_id
          AND cto.centre_id = ${centreParam}
          AND cto.trainee_id = ${traineeParam}
          AND cto.state = 'assigned'
    )
    OR (
        NOT EXISTS (
            SELECT 1
            FROM course_trainee_overrides cto
            WHERE cto.course_id = ${courseAlias}.certificate_id
              AND cto.centre_id = ${centreParam}
              AND cto.trainee_id = ${traineeParam}
              AND cto.state = 'excluded'
        )
        AND EXISTS (
            SELECT 1
            FROM course_batch_assignments cba
            JOIN batch_people_data bpd
              ON cba.batch_id = ANY(bpd.batch_id)
             AND bpd.user_id = ${traineeParam}
            WHERE cba.course_id = ${courseAlias}.certificate_id
              AND cba.centre_id = ${centreParam}
        )
    )`;

const getCourseById = async (db, courseId, forUpdate = false) => {
    const result = await db.query(
        `SELECT * FROM certification_data WHERE certificate_id = $1${forUpdate ? ' FOR UPDATE' : ''}`,
        [courseId]
    );
    if (result.rows.length === 0) throw new HttpError(404, 'Course not found.');
    return result.rows[0];
};

const assertCourseEditable = (requester, course) => {
    requireRole(requester, COURSE_EDITOR_ROLES);
    if (!canEditOwnedEntity(requester, course.owner_scope, course.owner_centre_id)) {
        throw new HttpError(404, 'Course not found.');
    }
};

const createCourse = async (requester, input) => {
    requireRole(requester, COURSE_EDITOR_ROLES);
    const requestedKind = input.courseKind;
    if (!COURSE_KINDS.includes(requestedKind)) throw new HttpError(400, 'Invalid courseKind.');
    if (!input.name?.trim()) throw new HttpError(400, 'name is required.');

    const superAdmin = isSuperAdmin(requester);
    if (superAdmin && requestedKind === 'institution') {
        throw new HttpError(400, 'Use an institution account to create an institution-owned course.');
    }
    if (!superAdmin && requestedKind !== 'institution') {
        throw new HttpError(403, 'Institution users can create institution courses only.');
    }

    const ownerCentreId = superAdmin ? null : requireInstitution(requester);
    const ownerScope = superAdmin ? 'super_admin' : 'institution';
    const visibilityMode = requestedKind === 'core' ? 'all' : 'none';
    const result = await client.query(
        `INSERT INTO certification_data
            (certificate_name, curiculum_id, course_kind, owner_scope, owner_centre_id,
             created_by, publication_status, visibility_mode, ownership_review_required)
         VALUES ($1, $2, $3, $4, $5, $6, 'draft', $7, false)
         RETURNING *`,
        [input.name.trim(), input.curriculumId || null, requestedKind, ownerScope, ownerCentreId, requester.user_mail, visibilityMode]
    );
    await audit(client, requester, 'course.created', 'course', result.rows[0].certificate_id, ownerCentreId, { courseKind: requestedKind });
    return result.rows[0];
};

const listCourses = async (requester, view = 'management') => {
    const role = roleOf(requester);
    if (role === ROLES.TRAINEE || view === 'assigned') return listEffectiveCourses(requester);
    requireRole(requester, COURSE_EDITOR_ROLES);

    if (isSuperAdmin(requester)) {
        const result = await client.query(
            `SELECT cd.*,
                    COALESCE(jsonb_agg(DISTINCT cia.centre_id) FILTER (WHERE cia.centre_id IS NOT NULL), '[]'::jsonb) AS institution_ids
             FROM certification_data cd
             LEFT JOIN course_institution_access cia ON cia.course_id = cd.certificate_id
             GROUP BY cd.certificate_id
             ORDER BY cd.created_at DESC`
        );
        return result.rows;
    }

    const centreId = requireInstitution(requester);
    const result = await client.query(
        `SELECT cd.*,
                (cd.owner_scope = 'institution' AND cd.owner_centre_id = $1) AS can_edit
         FROM certification_data cd
         WHERE (cd.owner_scope = 'institution' AND cd.owner_centre_id = $1)
            OR (${courseEligibilitySql('cd', '$1')})
         ORDER BY can_edit DESC, cd.created_at DESC`,
        [centreId]
    );
    return result.rows;
};

const listEffectiveCourses = async (requester) => {
    requireRole(requester, [ROLES.TRAINEE]);
    const centreId = requireInstitution(requester);
    const result = await client.query(
        `SELECT cd.certificate_id, cd.certificate_name, cd.curiculum_id, cd.course_kind,
                cd.owner_scope, cd.owner_centre_id, cd.updated_at
         FROM certification_data cd
         WHERE ${courseEligibilitySql('cd', '$1')}
           AND (${assignmentSql('cd', '$1', '$2')})
         ORDER BY cd.certificate_name`,
        [centreId, requester.user_mail]
    );
    return result.rows;
};

const updateCourse = async (requester, courseId, input) => {
    const course = await getCourseById(client, courseId);
    assertCourseEditable(requester, course);
    const updates = [];
    const values = [];
    if (input.name !== undefined) {
        if (!input.name?.trim()) throw new HttpError(400, 'name cannot be empty.');
        values.push(input.name.trim());
        updates.push(`certificate_name = $${values.length}`);
    }
    if (input.curriculumId !== undefined) {
        values.push(input.curriculumId || null);
        updates.push(`curiculum_id = $${values.length}`);
    }
    if (updates.length === 0) throw new HttpError(400, 'No supported fields were provided.');
    values.push(courseId);
    const result = await client.query(
        `UPDATE certification_data SET ${updates.join(', ')}, updated_at = now()
         WHERE certificate_id = $${values.length} RETURNING *`,
        values
    );
    await audit(client, requester, 'course.updated', 'course', courseId, course.owner_centre_id);
    return result.rows[0];
};

const setPublication = async (requester, courseId, state) => {
    if (!PUBLICATION_STATES.includes(state)) throw new HttpError(400, 'Invalid publication state.');
    const course = await getCourseById(client, courseId);
    assertCourseEditable(requester, course);
    if (course.ownership_review_required) throw new HttpError(409, 'Resolve course ownership before publication.');
    const result = await client.query(
        `UPDATE certification_data SET publication_status = $1, updated_at = now()
         WHERE certificate_id = $2 RETURNING *`,
        [state, courseId]
    );
    await audit(client, requester, `course.${state}`, 'course', courseId, course.owner_centre_id);
    return result.rows[0];
};

const setInstitutionAccess = async (requester, courseId, mode, institutionIds = []) => {
    requireRole(requester, [ROLES.SUPER_ADMIN]);
    if (!VISIBILITY_MODES.includes(mode)) throw new HttpError(400, 'Invalid visibility mode.');
    const uniqueIds = [...new Set(institutionIds.filter(Boolean))];
    if (mode === 'selected' && uniqueIds.length === 0) throw new HttpError(400, 'institutionIds are required for selected visibility.');
    if (mode !== 'selected' && uniqueIds.length > 0) throw new HttpError(400, 'institutionIds are supported only for selected visibility.');

    const db = await client.connect();
    await db.query('BEGIN');
    try {
        const course = await getCourseById(db, courseId, true);
        if (course.course_kind !== 'specialized' || course.owner_scope !== 'super_admin') {
            throw new HttpError(409, 'Institution distribution applies only to specialized Super Admin courses.');
        }
        if (uniqueIds.length > 0) {
            const centers = await db.query('SELECT center_id FROM scan_centers WHERE center_id = ANY($1::uuid[])', [uniqueIds]);
            if (centers.rows.length !== uniqueIds.length) throw new HttpError(400, 'One or more institutionIds are invalid.');
        }
        await db.query('DELETE FROM course_institution_access WHERE course_id = $1', [courseId]);
        for (const centreId of uniqueIds) {
            await db.query(
                `INSERT INTO course_institution_access(course_id, centre_id, granted_by)
                 VALUES ($1, $2, $3)`,
                [courseId, centreId, requester.user_mail]
            );
        }
        await db.query(
            'UPDATE certification_data SET visibility_mode = $1, updated_at = now() WHERE certificate_id = $2',
            [mode, courseId]
        );
        await audit(db, requester, 'course.distribution_changed', 'course', courseId, null, { mode, institutionIds: uniqueIds });
        await db.query('COMMIT');
        return { mode, institutionIds: uniqueIds };
    } catch (error) {
        await db.query('ROLLBACK');
        throw error;
    } finally {
        db.release();
    }
};

const assertCourseEligibleForCentre = async (db, courseId, centreId) => {
    const result = await db.query(
        `SELECT cd.certificate_id FROM certification_data cd
         WHERE cd.certificate_id = $1 AND (${courseEligibilitySql('cd', '$2')})`,
        [courseId, centreId]
    );
    if (result.rows.length === 0) throw new HttpError(404, 'Eligible published course not found.');
};

const assertCourseReadable = async (requester, courseId) => {
    const role = roleOf(requester);
    if (role === ROLES.SUPER_ADMIN) return getCourseById(client, courseId);
    const centreId = requireInstitution(requester);
    if ([ROLES.INSTITUTION_ADMIN, ROLES.TUTOR].includes(role)) {
        const result = await client.query(
            `SELECT cd.* FROM certification_data cd
             WHERE cd.certificate_id = $1
               AND ((cd.owner_scope = 'institution' AND cd.owner_centre_id = $2)
                    OR (${courseEligibilitySql('cd', '$2')}))`,
            [courseId, centreId]
        );
        if (result.rows.length === 0) throw new HttpError(404, 'Course not found.');
        return result.rows[0];
    }
    if (role === ROLES.TRAINEE) {
        const result = await client.query(
            `SELECT cd.* FROM certification_data cd
             WHERE cd.certificate_id = $1
               AND (${courseEligibilitySql('cd', '$2')})
               AND (${assignmentSql('cd', '$2', '$3')})`,
            [courseId, centreId, requester.user_mail]
        );
        if (result.rows.length === 0) throw new HttpError(404, 'Course not found.');
        return result.rows[0];
    }
    throw new HttpError(403, 'You do not have permission to view courses.');
};

const replaceAssignments = async (requester, courseId, input) => {
    requireRole(requester, [ROLES.INSTITUTION_ADMIN, ROLES.TUTOR]);
    const centreId = requireInstitution(requester);
    const batchIds = [...new Set((input.batchIds || []).filter(Boolean))];
    const assigned = [...new Set((input.assignedTraineeIds || []).filter(Boolean))];
    const excluded = [...new Set((input.excludedTraineeIds || []).filter(Boolean))];
    if (assigned.some((id) => excluded.includes(id))) throw new HttpError(400, 'A trainee cannot be both assigned and excluded.');

    const db = await client.connect();
    await db.query('BEGIN');
    try {
        await assertCourseEligibleForCentre(db, courseId, centreId);
        if (batchIds.length > 0) {
            const batches = await db.query(
                'SELECT batch_id FROM batch_data WHERE centre_id = $1 AND batch_id = ANY($2::varchar[])',
                [centreId, batchIds]
            );
            if (batches.rows.length !== batchIds.length) throw new HttpError(400, 'One or more batchIds do not belong to your institution.');
        }
        const traineeIds = [...new Set([...assigned, ...excluded])];
        if (traineeIds.length > 0) {
            const trainees = await db.query(
                `SELECT user_email FROM user_data
                 WHERE centre_id = $1 AND user_role = '103' AND user_email = ANY($2::text[])`,
                [centreId, traineeIds]
            );
            if (trainees.rows.length !== traineeIds.length) throw new HttpError(400, 'One or more trainee IDs do not belong to your institution.');
        }

        await db.query('DELETE FROM course_batch_assignments WHERE course_id = $1 AND centre_id = $2', [courseId, centreId]);
        await db.query('DELETE FROM course_trainee_overrides WHERE course_id = $1 AND centre_id = $2', [courseId, centreId]);
        for (const batchId of batchIds) {
            await db.query(
                `INSERT INTO course_batch_assignments(course_id, centre_id, batch_id, assigned_by)
                 VALUES ($1, $2, $3, $4)`,
                [courseId, centreId, batchId, requester.user_mail]
            );
        }
        for (const [state, ids] of [['assigned', assigned], ['excluded', excluded]]) {
            for (const traineeId of ids) {
                await db.query(
                    `INSERT INTO course_trainee_overrides(course_id, centre_id, trainee_id, state, assigned_by)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [courseId, centreId, traineeId, state, requester.user_mail]
                );
            }
        }
        await audit(db, requester, 'course.assignments_replaced', 'course', courseId, centreId, {
            batchCount: batchIds.length,
            assignedTraineeCount: assigned.length,
            excludedTraineeCount: excluded.length
        });
        await db.query('COMMIT');
        return { batchIds, assignedTraineeIds: assigned, excludedTraineeIds: excluded };
    } catch (error) {
        await db.query('ROLLBACK');
        throw error;
    } finally {
        db.release();
    }
};

const getAssignments = async (requester, courseId) => {
    requireRole(requester, [ROLES.INSTITUTION_ADMIN, ROLES.TUTOR]);
    const centreId = requireInstitution(requester);
    await assertCourseEligibleForCentre(client, courseId, centreId);
    const [batches, overrides] = await Promise.all([
        client.query(
            'SELECT batch_id FROM course_batch_assignments WHERE course_id = $1 AND centre_id = $2 ORDER BY batch_id',
            [courseId, centreId]
        ),
        client.query(
            'SELECT trainee_id, state FROM course_trainee_overrides WHERE course_id = $1 AND centre_id = $2 ORDER BY trainee_id',
            [courseId, centreId]
        )
    ]);
    return {
        batchIds: batches.rows.map((row) => row.batch_id),
        assignedTraineeIds: overrides.rows.filter((row) => row.state === 'assigned').map((row) => row.trainee_id),
        excludedTraineeIds: overrides.rows.filter((row) => row.state === 'excluded').map((row) => row.trainee_id)
    };
};

const getEffectiveAccess = async (requester, courseId) => {
    requireRole(requester, [ROLES.SUPER_ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.TUTOR]);
    const centreId = isSuperAdmin(requester) ? requester.requested_centre_id : requireInstitution(requester);
    if (!centreId) throw new HttpError(400, 'An institutionId query parameter is required for Super Admin.');
    if (!isSuperAdmin(requester) && String(centreId) !== String(requester.centre_id)) throw new HttpError(404, 'Course not found.');
    await assertCourseEligibleForCentre(client, courseId, centreId);
    const result = await client.query(
        `SELECT u.user_email AS trainee_id, u.user_name,
                (${assignmentSql('cd', '$2', 'u.user_email')}) AS has_access
         FROM user_data u
         CROSS JOIN certification_data cd
         WHERE cd.certificate_id = $1 AND u.centre_id = $2 AND u.user_role = '103'
         ORDER BY u.user_name`,
        [courseId, centreId]
    );
    return result.rows;
};

const listMigrationReview = async (requester) => {
    requireRole(requester, [ROLES.SUPER_ADMIN]);
    const [courses, volumes, mappings] = await Promise.all([
        client.query(`SELECT * FROM certification_data WHERE ownership_review_required = true ORDER BY created_at`),
        client.query(`SELECT volume_id, volume_name, added_by, created_at FROM volumes WHERE ownership_review_required = true ORDER BY created_at`),
        client.query(`SELECT cm.*, v.owner_scope, v.owner_centre_id, v.ownership_review_required AS volume_review_required
                      FROM course_mapping cm
                      JOIN volumes v ON v.volume_id = cm.volume_id
                      LEFT JOIN course_mapping_migrations cmm ON cmm.mapping_id = cm.mapping_id
                      WHERE cmm.mapping_id IS NULL
                      ORDER BY cm.created_at`)
            .catch(() => ({ rows: [] }))
    ]);
    return { courses: courses.rows, volumes: volumes.rows, courseMappings: mappings.rows };
};

const resolveCourseOwnership = async (requester, courseId, input) => {
    requireRole(requester, [ROLES.SUPER_ADMIN]);
    if (!COURSE_KINDS.includes(input.courseKind)) throw new HttpError(400, 'Invalid courseKind.');
    const institutionOwned = input.courseKind === 'institution';
    if (institutionOwned && !input.institutionId) throw new HttpError(400, 'institutionId is required for an institution course.');
    if (!institutionOwned && input.institutionId) throw new HttpError(400, 'institutionId is valid only for an institution course.');
    const result = await client.query(
        `UPDATE certification_data
         SET course_kind = $1,
             owner_scope = $2,
             owner_centre_id = $3,
             visibility_mode = $4,
             ownership_review_required = false,
             publication_status = 'draft',
             updated_at = now()
         WHERE certificate_id = $5
         RETURNING *`,
        [input.courseKind, institutionOwned ? 'institution' : 'super_admin', input.institutionId || null,
            input.courseKind === 'core' ? 'all' : 'none', courseId]
    );
    if (result.rows.length === 0) throw new HttpError(404, 'Course not found.');
    await audit(client, requester, 'course.ownership_resolved', 'course', courseId, input.institutionId || null, input);
    return result.rows[0];
};

const resolveVolumeOwnership = async (requester, volumeId, input) => {
    requireRole(requester, [ROLES.SUPER_ADMIN]);
    if (!['super_admin', 'institution'].includes(input.ownerScope)) throw new HttpError(400, 'Invalid ownerScope.');
    const institutionOwned = input.ownerScope === 'institution';
    if (institutionOwned && !input.institutionId) throw new HttpError(400, 'institutionId is required for institution ownership.');
    if (!institutionOwned && input.institutionId) throw new HttpError(400, 'institutionId is valid only for institution ownership.');
    if (institutionOwned) {
        const center = await client.query('SELECT 1 FROM scan_centers WHERE center_id = $1', [input.institutionId]);
        if (center.rows.length === 0) throw new HttpError(400, 'Institution not found.');
    }
    const result = await client.query(
        `UPDATE volumes SET owner_scope = $1, owner_centre_id = $2, ownership_review_required = false
         WHERE volume_id = $3 RETURNING volume_id, volume_name, owner_scope, owner_centre_id`,
        [input.ownerScope, input.institutionId || null, volumeId]
    );
    if (result.rows.length === 0) throw new HttpError(404, 'Volume not found.');
    await audit(client, requester, 'volume.ownership_resolved', 'volume', volumeId, input.institutionId || null, input);
    return result.rows[0];
};

const migrateCourseMapping = async (requester, mappingId, input) => {
    requireRole(requester, [ROLES.SUPER_ADMIN]);
    const db = await client.connect();
    await db.query('BEGIN');
    try {
        const mappingResult = await db.query(
            `SELECT cm.*, v.owner_scope, v.owner_centre_id, v.ownership_review_required
             FROM course_mapping cm JOIN volumes v ON v.volume_id = cm.volume_id
             LEFT JOIN course_mapping_migrations cmm ON cmm.mapping_id = cm.mapping_id
             WHERE cm.mapping_id = $1 AND cmm.mapping_id IS NULL
             FOR UPDATE OF cm`,
            [mappingId]
        );
        if (mappingResult.rows.length === 0) throw new HttpError(404, 'Unmigrated course mapping not found.');
        const mapping = mappingResult.rows[0];
        if (mapping.ownership_review_required || !mapping.owner_scope) {
            throw new HttpError(409, 'Resolve the mapped volume ownership first.');
        }
        const allowedKinds = mapping.owner_scope === 'super_admin' ? ['core', 'specialized'] : ['institution'];
        if (!allowedKinds.includes(input.courseKind)) throw new HttpError(400, `courseKind must be one of: ${allowedKinds.join(', ')}.`);
        const courseResult = await db.query(
            `INSERT INTO certification_data
                (certificate_name, course_kind, owner_scope, owner_centre_id, created_by,
                 publication_status, visibility_mode, ownership_review_required)
             VALUES ($1, $2, $3, $4, $5, 'draft', $6, false)
             RETURNING *`,
            [mapping.course_name || mapping.volume_name, input.courseKind, mapping.owner_scope,
                mapping.owner_centre_id, requester.user_mail, input.courseKind === 'core' ? 'all' : 'none']
        );
        const course = courseResult.rows[0];
        await db.query(
            `INSERT INTO course_content_links
                (course_id, volume_id, shadow_recording_id, step_recording_id, created_by)
             VALUES ($1, $2, $3, $4, $5)`,
            [course.certificate_id, mapping.volume_id, mapping.shadow_recording_id || null, mapping.step_recording_id || null, requester.user_mail]
        );
        await db.query(
            `INSERT INTO course_mapping_migrations(mapping_id, course_id, migrated_by)
             VALUES ($1, $2, $3)`,
            [mappingId, course.certificate_id, requester.user_mail]
        );
        await audit(db, requester, 'course_mapping.migrated', 'course_mapping', mappingId, mapping.owner_centre_id, { courseId: course.certificate_id });
        await db.query('COMMIT');
        return course;
    } catch (error) {
        await db.query('ROLLBACK');
        throw error;
    } finally {
        db.release();
    }
};

module.exports = {
    COURSE_KINDS,
    PUBLICATION_STATES,
    VISIBILITY_MODES,
    createCourse,
    listCourses,
    listEffectiveCourses,
    updateCourse,
    setPublication,
    setInstitutionAccess,
    replaceAssignments,
    getAssignments,
    getEffectiveAccess,
    listMigrationReview,
    resolveCourseOwnership,
    resolveVolumeOwnership,
    migrateCourseMapping,
    getCourseById,
    assertCourseEligibleForCentre,
    assertCourseReadable,
    audit
};
