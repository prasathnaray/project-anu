const client = require('../utils/conn.js');

const svUploadModel = (requester, volume_type, volume_name, volume_ga, volume_fetal_presentation, volume_file) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [101, 102, 103].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to upload volumes',
            });
        }

        const query = `
            INSERT INTO volumes (volume_type, volume_name, volume_ga, volume_fetal_presentation, volume_file, added_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        client.query(query, [volume_type, volume_name, volume_ga, volume_fetal_presentation, volume_file, requester.user_mail], (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


const getUploadedVolume = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [101, 102, 103].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view uploaded volumes',
            });
        }
        const query = `SELECT * FROM volumes ORDER BY id DESC;`;
        client.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve({
                    status: 'Success',
                    code: 200,
                    data: result.rows
                });
            }
        });
    });
};
module.exports = { svUploadModel, getUploadedVolume };