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
// const getTraineesm = (requester, page, limit) => {
//     return new Promise((resolve, reject) => {
//         const isPrivileged = [101, 102].includes(Number(requester.role));
//         if(!isPrivileged)
//         {
//             return resolve({
//                 status: 'Unauthorized',
//                 code: 401,
//                 message: 'You do not have permission to view trainee profiles.'
//             });
//         }
//         const offset = (page - 1) * limit;
//         client.query("SELECT COUNT(*) OVER() AS total_count, ud.user_profile_photo, ud.people_id, ud.user_name, ud.user_email, ud.user_contact_num, ud.user_dob, ud.user_gender, ud.status, bpd.batch_id, bpd.user_id, bd.batch_name, bd.batch_start_date, bd.batch_end_date FROM  public.user_data ud LEFT JOIN public.batch_people_data bpd ON ud.user_email = bpd.user_id LEFT JOIN public.batch_data bd ON bd.batch_id = ANY(bpd.batch_id) WHERE ud.user_role=$1 ORDER BY ud.user_name LIMIT $2 OFFSET $3", ['103', limit, offset], (err, result) => {
//             if(err){
//                 return reject(err.message);
//             }  
//             else
//             {
//                 return resolve(result);
//             }
//         })
//     })
// }

const getTraineesm = (requester, page, limit) => {
    return new Promise((resolve, reject) => {

        const isPrivileged = [101, 102].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles.'
            });
        }

        const offset = (page - 1) * limit;

        let query = "";
        let params = [];

        // ADMIN (role 101)
        if (Number(requester.role) === 101) {
            query = `
                SELECT COUNT(*) OVER() AS total_count,
                       ud.user_profile_photo,
                       ud.people_id,
                       ud.user_name,
                       ud.user_email,
                       ud.user_contact_num,
                       ud.user_dob,
                       ud.user_gender,
                       ud.status,
                       bpd.batch_id,
                       bpd.user_id,
                       bd.batch_name,
                       bd.batch_start_date,
                       bd.batch_end_date
                FROM public.user_data ud
                LEFT JOIN public.batch_people_data bpd 
                    ON ud.user_email = bpd.user_id
                LEFT JOIN public.batch_data bd 
                    ON bd.batch_id = ANY(bpd.batch_id)
                WHERE ud.user_role = '103'
                ORDER BY ud.user_name
                LIMIT $1 OFFSET $2
            `;
            params = [limit, offset];
        }

        // INSTRUCTOR (role 102)
        else if (Number(requester.role) === 102) {
            query = `
                SELECT COUNT(*) OVER() AS total_count,
                       ud.user_profile_photo,
                       ud.people_id,
                       ud.user_name,
                       ud.user_email,
                       ud.user_contact_num,
                       ud.user_dob,
                       ud.user_gender,
                       ud.status,
                       bpd.batch_id,
                       bpd.user_id,
                       bd.batch_name,
                       bd.batch_start_date,
                       bd.batch_end_date
                FROM public.user_data ud
                JOIN public.batch_people_data bpd 
                    ON ud.user_email = bpd.user_id
                LEFT JOIN public.batch_data bd 
                    ON bd.batch_id = ANY(bpd.batch_id)
                WHERE bpd.batch_id && (
                        SELECT batch_id 
                        FROM public.batch_people_data 
                        WHERE user_id = $3
                )
                AND ud.user_role = '103'
                ORDER BY ud.user_name
                LIMIT $1 OFFSET $2
            `;
            params = [limit, offset, requester.user_mail];
        }

        client.query(query, params, (err, result) => {
            if (err) return reject(err.message);
            return resolve(result);
        });

    });
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
// const indDatauuid = (requester, people_id) => {
//     return new Promise((resolve, reject) => {
//         const isPrivileged = [101, 102, 103].includes(Number(requester.role));
//         if(!isPrivileged)
//         {
//             return resolve({
//                   status: 'Unauthorized',
//                   code: 401, 
//                   message: 'You do not have permission to view profiles'
//             })
//         }
//         client.query(`
//             WITH user_info AS (
//     SELECT user_email, user_name, user_role, user_profile_photo
//     FROM user_data
//     WHERE people_id = $1
// ),
// pdt AS (
//     SELECT resourse_id AS rid, user_id, is_completed, updated_at
//     FROM progress_data
//     WHERE user_id IN (SELECT user_email FROM user_info)
// )
// SELECT 
//     ui.user_name,
//     ui.user_profile_photo,
//     ui.user_role,
//     c.course_id, 
//     c.course_name, 
//     c.curiculum_id, 
//     ch.chapter_id, 
//     ch.chapter_name, 
//     md.module_id, 
//     md.module_name, 
//     rd.resource_name, 
//     pdt.is_completed,
//     pdt.updated_at
// FROM user_info ui
// CROSS JOIN course_data c
// LEFT JOIN chapter_data ch ON c.course_id = ch.course_id
// LEFT JOIN module_data md ON ch.chapter_id = md.chapter_id
// JOIN resource_data rd ON md.module_id = rd.module_id
// LEFT JOIN pdt ON pdt.rid = rd.resource_id;
//         `, [people_id], (err, result) => {
//                 if(err)
//                 {
//                    return reject(err)
//                 }
//                 else
//                 {
//                     return resolve(result);
//                 }
//         })
//     })
// }


// const indDatauuid = (requester, people_id) => {
//   return new Promise((resolve, reject) => {
//     const isPrivileged = [101, 102, 103].includes(Number(requester.role));
//     if (!isPrivileged) {
//       return resolve({
//         status: 'Unauthorized',
//         code: 401,
//         message: 'You do not have permission to view profiles',
//       });
//     }

//     // Query 1 — progress + user info
//     const userProgressQuery = `
//     WITH user_info AS (
//     SELECT 
//         user_email, 
//         user_name, 
//         user_role, 
//         user_profile_photo
//     FROM user_data
//     WHERE people_id = $1
// ),

// pdt AS (
//     SELECT 
//         resourse_id AS rid, 
//         user_id, 
//         is_completed, 
//         updated_at
//     FROM progress_data
//     WHERE user_id IN (SELECT user_email FROM user_info)
// )

// SELECT 
//     ui.user_name,
//     ui.user_profile_photo,
//     ui.user_role,
//     lm.certificate_id,
//     lm.course_name,
//     lm.module_name,
//     lm.unit_name,
//     lm.learning_module_id,
//     rd.resource_id,
//     rd.resource_name,
//     rd.resource_type,
//     pdt.is_completed,
//     pdt.updated_at
// FROM user_info ui
// CROSS JOIN learning_module lm
// LEFT JOIN resource_data rd 
//     ON lm.learning_module_id = rd.learning_module_id
// LEFT JOIN pdt 
//     ON pdt.rid = rd.resource_id;`
    
//     const instructorQuery = `
//       SELECT 
//           bd.batch_id,
//           bd.batch_name,
//           COUNT(DISTINCT CASE WHEN ud.user_role = '102' THEN ud.user_email END) AS instructor_count,
//           ARRAY_AGG(DISTINCT ud.user_name) FILTER (WHERE ud.user_role = '102' AND ud.user_name IS NOT NULL) AS instructors
//       FROM batch_data bd
//       JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
//       JOIN user_data ud ON ud.user_email = bpd.user_id
//       WHERE bd.batch_id IN (
//           SELECT UNNEST(bpd.batch_id)
//           FROM user_data ud
//           JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//           WHERE ud.people_id = $1
//       )
//       GROUP BY bd.batch_id, bd.batch_name;
//     `;

//     const testDataQuery = `SELECT 
//     rd.resource_id,
//     rd.resource_name,
//     rd.resource_type,
//     ctd.plane_identification,
//     ctd.image_optimization,
//     ctd.measurement,
//     ctd.diagnostic_interpretation,
//     ctd.created_at,
//     lm.learning_module_id,
//     lm.module_name,
//     lm.unit_name,
//     lm.course_name,
//     cd.certificate_name
// FROM user_data ud
// JOIN course_test_data ctd 
//     ON ud.user_email = ctd.user_id
// JOIN resource_data rd 
//     ON rd.resource_id = ctd.r_id
// JOIN learning_module lm 
//     ON lm.learning_module_id = rd.learning_module_id
// JOIN certification_data cd 
//     ON cd.certificate_id = lm.certificate_id
// WHERE ud.people_id = $1
// ORDER BY ctd.created_at DESC;`;

// const testReattempts = `SELECT
//   r.resource_id,
//   r.resource_name,
//   r.resource_type,
//   COUNT(t.r_id) AS attempt_count
// FROM user_data ud
// JOIN test_attempts_logs t
//   ON t.user_id = ud.user_email
// JOIN resource_data r
//   ON r.resource_id = t.r_id
// WHERE ud.people_id = $1
// GROUP BY
//   r.resource_id,
//   r.resource_name,
//   r.resource_type
// HAVING COUNT(t.r_id) > 1
// ORDER BY attempt_count DESC;`
//     Promise.all([
//       new Promise((res, rej) =>
//         client.query(userProgressQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(instructorQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) => 
//         client.query(testDataQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) => 
//         client.query(testReattempts, [people_id], (err, result) => {
//             err? rej(err) : res(result.rows)
//         })
//       )
//     ])
//       .then(([progressData, instructorData, reAttemptsData]) => {
//         resolve({
//           status: 'Success',
//           code: 200,
//           data: progressData, 
//           instructors: instructorData,
//         //   testQuery: testData,
//           reAttempts: reAttemptsData
//         });
//       })
//       .catch((err) => {
//         reject({
//           status: 'Error',
//           code: 500,
//           message: 'Database query failed',
//           error: err,
//         });
//       });
//   });
// };

// const indDatauuid = (requester, people_id, loginContext = "lms") => {
//   return new Promise((resolve, reject) => {
//     const isPrivileged = [101, 102, 103].includes(Number(requester.role));

//     if (!isPrivileged) {
//       return resolve({
//         status: 'Unauthorized',
//         code: 401,
//         message: 'You do not have permission to view profiles',
//       });
//     }

