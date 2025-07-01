const client = require('../utils/conn.js');
const forgotm = (user_mail, ipaddress) => {
     return new Promise((resolve, reject ) => {
        client.query('SELECT * FROM user_data WHERE user_email=$1', [user_mail] , (err, result) => {
            if(err) {
                return reject(err);
            }
            else
            {
                if(result.rows.length === 0) {
                    return resolve({
                        status: 'User Not Found',
                        code: 404,
                        message: 'No user found with the provided email.'
                    });
                }
                client.query('INSERT INTO forgot_password_request_activity (user_mail, ip_address) VALUES ($1, $2)', [user_mail, ipaddress], (err, insertResult) => {
                    if(err) {
                        return reject(err);
                    }
                    return resolve({
                        status: 'Request Successful',
                        code: 200,
                        message: 'Password reset request has been recorded successfully.'
                    });
                });                
            }
        })
     })
}
module.exports = forgotm;