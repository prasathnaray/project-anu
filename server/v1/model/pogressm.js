const client = require('../utils/conn');
const progressm = (user_id, course_id, module_id, isCompleted, requester) => {
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
        client.query('INSERT INTO progress_data(user_id, course_id, module_id, is_completed) VALUES($1, $2, $3, $4)', [user_id, course_id, module_id, isCompleted], (err, result) => {
                if(err)
                {
                   return reject(err)
                }
                else {
                    return resolve(result)
                }
        })
    })
}
module.exports = {progressm};