const crypto = require('crypto');
const client = require('../utils/conn');

const pickOption = (question, makeCorrect) => {
    const options = Array.isArray(question.options) ? question.options : [];
    const correct = question.correct_answer || {};
    const correctKey = String(correct.key ?? correct.value ?? correct.answer ?? correct.option ?? '');

    if (makeCorrect && correctKey) return correctKey.slice(0, 10);
    const fallback = options.find((option) => String(option.key ?? option.value ?? '') !== correctKey) || options[0];
    return String(fallback?.key ?? fallback?.value ?? fallback?.label ?? fallback?.text ?? '').slice(0, 10);
};

const main = async () => {
    const resourceResult = await client.query(`
        SELECT
            msq.resource_id,
            rd.resource_name,
            count(*)::int AS question_count
        FROM public.mind_spark_questions msq
        LEFT JOIN resource_data rd ON rd.resource_id = msq.resource_id
        WHERE msq.is_active = true
        GROUP BY msq.resource_id, rd.resource_name
        ORDER BY question_count DESC, rd.resource_name
        LIMIT 1
    `);

    const resource = resourceResult.rows[0];
    if (!resource) throw new Error('No configured Mindspark questions found.');

    const userResult = await client.query(`
        SELECT user_email
        FROM user_data
        WHERE user_role::text = '103'
        ORDER BY user_email
        LIMIT 1
    `);

    const user = userResult.rows[0];
    if (!user) throw new Error('No trainee user found.');

    const questionResult = await client.query(`
        SELECT question_no, question_type, options, correct_answer
        FROM public.mind_spark_questions
        WHERE resource_id = $1
          AND is_active = true
        ORDER BY question_no
    `, [resource.resource_id]);

    const questions = questionResult.rows;
    const sessionId = crypto.randomUUID();

    await client.query('BEGIN');
    try {
        for (const [index, question] of questions.entries()) {
            const isCorrect = index < Math.ceil(questions.length / 2);
            await client.query(`
                INSERT INTO activity_submissions
                    (session_id, user_id, resource_id, resource_type, question_no, option_chosen, is_correct, submitted_at)
                VALUES
                    ($1, $2, $3, $4, $5, $6, $7, NOW())
            `, [
                sessionId,
                user.user_email,
                resource.resource_id,
                'Mindspark',
                question.question_no,
                pickOption(question, isCorrect),
                isCorrect,
            ]);
        }

        await client.query(`
            INSERT INTO progress_data (user_id, resourse_id, is_completed, updated_at)
            VALUES ($1, $2, TRUE, NOW())
            ON CONFLICT (user_id, resourse_id)
            DO UPDATE SET is_completed = TRUE, updated_at = NOW()
        `, [user.user_email, resource.resource_id]);

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }

    const scoreResult = await client.query(`
        SELECT
            count(*)::int AS total_questions,
            count(*) FILTER (WHERE is_correct = true)::int AS correct_answers,
            count(*) FILTER (WHERE is_correct = false)::int AS wrong_answers,
            round(count(*) FILTER (WHERE is_correct = true)::decimal / nullif(count(*), 0) * 100, 2) AS score_percentage
        FROM activity_submissions
        WHERE session_id = $1
          AND resource_id = $2
    `, [sessionId, resource.resource_id]);

    console.table([{
        session_id: sessionId,
        user_id: user.user_email,
        resource_id: resource.resource_id,
        resource_name: resource.resource_name,
        ...scoreResult.rows[0],
    }]);
};

main()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(() => {
        client.end().catch(() => {});
        setTimeout(() => process.exit(process.exitCode || 0), 100);
    });
