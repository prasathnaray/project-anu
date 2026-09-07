const client = require('../utils/conn');

const getDashboardDatam = (requester) => {
    return new Promise((resolve, reject) => {
        const role = Number(requester.role);

        if (role === 99) {
            const superAdminMetrics = new Promise((res, rej) => {
                client.query(
                    `SELECT
                        (SELECT COUNT(*) FROM scan_centers) AS institutions,
                        (SELECT COUNT(*) FROM user_data WHERE user_role = '103') AS students,
                        (SELECT COUNT(*) FROM user_data WHERE user_role = '102') AS instructors,
                        (SELECT COUNT(*) FROM certification_data) AS courses,
                        (SELECT COUNT(DISTINCT la.user_id)
                         FROM login_activity la
                         JOIN user_data ud ON ud.user_email = la.user_id
                         WHERE la.logged_at >= NOW() - INTERVAL '24 hours') AS active_users`,
                    (err, result) => (err ? rej(err) : res(result.rows[0]))
                );
            });

            const activeUsersList = new Promise((res, rej) => {
                client.query(
                    `SELECT 
                        ud.user_email,
                        ud.user_name,
                        ud.user_role,
                        ud.user_profile_photo,
                        COALESCE(sc.center_name, ud.center_name) AS centre_name,
                        MAX(la.logged_at) AS last_login
                     FROM login_activity la
                     JOIN user_data ud ON ud.user_email = la.user_id
                     LEFT JOIN scan_centers sc ON sc.center_id::text = ud.centre_id::text
                     WHERE la.logged_at >= NOW() - INTERVAL '24 hours'
                     GROUP BY ud.user_email, ud.user_name, ud.user_role, ud.user_profile_photo, sc.center_name, ud.center_name
                     ORDER BY last_login DESC;`,
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            const TopPerformingTraineesGlobal = new Promise((res, rej) => {
                client.query(
                    `WITH recent_completed AS (
                        SELECT user_id, COUNT(*) as completed_count
                        FROM progress_data
                        WHERE is_completed = TRUE
                        GROUP BY user_id
                        ORDER BY completed_count DESC
                        LIMIT 10
                    )
                    SELECT 
                        ud.user_name,
                        ud.user_email,
                        rc.completed_count
                    FROM recent_completed rc
                    JOIN user_data ud ON ud.user_email = rc.user_id
                    WHERE ud.user_role = '103'
                    ORDER BY rc.completed_count DESC
                    LIMIT 5;`,
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            const PlatformRecentActivity = new Promise((res, rej) => {
                client.query(
                    `WITH recent_pd AS (
                        SELECT user_id, resourse_id, updated_at
                        FROM progress_data
                        ORDER BY updated_at DESC
                        LIMIT 10
                    )
                    SELECT 
                        ud.user_name,
                        rd.resource_name,
                        rpd.updated_at
                    FROM recent_pd rpd
                    JOIN user_data ud ON rpd.user_id = ud.user_email
                    JOIN resource_data rd ON rpd.resourse_id = rd.resource_id
                    ORDER BY rpd.updated_at DESC
                    LIMIT 5;`,
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            const institutionActivity = new Promise((res, rej) => {
                client.query(
                    `SELECT 
                        sc.center_name AS institution,
                        COUNT(ud.user_email) AS students,
                        COALESCE(sc.status, 'Active') AS status
                     FROM scan_centers sc
                     LEFT JOIN user_data ud ON (ud.centre_id::text = sc.center_id::text AND ud.user_role = '103')
                     GROUP BY sc.center_name, sc.status
                     ORDER BY students DESC
                     LIMIT 5;`,
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            const recentInstitutions = new Promise((res, rej) => {
                client.query(
                    `SELECT 
                        center_name AS name,
                        COALESCE(center_email, admin_user_email) AS email,
                        COALESCE(status, 'Active') AS status
                     FROM scan_centers
                     ORDER BY created_at DESC
                     LIMIT 5;`,
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            const courseApprovals = new Promise((res, rej) => {
                client.query(
                    `SELECT 
                        cd.certificate_name AS course_name,
                        COALESCE(sc.center_name, 'Super Admin') AS institution,
                        CASE 
                            WHEN cd.publication_status = 'published' THEN 'Approved'
                            ELSE 'Pending'
                        END AS status
                     FROM certification_data cd
                     LEFT JOIN scan_centers sc ON sc.center_id::text = cd.owner_centre_id::text
                     ORDER BY cd.created_at DESC
                     LIMIT 10;`,
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            const courseDistribution = new Promise((res, rej) => {
                client.query(
                    `SELECT 
                        CASE 
                            WHEN course_kind = 'institution' OR owner_scope = 'institution' THEN 'Institution'
                            WHEN course_kind = 'core' THEN 'Core'
                            WHEN course_kind = 'specialized' THEN 'Specialized'
                            ELSE 'General'
                        END AS category,
                        COUNT(*)::int AS count
                     FROM certification_data
                     GROUP BY category
                     ORDER BY count DESC;`,
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            const platformGrowth = new Promise((res, rej) => {
                client.query(
                    `SELECT 
                        TO_CHAR(d.month, 'Mon') as month,
                        (SELECT COUNT(*)::int FROM user_data WHERE user_role = '103' AND created_at <= d.month + INTERVAL '1 month - 1 day') as students,
                        (SELECT COUNT(*)::int FROM certification_data WHERE created_at <= d.month + INTERVAL '1 month - 1 day') as courses
                     FROM generate_series(
                        DATE_TRUNC('month', NOW() - INTERVAL '5 months'),
                        DATE_TRUNC('month', NOW()),
                        INTERVAL '1 month'
                     ) d(month)
                     ORDER BY d.month;`,
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            Promise.all([
                superAdminMetrics,
                activeUsersList,
                TopPerformingTraineesGlobal,
                PlatformRecentActivity,
                institutionActivity,
                recentInstitutions,
                courseApprovals,
                courseDistribution,
                platformGrowth
            ])
                .then(([
                    superAdminMetrics,
                    activeUsersList,
                    TopPerformingTraineesGlobal,
                    PlatformRecentActivity,
                    institutionActivity,
                    recentInstitutions,
                    courseApprovals,
                    courseDistribution,
                    platformGrowth
                ]) => {
                    const inst = Number(superAdminMetrics?.institutions || 0);
                    const stud = Number(superAdminMetrics?.students || 0);
                    const instr = Number(superAdminMetrics?.instructors || 0);
                    const crs = Number(superAdminMetrics?.courses || 0);
                    const act = Number(superAdminMetrics?.active_users || 0);

                    resolve({
                        superAdminMetrics: {
                            institutions: inst,
                            students: stud,
                            instructors: instr,
                            courses: crs,
                            active_users: act,
                            activeUsers: act
                        },
                        institutions: inst,
                        students: stud,
                        instructors: instr,
                        courses: crs,
                        activeUsers: act,
                        active_users: act,
                        activeUsersList,
                        TopPerformingTraineesGlobal,
                        PlatformRecentActivity,
                        institutionActivity,
                        recentInstitutions,
                        courseApprovals,
                        courseDistribution,
                        platformGrowth
                    });
                })
                .catch(reject);
            return;
        }

        // ─── Role 101: Full Dashboard ───────────────────────────────────
        if (role === 101) {
            if (!requester.centre_id) {
                return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'Your account is not linked to a scan center.',
                });
            }

            const getTraineesIns = new Promise((res, rej) => {
                client.query(
                    `SELECT user_data.user_role, COUNT(*)
                     FROM user_data
                     WHERE user_role IN ('102', '103')
                     AND centre_id = $1
                     GROUP BY user_data.user_role;`,
                    [requester.centre_id],
                    (err, result) => (err ? rej(err) : res(result))
                );
            });

            const getBatchDas = new Promise((res, rej) => {
                client.query(
                    `SELECT COUNT(DISTINCT bd.batch_id)
                     FROM batch_data bd
                     WHERE bd.centre_id = $1`,
                    [requester.centre_id],
                    (err, result) => err ? rej(err) : res(result)
                );
            });

            const TLStats = new Promise((res, rej) => {
                client.query(
                    `SELECT tl.*
                     FROM targeted_learning tl
                     JOIN user_data ud ON ud.user_email = tl.created_by
                     WHERE ud.centre_id = $1`,
                    [requester.centre_id],
                    (err, result) => err ? rej(err) : res(result.rows)
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
                     AND ud.centre_id = $2
                     GROUP BY bd.batch_id, bd.batch_name
                     ORDER BY bd.batch_id;`,
                    ['103', requester.centre_id],
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            // --- New EDA Additions for Admin ---
            const TotalResources = new Promise((res, rej) => {
                client.query('SELECT COUNT(*) FROM resource_data', (err, result) =>
                    err ? rej(err) : res(result.rows[0])
                );
            });

            const TopPerformingTraineesGlobal = new Promise((res, rej) => {
                client.query(
                    `SELECT 
                        ud.user_name,
                        ud.user_email,
                        COUNT(pd.resourse_id) as completed_count
                     FROM user_data ud
                     JOIN progress_data pd ON ud.user_email = pd.user_id
                     WHERE ud.user_role = '103' 
                     AND ud.centre_id = $1
                     AND pd.is_completed = TRUE
                     GROUP BY ud.user_name, ud.user_email
                     ORDER BY completed_count DESC
                     LIMIT 5;`,
                    [requester.centre_id],
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            const PlatformRecentActivity = new Promise((res, rej) => {
                client.query(
                    `SELECT 
                        ud.user_name,
                        rd.resource_name,
                        pd.updated_at
                     FROM progress_data pd
                     JOIN user_data ud ON pd.user_id = ud.user_email
                     JOIN resource_data rd ON pd.resourse_id = rd.resource_id
                     WHERE ud.centre_id = $1
                     ORDER BY pd.updated_at DESC
                     LIMIT 5;`,
                    [requester.centre_id],
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            const TopInstructorsByTrainees = new Promise((res, rej) => {
                client.query(
                    `SELECT 
                        ud.user_name,
                        ud.user_email,
                        COUNT(DISTINCT bpd2.user_id) as total_trainees
                     FROM user_data ud
                     JOIN batch_people_data bpd1 ON ud.user_email = bpd1.user_id
                     JOIN batch_people_data bpd2 ON bpd1.batch_id && bpd2.batch_id
                     JOIN user_data ud2 ON bpd2.user_id = ud2.user_email
                     WHERE ud.user_role = '102' AND ud2.user_role = '103'
                     AND ud.centre_id = $1
                     AND ud2.centre_id = $1
                     GROUP BY ud.user_name, ud.user_email
                     ORDER BY total_trainees DESC
                     LIMIT 5;`,
                    [requester.centre_id],
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            const InstructorVolumeActivity = new Promise((res, rej) => {
                client.query(
                    `SELECT 
                        ud.user_name,
                        COUNT(vcl.volume_id) AS total_volumes
                     FROM user_data ud
                     JOIN volume_conv_logs vcl ON ud.user_email = vcl.converted_by
                     WHERE ud.user_role = '102' AND vcl.conversion_completion = TRUE
                     AND ud.centre_id = $1
                     GROUP BY ud.user_name
                     ORDER BY total_volumes DESC
                     LIMIT 5;`,
                    [requester.centre_id],
                    (err, result) => (err ? rej(err) : res(result.rows))
                );
            });

            Promise.all([
                getTraineesIns,
                getBatchDas,
                TLStats,
                CourseDataList,
                BatchPerUserList,
                TotalResources,
                TopPerformingTraineesGlobal,
                PlatformRecentActivity,
                TopInstructorsByTrainees,
                InstructorVolumeActivity
            ])
                .then(([
                    getTraineesIns,
                    getBatchDas,
                    TLStats,
                    CourseDataList,
                    BatchPerUserList,
                    TotalResources,
                    TopPerformingTraineesGlobal,
                    PlatformRecentActivity,
                    TopInstructorsByTrainees,
                    InstructorVolumeActivity
                ]) => {
                    resolve({
                        getTraineesIns,
                        getBatchDas,
                        TLStats,
                        CourseDataList,
                        BatchPerUserList,
                        TotalResources,
                        TopPerformingTraineesGlobal,
                        PlatformRecentActivity,
                        TopInstructorsByTrainees,
                        InstructorVolumeActivity
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
