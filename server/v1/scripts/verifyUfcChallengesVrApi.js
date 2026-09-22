const client = require('../utils/conn');
const { indDatauuid } = require('../model/traineem');

const certificateId = '24d9e2c4-42b0-4133-b801-d8cace4600f5';
const expectedByModule = {
    'Probe Movements': [
        'Probe Selection and Orientations',
        'Probe Movements',
    ],
    Knobology: [
        'Find the Optimal Image',
        'Image Optimization',
    ],
    Morphology: [
        'Sector Orientation and Directional Terms',
        'Ultrasound Spatial Visualization',
    ],
};

const findActiveUfcTrainee = async () => {
    const result = await client.query(
        `SELECT DISTINCT ud.people_id, ud.user_email
         FROM public.user_data ud
         JOIN public.batch_people_data bpd ON bpd.user_id = ud.user_email
         JOIN public.batch_data bd ON bd.batch_id = ANY(bpd.batch_id)
         WHERE ud.user_role = $1
           AND bd.batch_end_date::date >= CURRENT_DATE
           AND bd.certification_data ? $2
         LIMIT 1`,
        ['103', certificateId]
    );

    if (result.rows.length === 0) {
        throw new Error('No active UFC trainee is available for VR API verification');
    }

    return result.rows[0];
};

const flattenChallenges = response => {
    const rows = [];
    for (const certificate of response.certificates || []) {
        if (certificate.certificate_id !== certificateId) continue;
        for (const course of certificate.courses || []) {
            for (const module of course.modules || []) {
                for (const unit of module.units || []) {
                    const moduleName = unit.unit_name || module.module_name || course.course_name;
                    for (const challenge of unit.challenges?.items || []) {
                        rows.push({
                            module_name: moduleName,
                            resource_name: challenge.resource_name,
                            resource_type: challenge.resource_type,
                            display_order: challenge.display_order,
                        });
                    }
                }
            }
        }
    }
    return rows;
};

const run = async () => {
    try {
        const trainee = await findActiveUfcTrainee();
        const response = await indDatauuid(
            { role: 103, user_mail: trainee.user_email },
            trainee.people_id,
            true
        );
        const rows = flattenChallenges(response);

        const missing = Object.entries(expectedByModule).flatMap(([moduleName, resourceNames]) =>
            resourceNames
                .filter(resourceName => !rows.some(row =>
                    row.module_name === moduleName &&
                    row.resource_name === resourceName &&
                    row.resource_type === 'CHALLENGE'
                ))
                .map(resourceName => `${moduleName} / ${resourceName}`)
        );

        if (response.loginContext !== 'vr') {
            throw new Error(`Expected VR login context, received: ${response.loginContext}`);
        }
        if (missing.length > 0) {
            throw new Error(`VR API challenge verification failed; missing: ${missing.join(', ')}`);
        }

        console.table(rows);
        console.log(`Verified ${rows.length} challenges in the VR API response.`);
    } catch (error) {
        console.error('Failed to verify UFC challenges in the VR API:', error.message);
        process.exitCode = 1;
    } finally {
        await client.end();
    }
};

run();
