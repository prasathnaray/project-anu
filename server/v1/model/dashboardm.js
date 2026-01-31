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

            // 1. Total trainees assigned to this instructor's batches
            const getTotalTrainees = new Promise((res, rej) => {
                client.query(
                    `SELECT COUNT(DISTINCT bpd.user_id) AS total_trainees
                     FROM batch_people_data bpd
                     WHERE bpd.user_id IN (
                         SELECT user_email 
                         FROM user_data 
                         WHERE user_role = '103'
                     )
                     AND bpd.batch_id && (
                         SELECT batch_id 
                         FROM batch_people_data 
                         WHERE user_id = $1
                     );`,
                    [requester.user_mail],
                    (err, result) => (err ? rej(err) : res(result.rows[0]))
                );
            });

            // 2. Total batches associated with this instructor
            const getTotalBatches = new Promise((res, rej) => {
                client.query(
                    `WITH instructor_batches AS (
                         SELECT unnest(batch_id) AS batch
                         FROM batch_people_data
                         WHERE user_id = $1
                     )
                     SELECT COUNT(DISTINCT batch) AS total_batches
                     FROM instructor_batches;`,
                    [requester.user_mail],
                    (err, result) => (err ? rej(err) : res(result.rows[0]))
                );
            });

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

            Promise.all([getTotalTrainees, getTotalBatches, getTotalVolumes, getVolumeSizes])
                .then(([getTotalTrainees, getTotalBatches, getTotalVolumes, getVolumeSizes]) => {
                    resolve({
                        totalTrainees: getTotalTrainees.total_trainees || 0,
                        totalBatches: getTotalBatches.total_batches || 0,
                        totalVolumes: getTotalVolumes.total_volumes || 0,
                        volumeSizes: getVolumeSizes,
                    });
                })
                .catch(reject);
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