//     // VR login: only batch and certificate data
//     if (loginContext === "vr") {
//       const vrBatchQuery = `
//         SELECT 
//           bd.batch_id,
//           bd.batch_name,
//           bd.batch_end_date,
//           COUNT(DISTINCT CASE WHEN ud.user_role = '102' THEN ud.user_email END) AS instructor_count,
//           ARRAY_AGG(DISTINCT ud.user_name) FILTER (WHERE ud.user_role = '102' AND ud.user_name IS NOT NULL) AS instructors
//         FROM batch_data bd
//         JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
//         JOIN user_data ud ON ud.user_email = bpd.user_id
//         WHERE bd.batch_end_date::DATE >= CURRENT_DATE
//           AND bd.batch_id IN (
//             SELECT UNNEST(bpd.batch_id)
//             FROM user_data ud
//             JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//             WHERE ud.people_id = $1
//           )
//         GROUP BY bd.batch_id, bd.batch_name, bd.batch_end_date
//         ORDER BY bd.batch_end_date::DATE DESC;
//       `;

//       const vrCertificateQuery = `
//         SELECT DISTINCT
//           cd.certificate_id,
//           cd.certificate_name,
//           lm.course_name
//         FROM user_data ud
//         JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//         JOIN batch_data bd ON bd.batch_id = ANY(bpd.batch_id)
//         JOIN learning_module lm ON lm.certificate_id IS NOT NULL
//         JOIN certification_data cd ON cd.certificate_id = lm.certificate_id
//         WHERE ud.people_id = $1;
//       `;

//       Promise.all([
//         new Promise((res, rej) =>
//           client.query(vrBatchQuery, [people_id], (err, result) =>
//             err ? rej(err) : res(result.rows)
//           )
//         ),
//         new Promise((res, rej) =>
//           client.query(vrCertificateQuery, [people_id], (err, result) =>
//             err ? rej(err) : res(result.rows)
//           )
//         ),
//       ])
//         .then(([batchData, certificateData]) => {
//           resolve({
//             status: 'Success',
//             code: 200,
//             currentBatches: batchData, // Only current batches returned
//             certificates: certificateData,
//             loginContext: 'vr',
//           });
//         })
//         .catch((err) => {
//           reject({
//             status: 'Error',
//             code: 500,
//             message: 'Database query failed',
//             error: err,
//           });
//         });

//       return;
//     }

//     // LMS login: full data (original queries)
//     const userProgressQuery = `
//       WITH user_info AS (
//         SELECT user_email, user_name, user_role, user_profile_photo
//         FROM user_data
//         WHERE people_id = $1
//       ),
//       pdt AS (
//         SELECT resourse_id AS rid, user_id, is_completed, updated_at
//         FROM progress_data
//         WHERE user_id IN (SELECT user_email FROM user_info)
//       )
//       SELECT 
//         ui.user_name, ui.user_profile_photo, ui.user_role,
//         lm.certificate_id, lm.course_name, lm.module_name, lm.unit_name, lm.learning_module_id,
//         rd.resource_id, rd.resource_name, rd.resource_type,
//         pdt.is_completed, pdt.updated_at
//       FROM user_info ui
//       CROSS JOIN learning_module lm
//       LEFT JOIN resource_data rd ON lm.learning_module_id = rd.learning_module_id
//       LEFT JOIN pdt ON pdt.rid = rd.resource_id;
//     `;

//     const instructorQuery = `
//       SELECT 
//         bd.batch_id,
//         bd.batch_name,
//         bd.batch_end_date,
//         CASE 
//           WHEN bd.batch_end_date::DATE >= CURRENT_DATE THEN 'current'
//           ELSE 'completed'
//         END AS batch_status,
//         COUNT(DISTINCT CASE WHEN ud.user_role = '102' THEN ud.user_email END) AS instructor_count,
//         ARRAY_AGG(DISTINCT ud.user_name) FILTER (WHERE ud.user_role = '102' AND ud.user_name IS NOT NULL) AS instructors
//       FROM batch_data bd
//       JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
//       JOIN user_data ud ON ud.user_email = bpd.user_id
//       WHERE bd.batch_id IN (
//         SELECT UNNEST(bpd.batch_id)
//         FROM user_data ud
//         JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//         WHERE ud.people_id = $1
//       )
//       GROUP BY bd.batch_id, bd.batch_name, bd.batch_end_date
//       ORDER BY bd.batch_end_date::DATE DESC;
//     `;

//     const testDataQuery = `
//       SELECT 
//         rd.resource_id, rd.resource_name, rd.resource_type,
//         ctd.plane_identification, ctd.image_optimization, ctd.measurement, ctd.diagnostic_interpretation, ctd.created_at,
//         lm.learning_module_id, lm.module_name, lm.unit_name, lm.course_name,
//         cd.certificate_name
//       FROM user_data ud
//       JOIN course_test_data ctd ON ud.user_email = ctd.user_id
//       JOIN resource_data rd ON rd.resource_id = ctd.r_id
//       JOIN learning_module lm ON lm.learning_module_id = rd.learning_module_id
//       JOIN certification_data cd ON cd.certificate_id = lm.certificate_id
//       WHERE ud.people_id = $1
//       ORDER BY ctd.created_at DESC;
//     `;

//     const testReattempts = `
//       SELECT 
//         r.resource_id, r.resource_name, r.resource_type,
//         COUNT(t.r_id) AS attempt_count
//       FROM user_data ud
//       JOIN test_attempts_logs t ON t.user_id = ud.user_email
//       JOIN resource_data r ON r.resource_id = t.r_id
//       WHERE ud.people_id = $1
//       GROUP BY r.resource_id, r.resource_name, r.resource_type
//       HAVING COUNT(t.r_id) > 1
//       ORDER BY attempt_count DESC;
//     `;

//     Promise.all([
//       new Promise((res, rej) =>
//         client.query(userProgressQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(instructorQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(testDataQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(testReattempts, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//     ])
//       .then(([progressData, instructorData, testData, reAttemptsData]) => {
//         // Separate current and completed batches for LMS
//         const currentBatches = instructorData.filter(b => b.batch_status === 'current');
//         const completedBatches = instructorData.filter(b => b.batch_status === 'completed');

//         resolve({
//           status: 'Success',
//           code: 200,
//           data: progressData,
//           currentBatches: currentBatches,
//           completedBatches: completedBatches,
//           testQuery: testData,
//           reAttempts: reAttemptsData,
//           loginContext: 'lms',
//         });
//       })
//       .catch((err) => {
//         reject({
//           status: 'Error',
//           code: 500,
//           message: 'Database query failed',
//           error: err,
//         });
//       });
//   });
// };

// const indDatauuid = (requester, people_id, isVr = true) => {
//   return new Promise((resolve, reject) => {
//     const isPrivileged = [101, 102, 103].includes(Number(requester.role));

//     if (!isPrivileged) {
//       return resolve({
//         status: 'Unauthorized',
//         code: 401,
//         message: 'You do not have permission to view profiles',
//       });
//     }

//     // VR login: only batch and certificate data
//     if (isVr) {
//       const vrBatchQuery = `
//         SELECT 
//           bd.batch_id,
//           bd.batch_name,
//           bd.batch_end_date,
//           COUNT(DISTINCT CASE WHEN ud.user_role = '102' THEN ud.user_email END) AS instructor_count,
//           ARRAY_AGG(DISTINCT ud.user_name) FILTER (WHERE ud.user_role = '102' AND ud.user_name IS NOT NULL) AS instructors
//         FROM batch_data bd
//         JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
//         JOIN user_data ud ON ud.user_email = bpd.user_id
//         WHERE bd.batch_end_date::DATE >= CURRENT_DATE
//           AND bd.batch_id IN (
//             SELECT UNNEST(bpd.batch_id)
//             FROM user_data ud
//             JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//             WHERE ud.people_id = $1
//           )
//         GROUP BY bd.batch_id, bd.batch_name, bd.batch_end_date
//         ORDER BY bd.batch_end_date::DATE DESC;
//       `;

//       const vrCertificateQuery = `
//         SELECT DISTINCT
//           cd.certificate_id,
//           cd.certificate_name
//         FROM user_data ud
//         JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//         JOIN batch_data bd ON bd.batch_id = ANY(bpd.batch_id)
//         JOIN certification_data cd ON bd.certification_data ? cd.certificate_id::text
//         JOIN learning_module lm ON lm.certificate_id = cd.certificate_id
//         WHERE ud.people_id = $1
//           AND bd.batch_end_date::DATE >= CURRENT_DATE;
//       `;

//       Promise.all([
//         new Promise((res, rej) =>
//           client.query(vrBatchQuery, [people_id], (err, result) =>
//             err ? rej(err) : res(result.rows)
//           )
//         ),
//         new Promise((res, rej) =>
//           client.query(vrCertificateQuery, [people_id], (err, result) =>
//             err ? rej(err) : res(result.rows)
//           )
//         ),
//       ])
//         .then(([batchData, certificateData]) => {
//           resolve({
//             status: 'Success',
//             code: 200,
//             currentBatches: batchData,
//             certificates: certificateData,
//             loginContext: 'vr',
//           });
//         })
//         .catch((err) => {
//           reject({
//             status: 'Error',
//             code: 500,
//             message: 'Database query failed',
//             error: err,
//           });
//         });

//       return;
//     }

//     // LMS login: full data
//     const userProgressQuery = `
//       WITH user_info AS (
//         SELECT user_email, user_name, user_role, user_profile_photo
//         FROM user_data
//         WHERE people_id = $1
//       ),
//       pdt AS (
//         SELECT resourse_id AS rid, user_id, is_completed, updated_at
//         FROM progress_data
//         WHERE user_id IN (SELECT user_email FROM user_info)
//       )
//       SELECT 
//         ui.user_name, ui.user_profile_photo, ui.user_role,
//         lm.certificate_id, lm.course_name, lm.module_name, lm.unit_name, lm.learning_module_id,
//         rd.resource_id, rd.resource_name, rd.resource_type,
//         pdt.is_completed, pdt.updated_at
//       FROM user_info ui
//       CROSS JOIN learning_module lm
//       LEFT JOIN resource_data rd ON lm.learning_module_id = rd.learning_module_id
//       LEFT JOIN pdt ON pdt.rid = rd.resource_id;
//     `;

