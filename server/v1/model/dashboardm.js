const client = require('../utils/conn');
const getDashboardDatam = (requester) => {
    return new Promise((resolve, reject) => {
                const isPrivileged = [99, 101].includes(Number(requester.role));
                if(!isPrivileged) {
                    return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this profile.'
                    });
                }
            client.query('SELECT user_data.user_role, count(*) FROM user_data WHERE user_role !=$1 GROUP BY user_data.user_role;', ['101'], (err, result) => {
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
module.exports = {getDashboardDatam};