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
            la.user_id,
            ud.user_name,
            ud.user_email,
            ud.user_role,
            ud.user_profile_photo,
            COALESCE(sc.center_name, ud.center_name) AS centre_name,
            MAX(la.logged_at) AS last_login
         FROM login_activity la
         JOIN user_data ud ON ud.user_email = la.user_id
         LEFT JOIN scan_centers sc ON sc.center_id = ud.centre_id
         WHERE la.logged_at >= NOW() - INTERVAL '24 hours'
         GROUP BY la.user_id, ud.user_name, ud.user_email, ud.user_role, ud.user_profile_photo, sc.center_name, ud.center_name
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

    const [metricsRes, activeUsersRes, topTraineesRes, recentActivityRes] = await Promise.all([
        metricsQuery,
        activeUsersListQuery,
        topTraineesQuery,
        recentActivityQuery
    ]);

    const m = metricsRes.rows[0] || {};

    return {
        institutions: Number(m.institutions || 0),
        students: Number(m.students || 0),
        instructors: Number(m.instructors || 0),
        courses: Number(m.courses || 0),
        activeUsers: Number(m.active_users || 0),
        activeUsersList: activeUsersRes.rows || [],
        TopPerformingTraineesGlobal: topTraineesRes.rows || [],
        PlatformRecentActivity: recentActivityRes.rows || []
    };
};

module.exports = { listSuperAdmins, createSuperAdmin, getSuperAdminStats };