//     const instructorQuery = `
//       SELECT 
//         bd.batch_id,
//         bd.batch_name,
//         bd.batch_end_date,
//         CASE 
//           WHEN bd.batch_end_date::DATE >= CURRENT_DATE THEN 'current'
//           ELSE 'completed'
//         END AS batch_status,
//         COUNT(DISTINCT CASE WHEN ud.user_role = '102' THEN ud.user_email END) AS instructor_count,
//         ARRAY_AGG(DISTINCT ud.user_name) FILTER (WHERE ud.user_role = '102' AND ud.user_name IS NOT NULL) AS instructors
//       FROM batch_data bd
//       JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
//       JOIN user_data ud ON ud.user_email = bpd.user_id
//       WHERE bd.batch_id IN (
//         SELECT UNNEST(bpd.batch_id)
//         FROM user_data ud
//         JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//         WHERE ud.people_id = $1
//       )
//       GROUP BY bd.batch_id, bd.batch_name, bd.batch_end_date
//       ORDER BY bd.batch_end_date::DATE DESC;
//     `;

//     const testDataQuery = `
//       SELECT 
//         rd.resource_id, rd.resource_name, rd.resource_type,
//         ctd.plane_identification, ctd.image_optimization, ctd.measurement, ctd.diagnostic_interpretation, ctd.created_at,
//         lm.learning_module_id, lm.module_name, lm.unit_name, lm.course_name,
//         cd.certificate_name
//       FROM user_data ud
//       JOIN course_test_data ctd ON ud.user_email = ctd.user_id
//       JOIN resource_data rd ON rd.resource_id = ctd.r_id
//       JOIN learning_module lm ON lm.learning_module_id = rd.learning_module_id
//       JOIN certification_data cd ON cd.certificate_id = lm.certificate_id
//       WHERE ud.people_id = $1
//       ORDER BY ctd.created_at DESC;
//     `;

//     const testReattempts = `
//       SELECT 
//         r.resource_id, r.resource_name, r.resource_type,
//         COUNT(t.r_id) AS attempt_count
//       FROM user_data ud
//       JOIN test_attempts_logs t ON t.user_id = ud.user_email
//       JOIN resource_data r ON r.resource_id = t.r_id
//       WHERE ud.people_id = $1
//       GROUP BY r.resource_id, r.resource_name, r.resource_type
//       HAVING COUNT(t.r_id) > 1
//       ORDER BY attempt_count DESC;
//     `;

//     Promise.all([
//       new Promise((res, rej) =>
//         client.query(userProgressQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(instructorQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(testDataQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(testReattempts, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//     ])
//       .then(([progressData, instructorData, testData, reAttemptsData]) => {
//         const currentBatches = instructorData.filter(b => b.batch_status === 'current');
//         const completedBatches = instructorData.filter(b => b.batch_status === 'completed');

//         resolve({
//           status: 'Success',
//           code: 200,
//           data: progressData,
//           currentBatches: currentBatches,
//           completedBatches: completedBatches,
//           testQuery: testData,
//           reAttempts: reAttemptsData,
//           loginContext: 'lms',
//         });
//       })
//       .catch((err) => {
//         reject({
//           status: 'Error',
//           code: 500,
//           message: 'Database query failed',
//           error: err,
//         });
//       });
//   });
// };

// const buildCertificateTree = (rows) => {
//   const certMap = {};

//   for (const row of rows) {
//     const {
//       certificate_id, certificate_name,
//       course_name, module_name, unit_name,
//       resource_type, resource_topic, resource_name, resource_id, is_completed
//     } = row;

//     if (!certMap[certificate_id]) {
//       certMap[certificate_id] = { certificate_id, certificate_name, courses: {} };
//     }
//     const cert = certMap[certificate_id];

//     if (!cert.courses[course_name]) {
//       cert.courses[course_name] = { course_name, modules: {} };
//     }
//     const course = cert.courses[course_name];

//     if (!course.modules[module_name]) {
//       course.modules[module_name] = { module_name, units: {} };
//     }
//     const mod = course.modules[module_name];

//     if (!mod.units[unit_name]) {
//       mod.units[unit_name] = {
//         unit_name,
//         learning_resources: { total: 0, completed: 0, items: {} },
//         image_interpretations: { total: 0, completed: 0, items: {} },
//         practices: [],
//         tests: [],
//       };
//     }
//     const unit = mod.units[unit_name];

//     const leaf = { resource_id, resource_name, is_completed: is_completed ?? false };

//     if (resource_type === 'Learning Resource') {
//       unit.learning_resources.total += 1;
//       if (is_completed) unit.learning_resources.completed += 1;
//       if (!unit.learning_resources.items[resource_topic]) {
//         unit.learning_resources.items[resource_topic] = { resource_topic, resources: [] };
//       }
//       unit.learning_resources.items[resource_topic].resources.push(leaf);

//     } else if (resource_type === 'Image Interpretation') {
//       unit.image_interpretations.total += 1;
//       if (is_completed) unit.image_interpretations.completed += 1;
//       if (!unit.image_interpretations.items[resource_topic]) {
//         unit.image_interpretations.items[resource_topic] = { resource_topic, resources: [] };
//       }
//       unit.image_interpretations.items[resource_topic].resources.push(leaf);

//     } else if (resource_type === 'Practice') {
//       unit.practices.push(leaf);

//     } else if (resource_type === 'Test') {
//       unit.tests.push(leaf);
//     }
//   }

//   // Convert all maps to arrays
//   return Object.values(certMap).map(cert => ({
//     ...cert,
//     courses: Object.values(cert.courses).map(course => ({
//       ...course,
//       modules: Object.values(course.modules).map(mod => ({
//         ...mod,
//         units: Object.values(mod.units).map(unit => ({
//           ...unit,
//           learning_resources: {
//             ...unit.learning_resources,
//             items: Object.values(unit.learning_resources.items),
//           },
//           image_interpretations: {
//             ...unit.image_interpretations,
//             items: Object.values(unit.image_interpretations.items),
//           },
//         })),
//       })),
//     })),
//   }));
// };
//the above buildCertificateTree function would work

// const UNIT_ORDER = {
//   'BPD & HC': 1,
//   'AC': 2,
//   'FL': 3,
// };

// const TOPIC_ORDER = [
//   'Fetal Head',
//   'Fetal abdomen',
//   'Fetal Femur',
//   'Anatomical Landmarks',
//   'Anatomical landmarks',
//   'Imaging the Transthalamic Plane',
//   'Imaging the transabdominal plane',
//   'Imaging the transfemoral plane',
//   'Measurement',
//   'Plane Acquisition Challenges and Common Measurement Errors',
//   'Pitfalls in Plane Acquisition and Measurement',
//   'Image Diagnosis',
//   'Image diagnosis',
//   'OB Boosters',
// ];
//version 2 of the buildCertificateTree with sorting of units based on UNIT_ORDER and handling missing unit names by placing them at the end
// const buildCertificateTree = (rows) => {
//   const certMap = {};

//   for (const row of rows) {
//     const {
//       certificate_id, certificate_name,
//       course_name, module_name, unit_name,
//       resource_type, resource_topic, resource_name, resource_id, is_completed
//     } = row;

//     if (!certMap[certificate_id]) {
//       certMap[certificate_id] = { certificate_id, certificate_name, courses: {} };
//     }
//     const cert = certMap[certificate_id];

//     if (!cert.courses[course_name]) {
//       cert.courses[course_name] = { course_name, modules: {} };
//     }
//     const course = cert.courses[course_name];

//     if (!course.modules[module_name]) {
//       course.modules[module_name] = { module_name, units: {} };
//     }
//     const mod = course.modules[module_name];

//     if (!mod.units[unit_name]) {
//       mod.units[unit_name] = {
//         unit_name,
//         learning_resources: { total: 0, completed: 0, items: {} },
//         image_interpretations: { total: 0, completed: 0, items: {} },
//         practices: [],
//         tests: [],
//       };
//     }
//     const unit = mod.units[unit_name];

//     const leaf = { resource_id, resource_name, is_completed: is_completed ?? false };

//     if (resource_type === 'Learning Resource') {
//       unit.learning_resources.total += 1;
//       if (is_completed) unit.learning_resources.completed += 1;
//       if (!unit.learning_resources.items[resource_topic]) {
//         unit.learning_resources.items[resource_topic] = { resource_topic, resources: [] };
//       }
//       unit.learning_resources.items[resource_topic].resources.push(leaf);

//     } else if (resource_type === 'Image Interpretation') {
//       unit.image_interpretations.total += 1;
//       if (is_completed) unit.image_interpretations.completed += 1;
//       if (!unit.image_interpretations.items[resource_topic]) {
//         unit.image_interpretations.items[resource_topic] = { resource_topic, resources: [] };
//       }
//       unit.image_interpretations.items[resource_topic].resources.push(leaf);

//     } else if (resource_type === 'Practice') {
//       unit.practices.push(leaf);

//     } else if (resource_type === 'Test') {
//       unit.tests.push(leaf);
//     }
//   }

//   // Convert all maps to arrays
//   return Object.values(certMap).map(cert => ({
//     ...cert,
//     courses: Object.values(cert.courses).map(course => ({
//       ...course,
//       modules: Object.values(course.modules).map(mod => ({
//         ...mod,
//         // ↓ ONLY this units block changes — sort applied here
//         units: Object.values(mod.units)
//           .sort((a, b) => (UNIT_ORDER[a.unit_name] ?? 99) - (UNIT_ORDER[b.unit_name] ?? 99))
//           .map(unit => ({
//             ...unit,
//             learning_resources: {
//               ...unit.learning_resources,
//               items: Object.values(unit.learning_resources.items),
//             },
//             image_interpretations: {
//               ...unit.image_interpretations,
//               items: Object.values(unit.image_interpretations.items),
//             },
//           })),
//       })),
//     })),
//   }));
// };



