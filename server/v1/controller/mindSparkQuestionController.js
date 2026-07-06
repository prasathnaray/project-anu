const {
    createMindSparkQuestions,
    getMindSparkQuestions,
    updateMindSparkQuestion,
    deleteMindSparkQuestion,
    getMindSparkAttemptDetails,
} = require('../model/mindSparkQuestionm');

const isBlank = (value) => value === undefined || value === null || value === '';

const validateQuestion = (question, defaultResourceId) => {
    const resourceId = question.resource_id ?? defaultResourceId;
    const questionNo = question.question_no ?? question.questionNo;
    const prompt = question.prompt ?? question.question_query ?? question.question;
    const correctAnswer = question.correct_answer ?? question.correctAnswer ?? question.answer;

    if (isBlank(resourceId)) return 'resource_id is required';
    if (isBlank(questionNo)) return 'question_no is required';
    if (isBlank(prompt)) return 'prompt is required';
    if (correctAnswer === undefined || correctAnswer === null) return 'correct_answer is required';

    return null;
};

const createQuestionsController = async (req, res) => {
    try {
        const questions = Array.isArray(req.body.questions) ? req.body.questions : [req.body];

        if (questions.length === 0) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: 'questions should not be empty'
            });
        }

        for (const question of questions) {
            const validationError = validateQuestion(question, req.body.resource_id);
            if (validationError) {
                return res.status(400).json({
                    status: 'Bad Request',
                    code: 400,
                    message: validationError
                });
            }
        }

        const result = await createMindSparkQuestions(req.user, req.body);
        if (result.code === 401) {
            return res.status(401).json(result);
        }

        return res.status(200).json({
            status: 'Success',
            code: 200,
            message: 'Mindspark questions saved successfully',
            data: result.data
        });
    } catch (err) {
        console.error('Error creating Mindspark questions:', err);
        return res.status(500).json({
            status: 'Error',
            code: 500,
            message: 'Failed to save Mindspark questions',
            error: err.message
        });
    }
};

const getQuestionsController = async (req, res) => {
    try {
        const { resource_id, mindspark_no, include_inactive } = req.query;

        if (isBlank(resource_id)) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: 'resource_id is required'
            });
        }

        const result = await getMindSparkQuestions(req.user, {
            resource_id,
            mindspark_no,
            include_inactive: include_inactive === 'true'
        });

        if (result.code === 401) {
            return res.status(401).json(result);
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching Mindspark questions:', err);
        return res.status(500).json({
            status: 'Error',
            code: 500,
            message: 'Failed to fetch Mindspark questions',
            error: err.message
        });
    }
};

const updateQuestionController = async (req, res) => {
    try {
        const { question_id } = req.params;

        if (isBlank(question_id)) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: 'question_id is required'
            });
        }

        const result = await updateMindSparkQuestion(req.user, question_id, req.body);
        if (result.code === 401) {
            return res.status(401).json(result);
        }
        if (!result.data) {
            return res.status(404).json({
                status: 'Not Found',
                code: 404,
                message: 'Question not found'
            });
        }

        return res.status(200).json({
            status: 'Success',
            code: 200,
            message: 'Mindspark question updated successfully',
            data: result.data
        });
    } catch (err) {
        console.error('Error updating Mindspark question:', err);
        return res.status(500).json({
            status: 'Error',
            code: 500,
            message: 'Failed to update Mindspark question',
            error: err.message
        });
    }
};

const deleteQuestionController = async (req, res) => {
    try {
        const { question_id } = req.params;

        if (isBlank(question_id)) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: 'question_id is required'
            });
        }

        const result = await deleteMindSparkQuestion(req.user, question_id);
        if (result.code === 401) {
            return res.status(401).json(result);
        }
        if (!result.data) {
            return res.status(404).json({
                status: 'Not Found',
                code: 404,
                message: 'Question not found'
            });
        }

        return res.status(200).json({
            status: 'Success',
            code: 200,
            message: 'Mindspark question deleted successfully',
            data: result.data
        });
    } catch (err) {
        console.error('Error deleting Mindspark question:', err);
        return res.status(500).json({
            status: 'Error',
            code: 500,
            message: 'Failed to delete Mindspark question',
            error: err.message
        });
    }
};

const getAttemptDetailsController = async (req, res) => {
    try {
        const { resource_id, session_id } = req.query;

        if (isBlank(resource_id)) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: 'resource_id is required'
            });
        }

        const result = await getMindSparkAttemptDetails(req.user, { resource_id, session_id });
        if (result.code === 401) {
            return res.status(401).json(result);
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching Mindspark attempt details:', err);
        return res.status(500).json({
            status: 'Error',
            code: 500,
            message: 'Failed to fetch Mindspark attempt details',
            error: err.message
        });
    }
};

module.exports = {
    createQuestionsController,
    getQuestionsController,
    updateQuestionController,
    deleteQuestionController,
    getAttemptDetailsController,
};
