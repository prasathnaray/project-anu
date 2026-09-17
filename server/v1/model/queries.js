const client = require('../utils/conn.js');

const denied = (message) => ({
    status: 'Forbidden',
    code: 403,
    message
});

const getAdminQueryScope = (requester, userAlias = 'ud', parameterNumber = 1) => {
    const role = Number(requester?.role);
    if (role === 99) return { clause: 'TRUE', params: [] };
    if (role !== 101 || !requester?.centre_id) return null;

    return {
        clause: `${userAlias}.centre_id = $${parameterNumber} AND ${userAlias}.user_role IN ('102', '103')`,
        params: [requester.centre_id]
    };
};

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
    const scope = getAdminQueryScope(requester);
    if (!scope) {
        return Promise.resolve(denied('Your account is not linked to an institution.'));
    }

    const offset = (page - 1) * limit;
    const limitParameter = scope.params.length + 1;
    const offsetParameter = limitParameter + 1;
    return new Promise((resolve, reject) => {
        client.query(
            `SELECT qd.*, ud.user_name 
             FROM queries_data qd 
             JOIN user_data ud ON qd.created_by = ud.user_email
             WHERE ${scope.clause}
             ORDER BY qd.created_at DESC 
             LIMIT $${limitParameter} OFFSET $${offsetParameter}`,
            [...scope.params, limit, offset],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    client.query(
                        `SELECT COUNT(*)
                         FROM queries_data qd
                         JOIN user_data ud ON qd.created_by = ud.user_email
                         WHERE ${scope.clause}`,
                        scope.params,
                        (countErr, countResult) => {
                        if (countErr) {
                            reject(countErr);
                        } else {
                            resolve({
                                rows: result.rows,
                                total: parseInt(countResult.rows[0].count)
                            });
                        }
                        }
                    );
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
    const scope = getAdminQueryScope(requester, 'ud', 3);
    if (!scope) {
        return Promise.resolve(denied('Your account is not linked to an institution.'));
    }

    const isSuperAdmin = Number(requester.role) === 99;
    const query = isSuperAdmin
        ? 'UPDATE queries_data SET status = $1 WHERE query_id = $2'
        : `UPDATE queries_data qd
           SET status = $1
           FROM user_data ud
           WHERE qd.query_id = $2
             AND qd.created_by = ud.user_email
             AND ${scope.clause}`;

    return new Promise((resolve, reject) => {
        client.query(
            query,
            [status, query_id, ...scope.params],
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
    const scope = getAdminQueryScope(requester, 'ud', 2);
    if (!scope) {
        return Promise.resolve(denied('Your account is not linked to an institution.'));
    }

    const isSuperAdmin = Number(requester.role) === 99;
    const query = isSuperAdmin
        ? 'DELETE FROM queries_data WHERE query_id = $1'
        : `DELETE FROM queries_data qd
           USING user_data ud
           WHERE qd.query_id = $1
             AND qd.created_by = ud.user_email
             AND ${scope.clause}`;

    return new Promise((resolve, reject) => {
        client.query(
            query,
            [query_id, ...scope.params],
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
