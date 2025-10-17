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
                user_profile_photo, 
                user_name, 
                user_email, 
                user_contact_num, 
                user_dob, 
                user_gender
            FROM user_data 
            WHERE user_email = $1
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