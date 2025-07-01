const client = require('../utils/conn.js');
const traineem = (requester) => {
    return new Promise((resolve, reject) => {
            const isPrivileged = [102].includes(Number(requester.role));
            if(!isPrivileged)
            {
                return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'You do not have permission to create a trainee profile.'
                });
            }
            client.query('INSERT INTO user_data (user_anu_id, user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role' , [], (err, result) => {
                  if(err){
                    return reject(err);
                  }  
                  else
                  {
                        return resolve(result);
                  }
            })
    })
}
module.exports = traineem;