//version 3 
// const UNIT_ORDER = {
//   'BPD & HC': 1,
//   'AC': 2,
//   'FL': 3,
// };

// const TOPIC_ORDER = [
//   'Fetal Head',
//   'Fetal abdomen',
//   'Fetal Femur',
//   'Anatomical Landmarks',
//   'Anatomical landmarks',
//   'Imaging the Plane',                                          // ← updated
//   'Imaging the Transthalamic Plane',                           // ← keep for old data
//   'Imaging the transabdominal plane',
//   'Imaging the transfemoral plane',
//   'Measurement',
//   'Measurements',                                              // ← new
//   'Plane Acquisition Challenges and Common Measurement Errors',
//   'Pitfalls in Plane Acquisition and Measurement',
//   'Image Diagnosis',
//   'Image diagnosis',
//   'OB Boosters',
// ];

// const RESOURCE_ORDER = {
//   // Fetal Head (shared)
//   'Transthalamic Plane': 1,
//   'Bi-Parietal Diameter': 2,
//   'Head Circumference': 3,
//   'Significance': 4,

//   // Anatomical Landmarks (new BPD & HC)
//   'Anatomical Landmarks and Significance': 1,
//   // old BPD & HC
//   'Anatomical Landmarks of the Transthalamic Plane': 1,
//   'Geometric shapes of key landmarks and their significance': 2,
//   'Mind Sparks - Anatomical Landmarks': 3,

//   // Imaging the Plane (new BPD & HC)
//   ' How To Image The Plane': 1,                               // ← leading space preserved
//   'Mind Sparks - Probe Movements': 2,
//   'How To Acquire The Transthalamic Plane': 3,
//   'Mind Sparks - Picture Pick': 4,

//   // Imaging the Transthalamic Plane (old BPD & HC)
//   'Finding the fetal presentation': 1,
//   'Mind Sparks - Probe movements': 2,
//   'How to acquire the transthalamic plane': 3,

//   // Measurements (new BPD & HC) / Measurement (AC, FL)
//   'How To Measure BPD': 1,
//   'How To Measure HC': 2,
//   'How to measure BPD': 1,
//   'How to measure HC': 2,
//   'How to measure AC': 1,
//   'Mind Sparks - Picture Pick': 2,                            // AC Measurement
//   'How to measure FL': 1,
//   'MindSparks - Picture Pick': 2,

//   // Image Diagnosis (shared)
//   'Image Diagnosis': 1,
//   'Percentile Chart & Significance': 2,                       // ← new name
//   'Percentile Charts  & Significance': 2,                     // ← old name
//   'BPD Chart': 3,
//   'HC Chart': 4,
//   'Mind Sparks - Chart Interpretation': 5,
//   'AC chart': 3,
//   'Image diagnosis': 1,
//   'Percentile charts & significance': 2,
//   'FL chart': 3,

//   // OB Boosters
//   'Picture Pick': 1,
//   'True / False': 2,                                          // ← new name with spaces
//   'True/False': 2,                                            // ← old name
//   'Wordsearch': 3,                                            // ← new name
//   'Word Search': 3,                                           // ← old name
//   'Crossword puzzle': 1,

//   // Plane Acquisition (AC, FL)
//   'Plane Acquisition Challenges': 1,
//   'Common Measurement Errors': 2,
// };
 //the below is working good incase of any issue in the above order uncomment the below code and comment the above one
// const TOPIC_ORDER = [
//   'Fetal Head',
//   'Fetal abdomen',
//   'Fetal Femur',
//   'Anatomical Landmarks',
//   'Anatomical landmarks',
//   'Imaging the Transthalamic Plane',
//   'Imaging the transabdominal plane',
//   'Imaging the transfemoral plane',
//   'Measurement',
//   'Plane Acquisition Challenges and Common Measurement Errors',
//   'Pitfalls in Plane Acquisition and Measurement',
//   'Image Diagnosis',
//   'Image diagnosis',
//   'OB Boosters',
// ];

// const RESOURCE_ORDER = {
//   // BPD & HC - Fetal Head
//   'Transthalamic Plane': 1,
//   'Bi-Parietal Diameter': 2,
//   'Head Circumference': 3,

//   // BPD & HC - Anatomical Landmarks
//   'Anatomical Landmarks of the Transthalamic Plane': 1,

//   // BPD & HC - Imaging the Transthalamic Plane
//   'Finding the fetal presentation': 1,
//   'Mind Sparks - Probe movements': 2,
//   'How to acquire the transthalamic plane': 3,
//   'Mind Sparks - Picture Pick': 4,

//   // BPD & HC - Measurement
//   'How to measure BPD': 1,
//   'How to measure HC': 2,
//   'Plane Acquisition Challenges and Common Measurement Errors': 3,

//   // BPD & HC - Image Diagnosis
//   'Image Diagnosis': 1,
//   'Percentile Charts  & Significance': 2,
//   'BPD Chart': 3,
//   'HC Chart': 4,
//   'Mind Sparks - Chart Interpretation': 5,

//   // OB Boosters (shared across units)
//   'Picture Pick': 1,
//   'True/False': 2,
//   'Word Search': 3,
//   'Crossword puzzle': 1,

//   // AC - Fetal abdomen
//   'Transabdominal plane': 1,
//   'Abdominal circumference': 2,

//   // AC - Imaging the transabdominal plane
//   'How to acquire the transabdominal plane': 1,
//   'Mind Sparks - Probe movements': 2,
//   'Mind Sparks - Picture pick': 3,

//   // AC - Measurement
//   'How to measure AC': 1,
//   'Mind Sparks - Picture Pick': 2,

//   // AC - Image Diagnosis
//   'AC chart': 3,

//   // FL - Fetal Femur
//   'Femur': 1,
//   'Femur diaphysis': 2,

//   // FL - Imaging the transfemoral plane
//   'How to acquire the femur diaphysis plane': 1,

//   // FL - Measurement
//   'How to measure FL': 1,
//   'MindSparks - Picture Pick': 2,

//   // FL - Image diagnosis
//   'Image diagnosis': 1,
//   'Percentile charts & significance': 2,
//   'FL chart': 3,

//   // Shared
//   'Significance': 4,
//   'Geometric shapes of key landmarks and their significance': 2,
//   'Mind Sparks - Anatomical Landmarks': 3,
//   'Plane Acquisition Challenges': 1,
//   'Common Measurement Errors': 2,
// };

// const IMAGE_INTERPRETATION_ORDER = {
//   'Find the Image': 1,
//   'Annotation 1': 2,
//   'Annotation 2': 3,
//   'Measurement': 4,
// };

// const getTopicOrder = (topic) => {
//   const idx = TOPIC_ORDER.indexOf(topic);
//   return idx === -1 ? 99 : idx;
// };

// const getResourceOrder = (name) => {
//   return RESOURCE_ORDER[name] ?? 99;
// };

// const buildCertificateTree = (rows) => {
//   const certMap = {};

//   for (const row of rows) {
//     const {
//       certificate_id, certificate_name,
//       course_name, module_name, unit_name,
//       resource_type, resource_topic, resource_name, resource_id, is_completed
//     } = row;

//     if (!resource_id) continue;

//     if (!certMap[certificate_id]) {
//       certMap[certificate_id] = { certificate_id, certificate_name, courses: {} };
//     }
//     const cert = certMap[certificate_id];

//     if (!cert.courses[course_name]) {
//       cert.courses[course_name] = { course_name, modules: {} };
//     }
//     const course = cert.courses[course_name];

//     if (!course.modules[module_name]) {
//       course.modules[module_name] = { module_name, units: {} };
//     }
//     const mod = course.modules[module_name];

//     if (!mod.units[unit_name]) {
//       mod.units[unit_name] = {
//         unit_name,
//         learning_resources: { total: 0, completed: 0, items: {} },
//         image_interpretations: { total: 0, completed: 0, items: {} },
//         practices: [],
//         tests: [],
//       };
//     }
//     const unit = mod.units[unit_name];

//     const leaf = { resource_id, resource_name, is_completed: is_completed ?? false };

//     if (resource_type === 'Learning Resource') {
//       unit.learning_resources.total += 1;
//       if (is_completed) unit.learning_resources.completed += 1;
//       if (!unit.learning_resources.items[resource_topic]) {
//         unit.learning_resources.items[resource_topic] = { resource_topic, resources: [] };
//       }
//       unit.learning_resources.items[resource_topic].resources.push(leaf);

//     } else if (resource_type === 'Image Interpretation') {
//       unit.image_interpretations.total += 1;
//       if (is_completed) unit.image_interpretations.completed += 1;
//       if (!unit.image_interpretations.items[resource_topic]) {
//         unit.image_interpretations.items[resource_topic] = { resource_topic, resources: [] };
//       }
//       unit.image_interpretations.items[resource_topic].resources.push(leaf);

//     } else if (resource_type === 'Practice') {
//       unit.practices.push(leaf);

//     } else if (resource_type === 'Test') {
//       unit.tests.push(leaf);
//     }
//   }

