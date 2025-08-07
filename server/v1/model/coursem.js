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
const createCoursem = (course_name, curiculum_id, requester) => {
    return new Promise((resolve, reject) => {
        const isPriviledged = [99].includes(Number(requester.role));
        if(!isPriviledged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this course data.'
            })
        }
        client.query('INSERT INTO course_data(course_name, curiculum_id) VALUES($1, $2)', [course_name, curiculum_id], (err, result) => {
                if(err)
                {
                    return reject(err);
                }
                else
                {
                    return resolve(result);
                }
        })
    })
}
const getCoursem = (requester) => {
    return new Promise((resolve, reject) => {
        const isPriviledged = [99, 101].includes(Number(requester.role));
        if(!isPriviledged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this course data.'
            })
        }
        client.query('SELECT * FROM course_data', (err, result) => {
            if(err)
            {
                return reject(err)
            }
            else
            {
                return resolve(result);
            }
        })
    })
}
module.exports = {coursem, createCoursem, getCoursem};