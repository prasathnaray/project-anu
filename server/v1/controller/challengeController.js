const {
    submitChallengeAnswer,
    getChallengeAttemptDetails,
} = require('../model/challengem');

const isBlank = (value) => value === undefined || value === null || value === '';

const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
    }
    return null;
};

const validateSubmitPayload = (body) => {
    const missing = [];

    if (isBlank(body.resource_id)) missing.push('resource_id');
    if (isBlank(body.session_id)) missing.push('session_id');
    if (isBlank(body.question_number)) missing.push('question_number');
    if (body.choose_option === undefined || body.choose_option === null) missing.push('choose_option');
    if (body.isCorrect === undefined || body.isCorrect === null) missing.push('isCorrect');

    if (missing.length > 0) {
        return `${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} required`;
    }

    if (Number.isNaN(Number(body.question_number))) {
        return 'question_number must be a number';
    }

    const selectedOptions = Array.isArray(body.choose_option) ? body.choose_option : [body.choose_option];
    if (selectedOptions.map((option) => String(option).trim()).filter(Boolean).length === 0) {
        return 'choose_option should not be empty';
    }

    if (parseBoolean(body.isCorrect) === null) {
        return 'isCorrect must be true or false';
    }

    return null;
};

const submitChallengeController = async (req, res) => {
    try {
        const validationError = validateSubmitPayload(req.body);
        if (validationError) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: validationError,
            });
        }

        const result = await submitChallengeAnswer(req.user, {
            ...req.body,
            isCorrect: parseBoolean(req.body.isCorrect),
        });

        return res.status(result.code).json(result);
    } catch (err) {
        console.error('submitChallengeController error:', err);
        return res.status(500).json({
            status: 'Error',
            code: 500,
            message: err.message,
        });
    }
};

const getChallengeAttemptDetailsController = async (req, res) => {
    try {
        const { resource_id, session_id } = req.query;

        if (isBlank(resource_id)) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: 'resource_id is required',
            });
        }

        const result = await getChallengeAttemptDetails(req.user, { resource_id, session_id });
        return res.status(result.code).json(result);
    } catch (err) {
        console.error('getChallengeAttemptDetailsController error:', err);
        return res.status(500).json({
            status: 'Error',
            code: 500,
            message: err.message,
        });
    }
};

module.exports = {
    submitChallengeController,
    getChallengeAttemptDetailsController,
};
