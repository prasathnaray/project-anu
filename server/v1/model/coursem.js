const client = require('../utils/conn.js');

const coursem = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [101].includes(Number(requester.role));
        if(!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this course data.'
            });
        }
        client.query('SELECT * FROM course_data WHERE course_email=$1', [requester.user_mail], (err, result) => {
            if(err) {
                return reject(err);
            }
            if(result.rows.length === 0) {
                return resolve({
                    status: 'Course Not Found',
                    code: 404,
                    message: 'No course found with the provided email.'
                });
            }
            const course = result.rows[0];
            resolve({
                status: 'Course Retrieved',
                code: 200,
                data: course
            });
        });
    })
}
module.exports = coursem;