const client = require('../utils/conn.js');

const profilem = async (requester) => {
    try {
        // Check if user has permission
        const privilegedRoles = [99, 101, 102, 103];
        const isPrivileged = privilegedRoles.includes(Number(requester.role));
        if (!isPrivileged) {
            return {
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.'
            };
        }
        const query = `
            SELECT
                ud.user_profile_photo, 
                ud.user_name, 
                ud.user_email, 
                ud.user_contact_num, 
                ud.user_dob, 
                ud.user_gender,
                sc.center_name AS institution_name
            FROM user_data ud
            LEFT JOIN scan_centers sc ON ud.centre_id = sc.center_id
            WHERE ud.user_email = $1
        `;

        const { rows } = await client.query(query, [requester.user_mail]);

        if (rows.length === 0) {
            return {
                status: 'User Not Found',
                code: 404,
                message: 'No user found with the provided email.'
            };
        }

        return {
            status: 'Profile Retrieved',
            code: 200,
            data: rows[0]
        };

    } catch (error) {
        console.error('Database error in profilem:', error);
        return {
            status: 'Error',
            code: 500,
            message: 'An error occurred while retrieving the profile.',
            details: error.message
        };
    }
};
module.exports = profilem;