const client = require('../utils/conn');

const getInstructorsm = (requester, page, limit) => {
    return new Promise((resolve, reject) => {
                const isPrivileged = [99, 101].includes(Number(requester.role));
                if(!isPrivileged) {
                    return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this profile.'
                    });
                }
            const offset = (page - 1) * limit;
            client.query('SELECT COUNT(*) OVER() AS total_count, u.user_name, u.people_id, u.status, u.user_profile_photo, u.user_email, u.user_contact_num, u.user_dob, u.user_gender, bpd.batch_id, ARRAY_AGG(b.batch_name ORDER BY b.batch_id) AS batch_names FROM public.user_data u LEFT JOIN public.batch_people_data bpd ON u.user_email = bpd.user_id LEFT JOIN LATERAL unnest(bpd.batch_id) AS bid(batch_id) ON TRUE LEFT JOIN public.batch_data b ON b.batch_id = bid.batch_id WHERE u.user_role = ANY(ARRAY[$1]) GROUP BY u.user_name, u.user_email, u.user_contact_num, u.user_dob, u.user_gender, bpd.batch_id ORDER BY u.user_name LIMIT $2 OFFSET $3',['102', limit, offset], (err, result) => {
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
const deleteInstructorsm = (requester, user_mail) => {
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
        client.query('DELETE FROM public.user_data WHERE user_email=$1 and user_role=$2', [user_mail, '102'], (err, result) => {
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
const updateInstructorsm = (requester, batch_id, user_id) => {
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
        const pgArray = `{${batch_id.join(",")}}`;
        client.query('update batch_people_data set batch_id = $1 where user_id=$2', [pgArray, user_id], (err, result) => {
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
module.exports = {getInstructorsm, deleteInstructorsm, updateInstructorsm};
