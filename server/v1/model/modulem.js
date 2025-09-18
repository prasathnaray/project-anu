const client = require('../utils/conn')
const createModuleModel = (course_id, module_name, requester) => {
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
        client.query('INSERT INTO module_data(course_id, module_name) VALUES($1, $2)', [course_id, module_name], (err, result) => {
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
const getModuleModel = (course_id, requester) => {
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
        client.query('SELECT * FROM module_data WHERE course_id=$1', [course_id],  (err, result) => {
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
const completionModel = (is_completed, submod_id, requester) => {
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
            client.query('INSERT INTO progress_data(user_id, is_completed, submod_id) VALUES($1, $2, $3)', [requester.user_mail, is_completed, submod_id], (err, result) => {
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
module.exports = {createModuleModel, getModuleModel, subModuleModel, getSubModuleModel, completionModel}