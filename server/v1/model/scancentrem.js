// model/scancentrem.js
const client = require('../utils/conn');
const { HashPassword } = require('../utils/hash.js'); // Adjust path if needed

const createScancentrem = async (requester, data) => {
    if (Number(requester.role) !== 99) {
        return { status: 'Forbidden', code: 403, message: 'Only Super Admin can create institutions.' };
    }
    if (!requester.user_mail) throw new Error('Admin user email is required. User session may be invalid.');
    const transactionClient = await client.connect();
    try {
        await transactionClient.query('BEGIN');
        const userCheck = await transactionClient.query('SELECT user_email FROM user_data WHERE user_email = $1', [data.center_email]);
        if (userCheck.rows.length > 0) {
            await transactionClient.query('ROLLBACK');
            return { status: 'Conflict', code: 409, message: 'A user with this email already exists.' };
        }
        const centerResult = await transactionClient.query(
            `INSERT INTO scan_centers(center_name, center_email, center_phone, center_address, admin_user_email, status)
             VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
            [data.center_name, data.center_email, data.center_phone, data.center_address, data.center_email, data.status || 'Pending']
        );
        const createdCenter = centerResult.rows[0];
        const tempPassword = generateTemporaryPassword();
        const hashedPassword = await HashPassword(tempPassword);
        const userResult = await transactionClient.query(
            `INSERT INTO user_data
                (user_email, user_name, user_contact_num, user_password, user_role, status, centre_id, center_name)
             VALUES($1, $2, $3, $4, '101', 'active', $5, $6)
             RETURNING user_email, user_name, user_role, status, centre_id`,
            [data.center_email, data.center_name, data.center_phone, hashedPassword, createdCenter.center_id, data.center_name]
        );
        await transactionClient.query('COMMIT');
        return {
            status: 'success',
            code: 201,
            data: { center: createdCenter, user: userResult.rows[0], temporaryPassword: tempPassword }
        };
    } catch (err) {
        await transactionClient.query('ROLLBACK');
        throw err;
    } finally {
        transactionClient.release();
    }
};

// Helper function to generate temporary password
const generateTemporaryPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

const getscancenterm = (requester) => {
    return new Promise(async (resolve, reject) => {
        const isPrivileged = [99].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.'
            });
        }
        try {
            const result = await client.query(`
                SELECT
                    sc.*,
                    COALESCE(stats.total_admins, 0) AS total_admins,
                    COALESCE(stats.total_instructors, 0) AS total_instructors,
                    COALESCE(stats.total_trainees, 0) AS total_trainees
                FROM scan_centers sc
                LEFT JOIN (
                    SELECT
                        centre_id,
                        COUNT(user_email) FILTER (WHERE user_role = '101') AS total_admins,
                        COUNT(user_email) FILTER (WHERE user_role = '102') AS total_instructors,
                        COUNT(user_email) FILTER (WHERE user_role = '103') AS total_trainees
                    FROM user_data
                    GROUP BY centre_id
                ) stats ON stats.centre_id = sc.center_id
                ORDER BY sc.created_at DESC NULLS LAST, sc.center_name ASC
            `);
            resolve({
                status: 'success',
                code: 200,
                data: result.rows
            });
        } catch (err) {
            reject(err);
        }
    });
}

const addInstitutionAdmin = async (requester, centreId, data) => {
    if (Number(requester.role) !== 99) {
        return { status: 'Forbidden', code: 403, message: 'Only Super Admin can add institution administrators.' };
    }
    if (!data.user_email?.trim() || !data.user_name?.trim()) {
        return { status: 'Validation Error', code: 400, message: 'user_email and user_name are required.' };
    }
    const email = data.user_email.trim().toLowerCase();
    const transactionClient = await client.connect();
    try {
        await transactionClient.query('BEGIN');
        const centerResult = await transactionClient.query(
            'SELECT center_id, center_name FROM scan_centers WHERE center_id = $1',
            [centreId]
        );
        if (centerResult.rows.length === 0) {
            await transactionClient.query('ROLLBACK');
            return { status: 'Not Found', code: 404, message: 'Institution not found.' };
        }
        const duplicate = await transactionClient.query('SELECT 1 FROM user_data WHERE user_email = $1', [email]);
        if (duplicate.rows.length > 0) {
            await transactionClient.query('ROLLBACK');
            return { status: 'Conflict', code: 409, message: 'A user with this email already exists.' };
        }
        const temporaryPassword = generateTemporaryPassword();
        const hashedPassword = await HashPassword(temporaryPassword);
        const center = centerResult.rows[0];
        const result = await transactionClient.query(
            `INSERT INTO user_data
                (user_email, user_name, user_contact_num, user_password, user_role, status, centre_id, center_name)
             VALUES ($1, $2, $3, $4, '101', 'active', $5, $6)
             RETURNING user_email, user_name, user_role, status, centre_id, center_name`,
            [email, data.user_name.trim(), data.user_contact_num || null, hashedPassword, centreId, center.center_name]
        );
        await transactionClient.query('COMMIT');
        return { status: 'Success', code: 201, data: { user: result.rows[0], temporaryPassword } };
    } catch (error) {
        await transactionClient.query('ROLLBACK');
        throw error;
    } finally {
        transactionClient.release();
    }
};

module.exports = {
    createScancentrem,
    getscancenterm,
    addInstitutionAdmin
};
