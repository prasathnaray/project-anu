const client = require('../utils/conn')
const GenderRatio = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101, 103, 102].includes(Number(requester.role));
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles'
            })
        }
        client.query('SELECT user_gender, COUNT(user_role) FROM user_data WHERE user_role NOT IN ($1, $2) GROUP BY user_gender', ['99', '101'], (err, result) => {
            if(err)
            {
                return reject(err)
            }
            else {
                return resolve(result.rows)
            }
        })
    })
}
const UserStats = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101, 103].includes(Number(requester.role));
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles'
            })
        }
        client.query(`
            WITH course_resources AS (
            SELECT 
                c.course_id,
                COUNT(r.resource_id) AS total_resources
            FROM course_data c
            JOIN chapter_data ch ON c.course_id = ch.course_id
            JOIN module_data m ON ch.chapter_id = m.chapter_id
            JOIN resource_data r ON m.module_id = r.module_id
            GROUP BY c.course_id
        ),
        user_completed AS (
            SELECT 
                c.course_id,
                COUNT(r.resource_id) AS completed_resources
            FROM course_data c
            JOIN chapter_data ch ON c.course_id = ch.course_id
            JOIN module_data m ON ch.chapter_id = m.chapter_id
            JOIN resource_data r ON m.module_id = r.module_id
            JOIN progress_data p ON r.resource_id = p.resourse_id
            WHERE p.user_id = $1
            AND p.is_completed = TRUE
            GROUP BY c.course_id
        )
        SELECT 
            cr.course_id,
            cr.total_resources,
            COALESCE(uc.completed_resources, 0) AS completed_resources,
            ROUND(
                (COALESCE(uc.completed_resources, 0)::decimal / cr.total_resources) * 100, 
                2
            ) AS completion_percentage
        FROM course_resources cr
        LEFT JOIN user_completed uc 
            ON cr.course_id = uc.course_id
        ORDER BY completion_percentage DESC;
            `,[requester.user_mail], (err, result) => {
                if(err)
                {
                    return reject(err)
                }
                else {
                    return resolve(result.rows)
                }
            })
    })
}
module.exports = {GenderRatio, UserStats}