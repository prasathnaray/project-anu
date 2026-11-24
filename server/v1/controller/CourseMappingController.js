const {
    ALLOWED_TRIMESTERS,
    ALLOWED_MODULES,
    ALLOWED_COURSE_TYPES,
    createCourseMappingModel,
    getCourseMappingsModel,
    getCourseMappingsWithRecordingsModel,
    tagCustomCourseModel
} = require('../model/CourseMappingm');
const { hydrateStorageFields } = require('../utils/hydrateStorageFields');

const mappingFiltersFromQuery = (query) => ({
    trimester: query.trimester,
    anatomy_type: query.anatomy_type,
    volume_name: query.volume_name,
    module_name: query.module_name,
    course_type: query.course_type
});

const createCourseMappingController = async (req, res) => {
    const requester = req.user;
    const {
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
        cluster_id,
        batch_id,
        student_ids,
        course_options
    } = req.body;

    if (!module_name || !course_type || (module_name === 'Custom Course'
        ? !cluster_id || !batch_id || !Array.isArray(student_ids) || student_ids.length === 0 || !Array.isArray(course_options) || course_options.length === 0
        : (!trimester || !anatomy_type || !volume_name))) {
        return res.status(400).json({
            code: 400,
            status: 'Validation Error',
            message: module_name === 'Custom Course'
                ? 'cluster_id, batch_id, at least one student, module_name, and at least one course option are required.'
                : 'trimester, anatomy_type, volume_name, module_name, and course_type are required.'
        });
    }

    if (module_name !== 'Custom Course' && !ALLOWED_TRIMESTERS.includes(trimester)) {
        return res.status(400).json({
            code: 400,
            status: 'Validation Error',
            message: `trimester must be one of: ${ALLOWED_TRIMESTERS.join(', ')}.`
        });
    }

    if (!ALLOWED_MODULES.includes(module_name)) {
        return res.status(400).json({
            code: 400,
            status: 'Validation Error',
            message: `module_name must be one of: ${ALLOWED_MODULES.join(', ')}.`
        });
    }

    if (!ALLOWED_COURSE_TYPES.includes(course_type)) {
        return res.status(400).json({
            code: 400,
            status: 'Validation Error',
            message: `course_type must be one of: ${ALLOWED_COURSE_TYPES.join(', ')}.`
        });
    }

    if (module_name === 'Custom Course' &&
        (!Array.isArray(student_ids) || !Array.isArray(course_options) ||
         course_options.some(option => !['p1', 'p2', 'p3', 'p4', 't1', 't2'].includes(option)) ||
         course_options[0] !== course_type ||
         new Set(course_options).size !== course_options.length ||
         new Set(student_ids).size !== student_ids.length)) {
        return res.status(400).json({ code: 400, message: 'Choose valid, unique students and course options.' });
    }

    try {
        const result = await createCourseMappingModel(
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
            cluster_id,
            batch_id,
            student_ids,
            course_options
        );

        if (result.code && result.code !== 201) {
            return res.status(result.code).json(result);
        }

        return res.status(201).json({
            code: 201,
            status: 'Created Successfully',
            data: result.data
        });
    } catch (err) {
        console.error('createCourseMappingController error:', err);
        return res.status(500).json({
            code: 500,
            status: 'Error',
            message: err.message || 'Internal server error'
        });
    }
};

const getCourseMappingsController = async (req, res) => {
    const requester = req.user;

    try {
        const result = await getCourseMappingsModel(requester, mappingFiltersFromQuery(req.query));

        if (result.code && result.code !== 200) {
            return res.status(result.code).json(result);
        }

        return res.status(200).json({
            code: 200,
            status: 'Success',
            data: result.data
        });
    } catch (err) {
        console.error('getCourseMappingsController error:', err);
        return res.status(500).json({
            code: 500,
            status: 'Error',
            message: err.message || 'Internal server error'
        });
    }
};

const getCourseMappingsWithRecordingsController = async (req, res) => {
    try {
        const result = await getCourseMappingsWithRecordingsModel(
            req.user,
            mappingFiltersFromQuery(req.query)
        );

        if (result.code !== 200) {
            return res.status(result.code).json(result);
        }

        return res.status(200).json({
            code: 200,
            status: 'Success',
            data: await hydrateStorageFields(result.data)
        });
    } catch (err) {
        console.error('getCourseMappingsWithRecordingsController error:', err);
        return res.status(500).json({
            code: 500,
            status: 'Error',
            message: err.message || 'Internal server error'
        });
    }
};

const tagCustomCourseController = async (req, res) => {
    const { mapping_id } = req.params;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(mapping_id)) {
        return res.status(400).json({ code: 400, message: 'Valid mapping_id is required.' });
    }
    try {
        const result = await tagCustomCourseModel(req.user, mapping_id, req.body || {});
        return res.status(result.code).json(result);
    } catch (err) {
        console.error('tagCustomCourseController error:', err);
        return res.status(500).json({ code: 500, message: 'Failed to tag course.' });
    }
};

module.exports = {
    createCourseMappingController,
    getCourseMappingsController,
    getCourseMappingsWithRecordingsController,
    tagCustomCourseController
};
