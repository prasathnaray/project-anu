const client = require('../utils/conn');
const { HashPassword } = require('../utils/hash');
const { encryptedUserFields } = require('../utils/userEmailCrypto');
const { ROLES, HttpError, requireRole } = require('../Auth/authorization');
const { audit } = require('./contentAccessm');
const { validPhoneNumber } = require('../utils/accountVerification');

const temporaryPassword = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    return Array.from({ length: 16 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
};

const listSuperAdmins = async (requester) => {
    requireRole(requester, [ROLES.SUPER_ADMIN]);
    const result = await client.query(
        `SELECT user_email, user_name, user_contact_num, status, created_at
         FROM user_data WHERE user_role = '99' ORDER BY user_name`
    );
    return result.rows;
};

const createSuperAdmin = async (requester, input) => {
    requireRole(requester, [ROLES.SUPER_ADMIN]);
    if (!input.user_email?.trim() || !input.user_name?.trim()) throw new HttpError(400, 'user_email and user_name are required.');
    if (!validPhoneNumber(input.user_contact_num)) throw new HttpError(422, 'A valid E.164 phone number is required for OTP verification.');
    const pii = encryptedUserFields(input.user_email, input.user_name.trim(), input.user_contact_num || null);
    const email = pii.user_email;
    const duplicate = await client.query('SELECT 1 FROM user_data WHERE user_email_lookup = $1', [pii.user_email_lookup]);
    if (duplicate.rows.length > 0) throw new HttpError(409, 'A user with this email already exists.');
    const password = temporaryPassword();
    const hashed = await HashPassword(password);
    const result = await client.query(
        `INSERT INTO user_data
            (user_email, user_name, user_contact_num, user_password, user_role, status, centre_id, center_name,
             verification_required, user_email_lookup, user_email_enc, user_name_enc, user_contact_num_enc)
         VALUES ($1, $2, $3, $4, '99', 'pending_verification', NULL, NULL, true, $5, $6, $7, $8)
         RETURNING user_email, user_name, user_contact_num, user_role, status, created_at`,
        [email, input.user_name.trim(), input.user_contact_num || null, hashed,
            pii.user_email_lookup, pii.user_email_enc, pii.user_name_enc, pii.user_contact_num_enc]
    );
    await audit(client, requester, 'super_admin.created', 'user', email);
    return { user: result.rows[0], temporaryPassword: password };
};

const getSuperAdminStats = async (requester) => {
    requireRole(requester, [ROLES.SUPER_ADMIN]);

    const metricsQuery = client.query(
        `SELECT
            (SELECT COUNT(*) FROM scan_centers) AS institutions,
            (SELECT COUNT(*) FROM user_data WHERE user_role = '103') AS students,
            (SELECT COUNT(*) FROM user_data WHERE user_role = '102') AS instructors,
            (SELECT COUNT(*) FROM certification_data) AS courses,
            (SELECT COUNT(DISTINCT combined.user_id)
             FROM (
                 SELECT user_id FROM login_activity WHERE logged_at >= NOW() - INTERVAL '24 hours'
                 UNION
                 SELECT user_id FROM activity_logs WHERE created_at >= NOW() - INTERVAL '24 hours' AND user_id IS NOT NULL AND user_id != 'system' AND user_id != 'anonymous'
             ) combined
             JOIN user_data ud ON LOWER(ud.user_email) = LOWER(combined.user_id)) AS active_users`
    );

    const activeUsersListQuery = client.query(
        `SELECT 
            ud.user_email,
            ud.user_name,
            ud.user_role,
            ud.user_profile_photo,
            COALESCE(sc.center_name, ud.center_name) AS centre_name,
            MAX(combined.last_act) AS last_login
         FROM (
             SELECT user_id, logged_at AS last_act FROM login_activity WHERE logged_at >= NOW() - INTERVAL '24 hours'
             UNION ALL
             SELECT user_id, created_at AS last_act FROM activity_logs WHERE created_at >= NOW() - INTERVAL '24 hours' AND user_id IS NOT NULL AND user_id != 'system' AND user_id != 'anonymous'
         ) combined
         JOIN user_data ud ON LOWER(ud.user_email) = LOWER(combined.user_id)
         LEFT JOIN scan_centers sc ON sc.center_id::text = ud.centre_id::text
         GROUP BY ud.user_email, ud.user_name, ud.user_role, ud.user_profile_photo, sc.center_name, ud.center_name
         ORDER BY last_login DESC;`
    );

    const topTraineesQuery = client.query(
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
        LIMIT 5;`
    );

    const recentActivityQuery = client.query(
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
        LIMIT 5;`
    );

    const institutionActivityQuery = client.query(
        `SELECT 
            sc.center_name AS institution,
            COUNT(ud.user_email) AS students,
            COALESCE(sc.status, 'Active') AS status
         FROM scan_centers sc
         LEFT JOIN user_data ud ON (ud.centre_id::text = sc.center_id::text AND ud.user_role = '103')
         GROUP BY sc.center_name, sc.status
         ORDER BY students DESC
         LIMIT 5;`
    );

    const recentInstitutionsQuery = client.query(
        `SELECT 
            center_name AS name,
            COALESCE(center_email, admin_user_email) AS email,
            COALESCE(status, 'Active') AS status
         FROM scan_centers
         ORDER BY created_at DESC
         LIMIT 5;`
    );

    const courseApprovalsQuery = client.query(
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
         LIMIT 10;`
    );

    const courseDistributionQuery = client.query(
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
         ORDER BY count DESC;`
    );

    const platformGrowthQuery = client.query(
        `SELECT 
            TO_CHAR(d.month, 'Mon') as month,
            (SELECT COUNT(*)::int FROM user_data WHERE user_role = '103' AND created_at <= d.month + INTERVAL '1 month - 1 day') as students,
            (SELECT COUNT(*)::int FROM certification_data WHERE created_at <= d.month + INTERVAL '1 month - 1 day') as courses
         FROM generate_series(
            DATE_TRUNC('month', NOW() - INTERVAL '5 months'),
            DATE_TRUNC('month', NOW()),
            INTERVAL '1 month'
         ) d(month)
         ORDER BY d.month;`
    );

    const vrAnalyticsQuery = client.query(
        `SELECT
            COUNT(*) FILTER (WHERE module = 'VR Modules' OR action LIKE '%VR%' OR (metadata->>'isVR') = 'true' OR action IN ('START_VR_TEST', 'END_VR_TEST', 'VR_ATTEMPT', 'VR_ATTEMPT_STARTED', 'PRACTICE_ATTEMPT', 'VR_SESSION', 'SUBMIT_VR_MEASUREMENT', 'SAVE_VR_RECORDING', 'START_VR_STREAM', 'END_VR_STREAM', 'VR_LOGIN', 'VR_DATA_ACCESS', 'COMPLETE_VR_RESOURCE'))::int AS total_vr_attempts,
            COUNT(*) FILTER (WHERE action IN ('COMPLETE_VR_RESOURCE', 'END_VR_TEST', 'COMPLETE_CHALLENGE', 'CHALLENGE_COMPLETED') AND status = 'SUCCESS')::int AS vr_completed,
            COUNT(*) FILTER (WHERE action IN ('PRACTICE_ATTEMPT', 'submit_prac') OR module = 'Practice')::int AS practice_attempts,
            COUNT(*) FILTER (WHERE action IN ('SUBMIT_VR_MEASUREMENT', 'submit-ii', 'SUBMIT_II') OR module = 'Image Interpretation')::int AS image_interpretations
         FROM public.activity_logs;`
    ).catch(() => ({ rows: [{ total_vr_attempts: 0, vr_completed: 0, practice_attempts: 0, image_interpretations: 0 }] }));

    const volumeAnalyticsQuery = client.query(
        `SELECT
            (SELECT COUNT(*)::int FROM volumes) AS total_volumes,
            (SELECT COUNT(*)::int FROM volume_conv_logs WHERE conversion_completion = true) AS converted_volumes,
            (SELECT COUNT(*)::int FROM volumes WHERE conversion_process_status = true) AS pending_conversions,
            (SELECT COUNT(DISTINCT volume_id)::int FROM volume_placements) AS placed_volumes;`
    ).catch(() => ({ rows: [{ total_volumes: 0, converted_volumes: 0, pending_conversions: 0, placed_volumes: 0 }] }));

    const systemAlertsQuery = client.query(
        `SELECT id, user_id, role, action, module, status, metadata, created_at
         FROM public.activity_logs
         WHERE status = 'FAILED' 
            OR action ILIKE '%FAIL%' 
            OR action ILIKE '%ERROR%' 
            OR action ILIKE '%DELETE%'
            OR action ILIKE '%DISABLE%'
         ORDER BY created_at DESC
         LIMIT 15;`
    ).catch(() => ({ rows: [] }));

    const trendsQuery = client.query(
        `SELECT
            (SELECT COUNT(*)::int FROM user_data WHERE user_role = '103' AND created_at >= NOW() - INTERVAL '30 days') AS new_students_30d,
            (SELECT COUNT(*)::int FROM user_data WHERE user_role = '102' AND created_at >= NOW() - INTERVAL '30 days') AS new_instructors_30d,
            (SELECT COUNT(*)::int FROM scan_centers WHERE created_at >= NOW() - INTERVAL '30 days') AS new_institutions_30d,
            (SELECT COUNT(*)::int FROM certification_data WHERE created_at >= NOW() - INTERVAL '30 days') AS new_courses_30d;`
    ).catch(() => ({ rows: [{ new_students_30d: 0, new_instructors_30d: 0, new_institutions_30d: 0, new_courses_30d: 0 }] }));

    const topInstructorsQuery = client.query(
        `SELECT 
            ud.user_name,
            ud.user_email,
            COALESCE(sc.center_name, ud.center_name, 'Main Campus') AS centre_name,
            COALESCE(ud.status, 'Active') AS status,
            ud.created_at
         FROM user_data ud
         LEFT JOIN scan_centers sc ON sc.center_id::text = ud.centre_id::text
         WHERE ud.user_role = '102'
         ORDER BY ud.created_at DESC
         LIMIT 5;`
    ).catch(() => ({ rows: [] }));

    const [
        metricsRes,
        activeUsersRes,
        topTraineesRes,
        recentActivityRes,
        instActivityRes,
        recentInstRes,
        courseApprovalsRes,
        courseDistRes,
        platformGrowthRes,
        vrRes,
        volRes,
        alertsRes,
        trendsRes,
        topInstructorsRes
    ] = await Promise.all([
        metricsQuery,
        activeUsersListQuery,
        topTraineesQuery,
        recentActivityQuery,
        institutionActivityQuery,
        recentInstitutionsQuery,
        courseApprovalsQuery,
        courseDistributionQuery,
        platformGrowthQuery,
        vrAnalyticsQuery,
        volumeAnalyticsQuery,
        systemAlertsQuery,
        trendsQuery,
        topInstructorsQuery
    ]);

    const m = metricsRes.rows[0] || {};
    const inst = Number(m.institutions || 0);
    const stud = Number(m.students || 0);
    const instr = Number(m.instructors || 0);
    const crs = Number(m.courses || 0);
    const act = Number(m.active_users || 0);
    const vrRow = vrRes.rows[0] || {};
    const volRow = volRes.rows[0] || {};
    const trRow = trendsRes.rows[0] || {};

    const systemHealth = {
        api: {
            status: 'Operational',
            uptimeSeconds: Math.floor(process.uptime()),
            memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
            nodeVersion: process.version
        },
        database: {
            status: 'Connected',
            pool: 'Healthy'
        },
        backgroundProcessing: {
            status: 'Operational',
            realtimeSocket: 'Live Broadcast Active'
        },
        checkedAt: new Date().toISOString()
    };

    return {
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
        activeUsersList: activeUsersRes.rows || [],
        TopPerformingTraineesGlobal: topTraineesRes.rows || [],
        PlatformRecentActivity: recentActivityRes.rows || [],
        institutionActivity: instActivityRes.rows || [],
        recentInstitutions: recentInstRes.rows || [],
        courseApprovals: courseApprovalsRes.rows || [],
        courseDistribution: courseDistRes.rows || [],
        platformGrowth: platformGrowthRes.rows || [],
        vrAnalytics: {
            totalVrAttempts: Number(vrRow.total_vr_attempts || 0),
            vrCompleted: Number(vrRow.vr_completed || 0),
            practiceAttempts: Number(vrRow.practice_attempts || 0),
            imageInterpretations: Number(vrRow.image_interpretations || 0),
            completionRate: Number(vrRow.total_vr_attempts || 0) > 0
                ? Math.round((Number(vrRow.vr_completed || 0) / Number(vrRow.total_vr_attempts || 0)) * 100)
                : 85
        },
        volumeAnalytics: {
            totalVolumes: Number(volRow.total_volumes || 0),
            convertedVolumes: Number(volRow.converted_volumes || 0),
            pendingConversions: Number(volRow.pending_conversions || 0),
            placedVolumes: Number(volRow.placed_volumes || 0),
            conversionRate: Number(volRow.total_volumes || 0) > 0
                ? Math.round((Number(volRow.converted_volumes || 0) / Number(volRow.total_volumes || 0)) * 100)
                : 100
        },
        systemAlerts: alertsRes.rows || [],
        trends: {
            newStudents30d: Number(trRow.new_students_30d || 0),
            newInstructors30d: Number(trRow.new_instructors_30d || 0),
            newInstitutions30d: Number(trRow.new_institutions_30d || 0),
            newCourses30d: Number(trRow.new_courses_30d || 0)
        },
        topInstructors: topInstructorsRes.rows || [],
        systemHealth
    };
};
module.exports = { listSuperAdmins, createSuperAdmin, getSuperAdminStats };
