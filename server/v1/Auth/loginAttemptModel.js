const client = require('../utils/conn');
const LoginAttemptModel = (user_Id) => {
    return new Promise((resolve, reject) => {
        client.query('INSERT INTO login_activity(user_id) VALUES($1)', [user_Id], (err, result) => {
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
module.exports = LoginAttemptModel;