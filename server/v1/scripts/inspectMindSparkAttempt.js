const client = require('../utils/conn');

const sessionId = process.argv[2] || '811e0ae8-d05f-4a80-9f49-640a5e956e53';
const resourceId = process.argv[3] || 'd205a94c-cdfc-4e04-986f-0fe5e9432cc5';

const getOptionText = (options, optionKey) => {
    const selected = (Array.isArray(options) ? options : []).find((option) => (
        String(option.key ?? option.value ?? '').slice(0, 10) === String(optionKey)
    ));
    return selected?.text ?? selected?.label ?? selected?.value ?? '';
};

const main = async () => {
    const result = await client.query(`
        SELECT
            ass.question_no,
            msq.prompt,
            ass.option_chosen,
            ass.is_correct,
            msq.correct_answer,
            msq.options
        FROM activity_submissions ass
        LEFT JOIN public.mind_spark_questions msq
            ON msq.resource_id = ass.resource_id
           AND msq.question_no = ass.question_no
           AND msq.is_active = true
        WHERE ass.session_id = $1
          AND ass.resource_id = $2
        ORDER BY ass.question_no
    `, [sessionId, resourceId]);

    const rows = result.rows.map((row) => {
        const correct = row.correct_answer || {};
        const correctKey = String(correct.key ?? correct.value ?? correct.answer ?? correct.option ?? '');
        return {
            question_no: row.question_no,
            status: row.is_correct ? 'RIGHT' : 'WRONG',
            selected: row.option_chosen,
            selected_text: getOptionText(row.options, row.option_chosen),
            correct_answer: correctKey || JSON.stringify(correct),
            correct_text: getOptionText(row.options, correctKey),
            question: row.prompt,
        };
    });

    console.table(rows);
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
