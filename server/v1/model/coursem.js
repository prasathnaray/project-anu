const client = require('../utils/conn.js');
const supabase = require('../supaBaseClient.js');
const {
    createCourse,
    listCourses,
    setPublication
} = require('./ContentAccessm');

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
const createCertificatem = async (certificate_name, curiculum_id, requester) => {
    const course = await createCourse(requester, {
        name: certificate_name,
        curriculumId: curiculum_id,
        courseKind: 'core'
    });
    return { rowCount: 1, rows: [course] };
};

const getCoursem = async (requester) => ({
    rows: await listCourses(requester, Number(requester.role) === 103 ? 'assigned' : 'management')
});
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
const deleteCoursem = async (course_id, requester) => {
    await setPublication(requester, course_id, 'archived');
    return { rowCount: 1 };
};

const tagCoursem = async(user_id, certificate_id, requester) => {
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
            certificate_id: certificate_id,
        })
    )
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
module.exports = {coursem, createCertificatem, getCoursem, getCoursesByCurm, deleteCoursem, tagCoursem, requestCoursem};
