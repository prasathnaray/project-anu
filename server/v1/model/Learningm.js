const client = require('../utils/conn');
const { assertCourseReadable, getCourseById } = require('./ContentAccessm');
const { canEditOwnedEntity, HttpError } = require('../Auth/authorization');
const Learningm = async (certificate_id, course_name, module_name, unit_name, requester) => {
    const course = await getCourseById(client, certificate_id);
    if (!canEditOwnedEntity(requester, course.owner_scope, course.owner_centre_id)) {
        throw new HttpError(404, 'Course not found.');
    }
    return client.query(
        'INSERT INTO learning_module(certificate_id, course_name, module_name, unit_name) VALUES($1, $2, $3, $4)',
        [certificate_id, course_name, module_name, unit_name]
    );
};

const getLearningByidm = async (certificate_id, requester) => {
    await assertCourseReadable(requester, certificate_id);
    const result = await client.query('SELECT * FROM learning_module WHERE certificate_id = $1', [certificate_id]);
    return result.rows;
};
const getResourceBylmandrt = async (requester, r_type, learning_module_id) => {
    const moduleResult = await client.query(
        'SELECT certificate_id FROM learning_module WHERE learning_module_id = $1',
        [learning_module_id]
    );
    if (moduleResult.rows.length === 0) throw new HttpError(404, 'Learning module not found.');
    await assertCourseReadable(requester, moduleResult.rows[0].certificate_id);
    const result = await client.query(
        `SELECT rd.* FROM resource_data rd
         WHERE rd.resource_type = $1 AND rd.learning_module_id = $2
           AND (
             COALESCE((to_jsonb(rd)->>'is_hidden')::boolean, false) IS NOT TRUE
             OR (
               lower(trim(coalesce(rd.resource_type, ''))) = lower('Learning Resource')
               AND regexp_replace(lower(coalesce(rd.resource_topic, '')), '[^a-z0-9]+', '', 'g') IN (
                 'imagingtheplane',
                 'imagingthetransabdominalplane',
                 'imagingthetransfemoralplane'
               )
               AND regexp_replace(lower(coalesce(rd.resource_name, '')), '[^a-z0-9]+', '', 'g') IN (
                 'mindsparksprobemovement',
                 'mindsparksprobemovements',
                 'minsparksprobemovement',
                 'minsparksprobemovements'
               )
               AND EXISTS (
                 SELECT 1
                 FROM learning_module restored_lm
                 JOIN certification_data restored_cd
                   ON restored_cd.certificate_id = restored_lm.certificate_id
                 WHERE restored_lm.learning_module_id = rd.learning_module_id
                   AND lower(trim(coalesce(restored_cd.certificate_name, ''))) = lower('BTC')
                   AND (
                     regexp_replace(lower(coalesce(restored_lm.course_name, '')), '[^a-z0-9]+', '', 'g') IN ('ac', 'aclearningresource', 'fl', 'fllearningresource')
                     OR regexp_replace(lower(coalesce(restored_lm.module_name, '')), '[^a-z0-9]+', '', 'g') IN ('ac', 'aclearningresource', 'fl', 'fllearningresource')
                     OR regexp_replace(lower(coalesce(restored_lm.unit_name, '')), '[^a-z0-9]+', '', 'g') IN ('ac', 'aclearningresource', 'fl', 'fllearningresource')
                   )
               )
             )
           )
         ORDER BY rd.display_order ASC NULLS LAST, rd.created_at ASC`,
        [r_type, learning_module_id]
    );
    return result.rows;
};
module.exports = {Learningm, getLearningByidm, getResourceBylmandrt};
