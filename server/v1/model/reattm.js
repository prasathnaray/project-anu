const client = require('../utils/conn');

const createReattData = (requester, reattData) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to create reattempt data.'
            });
        }

        const uploadedBy = reattData.uploaded_by || requester.user_mail;
        const query = `
            INSERT INTO reatt_data (
                uploaded_by,
                certificate_id,
                course_id,
                unit_name,
                resource_type,
                resource_id,
                max_reattempt_count
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const values = [
            uploadedBy,
            reattData.certificate_id,
            reattData.course_id,
            reattData.unit_name,
            reattData.resource_type,
            reattData.resource_id,
            reattData.max_reattempt_count
        ];

        client.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }

            return resolve({
                status: 'Created Successfully',
                code: 201,
                data: result.rows[0]
            });
        });
    });
};

const getReattData = (requester, filters) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view reattempt data.'
            });
        }

        const conditions = [];
        const values = [];
        const allowedFilters = [
            'uploaded_by',
            'certificate_id',
            'course_id',
            'unit_name',
            'resource_type',
            'resource_id',
            'max_reattempt_count'
        ];

        allowedFilters.forEach((field) => {
            if (filters[field]) {
                values.push(filters[field]);
                conditions.push(`${field} = $${values.length}`);
            }
        });

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
            SELECT *
            FROM reatt_data
            ${whereClause}
            ORDER BY created_at DESC
        `;

        client.query(query, values, (err, result) => {
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

module.exports = {
    createReattData,
    getReattData
};
