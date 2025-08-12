const client = require('../utils/conn');
const adminm = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99].includes(Number(requester.role))
        if(!isPrivileged)
        {
          return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to access this course data.'
            });   
        }

        client.query('SELECT * FROM user_data WHERE user_role=$1', ['101'], (err, result) => {
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
module.exports = {adminm}