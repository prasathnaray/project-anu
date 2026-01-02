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
const instDataAnalysisModel = (requester, people_id) => {
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
        client.query(`
            WITH instructor AS (
                SELECT
                    user_email,
                    user_name,
                    user_role,
                    user_profile_photo
                FROM user_data
                WHERE people_id = $1
            ),
            instructor_batches AS (
                SELECT DISTINCT
                    bd.batch_id,
                    bd.batch_end_date
                FROM batch_people_data bpd
                JOIN instructor i
                    ON i.user_email = bpd.user_id
                JOIN batch_data bd
                    ON bd.batch_id = ANY (bpd.batch_id)
            ),
            active_batches AS (
                SELECT batch_id
                FROM instructor_batches
                WHERE batch_end_date IS NULL
                OR batch_end_date::date >= CURRENT_DATE
            ),
            total_trainees AS (
                SELECT DISTINCT ud.user_email
                FROM batch_people_data bpd
                JOIN user_data ud
                    ON ud.user_email = bpd.user_id
                WHERE ud.user_role = '103'
                AND EXISTS (
                    SELECT 1
                    FROM instructor_batches ib
                    WHERE ib.batch_id = ANY (bpd.batch_id)
                )
            ),
            active_trainees AS (
                SELECT DISTINCT ud.user_email
                FROM batch_people_data bpd
                JOIN user_data ud
                    ON ud.user_email = bpd.user_id
                WHERE ud.user_role = '103'
                AND EXISTS (
                    SELECT 1
                    FROM active_batches ab
                    WHERE ab.batch_id = ANY (bpd.batch_id)
                )
            )
            SELECT
                i.user_name AS instructor_name,
                i.user_role AS instructor_role,
                i.user_profile_photo,
                COUNT(DISTINCT at.user_email) AS active_trainees,
                COUNT(DISTINCT tt.user_email) AS total_trainees,
                (SELECT COUNT(*) FROM active_batches)      AS active_batches,
                (SELECT COUNT(*) FROM instructor_batches)  AS total_batches
            FROM instructor i
            LEFT JOIN active_trainees at ON TRUE
            LEFT JOIN total_trainees tt ON TRUE
            GROUP BY
                i.user_name,
                i.user_role,
                i.user_profile_photo;
        `, [people_id], (err, result) => {
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
module.exports = {getInstructorsm, deleteInstructorsm, updateInstructorsm, instDataAnalysisModel};
