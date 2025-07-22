const client = require('../utils/conn');

const getInstructorsm = (requester) => {
    return new Promise((resolve, reject) => {
                const isPrivileged = [99, 101].includes(Number(requester.role));
                if(!isPrivileged) {
                    return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this profile.'
                    });
                }
            client.query('SELECT user_anu_id, user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, status, batch_id FROM public.user_data LEFT JOIN public.batch_people_data ON public.user_data.user_email = public.batch_people_data.user_id  WHERE user_role = $1' , ['102'], (err, result) => {
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
module.exports = {getInstructorsm};
