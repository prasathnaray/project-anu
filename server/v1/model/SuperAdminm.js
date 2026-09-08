const client = require('../utils/conn');
const { HashPassword } = require('../utils/hash');
const { ROLES, HttpError, requireRole } = require('../Auth/authorization');
const { audit } = require('./ContentAccessm');

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
    const email = input.user_email.trim().toLowerCase();
    const duplicate = await client.query('SELECT 1 FROM user_data WHERE user_email = $1', [email]);
    if (duplicate.rows.length > 0) throw new HttpError(409, 'A user with this email already exists.');
    const password = temporaryPassword();
    const hashed = await HashPassword(password);
    const result = await client.query(
        `INSERT INTO user_data
            (user_email, user_name, user_contact_num, user_password, user_role, status, centre_id, center_name)
         VALUES ($1, $2, $3, $4, '99', 'active', NULL, NULL)
         RETURNING user_email, user_name, user_contact_num, user_role, status, created_at`,
        [email, input.user_name.trim(), input.user_contact_num || null, hashed]
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
            (SELECT COUNT(DISTINCT la.user_id)
             FROM login_activity la
             JOIN user_data ud ON ud.user_email = la.user_id
             WHERE la.logged_at >= NOW() - INTERVAL '24 hours') AS active_users`
    );

    const activeUsersListQuery = client.query(
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

    const [
        metricsRes,
        activeUsersRes,
        topTraineesRes,
        recentActivityRes,
        instActivityRes,
        recentInstRes,
        courseApprovalsRes,
        courseDistRes,
        platformGrowthRes
    ] = await Promise.all([
        metricsQuery,
        activeUsersListQuery,
        topTraineesQuery,
        recentActivityQuery,
        institutionActivityQuery,
        recentInstitutionsQuery,
        courseApprovalsQuery,
        courseDistributionQuery,
        platformGrowthQuery
    ]);

    const m = metricsRes.rows[0] || {};
    const inst = Number(m.institutions || 0);
    const stud = Number(m.students || 0);
    const instr = Number(m.instructors || 0);
    const crs = Number(m.courses || 0);
    const act = Number(m.active_users || 0);

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
        platformGrowth: platformGrowthRes.rows || []
    };
};

module.exports = { listSuperAdmins, createSuperAdmin, getSuperAdminStats };
