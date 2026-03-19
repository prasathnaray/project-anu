const client = require('../utils/conn.js');

const createQuerym = (requester, subject, instructor_id, message) => {
    const isPrivileged = [103].includes(Number(requester.role));
    if (!isPrivileged) {
        return Promise.resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to access queries.'
        });
    }
    return new Promise((resolve, reject) => {
        client.query(
            'INSERT INTO queries_data (subject, instructor_id, message, created_by) VALUES($1, $2, $3, $4)',
            [subject, instructor_id, message, requester.user_mail],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

const getQueriesm = (requester, page, limit) => {
    const isPrivileged = [99, 101].includes(Number(requester.role));
    if (!isPrivileged) {
        return Promise.resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to access queries.'
        });
    }
    const offset = (page - 1) * limit;
    return new Promise((resolve, reject) => {
        client.query(
            `SELECT qd.*, ud.user_name 
             FROM queries_data qd 
             LEFT JOIN user_data ud ON qd.created_by = ud.user_email 
             ORDER BY qd.created_at DESC 
             LIMIT $1 OFFSET $2`,
            [limit, offset],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    // Get total count
                    client.query('SELECT COUNT(*) FROM queries_data', (countErr, countResult) => {
                        if (countErr) {
                            reject(countErr);
                        } else {
                            resolve({
                                rows: result.rows,
                                total: parseInt(countResult.rows[0].count)
                            });
                        }
                    });
                }
            }
        );
    });
};

const getQueriesByUserm = (requester, page, limit) => {
    const offset = (page - 1) * limit;
    return new Promise((resolve, reject) => {
        client.query(
            `SELECT qd.*, ud.user_name 
             FROM queries_data qd 
             LEFT JOIN user_data ud ON qd.created_by = ud.user_email 
             WHERE qd.created_by = $1 
             ORDER BY qd.created_at DESC 
             LIMIT $2 OFFSET $3`,
            [requester.user_mail, limit, offset],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    client.query('SELECT COUNT(*) FROM queries_data WHERE created_by = $1', [requester.user_mail], (countErr, countResult) => {
                        if (countErr) {
                            reject(countErr);
                        } else {
                            resolve({
                                rows: result.rows,
                                total: parseInt(countResult.rows[0].count)
                            });
                        }
                    });
                }
            }
        );
    });
};

const updateQueryStatusm = (requester, query_id, status) => {
    const isPrivileged = [99, 101].includes(Number(requester.role));
    if (!isPrivileged) {
        return Promise.resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to update queries.'
        });
    }
    return new Promise((resolve, reject) => {
        client.query(
            'UPDATE queries_data SET status = $1 WHERE query_id = $2',
            [status, query_id],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

const deleteQuerym = (requester, query_id) => {
    const isPrivileged = [99, 101].includes(Number(requester.role));
    if (!isPrivileged) {
        return Promise.resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to delete queries.'
        });
    }
    return new Promise((resolve, reject) => {
        client.query(
            'DELETE FROM queries_data WHERE query_id = $1',
            [query_id],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};
module.exports = { createQuerym, getQueriesm, getQueriesByUserm, updateQueryStatusm, deleteQuerym };