const client = require('../utils/conn')
const GenderRatio = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101].includes(Number(requester.role));
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
module.exports = {GenderRatio}