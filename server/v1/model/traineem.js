const client = require('../utils/conn.js');
// const {HashedPassword} = require('../utils/hash.js');
const traineem = (user_anu_id, user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, status, description, requester) => {
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
            client.query('INSERT INTO user_data (user_anu_id, user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, status, description) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)' , [user_anu_id, user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, status, description], (err, result) => {
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
const getTraineesm = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [102].includes(Number(requester.role));
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles.'
            });
        }
        client.query('SELECT user_anu_id, user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, status FROM user_data WHERE user_role = $1', ['103'], (err, result) => {
            if(err){
                return reject(err.message);
            }  
            else
            {
                return resolve(result);
            }
        })
    })
}
const disableTraineem = (requester , user_mail, status) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [102, 101].includes(Number(requester.role));
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles'
            })
        }
        client.query('UPDATE user_data SET status=$1 WHERE user_email=$2', [status , user_mail], (err, result) => {
            if(err)
            {
                return reject(err.message)
            }
            else
            {
                return resolve(result);
            }
        })
    })
}
module.exports = {traineem, getTraineesm, disableTraineem};