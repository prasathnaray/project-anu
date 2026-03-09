const { submitActivity } = require('../model/irobm');
const buildPayload = (resourceType, body) => {
    switch (resourceType) {
        case 'TYPE1':
            return {
                resourceType,
                sessionId: body.sessionId,
                resourceId: body.resourceId,
                questionNo: body.questionNo,
                optionChosen: body.optionChosen,
                isCorrect: body.isCorrect,
            };

        case 'MATCHING':
            return {
                resourceType,
                sessionId: body.sessionId,
                resourceId: body.resourceId,
                questionNo: body.questionNo,
                matchPayload: body.payload,
                isCorrect: body.isCorrect,
            };

        case 'WORDSEARCH':
            return {
                resourceType,
                sessionId: body.sessionId,
                resourceId: body.resourceId,
                questionNo: body.questionNo,
                timeTaken: body.timeTaken,
                hasTakenClue: body.hasTakenClue,
            };

        case 'CROSSWORD':
            return {
                resourceType,
                sessionId: body.sessionId,
                resourceId: body.resourceId,
                totalTimeTaken: body.totalTimeTaken,
            };

        case 'PROBEMOVEMENTS':
            return {
                resourceType,
                sessionId: body.sessionId,
                resourceId: body.resourceId,
                totalTimeTaken: body.totalTimeTaken,
            };

        default:
            return null;
    }
};

const irobsubmit = async (req, res) => {
    try {
        const { resourceType, resourceId, sessionId, ...rest } = req.body;

        if (!resourceType) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: 'resourceType is required',
            });
        }

        if (!resourceId) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: 'resourceId is required',
            });
        }

        if (!sessionId) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: 'sessionId is required',
            });
        }

        const payload = buildPayload(resourceType.toUpperCase(), { ...rest, resourceId, sessionId });

        if (!payload) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: `Unknown resourceType: ${resourceType}`,
            });
        }

        const result = await submitActivity(req.user, payload);

        return res.status(200).json({
            status: 'Success',
            code: 200,
            message: 'Activity submitted successfully',
            data: result.rows ?? [],
        });
    } catch (err) {
        console.error('[submit] Error:', err);
        return res.status(500).json({ status: 'Error', code: 500, message: err.message });
    }
};
module.exports = { irobsubmit };