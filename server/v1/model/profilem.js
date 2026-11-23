const client = require('../utils/conn.js');
const { encryptPii } = require('../utils/userEmailCrypto');
const { validPhoneNumber } = require('../utils/accountVerification');

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

const updateProfile = async (requester, input = {}) => {
    if (![99, 101, 102, 103].includes(Number(requester?.role)) || !requester?.user_mail) {
        return { status: 'Unauthorized', code: 401, message: 'You cannot update this profile.' };
    }

    input = input && typeof input === 'object' && !Array.isArray(input) ? input : {};

    const name = typeof input.user_name === 'string' ? input.user_name.trim() : '';
    const rawPhone = typeof input.user_contact_num === 'string' ? input.user_contact_num.trim() : '';
    const phone = rawPhone ? validPhoneNumber(rawPhone) : null;
    const gender = typeof input.user_gender === 'string' ? input.user_gender.trim() : '';
    const dob = input.user_dob || null;
    const date = dob && /^\d{4}-\d{2}-\d{2}$/.test(dob) ? new Date(`${dob}T00:00:00Z`) : null;

    if (!name || name.length > 50) {
        return { status: 'Invalid input', code: 422, message: 'Enter a name of up to 50 characters.' };
    }
    if (rawPhone && !phone) {
        return { status: 'Invalid input', code: 422, message: 'Enter a valid phone number with country code.' };
    }
    if (gender && !['male', 'female', 'prefer_not_to_say'].includes(gender)) {
        return { status: 'Invalid input', code: 422, message: 'Select a valid gender option.' };
    }
    if (dob && (!date || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dob || date > new Date())) {
        return { status: 'Invalid input', code: 422, message: 'Enter a valid date of birth.' };
    }

    const { rows } = await client.query(
        `UPDATE public.user_data
         SET user_name = $1, user_name_enc = $2, user_contact_num = $3,
             user_contact_num_enc = $4, user_dob = $5, user_gender = $6
         WHERE user_email = $7
         RETURNING user_name, user_email, user_contact_num, user_dob, user_gender`,
        [name, encryptPii(name, 'user_name'), phone, encryptPii(phone, 'user_contact_num'), dob, gender || null, requester.user_mail]
    );
    if (!rows.length) return { status: 'Not found', code: 404, message: 'Profile not found.' };
    return { status: 'Profile Updated', code: 200, data: rows[0] };
};

module.exports.updateProfile = updateProfile;
