const client = require('../utils/conn.js');

const profilem = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99].includes(Number(requester.role));
        if(!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.'
            });
        }
        client.query('SELECT * FROM user_data WHERE user_email=$1', [requester.user_mail], (err, result) => {
            if(err) {
                return reject(err);
            }
            if(result.rows.length === 0) {
                return resolve({
                    status: 'User Not Found',
                    code: 404,
                    message: 'No user found with the provided email.'
                });
            }
            const user = result.rows[0];
            resolve({
                status: 'Profile Retrieved',
                code: 200,
                data: user
            });
        });
    })
}
module.exports = profilem;