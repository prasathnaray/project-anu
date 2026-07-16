const client = require('../utils/conn');

const ALLOWED_ROLES = [99, 101, 102, 103];
const RESOURCE_TYPE = 'CHALLENGE';

const isAllowed = (requester) => ALLOWED_ROLES.includes(Number(requester.role));

const updateProgress = async (userId, resourceId) => {
    await client.query(
        `INSERT INTO progress_data (user_id, resourse_id, is_completed, updated_at)
         VALUES ($1, $2, TRUE, NOW())
         ON CONFLICT (user_id, resourse_id)
         DO UPDATE SET is_completed = TRUE, updated_at = NOW()`,
        [userId, resourceId]
    );
};

const normalizeChosenOption = (chooseOption) => {
    if (Array.isArray(chooseOption)) {
        return chooseOption.map((option) => String(option).trim()).filter(Boolean);
    }

    if (chooseOption === undefined || chooseOption === null) {
        return [];
    }

    return [String(chooseOption).trim()].filter(Boolean);
};

const submitChallengeAnswer = async (requester, payload) => {
    if (!isAllowed(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to submit challenges.'
        };
    }

    const selectedOptions = normalizeChosenOption(payload.choose_option);
    const optionChosen = selectedOptions.join(', ');
    const questionNo = Number(payload.question_number);
    const isCorrect = payload.isCorrect;
    const answerPayload = {
        selected_options: selectedOptions,
        question_part: payload.question_part ?? null,
        question_text: payload.question_text ?? null,
        correct_answer: payload.correct_answer ?? null,
        feedback_correct: payload.feedback_correct ?? null,
        feedback_wrong: payload.feedback_wrong ?? null,
    };

    const result = await client.query(
        `INSERT INTO activity_submissions
            (session_id, user_id, resource_id, resource_type, question_no, option_chosen,
             is_correct, match_payload, time_taken, total_time_taken, submitted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
         RETURNING *`,
        [
            payload.session_id,
            requester.user_mail,
            payload.resource_id,
            RESOURCE_TYPE,
            questionNo,
            optionChosen,
            isCorrect,
            JSON.stringify(answerPayload),
            payload.time_taken ?? null,
            payload.total_time_taken ?? null,
        ]
    );

    if (payload.mark_completed !== false) {
        await updateProgress(requester.user_mail, payload.resource_id);
    }

    return {
        status: 'Success',
        code: 201,
        message: 'Challenge answer submitted successfully',
        data: result.rows[0],
    };
};

const getChallengeAttemptDetails = async (requester, { resource_id, session_id }) => {
    if (!isAllowed(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view challenge attempts.'
        };
    }

    const values = [resource_id, requester.user_mail];
    const conditions = [
        'resource_id = $1',
        'user_id = $2',
        'resource_type = $3',
    ];
    values.push(RESOURCE_TYPE);

    if (session_id) {
        values.push(session_id);
        conditions.push(`session_id = $${values.length}`);
    }

    const result = await client.query(
        `SELECT *
         FROM activity_submissions
         WHERE ${conditions.join(' AND ')}
         ORDER BY submitted_at ASC, question_no ASC`,
        values
    );

    const total = result.rows.length;
    const correct = result.rows.filter((row) => row.is_correct === true).length;

    return {
        status: 'Success',
        code: 200,
        data: result.rows,
        summary: {
            total_questions: total,
            correct_answers: correct,
            wrong_answers: total - correct,
            score_percentage: total > 0 ? Number(((correct / total) * 100).toFixed(2)) : null,
        },
    };
};

module.exports = {
    submitChallengeAnswer,
    getChallengeAttemptDetails,
};
