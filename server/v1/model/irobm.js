const client = require('../utils/conn');
const submitActivity = (requester, payload) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [103].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.'
            });
        }
        client.query(
            `INSERT INTO activity_submissions 
             (session_id, user_id, resource_id, resource_type, question_no, option_chosen, is_correct, match_payload, time_taken, has_taken_clue, total_time_taken, submitted_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())`,
            [
                payload.sessionId,
                requester.user_mail,
                payload.resourceId,
                payload.resourceType,
                payload.questionNo ?? null,
                payload.optionChosen ?? null,
                payload.isCorrect ?? null,
                payload.matchPayload ? JSON.stringify(payload.matchPayload) : null,
                payload.timeTaken ?? null,
                payload.hasTakenClue ?? null,
                payload.totalTimeTaken ?? null,
            ],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};

module.exports = { submitActivity };
