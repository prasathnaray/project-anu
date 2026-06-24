const { createReattData, getReattData } = require('../model/reattm');

const isBlank = (value) => !value || String(value).trim() === '';

const createReattDataController = async (req, res) => {
    const requester = req.user;
    const {
        uploaded_by,
        certificate_id,
        course_id,
        unit_name,
        resource_type,
        resource_id,
        max_reattempt_count
    } = req.body;

    if (isBlank(certificate_id)) {
        return res.status(400).json({
            status: 'Bad Request',
            code: 400,
            message: 'certificate_id should not be empty'
        });
    }

    if (isBlank(course_id)) {
        return res.status(400).json({
            status: 'Bad Request',
            code: 400,
            message: 'course_id should not be empty'
        });
    }

    if (isBlank(unit_name)) {
        return res.status(400).json({
            status: 'Bad Request',
            code: 400,
            message: 'unit_name should not be empty'
        });
    }

    if (isBlank(resource_type)) {
        return res.status(400).json({
            status: 'Bad Request',
            code: 400,
            message: 'resource_type should not be empty'
        });
    }

    if (isBlank(resource_id)) {
        return res.status(400).json({
            status: 'Bad Request',
            code: 400,
            message: 'resource_id should not be empty'
        });
    }

    const parsedMaxReattemptCount = Number(max_reattempt_count);
    if (isBlank(max_reattempt_count) || !Number.isInteger(parsedMaxReattemptCount) || parsedMaxReattemptCount < 0) {
        return res.status(400).json({
            status: 'Bad Request',
            code: 400,
            message: 'max_reattempt_count should be a non-negative integer'
        });
    }

    try {
        const result = await createReattData(requester, {
            uploaded_by,
            certificate_id,
            course_id,
            unit_name,
            resource_type,
            resource_id,
            max_reattempt_count: parsedMaxReattemptCount
        });

        return res.status(result.code || 200).json(result);
    } catch (err) {
        return res.status(500).json({
            status: 'Error',
            code: 500,
            message: err.message
        });
    }
};

const getReattDataController = async (req, res) => {
    try {
        const result = await getReattData(req.user, req.query);
        return res.status(result.code || 200).json(result);
    } catch (err) {
        return res.status(500).json({
            status: 'Error',
            code: 500,
            message: err.message
        });
    }
};

module.exports = {
    createReattDataController,
    getReattDataController
};
