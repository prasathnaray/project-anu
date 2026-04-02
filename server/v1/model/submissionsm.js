const client = require('../utils/conn');

const getSubmissionsM = (requester, resource_id) => {
    return new Promise((resolve, reject) => {
        const role = Number(requester.role);
        const isPrivileged = [99, 101].includes(role);
        const isTrainee = role === 103;

        if (!isPrivileged && !isTrainee) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access submissions.'
            });
        }

        let query = 'SELECT * FROM submissions';
        let params = [];

        if (isTrainee) {
            query += ' WHERE user_mail = $1 AND resource_id = $2'; // ✅ space added
            params.push(requester.user_mail, resource_id);
        }

        client.query(query, params, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve({
                status: 'Success',
                code: 200,
                data: result.rows
            });
        });
    });
};

module.exports = { getSubmissionsM };