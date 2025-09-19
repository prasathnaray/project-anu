const client = require('../utils/conn');
const resourcem = (module_id, resource_name, requester) => {
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
            client.query('INSERT INTO resource_data(module_id, resource_name) VALUES($1, $2)', [module_id, resource_name], (err, result) => {
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
const getResourcesModel = (requester, module_id) => {
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
        client.query('SELECT  * FROM resource_data WHERE module_id=$1', [module_id], (err, result) => {
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
module.exports = {resourcem, getResourcesModel}