//   return Object.values(certMap).map(cert => ({
//     ...cert,
//     courses: Object.values(cert.courses).map(course => ({
//       ...course,
//       modules: Object.values(course.modules).map(mod => ({
//         ...mod,
//         units: Object.values(mod.units)
//           .sort((a, b) => (UNIT_ORDER[a.unit_name] ?? 99) - (UNIT_ORDER[b.unit_name] ?? 99))
//           .map(unit => ({
//             ...unit,
//             learning_resources: {
//               ...unit.learning_resources,
//               items: Object.values(unit.learning_resources.items)
//                 .sort((a, b) => getTopicOrder(a.resource_topic) - getTopicOrder(b.resource_topic))
//                 .map(topicGroup => ({
//                   ...topicGroup,
//                   resources: [...topicGroup.resources]
//                     .sort((a, b) => getResourceOrder(a.resource_name) - getResourceOrder(b.resource_name)),
//                 })),
//             },
//             practices: [...unit.practices].sort((a, b) => a.resource_name.localeCompare(b.resource_name)),
//             image_interpretations: {
//               ...unit.image_interpretations,
//               items: Object.values(unit.image_interpretations.items).map(topicGroup => ({
//                 ...topicGroup,
//                 resources: [...topicGroup.resources].sort(
//                   (a, b) => (IMAGE_INTERPRETATION_ORDER[a.resource_name] ?? 99) - (IMAGE_INTERPRETATION_ORDER[b.resource_name] ?? 99)
//                 ),
//               })),
//             },
//             tests: [...unit.tests].sort((a, b) => a.resource_name.localeCompare(b.resource_name)),
//           })),
//       })),
//     })),
//   }));
// };

// const indDatauuid = (requester, people_id, isVr = true) => {
//   return new Promise((resolve, reject) => {
//     const isPrivileged = [101, 102, 103].includes(Number(requester.role));

//     if (!isPrivileged) {
//       return resolve({
//         status: 'Unauthorized',
//         code: 401,
//         message: 'You do not have permission to view profiles',
//       });
//     }

//     // ─── VR LOGIN ────────────────────────────────────────────────────────────
//     if (isVr) {
//       const vrBatchQuery = `
//         SELECT 
//           bd.batch_id,
//           bd.batch_name,
//           bd.batch_end_date,
//           COUNT(DISTINCT CASE WHEN ud.user_role = '102' THEN ud.user_email END) AS instructor_count,
//           ARRAY_AGG(DISTINCT ud.user_name) FILTER (WHERE ud.user_role = '102' AND ud.user_name IS NOT NULL) AS instructors
//         FROM batch_data bd
//         JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
//         JOIN user_data ud ON ud.user_email = bpd.user_id
//         WHERE bd.batch_end_date::DATE >= CURRENT_DATE
//           AND bd.batch_id IN (
//             SELECT UNNEST(bpd.batch_id)
//             FROM user_data ud
//             JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//             WHERE ud.people_id = $1
//           )
//         GROUP BY bd.batch_id, bd.batch_name, bd.batch_end_date
//         ORDER BY bd.batch_end_date::DATE DESC;
//       `;

//       const vrCertificateTreeQuery = `
//         WITH user_info AS (
//           SELECT ud.user_email
//           FROM user_data ud
//           WHERE ud.people_id = $1
//         ),
//         active_batches AS (
//           SELECT UNNEST(bpd.batch_id) AS batch_id
//           FROM user_data ud
//           JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//           WHERE ud.people_id = $1
//         ),
//         active_certificates AS (
//           SELECT DISTINCT cd.certificate_id, cd.certificate_name
//           FROM active_batches ab
//           JOIN batch_data bd ON bd.batch_id = ab.batch_id
//           JOIN certification_data cd ON bd.certification_data ? cd.certificate_id::text
//           WHERE bd.batch_end_date::DATE >= CURRENT_DATE
//         ),
//         user_progress AS (
//           SELECT pd.resourse_id, pd.is_completed
//           FROM progress_data pd
//           WHERE pd.user_id IN (SELECT user_email FROM user_info)
//         )
//         SELECT
//           ac.certificate_id,
//           ac.certificate_name,
//           lm.course_name,
//           lm.module_name,
//           lm.unit_name,
//           rd.resource_id,
//           rd.resource_name,
//           rd.resource_type,
//           rd.resource_topic,
//           rd.resource_name,
//           up.is_completed
//         FROM active_certificates ac
//         JOIN learning_module lm ON lm.certificate_id = ac.certificate_id
//         JOIN resource_data rd ON rd.learning_module_id = lm.learning_module_id
//         LEFT JOIN user_progress up ON up.resourse_id = rd.resource_id
//         ORDER BY
//           ac.certificate_name,
//           lm.course_name,
//           lm.module_name,
//           lm.unit_name,
//           rd.resource_type,
//           rd.resource_topic,
//           rd.resource_name;
//       `;

//       Promise.all([
//         new Promise((res, rej) =>
//           client.query(vrBatchQuery, [people_id], (err, result) =>
//             err ? rej(err) : res(result.rows)
//           )
//         ),
//         new Promise((res, rej) =>
//           client.query(vrCertificateTreeQuery, [people_id], (err, result) =>
//             err ? rej(err) : res(result.rows)
//           )
//         ),
//       ])
//         .then(([batchData, rawCertData]) => {
//           const certificates = buildCertificateTree(rawCertData);
//           resolve({
//             status: 'Success',
//             code: 200,
//             currentBatches: batchData,
//             certificates: certificates,
//             loginContext: 'vr',
//           });
//         })
//         .catch((err) => {
//           reject({
//             status: 'Error',
//             code: 500,
//             message: 'Database query failed',
//             error: err,
//           });
//         });

//       return;
//     }

//     // ─── LMS LOGIN ───────────────────────────────────────────────────────────
//     const userProgressQuery = `
//       WITH user_info AS (
//         SELECT user_email, user_name, user_role, user_profile_photo
//         FROM user_data
//         WHERE people_id = $1
//       ),
//       pdt AS (
//         SELECT resourse_id AS rid, user_id, is_completed, updated_at
//         FROM progress_data
//         WHERE user_id IN (SELECT user_email FROM user_info)
//       )
//       SELECT 
//         ui.user_name, ui.user_profile_photo, ui.user_role,
//         lm.certificate_id, lm.course_name, lm.module_name, lm.unit_name, lm.learning_module_id,
//         rd.resource_id, rd.resource_name, rd.resource_type, rd.resource_topic,
//         pdt.is_completed, pdt.updated_at
//       FROM user_info ui
//       CROSS JOIN learning_module lm
//       LEFT JOIN resource_data rd ON lm.learning_module_id = rd.learning_module_id
//       LEFT JOIN pdt ON pdt.rid = rd.resource_id;
//     `;

//     const instructorQuery = `
//       SELECT 
//         bd.batch_id,
//         bd.batch_name,
//         bd.batch_end_date,
//         CASE 
//           WHEN bd.batch_end_date::DATE >= CURRENT_DATE THEN 'current'
//           ELSE 'completed'
//         END AS batch_status,
//         COUNT(DISTINCT CASE WHEN ud.user_role = '102' THEN ud.user_email END) AS instructor_count,
//         ARRAY_AGG(DISTINCT ud.user_name) FILTER (WHERE ud.user_role = '102' AND ud.user_name IS NOT NULL) AS instructors
//       FROM batch_data bd
//       JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
//       JOIN user_data ud ON ud.user_email = bpd.user_id
//       WHERE bd.batch_id IN (
//         SELECT UNNEST(bpd.batch_id)
//         FROM user_data ud
//         JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//         WHERE ud.people_id = $1
//       )
//       GROUP BY bd.batch_id, bd.batch_name, bd.batch_end_date
//       ORDER BY bd.batch_end_date::DATE DESC;
//     `;

//     const testDataQuery = `
//       SELECT 
//         rd.resource_id, rd.resource_name, rd.resource_type,
//         ctd.plane_identification, ctd.image_optimization, ctd.measurement, ctd.diagnostic_interpretation, ctd.created_at,
//         lm.learning_module_id, lm.module_name, lm.unit_name, lm.course_name,
//         cd.certificate_name
//       FROM user_data ud
//       JOIN course_test_data ctd ON ud.user_email = ctd.user_id
//       JOIN resource_data rd ON rd.resource_id = ctd.r_id
//       JOIN learning_module lm ON lm.learning_module_id = rd.learning_module_id
//       JOIN certification_data cd ON cd.certificate_id = lm.certificate_id
//       WHERE ud.people_id = $1
//       ORDER BY ctd.created_at DESC;
//     `;

//     const testReattempts = `
//       SELECT 
//         r.resource_id, r.resource_name, r.resource_type,
//         COUNT(t.r_id) AS attempt_count
//       FROM user_data ud
//       JOIN test_attempts_logs t ON t.user_id = ud.user_email
//       JOIN resource_data r ON r.resource_id = t.r_id
//       WHERE ud.people_id = $1
//       GROUP BY r.resource_id, r.resource_name, r.resource_type
//       HAVING COUNT(t.r_id) > 1
//       ORDER BY attempt_count DESC;
//     `;

//     const moduleCompletionQuery = `
//       WITH user_info AS (
//         SELECT user_email
//         FROM user_data
//         WHERE people_id = $1
//       ),
//       pdt AS (
//         SELECT resourse_id AS rid, user_id, is_completed
//         FROM progress_data
//         WHERE user_id IN (SELECT user_email FROM user_info)
//       )
//       SELECT
//         lm.learning_module_id,
//         lm.course_name,
//         lm.module_name,
//         lm.unit_name,
//         COUNT(rd.resource_id) FILTER (
//           WHERE rd.resource_type = 'Learning Resource'
//         ) AS total_learning_resources,
//         COUNT(pdt.is_completed) FILTER (
//           WHERE rd.resource_type = 'Learning Resource'
//           AND pdt.is_completed = true
//         ) AS completed_learning_resources,
//         COUNT(rd.resource_id) FILTER (
//           WHERE rd.resource_type = 'Image Interpretation'
//         ) AS total_image_interpretations,
//         COUNT(pdt.is_completed) FILTER (
//           WHERE rd.resource_type = 'Image Interpretation'
//           AND pdt.is_completed = true
//         ) AS completed_image_interpretations
//       FROM learning_module lm
//       LEFT JOIN resource_data rd ON lm.learning_module_id = rd.learning_module_id
//       LEFT JOIN pdt ON pdt.rid = rd.resource_id
//       GROUP BY lm.learning_module_id, lm.course_name, lm.module_name, lm.unit_name;
//     `;

