const client = require('../utils/conn.js');
const supabase = require('../supaBaseClient.js');

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
        const isPriviledged = [101, 99].includes(Number(requester.role));
        if(!isPriviledged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this course data.'
            })
        }
        client.query('SELECT c.course_id, c.course_name, c.curiculum_id, ca.access_status, ca.user_id FROM course_data c LEFT JOIN course_availability ca ON c.course_id = ca.course_id;', (err, result) => {
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
const getCoursesByCurm = (curiculum_id, requester) => {
    return new Promise((resolve, reject) => {
        const isPriviledged = [99, 101].includes(Number(requester.role));
        if(!isPriviledged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: "You don't have a persmission"
            })
        }
        client.query('SELECT * FROM course_data WHERE curiculum_id=$1',[curiculum_id], (err, result) => {
            if(err)
            {
                return reject(err)
            }
            else
            {
                return resolve(result)
            }
        })
    })
}
const deleteCoursem = (course_id, requester) => {
    return new Promise((resolve, reject) => {
        const isPriviledged = [99, 101].includes(Number(requester.role));
        if(!isPriviledged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: "You don't have a permission"
            })
        }
        client.query('DELETE FROM course_data WHERE course_id=$1', [course_id], (err, result) => {
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

const tagCoursem = async(user_id, course_id, requester) => {
    return new Promise((resolve, reject) => {
        const isPriviledged = [99].includes(Number(requester.role));
        if(!isPriviledged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: "You don't have a permission"
            })
        }
        resolve(supabase
        .from('course_availability')
        .insert({
            user_id: user_id,
            course_id: course_id,
        })
    )
        // client.query('INSERT INTO course_availability(user_id, course_id) VALUES($1, $2)', [user_id, course_id], (err, result) => {
        //     if(err)
        //     {
        //         return reject(err)
        //     }
        //     else
        //     {
        //         return resolve(result)
        //     }
        // })
    })
}
const requestCoursem = async(course_id, requester) => {
    return new Promise((resolve, reject) => {
        const isPriviledged = [101, 99].includes(Number(requester.role))
        if(!isPriviledged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: "You don't have a permission"
            })
        }
        resolve(supabase
            .from('course_availability')
            .insert({
                user_id: requester.user_mail,
                course_id: course_id,
                access_status: false
            })
        )
    })
}
module.exports = {coursem, createCoursem, getCoursem, getCoursesByCurm, deleteCoursem, tagCoursem, requestCoursem};