const {
    ALLOWED_TRIMESTERS,
    ALLOWED_MODULES,
    ALLOWED_COURSE_TYPES,
    createCourseMappingModel,
    getCourseMappingsModel
} = require('../model/CourseMappingm');

const createCourseMappingController = async (req, res) => {
    const requester = req.user;
    const {
        trimester,
        anatomy_type,
        volume_name,
        module_name,
        course_type,
        shadow_recording_id,
        step_recording_id
    } = req.body;

    if (!trimester || !anatomy_type || !volume_name || !module_name || !course_type) {
        return res.status(400).json({
            code: 400,
            status: 'Validation Error',
            message: 'trimester, anatomy_type, volume_name, module_name, and course_type are required.'
        });
    }

    if (!ALLOWED_TRIMESTERS.includes(trimester)) {
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

    try {
        const result = await createCourseMappingModel(
            requester,
            trimester,
            anatomy_type,
            volume_name,
            module_name,
            course_type,
            shadow_recording_id,
            step_recording_id
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
    const {
        trimester,
        anatomy_type,
        volume_name,
        module_name,
        course_type
    } = req.query;

    try {
        const result = await getCourseMappingsModel(requester, {
            trimester,
            anatomy_type,
            volume_name,
            module_name,
            course_type
        });

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

module.exports = {
    createCourseMappingController,
    getCourseMappingsController
};