//     Promise.all([
//       new Promise((res, rej) =>
//         client.query(userProgressQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(instructorQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(testDataQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(testReattempts, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(moduleCompletionQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//     ])
//       .then(([progressData, instructorData, testData, reAttemptsData, moduleCompletion]) => {
//         const currentBatches = instructorData.filter(b => b.batch_status === 'current');
//         const completedBatches = instructorData.filter(b => b.batch_status === 'completed');

//         resolve({
//           status: 'Success',
//           code: 200,
//           data: progressData,
//           currentBatches: currentBatches,
//           completedBatches: completedBatches,
//           testQuery: testData,
//           reAttempts: reAttemptsData,
//           moduleCompletion: moduleCompletion,
//           loginContext: 'lms',
//         });
//       })
//       .catch((err) => {
//         reject({
//           status: 'Error',
//           code: 500,
//           message: 'Database query failed',
//           error: err,
//         });
//       });
//   });
// };
//below version is working good for vr and lms if the new code does not work we can use this as backup - it has only progress data and batch data for vr and lms but does not have test data and reattempts data for lms
// const indDatauuid = (requester, people_id, isVr = true) => {
//   return new Promise((resolve, reject) => {
//     const isPrivileged = [101, 102, 103].includes(Number(requester.role));

//     if (!isPrivileged) {
//       return resolve({
//         status: 'Unauthorized',
//         code: 401,
//         message: 'You do not have permission to view profiles',
//       });
//     }

//     // Shared query for both VR and LMS
//     const moduleCompletionQuery = `
//   WITH user_info AS (
//     SELECT user_email
//     FROM user_data
//     WHERE people_id = $1
//   ),
//   pdt AS (
//     SELECT resourse_id AS rid, user_id, is_completed
//     FROM progress_data
//     WHERE user_id IN (SELECT user_email FROM user_info)
//   )
//   SELECT
//     lm.learning_module_id,
//     lm.course_name,
//     lm.module_name,
//     lm.unit_name,

//     COUNT(rd.resource_id) FILTER (
//       WHERE rd.resource_type = 'Learning Resource'
//     ) AS total_learning_resources,
//     COUNT(pdt.is_completed) FILTER (
//       WHERE rd.resource_type = 'Learning Resource'
//       AND pdt.is_completed = true
//     ) AS completed_learning_resources,

//     COUNT(rd.resource_id) FILTER (
//       WHERE rd.resource_type = 'Image Interpretation'
//     ) AS total_image_interpretations,
//     COUNT(pdt.is_completed) FILTER (
//       WHERE rd.resource_type = 'Image Interpretation'
//       AND pdt.is_completed = true
//     ) AS completed_image_interpretations

//   FROM learning_module lm
//   LEFT JOIN resource_data rd ON lm.learning_module_id = rd.learning_module_id
//   LEFT JOIN pdt ON pdt.rid = rd.resource_id
//   GROUP BY lm.learning_module_id, lm.course_name, lm.module_name, lm.unit_name;
// `;

//     // VR login: only batch and certificate data
//     if (isVr) {
//       const vrBatchQuery = `
//         SELECT 
//           bd.batch_id,
//           bd.batch_name,
//           bd.batch_end_date,
//           COUNT(DISTINCT CASE WHEN ud.user_role = '102' THEN ud.user_email END) AS instructor_count,
//           ARRAY_AGG(DISTINCT ud.user_name) FILTER (WHERE ud.user_role = '102' AND ud.user_name IS NOT NULL) AS instructors
//         FROM batch_data bd
//         JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
//         JOIN user_data ud ON ud.user_email = bpd.user_id
//         WHERE bd.batch_end_date::DATE >= CURRENT_DATE
//           AND bd.batch_id IN (
//             SELECT UNNEST(bpd.batch_id)
//             FROM user_data ud
//             JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//             WHERE ud.people_id = $1
//           )
//         GROUP BY bd.batch_id, bd.batch_name, bd.batch_end_date
//         ORDER BY bd.batch_end_date::DATE DESC;
//       `;

//       const vrCertificateQuery = `
//         SELECT DISTINCT
//           cd.certificate_id,
//           cd.certificate_name
//         FROM user_data ud
//         JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//         JOIN batch_data bd ON bd.batch_id = ANY(bpd.batch_id)
//         JOIN certification_data cd ON bd.certification_data ? cd.certificate_id::text
//         JOIN learning_module lm ON lm.certificate_id = cd.certificate_id
//         WHERE ud.people_id = $1
//           AND bd.batch_end_date::DATE >= CURRENT_DATE;
//       `;

//       Promise.all([
//         new Promise((res, rej) =>
//           client.query(vrBatchQuery, [people_id], (err, result) =>
//             err ? rej(err) : res(result.rows)
//           )
//         ),
//         new Promise((res, rej) =>
//           client.query(vrCertificateQuery, [people_id], (err, result) =>
//             err ? rej(err) : res(result.rows)
//           )
//         ),
//         new Promise((res, rej) =>
//           client.query(moduleCompletionQuery, [people_id], (err, result) =>
//             err ? rej(err) : res(result.rows)
//           )
//         ),
//       ])
//         .then(([batchData, certificateData, moduleCompletion]) => {
//           resolve({
//             status: 'Success',
//             code: 200,
//             currentBatches: batchData,
//             certificates: certificateData,
//             moduleCompletion: moduleCompletion,
//             loginContext: 'vr',
//           });
//         })
//         .catch((err) => {
//           reject({
//             status: 'Error',
//             code: 500,
//             message: 'Database query failed',
//             error: err,
//           });
//         });

//       return;
//     }

//     // LMS login: full data
//     const userProgressQuery = `
//       WITH user_info AS (
//         SELECT user_email, user_name, user_role, user_profile_photo
//         FROM user_data
//         WHERE people_id = $1
//       ),
//       pdt AS (
//         SELECT resourse_id AS rid, user_id, is_completed, updated_at
//         FROM progress_data
//         WHERE user_id IN (SELECT user_email FROM user_info)
//       )
//       SELECT 
//         ui.user_name, ui.user_profile_photo, ui.user_role,
//         lm.certificate_id, lm.course_name, lm.module_name, lm.unit_name, lm.learning_module_id,
//         rd.resource_id, rd.resource_name, rd.resource_type,
//         pdt.is_completed, pdt.updated_at
//       FROM user_info ui
//       CROSS JOIN learning_module lm
//       LEFT JOIN resource_data rd ON lm.learning_module_id = rd.learning_module_id
//       LEFT JOIN pdt ON pdt.rid = rd.resource_id;
//     `;

//     const instructorQuery = `
//       SELECT 
//         bd.batch_id,
//         bd.batch_name,
//         bd.batch_end_date,
//         CASE 
//           WHEN bd.batch_end_date::DATE >= CURRENT_DATE THEN 'current'
//           ELSE 'completed'
//         END AS batch_status,
//         COUNT(DISTINCT CASE WHEN ud.user_role = '102' THEN ud.user_email END) AS instructor_count,
//         ARRAY_AGG(DISTINCT ud.user_name) FILTER (WHERE ud.user_role = '102' AND ud.user_name IS NOT NULL) AS instructors
//       FROM batch_data bd
//       JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
//       JOIN user_data ud ON ud.user_email = bpd.user_id
//       WHERE bd.batch_id IN (
//         SELECT UNNEST(bpd.batch_id)
//         FROM user_data ud
//         JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
//         WHERE ud.people_id = $1
//       )
//       GROUP BY bd.batch_id, bd.batch_name, bd.batch_end_date
//       ORDER BY bd.batch_end_date::DATE DESC;
//     `;

//     const testDataQuery = `
//       SELECT 
//         rd.resource_id, rd.resource_name, rd.resource_type,
//         ctd.plane_identification, ctd.image_optimization, ctd.measurement, ctd.diagnostic_interpretation, ctd.created_at,
//         lm.learning_module_id, lm.module_name, lm.unit_name, lm.course_name,
//         cd.certificate_name
//       FROM user_data ud
//       JOIN course_test_data ctd ON ud.user_email = ctd.user_id
//       JOIN resource_data rd ON rd.resource_id = ctd.r_id
//       JOIN learning_module lm ON lm.learning_module_id = rd.learning_module_id
//       JOIN certification_data cd ON cd.certificate_id = lm.certificate_id
//       WHERE ud.people_id = $1
//       ORDER BY ctd.created_at DESC;
//     `;

//     const testReattempts = `
//       SELECT 
//         r.resource_id, r.resource_name, r.resource_type,
//         COUNT(t.r_id) AS attempt_count
//       FROM user_data ud
//       JOIN test_attempts_logs t ON t.user_id = ud.user_email
//       JOIN resource_data r ON r.resource_id = t.r_id
//       WHERE ud.people_id = $1
//       GROUP BY r.resource_id, r.resource_name, r.resource_type
//       HAVING COUNT(t.r_id) > 1
//       ORDER BY attempt_count DESC;
//     `;

//     Promise.all([
//       new Promise((res, rej) =>
//         client.query(userProgressQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(instructorQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(testDataQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(testReattempts, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//       new Promise((res, rej) =>
//         client.query(moduleCompletionQuery, [people_id], (err, result) =>
//           err ? rej(err) : res(result.rows)
//         )
//       ),
//     ])
//       .then(([progressData, instructorData, testData, reAttemptsData, moduleCompletion]) => {
//         const currentBatches = instructorData.filter(b => b.batch_status === 'current');
//         const completedBatches = instructorData.filter(b => b.batch_status === 'completed');

//         resolve({
//           status: 'Success',
//           code: 200,
//           data: progressData,
//           currentBatches: currentBatches,
//           completedBatches: completedBatches,
//           testQuery: testData,
//           reAttempts: reAttemptsData,
//           moduleCompletion: moduleCompletion,
//           loginContext: 'lms',
//         });
//       })
//       .catch((err) => {
//         reject({
//           status: 'Error',
//           code: 500,
//           message: 'Database query failed',
//           error: err,
//         });
//       });
//   });
// };


//version 3

