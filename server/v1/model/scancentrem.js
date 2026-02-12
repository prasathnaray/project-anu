// model/scancentrem.js
const client = require('../utils/conn');
const { HashPassword } = require('../utils/hash.js'); // Adjust path if needed

const createScancentrem = (requester, data) => {
    return new Promise(async (resolve, reject) => {
        const isPrivileged = [99].includes(Number(requester.role));
        
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.'
            });
        }

        // Check if requester.user_mail exists
        if (!requester.user_mail) {
            return reject(new Error('Admin user email is required. User session may be invalid.'));
        }

        // Start a transaction
        try {
            await client.query('BEGIN');

            // 1. Check if user with this email already exists
            const userCheck = await client.query(
                'SELECT user_email FROM user_data WHERE user_email = $1',
                [data.center_email]
            );

            if (userCheck.rows.length > 0) {
                await client.query('ROLLBACK');
                return resolve({
                    status: 'error',
                    code: 400,
                    message: 'A user with this email already exists'
                });
            }

            // 2. Create the scan center
            const centerResult = await client.query(
                'INSERT INTO scan_centers(center_name, center_email, center_phone, center_address, admin_user_email, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                    data.center_name,
                    data.center_email,
                    data.center_phone,
                    data.center_address,
                    requester.user_mail,
                    data.status || 'Pending'
                ]
            );

            const createdCenter = centerResult.rows[0];

            // 3. Generate a temporary password
            const tempPassword = generateTemporaryPassword();
            
            // 4. Hash the password using your utility
            const hashedPassword = await HashPassword(tempPassword);

            // 5. Create the user login account
            const userResult = await client.query(
                `INSERT INTO user_data(
                    user_email, 
                    user_name, 
                    user_contact_num, 
                    user_password, 
                    user_role, 
                    status, 
                    centre_id,
                    center_name
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_email, user_name, user_role, status, centre_id`,
                [
                    data.center_email,
                    data.center_name,
                    data.center_phone,
                    hashedPassword,
                    data.user_role || '101', // Default role for scan center admin
                    'active',
                    createdCenter.center_id,
                    data.center_name
                ]
            );

            // 6. Commit the transaction
            await client.query('COMMIT');

            return resolve({
                status: 'success',
                code: 201,
                data: {
                    center: createdCenter,
                    user: userResult.rows[0],
                    temporaryPassword: tempPassword // Send this via email in production
                }
            });

        } catch (err) {
            // Rollback on error
            await client.query('ROLLBACK');
            return reject(err);
        }
    });
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

module.exports = {
    createScancentrem
};