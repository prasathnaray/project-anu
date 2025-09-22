const client = require('../utils/conn');
const getChapterModel = (course_id, requester) => {
    return new Promise((resolve, reject) => {
        const isPriviledged = [99, 101].includes(Number(requester.role));
        if (!isPriviledged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: "You don't have a persmission"
            });
        }
        client.query(
            `WITH module_completion AS (
    SELECT 
        m.module_id,
        m.chapter_id,
        pd.user_id,
        COUNT(pd.resourse_id) AS completed_resources,
        mr.total_resources
    FROM progress_data pd
    JOIN resource_data rd ON pd.resourse_id = rd.resource_id
    JOIN module_data m ON rd.module_id = m.module_id
    JOIN (
        SELECT module_id, COUNT(resource_id) AS total_resources
        FROM resource_data
        GROUP BY module_id
    ) mr ON mr.module_id = m.module_id
    WHERE pd.is_completed = TRUE
    GROUP BY m.module_id, m.chapter_id, pd.user_id, mr.total_resources
    HAVING COUNT(pd.resourse_id) = mr.total_resources
),
            user_chapter_progress AS (
                SELECT 
                    mc.chapter_id,
                    mc.user_id,
                    COUNT(mc.module_id) AS completed_modules
                FROM module_completion mc
                GROUP BY mc.chapter_id, mc.user_id
            ),
            chapter_modules AS (
                SELECT 
                    chapter_id, 
                    COUNT(module_id) AS total_modules
                FROM module_data
                GROUP BY chapter_id
            ),
            total_trainees AS (
                SELECT COUNT(user_email) AS total_users
                FROM user_data
                WHERE user_role = '103'
            )
            SELECT 
                c.course_id,
                c.chapter_id,
                c.chapter_name,
                COUNT(u.user_id) AS users_completed_all,
                t.total_users
            FROM chapter_data c
            LEFT JOIN chapter_modules cm 
                ON c.chapter_id = cm.chapter_id
            LEFT JOIN user_chapter_progress u
                ON c.chapter_id = u.chapter_id
                AND u.completed_modules = cm.total_modules
            CROSS JOIN total_trainees t
            WHERE c.course_id = $1
            GROUP BY c.course_id, c.chapter_id, c.chapter_name, cm.total_modules, t.total_users
            ORDER BY c.chapter_name;`,
            [course_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            }
        );
    });
};

module.exports = { getChapterModel };