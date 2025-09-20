const client = require('../utils/conn')
const createModuleModel = (course_id, chapter_name, requester) => {
    return new Promise((resolve, reject) =>{
        const isPrivileged = [99, 101].includes(Number(requester.role))
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.'
            })
        }
        client.query('INSERT INTO chapter_data(course_id, chapter_name) VALUES($1, $2)', [course_id, chapter_name], (err, result) => {
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve(result)
            }
        })
    })
}
// const getModuleModel = (chapter_id, requester) => {
//     return new Promise((resolve, reject) => {
//         const isPrivileged = [99, 101].includes(Number(requester.role))
//         if(!isPrivileged)
//         {
//             return resolve({
//                 status: 'Unauthorized',
//                 code: 401,
//                 message: 'You do not have permission to access this profile.'
//             })
//         }
//         client.query('SELECT * FROM module_data WHERE chapter_id=$1', [chapter_id],  (err, result) => {
//             if(err)
//             {
//                 reject(err)
//             }
//             else
//             {
//                 resolve(result)
//             }
//         })
//     })
// }
const getModuleModel = (chapter_id, requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.'
            });
        }

        // Promise #1: Get all modules for the chapter
        const modulesPromise = new Promise((res, rej) => {
            client.query(
                'SELECT * FROM module_data WHERE chapter_id=$1',
                [chapter_id],
                (err, result) => (err ? rej(err) : res(result))
            );
        });

        // Promise #2: Get completion stats + total trainees
        const statsPromise = new Promise((res, rej) => {
            client.query(
                `WITH module_resources AS (
                        SELECT module_id, COUNT(resource_id) AS total_resources
                        FROM resource_data
                        GROUP BY module_id
                    ),
                    user_progress AS (
                        SELECT 
                            rd.module_id,
                            pd.user_id,
                            COUNT(pd.resourse_id) AS completed_resources
                        FROM progress_data pd
                        JOIN resource_data rd 
                            ON pd.resourse_id = rd.resource_id
                        WHERE pd.is_completed = TRUE
                        GROUP BY rd.module_id, pd.user_id
                    ),
                    total_trainees AS (
                        SELECT COUNT(user_email) AS total_users
                        FROM user_data
                        WHERE user_role = '103'
                    )
                    SELECT 
                        m.module_id,
                        m.module_name,
                        COUNT(up.user_id) AS users_completed_all,
                        t.total_users
                    FROM module_data m
                    LEFT JOIN module_resources mr
                        ON m.module_id = mr.module_id
                    LEFT JOIN user_progress up
                        ON m.module_id = up.module_id
                        AND up.completed_resources = mr.total_resources
                    CROSS JOIN total_trainees t
                    WHERE m.chapter_id = $1
                    GROUP BY m.module_id, m.module_name, t.total_users`,
                [chapter_id],
                (err, result) => (err ? rej(err) : res(result))
            );
        });

        // Run both queries in parallel
        Promise.all([modulesPromise, statsPromise])
            .then(([modulesResult, statsResult]) => {
                resolve({
                    modules: modulesResult.rows,
                    stats: statsResult.rows
                });
            })
            .catch(reject);
    });
};
const subModuleModel = (module_id, submod_name, requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101].includes(Number(requester.role))
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.'
            })
        }
        client.query('INSERT INTO submod_data(module_id, submod_name) VALUES($1, $2)', [module_id, submod_name], (err, result) => {
            if(err)
            {
                reject(err)
            }
            else(
                resolve(result) 
            )
        })
    })
}
const getSubModuleModel = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101].includes(Number(requester.role))
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.'
            })
        }
        client.query('SELECT * FROM submod_data', (err, result) => {
            if(err)
            {
                reject(err)
            }
            else
            {
                resolve(result)
            }   
        })
    })
}
const completionModel = (is_completed, r_id, requester) => {
    return new Promise((resolve, reject) => {
            const isPrivileged = [103].includes(Number(requester.role))
            if(!isPrivileged)
            {
                return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'You do not have permission to access this profile.'
                })
            }
            client.query('INSERT INTO progress_data(user_id, is_completed, resourse_id) VALUES($1, $2, $3)', [requester.user_mail, is_completed, r_id], (err, result) => {
                if(err)
                {
                    reject(err)
                }
                else 
                {
                    resolve(result)
                }
            })
    })
}
const createNewModuleModel = (module_name, chapter_id, requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [101].includes(Number(requester.role))
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this profile.'
            })
        }
        client.query('INSERT INTO module_data(module_name, chapter_id) VALUES($1, $2)', [module_name, chapter_id], (err, result) => {
            if(err)
            {
                reject(err)
            }
            else 
            {
                resolve(result)
            }
        })
    })
}
module.exports = {createModuleModel, getModuleModel, subModuleModel, getSubModuleModel, completionModel, createNewModuleModel}