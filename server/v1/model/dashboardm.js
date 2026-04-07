const client = require('../utils/conn');

const getDashboardDatam = (requester) => {
    return new Promise((resolve, reject) => {
        const role = Number(requester.role);

        // ─── Role 101: Full Dashboard ───────────────────────────────────
        if (role === 101) {
            const getTraineesIns = new Promise((res, rej) => {
                client.query(
                    `SELECT user_data.user_role, COUNT(*)
                     FROM user_data
                     WHERE user_role IN ('102', '103')
                     GROUP BY user_data.user_role;`,
                    (err, result) => (err ? rej(err) : res(result))
                );
            });

            const getBatchDas = new Promise((res, rej) => {
                client.query('SELECT COUNT(*) FROM batch_data', (err, result) =>
                    err ? rej(err) : res(result)
                );
            });

            const TLStats = new Promise((res, rej) => {
                client.query('SELECT * FROM targeted_learning', (err, result) =>
                    err ? rej(err) : res(result.rows)
                );
            });

            const CourseDataList = new Promise((res, rej) => {
                client.query('SELECT * FROM certification_data', (err, result) =>
                    err ? rej(err) : res(result.rows)
                );
            });

            const BatchPerUserList = new Promise((res, rej) => {
                client.query(
                    `SELECT bd.batch_id, bd.batch_name, COUNT(bpd.user_id) AS total_users
                     FROM batch_data bd
                     JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
                     JOIN user_data ud ON bpd.user_id = ud.user_email
                     WHERE ud.user_role = $1
                     GROUP BY bd.batch_id, bd.batch_name
                     ORDER BY bd.batch_id;`,
                    ['103'],
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            Promise.all([getTraineesIns, getBatchDas, TLStats, CourseDataList, BatchPerUserList])
                .then(([getTraineesIns, getBatchDas, TLStats, CourseDataList, BatchPerUserList]) => {
                    resolve({
                        getTraineesIns,
                        getBatchDas,
                        TLStats,
                        CourseDataList,
                        BatchPerUserList,
                    });
                })
                .catch(reject);
        }

        // ─── Role 102: Instructor Dashboard ────────────────────────────
        else if (role === 102) {
            // Get all batch IDs associated with this instructor once
            const getInstructorBatchIds = new Promise((res, rej) => {
                client.query(
                    `SELECT DISTINCT unnest(batch_id) AS b_id
                     FROM batch_people_data
                     WHERE user_id = $1`,
                    [requester.user_mail],
                    (err, result) => {
                        if (err) return rej(err);
                        const ids = result.rows
                            .map(r => r.b_id)
                            .filter(id => id !== null && id !== undefined);
                        res(ids);
                    }
                );
            });

            getInstructorBatchIds.then(batchIds => {
                if (!batchIds || batchIds.length === 0) {
                    return resolve({
                        totalTrainees: 0,
                        totalBatches: 0,
                        totalVolumes: 0,
                        volumeSizes: [],
                        batchProgress: [],
                        topTrainees: [],
                        recentActivity: []
                    });
                }

                // 1. Total trainees assigned to this instructor's batches
                const getTotalTrainees = new Promise((res, rej) => {
                    client.query(
                        `SELECT COUNT(DISTINCT bpd.user_id) AS total_trainees
                         FROM batch_people_data bpd
                         JOIN user_data ud ON bpd.user_id = ud.user_email
                         WHERE ud.user_role = '103'
                         AND bpd.batch_id && $1::varchar[];`,
                        [batchIds],
                        (err, result) => (err ? rej(err) : res(result.rows[0]))
                    );
                });

                // 2. Total batches associated with this instructor
                const totalBatches = batchIds.length;

                // 3. Total number of volumes converted by this instructor
                const getTotalVolumes = new Promise((res, rej) => {
                    client.query(
                        `SELECT COUNT(DISTINCT volume_id) AS total_volumes
                         FROM volume_conv_logs
                         WHERE converted_by = $1
                         AND conversion_completion = TRUE;`,
                        [requester.user_mail],
                        (err, result) => (err ? rej(err) : res(result.rows[0]))
                    );
                });

                // 4. Volume sizes - individual output sizes for donut chart
                const getVolumeSizes = new Promise((res, rej) => {
                    client.query(
                        `SELECT 
                             vcl.volume_id,
                             v.volume_name,
                             vcl.output_size_mb AS size_mb,
                             vcl.output_size_kb AS size_kb
                         FROM volume_conv_logs vcl
                         JOIN volumes v ON vcl.volume_id = v.volume_id
                         WHERE vcl.converted_by = $1
                         AND vcl.conversion_completion = TRUE
                         ORDER BY vcl.output_size_mb DESC;`,
                        [requester.user_mail],
                        (err, result) => (err ? rej(err) : res(result.rows))
                    );
                });

                // 5. Batch-wise progress
                const getBatchProgress = new Promise((res, rej) => {
                    client.query(
                        `WITH batch_trainee_counts AS (
                            SELECT 
                                b_id, 
                                COUNT(DISTINCT user_id) as trainee_count
                            FROM (
                                SELECT unnest(batch_id) as b_id, user_id FROM batch_people_data
                                WHERE batch_id && $1::varchar[]
                            ) bpd
                            JOIN user_data ud ON bpd.user_id = ud.user_email
                            WHERE ud.user_role = '103'
                            GROUP BY b_id
                        ),
                        total_resources AS (
                            SELECT 
                                bd.batch_id,
                                COUNT(rd.resource_id) AS total_res
                            FROM batch_data bd
                            CROSS JOIN LATERAL jsonb_array_elements_text(bd.certification_data) AS cert(val)
                            JOIN chapter_data cd ON cd.course_id = cert.val::uuid
                            JOIN module_data md ON md.chapter_id = cd.chapter_id
                            JOIN resource_data rd ON rd.learning_module_id = md.module_id
                            WHERE bd.batch_id = ANY($1::varchar[])
                            GROUP BY bd.batch_id
                        ),
                        completed_resources AS (
                            SELECT 
                                b_id,
                                COUNT(pd.resourse_id) AS completed_res
                            FROM (
                                SELECT unnest(batch_id) as b_id, user_id
                                FROM batch_people_data
                                WHERE batch_id && $1::varchar[]
                            ) bpd
                            JOIN user_data ud ON bpd.user_id = ud.user_email
                            JOIN progress_data pd ON pd.user_id = ud.user_email
                            WHERE ud.user_role = '103' AND pd.is_completed = TRUE
                            GROUP BY b_id
                        )
                        SELECT 
                            bd.batch_name,
                            COALESCE(tr.total_res, 0) as total_resources,
                            COALESCE(cr.completed_res, 0) as completed_resources,
                            CASE 
                                WHEN COALESCE(tr.total_res, 0) = 0 OR COALESCE(btc.trainee_count, 0) = 0 THEN 0
                                ELSE ROUND((COALESCE(cr.completed_res, 0)::numeric / (tr.total_res * btc.trainee_count)::numeric) * 100, 2)
                            END AS progress_percentage
                        FROM batch_data bd
                        LEFT JOIN batch_trainee_counts btc ON bd.batch_id = btc.b_id
                        LEFT JOIN total_resources tr ON bd.batch_id = tr.batch_id
                        LEFT JOIN completed_resources cr ON bd.batch_id = cr.b_id
                        WHERE bd.batch_id = ANY($1::varchar[]);`,
                        [batchIds],
                        (err, result) => (err ? rej(err) : res(result.rows))
                    );
                });

                // 6. Top performing trainees
                const getTopTrainees = new Promise((res, rej) => {
                    client.query(
                        `SELECT 
                            ud.user_name,
                            ud.user_email,
                            COUNT(pd.resourse_id) as completed_count
                         FROM user_data ud
                         JOIN batch_people_data bpd ON ud.user_email = bpd.user_id
                         JOIN progress_data pd ON ud.user_email = pd.user_id
                         WHERE ud.user_role = '103' 
                         AND pd.is_completed = TRUE
                         AND bpd.batch_id && $1::varchar[]
                         GROUP BY ud.user_name, ud.user_email
                         ORDER BY completed_count DESC
                         LIMIT 5;`,
                        [batchIds],
                        (err, result) => (err ? rej(err) : res(result.rows))
                    );
                });

                // 7. Recent activity
                const getRecentActivity = new Promise((res, rej) => {
                    client.query(
                        `SELECT 
                            ud.user_name,
                            rd.resource_name,
                            pd.updated_at
                         FROM progress_data pd
                         JOIN user_data ud ON pd.user_id = ud.user_email
                         JOIN resource_data rd ON pd.resourse_id = rd.resource_id
                         JOIN batch_people_data bpd ON ud.user_email = bpd.user_id
                         WHERE bpd.batch_id && $1::varchar[]
                         ORDER BY pd.updated_at DESC
                         LIMIT 5;`,
                        [batchIds],
                        (err, result) => (err ? rej(err) : res(result.rows))
                    );
                });

                Promise.all([getTotalTrainees, getTotalVolumes, getVolumeSizes, getBatchProgress, getTopTrainees, getRecentActivity])
                    .then(([getTotalTrainees, getTotalVolumes, getVolumeSizes, getBatchProgress, getTopTrainees, getRecentActivity]) => {
                        resolve({
                            totalTrainees: getTotalTrainees.total_trainees || 0,
                            totalBatches: totalBatches,
                            totalVolumes: getTotalVolumes.total_volumes || 0,
                            volumeSizes: getVolumeSizes,
                            batchProgress: getBatchProgress,
                            topTrainees: getTopTrainees,
                            recentActivity: getRecentActivity
                        });
                    })
                    .catch(reject);
            }).catch(reject);
        }

        // ─── Unauthorized ───────────────────────────────────────────────
        else {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.',
            });
        }
    });
};

module.exports = { getDashboardDatam };