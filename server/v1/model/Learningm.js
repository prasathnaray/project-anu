const client = require('../utils/conn');
const Learningm = (certificate_id, course_name, module_name, unit_name, requester) => {
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
        client.query('INSERT INTO learning_module(certificate_id, course_name, module_name, unit_name) VALUES($1, $2, $3, $4)', [certificate_id, course_name, module_name, unit_name], (err, result) => {
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

const getLearningByidm = (certificate_id, requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101].includes(Number(requester.role));
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: "You don't have a persmission"
            })
        }
        client.query('SELECT * FROM learning_module WHERE certificate_id=$1',[certificate_id], (err, result) => {    
            if(err)
            {
                return reject(err)
            }
            else
            {
                return resolve(result.rows)
            }
        })
    })
}
module.exports = {Learningm, getLearningByidm};