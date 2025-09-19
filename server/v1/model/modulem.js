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
const getModuleModel = (chapter_id, requester) => {
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
        client.query('SELECT * FROM module_data WHERE chapter_id=$1', [chapter_id],  (err, result) => {
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
            const isPrivileged = [103, 101].includes(Number(requester.role))
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