const UNIT_ORDER = {
  'BPD & HC': 1,
  'AC': 2,
  'FL': 3,
};

const TOPIC_ORDER = [
  'Fetal Head',
  'Fetal abdomen',
  'Fetal Femur',
  'Anatomical Landmarks',
  'Anatomical landmarks',
  'Imaging the Plane',
  'Imaging the Transthalamic Plane',
  'Imaging the transabdominal plane',
  'Imaging the transfemoral plane',
  'Measurement',
  'Measurements',
  'Plane Acquisition Challenges and Common Measurement Errors',
  'Pitfalls in Plane Acquisition and Measurement',
  'Image Diagnosis',
  'Image diagnosis',
  'OB Boosters',
];

const RESOURCE_ORDER = {
  // ── BPD & HC ──────────────────────────────────────────────
  'BPD & HC::Transthalamic Plane': 1,
  'BPD & HC::Bi-Parietal Diameter': 2,
  'BPD & HC::Head Circumference': 3,
  'BPD & HC::Significance': 4,

  'BPD & HC::Anatomical Landmarks and Significance': 1,
  'BPD & HC::Anatomical Landmarks of the Transthalamic Plane': 1,
  'BPD & HC::Geometric shapes of key landmarks and their significance': 2,
  'BPD & HC::Mind Sparks - Anatomical Landmarks': 3,

  'BPD & HC:: How To Image The Plane': 1,
  'BPD & HC::Mind Sparks - Probe Movements': 2,
  'BPD & HC::How To Acquire The Transthalamic Plane': 3,
  'BPD & HC::Mind Sparks - Picture Pick': 4,
  'BPD & HC::Finding the fetal presentation': 1,
  'BPD & HC::Mind Sparks - Probe movements': 2,
  'BPD & HC::How to acquire the transthalamic plane': 3,

  'BPD & HC::How To Measure BPD': 1,
  'BPD & HC::How To Measure HC': 2,
  'BPD & HC::How to measure BPD': 1,
  'BPD & HC::How to measure HC': 2,

  'BPD & HC::Image Diagnosis': 1,
  'BPD & HC::Percentile Chart & Significance': 2,
  'BPD & HC::Percentile Charts  & Significance': 2,
  'BPD & HC::BPD Chart': 3,
  'BPD & HC::HC Chart': 4,
  'BPD & HC::Mind Sparks - Chart Interpretation': 5,

  'BPD & HC::Picture Pick': 1,
  'BPD & HC::True / False': 2,
  'BPD & HC::True/False': 2,
  'BPD & HC::Wordsearch': 3,
  'BPD & HC::Word Search': 3,

  'BPD & HC::Plane Acquisition Challenges': 1,
  'BPD & HC::Common Measurement Errors': 2,

  // ── AC ────────────────────────────────────────────────────
  'AC::Transabdominal plane': 1,
  'AC::Abdominal circumference': 2,
  'AC::Significance': 3,

  'AC::Anatomical landmarks of the transabdominal plane': 1,
  'AC::Geometric shapes of key landmarks and their significance': 2,
  'AC::Mind Sparks - Anatomical Landmarks': 3,

  'AC::How to acquire the transabdominal plane': 1,
  'AC::Mind Sparks - Probe movements': 2,
  'AC::Mind Sparks - Picture pick': 3,

  'AC::How to measure AC': 1,
  'AC::Mind Sparks - Picture Pick': 2,

  'AC::Image Diagnosis': 1,
  'AC::Percentile Charts  & Significance': 2,
  'AC::AC chart': 3,
  'AC::Mind Sparks - Chart Interpretation': 4,

  'AC::Crossword puzzle': 1,
  'AC::True/False': 2,
  'AC::Picture Pick': 3,

  'AC::Plane Acquisition Challenges': 1,
  'AC::Common Measurement Errors': 2,

  // ── FL ────────────────────────────────────────────────────
  'FL::Femur': 1,
  'FL::Femur diaphysis': 2,
  'FL::Significance': 3,

  'FL::Anatomical landmarks of the femur diaphysis plane': 1,
  'FL::Geometric shapes of key landmarks and their significance': 2,
  'FL::Mind Sparks - Anatomical Landmarks': 3,

  'FL::How to acquire the femur diaphysis plane': 1,
  'FL::Mind Sparks - Probe movements': 2,
  'FL::Mind Sparks - Picture pick': 3,

  'FL::How to measure FL': 1,
  'FL::MindSparks - Picture Pick': 2,

  'FL::Image Diagnosis': 1,
  'FL::Image diagnosis': 1,
  'FL::Percentile Charts  & Significance': 2,
  'FL::Percentile charts & significance': 2,
  'FL::AC chart': 3,
  'FL::FL chart': 3,
  'FL::Mind Sparks - Chart Interpretation': 4,

  'FL::Crossword puzzle': 1,
  'FL::Picture Pick': 2,
  'FL::True/False': 3,

  'FL::Plane Acquisition Challenges': 1,
  'FL::Common Measurement Errors': 2,
};

const IMAGE_INTERPRETATION_ORDER = {
  'Find the Image': 1,
  'Annotation 1': 2,
  'Annotation 2': 3,
  'Measurement': 4,
};

const getTopicOrder = (topic) => {
  const idx = TOPIC_ORDER.indexOf(topic);
  return idx === -1 ? 99 : idx;
};

const getResourceOrder = (unit_name, resource_name) => {
  return RESOURCE_ORDER[`${unit_name}::${resource_name}`] ?? 99;
};

const buildCertificateTree = (rows) => {
  const certMap = {};

  for (const row of rows) {
    const {
      certificate_id, certificate_name,
      course_name, module_name, unit_name,
      resource_type, resource_topic, resource_name, resource_id, is_completed
    } = row;

    if (!resource_id) continue;

    if (!certMap[certificate_id]) {
      certMap[certificate_id] = { certificate_id, certificate_name, courses: {} };
    }
    const cert = certMap[certificate_id];

    if (!cert.courses[course_name]) {
      cert.courses[course_name] = { course_name, modules: {} };
    }
    const course = cert.courses[course_name];

    if (!course.modules[module_name]) {
      course.modules[module_name] = { module_name, units: {} };
    }
    const mod = course.modules[module_name];

    if (!mod.units[unit_name]) {
      mod.units[unit_name] = {
        unit_name,
        learning_resources: { total: 0, completed: 0, items: {} },
        image_interpretations: { total: 0, completed: 0, items: {} },
        practices: [],
        tests: [],
      };
    }
    const unit = mod.units[unit_name];

    const leaf = { resource_id, resource_name, is_completed: is_completed ?? false };

    if (resource_type === 'Learning Resource') {
      unit.learning_resources.total += 1;
      if (is_completed) unit.learning_resources.completed += 1;
      if (!unit.learning_resources.items[resource_topic]) {
        unit.learning_resources.items[resource_topic] = { resource_topic, resources: [] };
      }
      unit.learning_resources.items[resource_topic].resources.push(leaf);

    } else if (resource_type === 'Image Interpretation') {
      unit.image_interpretations.total += 1;
      if (is_completed) unit.image_interpretations.completed += 1;
      if (!unit.image_interpretations.items[resource_topic]) {
        unit.image_interpretations.items[resource_topic] = { resource_topic, resources: [] };
      }
      unit.image_interpretations.items[resource_topic].resources.push(leaf);

    } else if (resource_type === 'Practice') {
      unit.practices.push(leaf);

    } else if (resource_type === 'Test') {
      unit.tests.push(leaf);
    }
  }

  return Object.values(certMap).map(cert => ({
    ...cert,
    courses: Object.values(cert.courses).map(course => ({
      ...course,
      modules: Object.values(course.modules).map(mod => ({
        ...mod,
        units: Object.values(mod.units)
          .sort((a, b) => (UNIT_ORDER[a.unit_name] ?? 99) - (UNIT_ORDER[b.unit_name] ?? 99))
          .map(unit => ({
            ...unit,
            learning_resources: {
              ...unit.learning_resources,
              items: Object.values(unit.learning_resources.items)
                .sort((a, b) => getTopicOrder(a.resource_topic) - getTopicOrder(b.resource_topic))
                .map(topicGroup => ({
                  ...topicGroup,
                  resources: [...topicGroup.resources]
                    .sort((a, b) => getResourceOrder(unit.unit_name, a.resource_name) - getResourceOrder(unit.unit_name, b.resource_name)),
                })),
            },
            practices: [...unit.practices].sort((a, b) => a.resource_name.localeCompare(b.resource_name)),
            image_interpretations: {
              ...unit.image_interpretations,
              items: Object.values(unit.image_interpretations.items).map(topicGroup => ({
                ...topicGroup,
                resources: [...topicGroup.resources].sort(
                  (a, b) => (IMAGE_INTERPRETATION_ORDER[a.resource_name] ?? 99) - (IMAGE_INTERPRETATION_ORDER[b.resource_name] ?? 99)
                ),
              })),
            },
            tests: [...unit.tests].sort((a, b) => a.resource_name.localeCompare(b.resource_name)),
          })),
      })),
    })),
  }));
};

