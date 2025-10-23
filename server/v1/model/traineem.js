const client = require('../utils/conn.js');
// const {HashedPassword} = require('../utils/hash.js');
const traineem = (user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, status, description, user_batch, requester) => {
    return new Promise((resolve, reject) => {
            const isPrivileged = [102, 101].includes(Number(requester.role));
            if(!isPrivileged)
            {
                return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'You do not have permission to create a trainee profile.'
                });
            }
            client.query('INSERT INTO public.user_data(user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, status, description) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)' , [user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, status, description], (err, result) => {
                  if(err){
                    return reject(err);
                  }  
                  else
                  {
                            client.query('INSERT INTO public.batch_people_data(batch_id, user_id) VALUES($1, $2)', [user_batch, user_email] ,(err2, result2) => {
                                if (err2) return reject(err2)
                                
                                return resolve({
                                    status: 'success',
                                    code: 200,
                                    message: 'Profile Created Successfully',
                                    data: {
                                        user_email
                                    }
                                })
                            })
                  }
            })
    })
}
const getTraineesm = (requester, page, limit) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [101, 102].includes(Number(requester.role));
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles.'
            });
        }
        const offset = (page - 1) * limit;
        client.query("SELECT COUNT(*) OVER() AS total_count, ud.user_profile_photo, ud.user_name, ud.user_email, ud.user_contact_num, ud.user_dob, ud.user_gender, ud.status, bpd.batch_id, bpd.user_id, bd.batch_name, bd.batch_start_date, bd.batch_end_date FROM  public.user_data ud LEFT JOIN public.batch_people_data bpd ON ud.user_email = bpd.user_id LEFT JOIN public.batch_data bd ON bd.batch_id = ANY(bpd.batch_id) WHERE ud.user_role=$1 ORDER BY ud.user_name LIMIT $2 OFFSET $3", ['103', limit, offset], (err, result) => {
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
        const isPrivileged = [101,  102].includes(Number(requester.role));
        if(!isPrivileged)
        {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles'
            })
        }
        client.query('UPDATE public.user_data SET status=$1 WHERE user_email=$2', [status , user_mail], (err, result) => {
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
const deleteTraineem = (requester, user_mail) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [101, 102].includes(Number(requester.role));
        if(!isPrivileged)
        {
            return resolve({
                  status: 'Unauthorized',
                  code: 401,
                  message: 'You do not have permission to view trainee profiles'
            })
        }
        client.query('DELETE FROM public.user_data WHERE user_email=$1 and user_role=$2', [user_mail, '103'], (err, result) => {
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

const indData = (requester, user_mail) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [103].includes(Number(requester.role));
        if(!isPrivileged)
        {
            return resolve({
                  status: 'Unauthorized',
                  code: 401,
                  message: 'You do not have permission to view trainee profiles'
            })
        }
        client.query(`WITH pdt AS(SELECT resourse_id AS rid, user_id, is_completed FROM progress_data WHERE user_id=$1) 
                     SELECT c.course_id, c.course_name, c.curiculum_id, ch.chapter_id, ch.chapter_name, md.module_id, md.module_name, rd.resource_name, pdt.is_completed from course_data c 
                     LEFT JOIN chapter_data ch ON c.course_id = ch.course_id 
                     LEFT JOIN module_data md ON ch.chapter_id = md.chapter_id 
                     LEFT JOIN resource_data rd ON md.module_id = rd.module_id 
                     LEFT JOIN pdt ON pdt.rid = rd.resource_id`, [user_mail], (err, result) => {
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
module.exports = {traineem, getTraineesm, disableTraineem, deleteTraineem, indData};