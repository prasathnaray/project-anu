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

module.exports = { listSuperAdmins, createSuperAdmin };
