const client = require('../utils/conn');

const execute = process.argv.includes('--execute');

const resourceCte = (hasQuestionTable) => `
    WITH mindspark_resources AS (
        SELECT DISTINCT resource_id
        FROM resource_data
        WHERE lower(coalesce(resource_name, '')) LIKE '%mind spark%'
           OR lower(coalesce(resource_name, '')) LIKE '%mindspark%'
        ${hasQuestionTable ? `
        UNION
        SELECT DISTINCT resource_id
        FROM public.mind_spark_questions
        WHERE resource_id IS NOT NULL
        ` : ''}
    )
`;

const scalar = async (sql, params = []) => {
    const result = await client.query(sql, params);
    return Number(result.rows[0]?.count || 0);
};

const affected = async (sql, params = []) => {
    const result = await client.query(sql, params);
    return result.rowCount || 0;
};

const main = async () => {
    const hasQuestionTable = (await client.query(
        "SELECT to_regclass('public.mind_spark_questions') IS NOT NULL AS exists"
    )).rows[0].exists;
    const hasLegacyTable = (await client.query(
        "SELECT to_regclass('public.mind_sparks') IS NOT NULL AS exists"
    )).rows[0].exists;

    const cte = resourceCte(hasQuestionTable);

    const before = {
        mindspark_resources: await scalar(`${cte} SELECT count(*) FROM mindspark_resources`),
        activity_submissions: await scalar(`${cte} SELECT count(*) FROM activity_submissions WHERE resource_id IN (SELECT resource_id FROM mindspark_resources)`),
        progress_rows: await scalar(`${cte} SELECT count(*) FROM progress_data WHERE resourse_id IN (SELECT resource_id FROM mindspark_resources)`),
        legacy_mind_sparks: hasLegacyTable ? await scalar('SELECT count(*) FROM public.mind_sparks') : 0,
    };

    console.table([{ stage: 'before', ...before }]);

    if (!execute) {
        console.log('Dry run only. Re-run with --execute to delete these rows.');
        return;
    }

    await client.query('BEGIN');
    try {
        const deletedActivity = await affected(`${cte} DELETE FROM activity_submissions WHERE resource_id IN (SELECT resource_id FROM mindspark_resources)`);
        const deletedProgress = await affected(`${cte} DELETE FROM progress_data WHERE resourse_id IN (SELECT resource_id FROM mindspark_resources)`);
        const deletedLegacy = hasLegacyTable ? await affected('DELETE FROM public.mind_sparks') : 0;

        await client.query('COMMIT');

        console.table([{
            stage: 'deleted',
            activity_submissions: deletedActivity,
            progress_rows: deletedProgress,
            legacy_mind_sparks: deletedLegacy,
        }]);
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
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
