const client = require('../utils/conn');

const isAdmin = (requester) => [99, 101, 102].includes(Number(requester.role));
const canRead = (requester) => [99, 101, 102, 103].includes(Number(requester.role));

const ensureMindSparkQuestionsTable = async () => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS public.mind_spark_questions (
            question_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            resource_id uuid NOT NULL,
            mindspark_no integer NOT NULL DEFAULT 1,
            question_no integer NOT NULL,
            question_type character varying(50) NOT NULL DEFAULT 'MCQ',
            prompt text NOT NULL,
            options jsonb NOT NULL DEFAULT '[]'::jsonb,
            correct_answer jsonb NOT NULL,
            feedback_correct text,
            feedback_wrong text,
            assets jsonb NOT NULL DEFAULT '[]'::jsonb,
            metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
            is_active boolean NOT NULL DEFAULT true,
            created_by character varying(100),
            created_at timestamp without time zone DEFAULT now(),
            updated_at timestamp without time zone DEFAULT now()
        );

        UPDATE public.mind_spark_questions
        SET mindspark_no = 1
        WHERE mindspark_no IS NULL;

        ALTER TABLE public.mind_spark_questions
            ALTER COLUMN mindspark_no SET DEFAULT 1;

        ALTER TABLE public.mind_spark_questions
            ALTER COLUMN mindspark_no SET NOT NULL;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_mind_spark_questions_unique_question
            ON public.mind_spark_questions(resource_id, mindspark_no, question_no);

        CREATE INDEX IF NOT EXISTS idx_mind_spark_questions_resource_id
            ON public.mind_spark_questions(resource_id);

        CREATE INDEX IF NOT EXISTS idx_mind_spark_questions_active
            ON public.mind_spark_questions(is_active);
    `);
};

const normalizeQuestion = (question) => ({
    resource_id: question.resource_id,
    mindspark_no: question.mindspark_no ?? question.mindsparkNo ?? 1,
    question_no: question.question_no ?? question.questionNo,
    question_type: question.question_type ?? question.questionType ?? 'MCQ',
    prompt: question.prompt ?? question.question_query ?? question.question ?? null,
    options: question.options ?? question.options_available ?? [],
    correct_answer: question.correct_answer ?? question.correctAnswer ?? question.answer ?? null,
    feedback_correct: question.feedback_correct ?? question.feedbackCorrect ?? null,
    feedback_wrong: question.feedback_wrong ?? question.feedbackWrong ?? null,
    assets: question.assets ?? [],
    metadata: question.metadata ?? {},
    is_active: question.is_active ?? question.isActive ?? true,
});

const createMindSparkQuestions = async (requester, payload) => {
    if (!isAdmin(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to configure Mindspark questions.'
        };
    }

    const questions = Array.isArray(payload.questions) ? payload.questions : [payload];
    const normalizedQuestions = questions.map((question) => normalizeQuestion({
        ...question,
        resource_id: question.resource_id ?? payload.resource_id,
        mindspark_no: question.mindspark_no ?? question.mindsparkNo ?? payload.mindspark_no ?? payload.mindsparkNo,
    }));

    await ensureMindSparkQuestionsTable();

    const db = await client.connect();
    try {
        await db.query('BEGIN');

        const rows = [];
        for (const question of normalizedQuestions) {
            const result = await db.query(
                `INSERT INTO mind_spark_questions
                    (resource_id, mindspark_no, question_no, question_type, prompt, options,
                     correct_answer, feedback_correct, feedback_wrong, assets, metadata, is_active, created_by, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10::jsonb, $11::jsonb, $12, $13, NOW())
                 ON CONFLICT (resource_id, mindspark_no, question_no)
                 DO UPDATE SET
                    question_type = EXCLUDED.question_type,
                    prompt = EXCLUDED.prompt,
                    options = EXCLUDED.options,
                    correct_answer = EXCLUDED.correct_answer,
                    feedback_correct = EXCLUDED.feedback_correct,
                    feedback_wrong = EXCLUDED.feedback_wrong,
                    assets = EXCLUDED.assets,
                    metadata = EXCLUDED.metadata,
                    is_active = EXCLUDED.is_active,
                    updated_at = NOW()
                 RETURNING *`,
                [
                    question.resource_id,
                    question.mindspark_no,
                    question.question_no,
                    question.question_type,
                    question.prompt,
                    JSON.stringify(question.options),
                    JSON.stringify(question.correct_answer),
                    question.feedback_correct,
                    question.feedback_wrong,
                    JSON.stringify(question.assets),
                    JSON.stringify(question.metadata),
                    question.is_active,
                    requester.user_mail,
                ]
            );
            rows.push(result.rows[0]);
        }

        await db.query('COMMIT');
        return { status: 'Success', code: 200, data: rows };
    } catch (err) {
        await db.query('ROLLBACK');
        throw err;
    } finally {
        db.release();
    }
};

const getMindSparkQuestions = async (requester, { resource_id, mindspark_no, include_inactive }) => {
    if (!canRead(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view Mindspark questions.'
        };
    }

    await ensureMindSparkQuestionsTable();

    const conditions = ['resource_id = $1'];
    const values = [resource_id];

    if (mindspark_no !== undefined && mindspark_no !== null && mindspark_no !== '') {
        values.push(mindspark_no);
        conditions.push(`mindspark_no = $${values.length}`);
    }

    if (!include_inactive) {
        conditions.push('is_active = TRUE');
    }

    const result = await client.query(
        `SELECT *
         FROM mind_spark_questions
         WHERE ${conditions.join(' AND ')}
         ORDER BY mindspark_no ASC NULLS LAST, question_no ASC, created_at ASC`,
        values
    );

    return { status: 'Success', code: 200, data: result.rows };
};

const updateMindSparkQuestion = async (requester, questionId, payload) => {
    if (!isAdmin(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to update Mindspark questions.'
        };
    }

    await ensureMindSparkQuestionsTable();

    const question = {
        mindspark_no: payload.mindspark_no ?? payload.mindsparkNo,
        question_no: payload.question_no ?? payload.questionNo,
        question_type: payload.question_type ?? payload.questionType,
        prompt: payload.prompt ?? payload.question_query ?? payload.question,
        options: payload.options ?? payload.options_available,
        correct_answer: payload.correct_answer ?? payload.correctAnswer ?? payload.answer,
        feedback_correct: payload.feedback_correct ?? payload.feedbackCorrect,
        feedback_wrong: payload.feedback_wrong ?? payload.feedbackWrong,
        assets: payload.assets,
        metadata: payload.metadata,
        is_active: payload.is_active ?? payload.isActive,
    };

    const result = await client.query(
        `UPDATE mind_spark_questions
         SET
            mindspark_no = COALESCE($2, mindspark_no),
            question_no = COALESCE($3, question_no),
            question_type = COALESCE($4, question_type),
            prompt = COALESCE($5, prompt),
            options = COALESCE($6::jsonb, options),
            correct_answer = COALESCE($7::jsonb, correct_answer),
            feedback_correct = COALESCE($8, feedback_correct),
            feedback_wrong = COALESCE($9, feedback_wrong),
            assets = COALESCE($10::jsonb, assets),
            metadata = COALESCE($11::jsonb, metadata),
            is_active = COALESCE($12, is_active),
            updated_at = NOW()
         WHERE question_id = $1
         RETURNING *`,
        [
            questionId,
            question.mindspark_no,
            question.question_no,
            question.question_type,
            question.prompt,
            question.options !== undefined ? JSON.stringify(question.options) : null,
            question.correct_answer !== undefined ? JSON.stringify(question.correct_answer) : null,
            question.feedback_correct,
            question.feedback_wrong,
            question.assets !== undefined ? JSON.stringify(question.assets) : null,
            question.metadata !== undefined ? JSON.stringify(question.metadata) : null,
            question.is_active ?? null,
        ]
    );

    return { status: 'Success', code: 200, data: result.rows[0] ?? null };
};

const deleteMindSparkQuestion = async (requester, questionId) => {
    if (!isAdmin(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to delete Mindspark questions.'
        };
    }

    await ensureMindSparkQuestionsTable();

    const result = await client.query(
        `UPDATE mind_spark_questions
         SET is_active = FALSE, updated_at = NOW()
         WHERE question_id = $1
         RETURNING *`,
        [questionId]
    );

    return { status: 'Success', code: 200, data: result.rows[0] ?? null };
};

const getMindSparkAttemptDetails = async (requester, { resource_id, session_id }) => {
    if (!canRead(requester)) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view Mindspark attempt details.'
        };
    }

    await ensureMindSparkQuestionsTable();

    const latestSessionResult = await client.query(
        `SELECT session_id
         FROM activity_submissions
         WHERE user_id = $1
           AND resource_id = $2
           AND ($3::uuid IS NULL OR session_id = $3::uuid)
         GROUP BY session_id
         ORDER BY MAX(submitted_at) DESC
         LIMIT 1`,
        [requester.user_mail, resource_id, session_id || null]
    );

    const latestSessionId = latestSessionResult.rows[0]?.session_id || null;
    if (!latestSessionId) {
        return {
            status: 'Success',
            code: 200,
            data: [],
            summary: {
                session_id: null,
                total_questions: 0,
                correct_answers: 0,
                wrong_answers: 0,
                score_percentage: null,
            }
        };
    }

    const result = await client.query(
        `SELECT
            msq.question_id,
            msq.question_no,
            msq.question_type,
            msq.prompt,
            msq.options,
            msq.correct_answer,
            msq.feedback_correct,
            msq.feedback_wrong,
            ass.session_id,
            ass.option_chosen,
            ass.is_correct,
            ass.submitted_at
         FROM mind_spark_questions msq
         LEFT JOIN activity_submissions ass
            ON ass.resource_id = msq.resource_id
           AND ass.question_no = msq.question_no
           AND ass.session_id = $2
           AND ass.user_id = $3
         WHERE msq.resource_id = $1
           AND msq.is_active = true
         ORDER BY msq.question_no ASC`,
        [resource_id, latestSessionId, requester.user_mail]
    );

    const rows = result.rows;
    const total = rows.length;
    const correct = rows.filter(row => row.is_correct === true).length;
    const wrong = rows.filter(row => row.is_correct === false).length;

    return {
        status: 'Success',
        code: 200,
        data: rows,
        summary: {
            session_id: latestSessionId,
            total_questions: total,
            correct_answers: correct,
            wrong_answers: wrong,
            score_percentage: total > 0 ? Number(((correct / total) * 100).toFixed(2)) : null,
        }
    };
};

module.exports = {
    ensureMindSparkQuestionsTable,
    createMindSparkQuestions,
    getMindSparkQuestions,
    updateMindSparkQuestion,
    deleteMindSparkQuestion,
    getMindSparkAttemptDetails,
};
