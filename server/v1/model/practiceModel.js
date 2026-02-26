const client = require('../utils/conn');

const isValidUUID = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const bulkCreatePracticeResults = (requester, practice_id, resource_id, practice_number, practiceresults) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [101, 99, 102, 103].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.',
            });
        }

        if (!isValidUUID(resource_id)) {
            return resolve({
                status: 'Bad Request',
                code: 400,
                message: 'resource_id must be a valid UUID',
            });
        }

        const results = practiceresults.map((r) => ({
            index: r.index,
            time: r.Time ?? r.time,
        }));

        const query = `
            INSERT INTO practice_results (practice_id, resource_id, user_id, practice_number, results)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const values = [practice_id, resource_id, requester.user_mail, practice_number, JSON.stringify(results)];

        client.query(query, values, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return reject(err);
            }
            return resolve(result.rows[0]);
        });
    });
};

module.exports = { bulkCreatePracticeResults };