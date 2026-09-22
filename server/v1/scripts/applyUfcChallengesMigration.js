const fs = require('fs');
const path = require('path');
const client = require('../utils/conn');

const migrationPath = path.resolve(
    __dirname,
    '../migrations/20260922_add_ufc_module_challenges.sql'
);

const certificateId = '24d9e2c4-42b0-4133-b801-d8cace4600f5';
const expectedChallenges = [
    { moduleName: 'Probe Movements', resourceName: 'Probe Selection and Orientations' },
    { moduleName: 'Probe Movements', resourceName: 'Probe Movements' },
    { moduleName: 'Knobology', resourceName: 'Find the Optimal Image' },
    { moduleName: 'Knobology', resourceName: 'Image Optimization' },
    { moduleName: 'Morphology', resourceName: 'Sector Orientation and Directional Terms' },
    { moduleName: 'Morphology', resourceName: 'Ultrasound Spatial Visualization' },
];

if (process.argv[2] !== '--apply') {
    throw new Error('Usage: node scripts/applyUfcChallengesMigration.js --apply');
}

const verifyChallenges = async () => {
    const result = await client.query(
        `SELECT
            COALESCE(
                NULLIF(trim(lm.unit_name), ''),
                NULLIF(trim(lm.module_name), ''),
                NULLIF(trim(lm.course_name), '')
            ) AS module_name,
            rd.resource_name,
            rd.resource_type,
            rd.resource_topic,
            rd.display_order,
            rd.is_hidden
         FROM public.resource_data rd
         JOIN public.learning_module lm
           ON lm.learning_module_id = rd.learning_module_id
         WHERE lm.certificate_id = $1
           AND rd.resource_type = 'CHALLENGE'
           AND rd.resource_name = ANY($2::text[])
         ORDER BY module_name, rd.display_order`,
        [certificateId, expectedChallenges.map(item => item.resourceName)]
    );

    const missing = expectedChallenges.filter(expected => !result.rows.some(row =>
        row.resource_name === expected.resourceName &&
        String(row.module_name).toLowerCase() === expected.moduleName.toLowerCase()
    ));
    if (missing.length > 0) {
        throw new Error(
            `Challenge verification failed; missing: ${missing
                .map(item => `${item.moduleName} / ${item.resourceName}`)
                .join(', ')}`
        );
    }

    return result.rows;
};

const run = async () => {
    try {
        const sql = fs.readFileSync(migrationPath, 'utf8');
        await client.query('BEGIN');
        await client.query(sql);
        const rows = await verifyChallenges();
        await client.query('COMMIT');
        console.table(rows);
        console.log(`Applied UFC challenges migration and verified ${rows.length} rows.`);
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {});
        console.error('Failed to apply UFC challenges migration:', error.message);
        process.exitCode = 1;
    } finally {
        await client.end();
    }
};

run();