const indDatauuid = (requester, people_id, isVr = true) => {
  return new Promise((resolve, reject) => {
    const isPrivileged = [101, 102, 103].includes(Number(requester.role));

    if (!isPrivileged) {
      return resolve({
        status: 'Unauthorized',
        code: 401,
        message: 'You do not have permission to view profiles',
      });
    }

    // ─── VR LOGIN ────────────────────────────────────────────────────────────
    if (isVr) {
      const vrBatchQuery = `
        SELECT 
          bd.batch_id,
          bd.batch_name,
          bd.batch_end_date,
          COUNT(DISTINCT CASE WHEN ud.user_role = '102' THEN ud.user_email END) AS instructor_count,
          ARRAY_AGG(DISTINCT ud.user_name) FILTER (WHERE ud.user_role = '102' AND ud.user_name IS NOT NULL) AS instructors
        FROM batch_data bd
        JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
        JOIN user_data ud ON ud.user_email = bpd.user_id
        WHERE bd.batch_end_date::DATE >= CURRENT_DATE
          AND bd.batch_id IN (
            SELECT UNNEST(bpd.batch_id)
            FROM user_data ud
            JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
            WHERE ud.people_id = $1
          )
        GROUP BY bd.batch_id, bd.batch_name, bd.batch_end_date
        ORDER BY bd.batch_end_date::DATE DESC;
      `;

      const vrCertificateTreeQuery = `
        WITH user_info AS (
          SELECT ud.user_email
          FROM user_data ud
          WHERE ud.people_id = $1
        ),
        active_batches AS (
          SELECT UNNEST(bpd.batch_id) AS batch_id
          FROM user_data ud
          JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
          WHERE ud.people_id = $1
        ),
        active_certificates AS (
          SELECT DISTINCT cd.certificate_id, cd.certificate_name
          FROM active_batches ab
          JOIN batch_data bd ON bd.batch_id = ab.batch_id
          JOIN certification_data cd ON bd.certification_data ? cd.certificate_id::text
          WHERE bd.batch_end_date::DATE >= CURRENT_DATE
        ),
        user_progress AS (
          SELECT pd.resourse_id, pd.is_completed
          FROM progress_data pd
          WHERE pd.user_id IN (SELECT user_email FROM user_info)
        )
        SELECT
          ac.certificate_id,
          ac.certificate_name,
          lm.course_name,
          lm.module_name,
          lm.unit_name,
          rd.resource_id,
          rd.resource_name,
          rd.resource_type,
          rd.resource_topic,
          up.is_completed
        FROM active_certificates ac
        JOIN learning_module lm ON lm.certificate_id = ac.certificate_id
        JOIN resource_data rd ON rd.learning_module_id = lm.learning_module_id
        LEFT JOIN user_progress up ON up.resourse_id = rd.resource_id
        ORDER BY
          ac.certificate_name,
          lm.course_name,
          lm.module_name,
          lm.unit_name,
          rd.resource_type,
          rd.resource_topic,
          rd.resource_name;
      `;

      Promise.all([
        new Promise((res, rej) =>
          client.query(vrBatchQuery, [people_id], (err, result) =>
            err ? rej(err) : res(result.rows)
          )
        ),
        new Promise((res, rej) =>
          client.query(vrCertificateTreeQuery, [people_id], (err, result) =>
            err ? rej(err) : res(result.rows)
          )
        ),
      ])
        .then(([batchData, rawCertData]) => {
          const certificates = buildCertificateTree(rawCertData);
          resolve({
            status: 'Success',
            code: 200,
            currentBatches: batchData,
            certificates: certificates,
            loginContext: 'vr',
          });
        })
        .catch((err) => {
          reject({
            status: 'Error',
            code: 500,
            message: 'Database query failed',
            error: err,
          });
        });

      return;
    }

    // ─── LMS LOGIN ───────────────────────────────────────────────────────────
    const userProgressQuery = `
      WITH user_info AS (
        SELECT user_email, user_name, user_role, user_profile_photo
        FROM user_data
        WHERE people_id = $1
      ),
      pdt AS (
        SELECT resourse_id AS rid, user_id, is_completed, updated_at
        FROM progress_data
        WHERE user_id IN (SELECT user_email FROM user_info)
      )
      SELECT 
        ui.user_name, ui.user_profile_photo, ui.user_role,
        lm.certificate_id, lm.course_name, lm.module_name, lm.unit_name, lm.learning_module_id,
        rd.resource_id, rd.resource_name, rd.resource_type, rd.resource_topic,
        pdt.is_completed, pdt.updated_at
      FROM user_info ui
      CROSS JOIN learning_module lm
      LEFT JOIN resource_data rd ON lm.learning_module_id = rd.learning_module_id
      LEFT JOIN pdt ON pdt.rid = rd.resource_id;
    `;

    const instructorQuery = `
      SELECT 
        bd.batch_id,
        bd.batch_name,
        bd.batch_end_date,
        CASE 
          WHEN bd.batch_end_date::DATE >= CURRENT_DATE THEN 'current'
          ELSE 'completed'
        END AS batch_status,
        COUNT(DISTINCT CASE WHEN ud.user_role = '102' THEN ud.user_email END) AS instructor_count,
        ARRAY_AGG(DISTINCT ud.user_name) FILTER (WHERE ud.user_role = '102' AND ud.user_name IS NOT NULL) AS instructors
      FROM batch_data bd
      JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
      JOIN user_data ud ON ud.user_email = bpd.user_id
      WHERE bd.batch_id IN (
        SELECT UNNEST(bpd.batch_id)
        FROM user_data ud
        JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
        WHERE ud.people_id = $1
      )
      GROUP BY bd.batch_id, bd.batch_name, bd.batch_end_date
      ORDER BY bd.batch_end_date::DATE DESC;
    `;

    const testDataQuery = `
      SELECT 
        rd.resource_id, rd.resource_name, rd.resource_type,
        ctd.plane_identification, ctd.image_optimization, ctd.measurement, ctd.diagnostic_interpretation, ctd.created_at,
        lm.learning_module_id, lm.module_name, lm.unit_name, lm.course_name,
        cd.certificate_name
      FROM user_data ud
      JOIN course_test_data ctd ON ud.user_email = ctd.user_id
      JOIN resource_data rd ON rd.resource_id = ctd.r_id
      JOIN learning_module lm ON lm.learning_module_id = rd.learning_module_id
      JOIN certification_data cd ON cd.certificate_id = lm.certificate_id
      WHERE ud.people_id = $1
      ORDER BY ctd.created_at DESC;
    `;

    const testReattempts = `
      SELECT 
        r.resource_id, r.resource_name, r.resource_type,
        COUNT(t.r_id) AS attempt_count
      FROM user_data ud
      JOIN test_attempts_logs t ON t.user_id = ud.user_email
      JOIN resource_data r ON r.resource_id = t.r_id
      WHERE ud.people_id = $1
      GROUP BY r.resource_id, r.resource_name, r.resource_type
      HAVING COUNT(t.r_id) > 1
      ORDER BY attempt_count DESC;
    `;

    const moduleCompletionQuery = `
      WITH user_info AS (
        SELECT user_email
        FROM user_data
        WHERE people_id = $1
      ),
      pdt AS (
        SELECT resourse_id AS rid, user_id, is_completed
        FROM progress_data
        WHERE user_id IN (SELECT user_email FROM user_info)
      )
      SELECT
        lm.learning_module_id,
        lm.course_name,
        lm.module_name,
        lm.unit_name,
        COUNT(rd.resource_id) FILTER (
          WHERE rd.resource_type = 'Learning Resource'
        ) AS total_learning_resources,
        COUNT(pdt.is_completed) FILTER (
          WHERE rd.resource_type = 'Learning Resource'
          AND pdt.is_completed = true
        ) AS completed_learning_resources,
        COUNT(rd.resource_id) FILTER (
          WHERE rd.resource_type = 'Image Interpretation'
        ) AS total_image_interpretations,
        COUNT(pdt.is_completed) FILTER (
          WHERE rd.resource_type = 'Image Interpretation'
          AND pdt.is_completed = true
        ) AS completed_image_interpretations
      FROM learning_module lm
      LEFT JOIN resource_data rd ON lm.learning_module_id = rd.learning_module_id
      LEFT JOIN pdt ON pdt.rid = rd.resource_id
      GROUP BY lm.learning_module_id, lm.course_name, lm.module_name, lm.unit_name;
    `;

    Promise.all([
      new Promise((res, rej) =>
        client.query(userProgressQuery, [people_id], (err, result) =>
          err ? rej(err) : res(result.rows)
        )
      ),
      new Promise((res, rej) =>
        client.query(instructorQuery, [people_id], (err, result) =>
          err ? rej(err) : res(result.rows)
        )
      ),
      new Promise((res, rej) =>
        client.query(testDataQuery, [people_id], (err, result) =>
          err ? rej(err) : res(result.rows)
        )
      ),
      new Promise((res, rej) =>
        client.query(testReattempts, [people_id], (err, result) =>
          err ? rej(err) : res(result.rows)
        )
      ),
      new Promise((res, rej) =>
        client.query(moduleCompletionQuery, [people_id], (err, result) =>
          err ? rej(err) : res(result.rows)
        )
      ),
    ])
      .then(([progressData, instructorData, testData, reAttemptsData, moduleCompletion]) => {
        const currentBatches = instructorData.filter(b => b.batch_status === 'current');
        const completedBatches = instructorData.filter(b => b.batch_status === 'completed');

        resolve({
          status: 'Success',
          code: 200,
          data: progressData,
          currentBatches: currentBatches,
          completedBatches: completedBatches,
          testQuery: testData,
          reAttempts: reAttemptsData,
          moduleCompletion: moduleCompletion,
          loginContext: 'lms',
        });
      })
      .catch((err) => {
        reject({
          status: 'Error',
          code: 500,
          message: 'Database query failed',
          error: err,
        });
      });
  });
};

const updateTraineem = (requester, user_id, batch_id) => {
    return new Promise((resolve, reject) => {
          const isPrivileged = [101, 99].includes(Number(requester.role));
          if(!isPrivileged)
          {
              return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'You do not have permission to view trainee profiles'
              })
          }
          const batchIdArray = Array.isArray(batch_id) 
              ? batch_id 
              : [batch_id];

          client.query(
              `UPDATE batch_people_data SET batch_id = $1 WHERE user_id = $2`, 
              [batchIdArray, user_id],
              (err, result) => {
                    if (err) {
                          reject({
                                status: 'Error',
                                code: 500,
                                message: 'Database query failed',
                                error: err
                          });
                    } else {
                          resolve({
                                status: 'Success',
                                code: 200,  
                                message: 'Trainee batch updated successfully'
                          });
                    } 
              }
          );
    })
}
module.exports = {traineem, getTraineesm, disableTraineem, deleteTraineem, indData, indDatauuid, updateTraineem};