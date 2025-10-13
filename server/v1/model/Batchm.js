const client = require('../utils/conn.js');
const createBatchm = (batch_name, batch_start_date, batch_end_date, course_data, curiculum_name, requester) => {
        return new Promise((resolve, reject) => {
                const isPrivileged = [101].includes(Number(requester.role));
                if(!isPrivileged) {
                    return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this course data.'
                    });
                }
                client.query('INSERT INTO batch_data(batch_name, batch_start_date, batch_end_date, course_data, curiculum_id) VALUES($1, $2, $3, $4, $5)', [batch_name, batch_start_date, batch_end_date, course_data, curiculum_name], (err, result) => {
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
const getBatchm = (requester) => {
    const isPrivileged = [101, 102].includes(Number(requester.role));
    if(!isPrivileged) {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to access this course data.'
        });
    }
    return new Promise((resolve, reject) => {
        const query = `WITH role_counts AS (SELECT b.batch_id, b.batch_name, b.batch_start_date, b.batch_end_date, ud.user_role, COUNT(*) AS role_count FROM batch_data b LEFT JOIN batch_people_data bpd ON b.batch_id = ANY(bpd.batch_id) LEFT JOIN user_data ud ON bpd.user_id = ud.user_email GROUP BY b.batch_id, b.batch_name, b.batch_start_date, b.batch_end_date, ud.user_role) SELECT batch_id, batch_name, batch_start_date, batch_end_date, SUM(role_count) AS total_users, JSON_AGG(JSON_BUILD_OBJECT('role', user_role, 'count', role_count)) FILTER (WHERE user_role IS NOT NULL) AS role_counts FROM role_counts GROUP BY batch_id, batch_name, batch_start_date, batch_end_date`
        client.query(query, (err, result) => {
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
const associateBatchm = (requester, batch_id, user_id) => {
    const isPrivileged = [101,  102].includes(Number(requester.role));
    if(!isPrivileged)
    {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view trainee profiles'
        })
    }
    return new Promise((resolve, reject) => {
        client.query('INSERT INTO public.batch_people_data(batch_id, user_id) VALUES($1, $2)', [batch_id, user_id] ,(err, result) => {
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
const deleteBatchm = (requester, batch_id) => {
    const isPrivileged = [101,  102].includes(Number(requester.role));
    if(!isPrivileged)
    {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view trainee profiles'
        })
    }
    return new Promise((resolve, reject) => {
        client.query('DELETE FROM batch_data WHERE batch_id=$1', [batch_id], (err, result) => {
            if(err)
            {
                reject(err)
            }   
            else
            {
                resolve(result);
            }
        })
    })
}
const createTargetedLearning = (requester, tar_name, curiculum_id, chapter_id, module_id, resources_id, start_date, end_date, course_id, trainee_id) => {
    const isPrivileged = [101, 102].includes(Number(requester.role))
    if(!isPrivileged)
    {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view trainee profiles'  
        })
    }
     const safeModuleIds = Array.isArray(module_id) && module_id.length > 0 ? module_id : null;
     const safeResourceIds = Array.isArray(resources_id) && resources_id.length > 0 ? resources_id : null;
     const traineeIds = Array.isArray(trainee_id) && trainee_id.length > 0 ? trainee_id : null;
    return new Promise((resolve, reject) => {
        client.query('INSERT INTO targeted_learning(tar_name, curiculum_id, chapter_id, modules_id, resources_id, start_date, end_date, course_id, trainee_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)', [tar_name, curiculum_id, chapter_id, safeModuleIds, safeResourceIds, start_date, end_date, course_id, traineeIds], (err, result) => {
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

const getTargetedLearningListModel = (requester) => {
    const isPrivileged = [101, 102].includes(Number(requester.role));
    if(!isPrivileged)
    {
            return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'You do not have permission to view trainee profiles'  
            })
    }
    return new Promise((resolve, reject) => {
        client.query('SELECT * FROM targeted_learning', (err, result) => {
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
const deleteTargetedLearningModel = (requester, targeted_learning_id) => {
    const isPrivileged = [101, 102].includes(Number(requester.role))
    if(!isPrivileged)
    {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: "You do not have permission to view"
        })
    }
    return new Promise((resolve, reject) => {
        client.query('DELETE FROM targeted_learning WHERE target_learning_id=$1', [targeted_learning_id], (err, result) => {
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

const IndividualtllList = (requester) => {
    const isPrivileged = [103].includes(Number(requester.role));
    if(!isPrivileged)
    {
            return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'You do not have permission to view trainee profiles'  
            })
    }
    return new Promise((resolve, reject) => {
        client.query('SELECT * FROM targeted_learning where trainee_id@>$1', [`{${requester.user_mail}}`], (err, result) => {
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
module.exports = {createBatchm, getBatchm, associateBatchm, deleteBatchm, createTargetedLearning, getTargetedLearningListModel, deleteTargetedLearningModel, IndividualtllList};