const client = require('../utils/conn.js');
// const {HashedPassword} = require('../utils/hash.js');
const hasCenterScope = (requester) => Boolean(requester?.centre_id);

const traineem = (user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, status, description, user_batch, requester) => {
    return new Promise((resolve, reject) => {
            const isPrivileged = [102, 101].includes(Number(requester.role));
            const role = Number(requester.role);
            const targetRole = Number(user_role);
            if(!isPrivileged)
            {
                return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'You do not have permission to create a trainee profile.'
                });
            }

            if (!hasCenterScope(requester)) {
                return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'Your account is not linked to a scan center.'
                });
            }

            if (![102, 103].includes(targetRole)) {
                return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'Only instructor and trainee profiles can be created here.'
                });
            }

            if (role === 102 && targetRole !== 103) {
                return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'Instructors can create trainee profiles only.'
                });
            }

            client.query(
                `INSERT INTO public.user_data(
                    user_profile_photo,
                    user_name,
                    user_email,
                    user_contact_num,
                    user_dob,
                    user_gender,
                    user_password,
                    user_role,
                    status,
                    description,
                    centre_id,
                    center_name
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [user_profile_photo, user_name, user_email, user_contact_num, user_dob, user_gender, user_password, user_role, status, description, requester.centre_id, requester.center_name],
                (err, result) => {
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

        if (!hasCenterScope(requester)) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'Your account is not linked to a scan center.'
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
                AND ud.centre_id = $3
                ORDER BY ud.user_name
                LIMIT $1 OFFSET $2
            `;
            params = [limit, offset, requester.centre_id];
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
                AND ud.centre_id = $4
                ORDER BY ud.user_name
                LIMIT $1 OFFSET $2
            `;
            params = [limit, offset, requester.user_mail, requester.centre_id];
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
        if (!hasCenterScope(requester)) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'Your account is not linked to a scan center.'
            });
        }
        client.query('UPDATE public.user_data SET status=$1 WHERE user_email=$2 AND user_role=$3 AND centre_id=$4', [status, user_mail, '103', requester.centre_id], (err, result) => {
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
        if (!hasCenterScope(requester)) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'Your account is not linked to a scan center.'
            });
        }
        client.query('DELETE FROM public.user_data WHERE user_email=$1 and user_role=$2 AND centre_id=$3', [user_mail, '103', requester.centre_id], (err, result) => {
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

const TOPIC_ORDER_ALIASES = [
  { order: 1, aliases: ['Fetal Head', 'Fetal Head (BPD & HC)', 'Fetal abdomen', 'Fetal Femur', 'Introduction', 'FL Summary'] },
  { order: 2, aliases: ['Anatomical Landmarks', 'Anatomical landmarks'] },
  { order: 3, aliases: ['Imaging the Plane', 'Imaging the Transthalamic Plane', 'Imaging the transabdominal plane', 'Imaging the transfemoral plane'] },
  { order: 4, aliases: ['Measurement', 'Measurements'] },
  { order: 5, aliases: ['Plane Acquisition Challenges and Common Errors', 'Plane Acquisition Challenges and Common Measurement Errors', 'Pitfalls in Plane Acquisition and Measurement', 'Pitfalls', 'Pit Falls'] },
  { order: 6, aliases: ['Image Diagnosis', 'Image diagnosis', 'Diagnosis'] },
  { order: 7, aliases: ['OB Boosters'] },
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
  'BPD & HC::MindSparks - Anatomical Landmarks': 3,
  'BPD & HC::MindSparks - Quiz': 3,

  'BPD & HC:: How To Image The Plane': 1,
  'BPD & HC::Imaging the plane': 1,
  'BPD & HC::Imaging the Plane': 1,
  'BPD & HC::Interaction - Fetal Head Scanning Activity': 2,
  'BPD & HC::Mind Sparks - Probe Movements': 3,
  'BPD & HC::How To Acquire The Transthalamic Plane': 3,
  'BPD & HC::Mind Sparks - Picture Pick': 4,
  'BPD & HC::Finding the fetal presentation': 1,
  'BPD & HC::Mind Sparks - Probe movements': 3,
  'BPD & HC::MindSparks - Probe movements': 3,
  'BPD & HC::How to acquire the transthalamic plane': 3,

  'BPD & HC::How To Measure BPD': 1,
  'BPD & HC::How To Measure HC': 2,
  'BPD & HC::How to measure BPD': 1,
  'BPD & HC::How to measure HC': 2,

  'BPD & HC::Image Diagnosis': 1,
  'BPD & HC::Percentile Chart & Significance': 2,
  'BPD & HC::Percentile Charts & Significance': 2,
  'BPD & HC::Percentile Charts  & Significance': 2,
  'BPD & HC::BPD Chart': 3,
  'BPD & HC::HC Chart': 4,
  'BPD & HC::Mind Sparks - Chart Interpretation': 5,
  'BPD & HC::MindSparks - Yes/No': 5,

  'BPD & HC::Image Selection': 1,
  'BPD & HC::Picture Pick': 2,
  'BPD & HC::Visual Recognition': 3,
  'BPD & HC::True / False': 4,
  'BPD & HC::True/False': 4,
  'BPD & HC::Wordsearch': 5,
  'BPD & HC::Word Search': 5,

  'BPD & HC::Plane Acquisition Challenges': 1,
  'BPD & HC::Plane Acquisition Challenges and Common Errors': 1,
  'BPD & HC::Plane Acquisition Challenges and Common Measurement Errors': 1,
  'BPD & HC::Common Measurement Errors': 2,
  'BPD & HC::MindSparks - Picture Pick': 2,

  // ── AC ────────────────────────────────────────────────────
  'AC::AC Introduction': 1,
  'AC::Transabdominal plane': 2,
  'AC::Abdominal circumference': 2,
  'AC::Transabdominal plane & Abdominal circumference': 2,
  'AC::Significance': 3,

  'AC::Anatomical landmarks of the transabdominal plane': 1,
  'AC::Geometric shapes of key landmarks and their significance': 1,
  'AC::Mind Sparks - Anatomical Landmarks': 2,
  'AC::MindSparks - Quiz': 2,

  'AC::Imaging the plane': 1,
  'AC::Imaging the Plane': 1,
  'AC::How to acquire the transabdominal plane': 1,
  'AC::Mind Sparks - Probe movements': 2,
  'AC::MindSparks - Probe movements': 2,
  'AC::Mind Sparks - Picture pick': 3,

  'AC::Measurement': 1,
  'AC::Measurements': 1,
  'AC::How to measure AC': 1,
  'AC::Interaction - Plane orientation and measurement': 2,
  'AC::Interaction - Landmark placement and measurement': 2,
  'AC::Mind Sparks - Picture Pick': 3,

  'AC::Image Diagnosis': 1,
  'AC::Percentile Charts  & Significance': 1,
  'AC::AC chart': 1,
  'AC::AC Chart': 1,
  'AC::Mind Sparks - Chart Interpretation': 2,
  'AC::MindSparks - True/False': 2,

  'AC::Crossword puzzle': 1,
  'AC::True/False': 2,
  'AC::Picture Pick': 3,

  'AC::Plane Acquisition Challenges': 1,
  'AC::Plane Acquisition Challenges and Common Errors': 1,
  'AC::Plane Acquisition Challenges and Common Measurement Errors': 1,
  'AC::Common Measurement Errors': 1,

  // ── FL ────────────────────────────────────────────────────
  'FL::Femur': 1,
  'FL::Femur diaphysis': 2,
  'FL::Significance': 3,

  'FL::Anatomical landmarks of the femur diaphysis plane': 1,
  'FL::Geometric shapes of key landmarks and their significance': 1,
  'FL::Interaction - Femur Bone': 2,
  'FL::Mind Sparks - Anatomical Landmarks': 3,
  'FL::MindSparks - Quiz': 3,

  'FL::Imaging the plane': 1,
  'FL::How to acquire the femur diaphysis plane': 1,
  'FL::Mind Sparks - Probe movements': 2,
  'FL::MindSparks - Probe movements': 2,
  'FL::Mind Sparks - Picture pick': 3,

  'FL::How to measure FL': 1,
  'FL::Measurement of  FL': 1,
  'FL::MindSparks - Picture Pick': 2,

  'FL::Image Diagnosis': 1,
  'FL::Image diagnosis': 1,
  'FL::Percentile Charts  & Significance': 2,
  'FL::Percentile charts & significance': 2,
  'FL::AC chart': 3,
  'FL::FL chart': 1,
  'FL::Mind Sparks - Chart Interpretation': 2,
  'FL::MindSparks - True/False': 2,

  'FL::Crossword puzzle': 3,
  'FL::Picture Pick': 1,
  'FL::True/False': 2,

  'FL::Plane Acquisition Challenges': 1,
  'FL::Plane Acquisition Challenges and Common Errors': 1,
  'FL::Common Measurement Errors': 1,
  'FL::Mind Sparks - Errors - Picture pick': 2,
};

const IMAGE_INTERPRETATION_ORDER = {
  'Find the Image': 1,
  'Find the Image (Upload)': 1,
  'Annotation: Drag and Drop': 2,
  'Annotation 1': 2,
  'Annotation: Label and Name': 3,
  'Annotation 2': 3,
  'Measurement': 4,
};

const stripLearningResourceSuffix = (value = '') =>
  String(value)
    .replace(/\s*-\s*LR\s*\(LMS Animation\)\s*$/i, '')
    .replace(/\s*-\s*LR\s*$/i, '')
    .trim();

const normalizeOrderToken = (value = '') =>
  stripLearningResourceSuffix(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

const TOPIC_ORDER = TOPIC_ORDER_ALIASES.reduce((orderMap, entry) => {
  for (const alias of entry.aliases) {
    orderMap[normalizeOrderToken(alias)] = entry.order;
  }
  return orderMap;
}, {});

const UNIT_TOPIC_ORDER = {
  'BPD & HC': {
    [normalizeOrderToken('Fetal Head')]: 1,
    [normalizeOrderToken('Fetal Head (BPD & HC)')]: 1,
    [normalizeOrderToken('Anatomical Landmarks')]: 2,
    [normalizeOrderToken('Anatomical landmarks')]: 2,
    [normalizeOrderToken('Imaging the Transthalamic Plane')]: 3,
    [normalizeOrderToken('Imaging the Plane')]: 3,
    [normalizeOrderToken('Measurement')]: 4,
    [normalizeOrderToken('Measurements')]: 4,
    [normalizeOrderToken('Pitfalls in Plane Acquisition and Measurement')]: 5,
    [normalizeOrderToken('Plane Acquisition Challenges and Common Errors')]: 5,
    [normalizeOrderToken('Plane Acquisition Challenges and Common Measurement Errors')]: 5,
    [normalizeOrderToken('Image Diagnosis')]: 6,
    [normalizeOrderToken('Image diagnosis')]: 6,
    [normalizeOrderToken('Percentile Charts  & Significance')]: 6,
    [normalizeOrderToken('Percentile Charts & Significance')]: 6,
    [normalizeOrderToken('Percentile Chart & Significance')]: 6,
    [normalizeOrderToken('OB Boosters')]: 7,
  },
  'Principles of ultrasound': {
    [normalizeOrderToken('Ultrasound wave physics')]: 1,
    [normalizeOrderToken('Generation of ultrasound waves')]: 2,
    [normalizeOrderToken('Ultrasound wave properties')]: 3,
    [normalizeOrderToken('Image Formation')]: 4,
    [normalizeOrderToken('Imaging modes')]: 5,
    [normalizeOrderToken('Interaction of ultrasound waves')]: 6,
    [normalizeOrderToken('Interaction')]: 6,
    [normalizeOrderToken('Interaction - ultrasound waves')]: 6,
    [normalizeOrderToken('Interaction Activity')]: 8,
    [normalizeOrderToken('7. iNTERACTION Activity')]: 8,
    [normalizeOrderToken('Echogenicity')]: 9,
    [normalizeOrderToken('Artifacts')]: 10,
  },
  'Probe Movements': {
    [normalizeOrderToken('Anatomy planes')]: 1,
    [normalizeOrderToken('Anatomy Plane')]: 1,
    [normalizeOrderToken('Types of probe')]: 2,
    [normalizeOrderToken('Types of Probe')]: 2,
    [normalizeOrderToken('Probe orientation')]: 3,
    [normalizeOrderToken('Probe movements')]: 4,
    [normalizeOrderToken('Echo Dose')]: 5,
  },
  Knobology: {
    [normalizeOrderToken('Overview of ultrasound machine')]: 1,
    [normalizeOrderToken('Function of the Knobs')]: 2,
    [normalizeOrderToken('Imaging Modes')]: 3,
    [normalizeOrderToken('Echo Dose')]: 4,
  },
  Morphology: {
    [normalizeOrderToken('Image Formation & Sector Orientation')]: 1,
    [normalizeOrderToken('3D to 2D Imaging')]: 2,
    [normalizeOrderToken('2D to 3D Imaging')]: 3,
    [normalizeOrderToken('Echo Dose')]: 4,
  },
  AC: {
    [normalizeOrderToken('AC - Fetal Abdomen')]: 1,
    [normalizeOrderToken('Fetal Abdomen')]: 1,
    [normalizeOrderToken('Fetal abdomen')]: 1,
    [normalizeOrderToken('Anatomical Landmarks')]: 2,
    [normalizeOrderToken('Anatomical landmarks')]: 2,
    [normalizeOrderToken('Imaging the Plane')]: 3,
    [normalizeOrderToken('Imaging the transabdominal plane')]: 3,
    [normalizeOrderToken('Measurement')]: 4,
    [normalizeOrderToken('Measurements')]: 4,
    [normalizeOrderToken('Pitfalls in Plane Acquisition and Measurement')]: 5,
    [normalizeOrderToken('Plane Acquisition Challenges and Common Errors')]: 5,
    [normalizeOrderToken('Plane Acquisition Challenges and Common Measurement Errors')]: 5,
    [normalizeOrderToken('Pitfalls')]: 5,
    [normalizeOrderToken('Pit Falls')]: 5,
    [normalizeOrderToken('Image Diagnosis')]: 6,
    [normalizeOrderToken('Image diagnosis')]: 6,
    [normalizeOrderToken('OB Boosters')]: 7,
  },
  FL: {
    [normalizeOrderToken('Fetal Femur')]: 1,
    [normalizeOrderToken('FL Summary')]: 1,
    [normalizeOrderToken('Anatomical Landmarks')]: 2,
    [normalizeOrderToken('Anatomical landmarks')]: 2,
    [normalizeOrderToken('Imaging the Plane')]: 3,
    [normalizeOrderToken('Imaging the transfemoral plane')]: 3,
    [normalizeOrderToken('Measurement')]: 4,
    [normalizeOrderToken('Measurements')]: 4,
    [normalizeOrderToken('Pitfalls in Plane Acquisition and Measurement')]: 5,
    [normalizeOrderToken('Pitfalls in plane acquisition and measurement')]: 5,
    [normalizeOrderToken('Pitfalls in Plane Acquistions and Measurements')]: 5,
    [normalizeOrderToken('Pitfalls in Plane Acquisitions and Measurements')]: 5,
    [normalizeOrderToken('Pitfalls')]: 5,
    [normalizeOrderToken('Pit Falls')]: 5,
    [normalizeOrderToken('Image Diagnosis')]: 6,
    [normalizeOrderToken('Image diagnosis')]: 6,
    [normalizeOrderToken('Diagnosis')]: 6,
    [normalizeOrderToken('OB Boosters')]: 7,
  },
};

const NORMALIZED_UNIT_TOPIC_ORDER = Object.entries(UNIT_TOPIC_ORDER).reduce((orderMap, [scopeName, topicOrder]) => {
  orderMap[normalizeOrderToken(scopeName)] = topicOrder;
  return orderMap;
}, {});

const makeResourceOrderKey = (unitName, topicName, resourceName) =>
  `${normalizeOrderToken(unitName)}::${normalizeOrderToken(topicName)}::${normalizeOrderToken(resourceName)}`;

const RESOURCE_ORDER_BY_TOPIC_ALIASES = [
  { units: ['Probe Movements'], topics: ['Anatomy planes', 'Anatomy Plane'], resources: ['Anatomy planes', 'Anatomy Plane'], order: 1 },
  { units: ['Probe Movements'], topics: ['Anatomy planes', 'Anatomy Plane'], resources: ['Mindsparks - Drag & Drop', 'Mindsparks - Anatomical Plane - Quiz', 'Mind Sparks - Anatomical Plane - Quiz'], order: 2 },
  { units: ['Probe Movements'], topics: ['Types of probe', 'Types of Probe'], resources: ['Types of probe', 'Types of Probe'], order: 1 },
  { units: ['Probe Movements'], topics: ['Types of probe', 'Types of Probe'], resources: ['Interaction - Probe Selection'], order: 2 },
  { units: ['Probe Movements'], topics: ['Types of probe', 'Types of Probe'], resources: ['Mindsparks - Quiz', 'Mind Sparks - Quiz'], order: 3 },
  { units: ['Probe Movements'], topics: ['Probe orientation'], resources: ['Probe Orientation'], order: 1 },
  { units: ['Probe Movements'], topics: ['Probe orientation'], resources: ['Mindsparks - Picture Pick'], order: 2 },
  { units: ['Probe Movements'], topics: ['Probe movements', 'Probe Movements'], resources: ['Probe Movements'], order: 1 },
  { units: ['Probe Movements'], topics: ['Probe movements', 'Probe Movements'], resources: ['Mindsparks - Probe movements', 'Mindsparks - Probe Movements', 'Mindsparks - probe movements', 'Mind Sparks - Probe Movements'], order: 2 },
  { units: ['Probe Movements'], topics: ['Echo Dose'], resources: ['Drag & Drop - Directional terms'], order: 1 },
  { units: ['Probe Movements'], topics: ['Echo Dose'], resources: ['True or False - Probe Orientation'], order: 2 },
  { units: ['Probe Movements'], topics: ['Echo Dose'], resources: ['Probe movements - Real-time', 'Probe movements'], order: 3 },
  { units: ['Knobology'], topics: ['Overview of ultrasound machine'], resources: ['Ultrasound machine'], order: 1 },
  { units: ['Knobology'], topics: ['Function of the Knobs'], resources: ['Interaction - Ultrasound Machine Interaction'], order: 2 },
  { units: ['Knobology'], topics: ['Function of the Knobs'], resources: ['Mindsparks - Quiz', 'Mind Sparks - US Machine - Quiz'], order: 4 },
  { units: ['Knobology'], topics: ['Function of the Knobs'], resources: ['Functions of knobs', 'Function of knobs'], order: 1 },
  { units: ['Knobology'], topics: ['Function of the Knobs'], resources: ['Mindsparks - Drag & Drop', 'Interaction - Knobology Interaction Activity'], order: 3 },
  { units: ['Knobology'], topics: ['Imaging Modes'], resources: ['Imaging Modes', 'Imaging modes'], order: 1 },
  { units: ['Knobology'], topics: ['Imaging Modes'], resources: ['Mindsparks - True/False', 'MindSparks - Imaging Modes - True / False'], order: 2 },
  { units: ['Knobology'], topics: ['Echo Dose'], resources: ['Echo Dose - Match', 'Knobs - Match'], order: 1 },
  { units: ['Knobology'], topics: ['Echo Dose'], resources: ['Echo Dose - Crossword', 'Knobs & Machine - Crossword Puzzle'], order: 2 },
  { units: ['Morphology'], topics: ['Image Formation & Sector Orientation'], resources: ['Image formation & sector orientation'], order: 1 },
  { units: ['Morphology'], topics: ['Image Formation & Sector Orientation'], resources: ['Mind Sparks - MCQ'], order: 2 },
  { units: ['Morphology'], topics: ['Image Formation & Sector Orientation'], resources: ['Need for understanding sector orientation'], order: 3 },
  { units: ['Morphology'], topics: ['Image Formation & Sector Orientation'], resources: ['Mind Sparks - ChatBot'], order: 4 },
  { units: ['Morphology'], topics: ['3D to 2D Imaging'], resources: ['3D to 2D Imaging'], order: 1 },
  { units: ['Morphology'], topics: ['3D to 2D Imaging'], resources: ['Mind Sparks - Scanning'], order: 2 },
  { units: ['Morphology'], topics: ['2D to 3D Imaging'], resources: ['2D to 3D Imaging'], order: 1 },
  { units: ['Morphology'], topics: ['2D to 3D Imaging'], resources: ['Mind Sparks - Picture Pick'], order: 2 },
  { units: ['Morphology'], topics: ['2D to 3D Imaging'], resources: ['Interaction - Spin Wheel'], order: 3 },
  { units: ['Morphology'], topics: ['Echo Dose'], resources: ['Sector Orientation'], order: 1 },
  { units: ['Morphology'], topics: ['Echo Dose'], resources: ['3D to 2D Prediction'], order: 2 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Fetal Head', 'Fetal Head (BPD & HC)'], resources: ['Transthalamic Plane'], order: 1 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Fetal Head', 'Fetal Head (BPD & HC)'], resources: ['Bi-Parietal Diameter'], order: 2 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Fetal Head', 'Fetal Head (BPD & HC)'], resources: ['Head Circumference'], order: 3 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Fetal Head', 'Fetal Head (BPD & HC)'], resources: ['Significance'], order: 4 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Anatomical Landmarks', 'Anatomical landmarks'], resources: ['Anatomical Landmarks and Significance', 'Anatomical Landmarks of the Transthalamic Plane'], order: 1 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Anatomical Landmarks', 'Anatomical landmarks'], resources: ['Geometric Shapes, Key Landmarks & Significance', 'Geometric shapes of key landmarks and their significance', 'Geometric shapes, Key Landmarks and significance'], order: 2 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Anatomical Landmarks', 'Anatomical landmarks'], resources: ['Mind Sparks - Anatomical Landmarks', 'MindSparks - Anatomical Landmarks', 'MindSparks - Quiz'], order: 3 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Imaging the Plane', 'Imaging the Transthalamic Plane'], resources: ['Imaging the plane', 'Imaging the Plane', 'Finding the Fetal Presentation', 'Finding the fetal presentation'], order: 1 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Imaging the Plane', 'Imaging the Transthalamic Plane'], resources: ['How To Acquire The Transthalamic Plane', 'How to acquire the transthalamic plane'], order: 2 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Imaging the Plane', 'Imaging the Transthalamic Plane'], resources: ['Interaction - Fetal Head Scanning Activity'], order: 2 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Imaging the Plane', 'Imaging the Transthalamic Plane'], resources: ['Mind Sparks - Probe Movements', 'Mind Sparks - Probe movements', 'MindSparks - Probe movements'], order: 3 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Imaging the Plane', 'Imaging the Transthalamic Plane'], resources: ['Mind Sparks - Picture Pick'], order: 4 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Measurement', 'Measurements'], resources: ['How to Measure BPD', 'How To Measure BPD'], order: 1 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Measurement', 'Measurements'], resources: ['How to measure HC', 'How To Measure HC'], order: 2 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Pitfalls in Plane Acquisition and Measurement', 'Plane Acquisition Challenges and Common Errors', 'Plane Acquisition Challenges and Common Measurement Errors'], resources: ['Plane Acquisition Challenges & Common Errors', 'Plane Acquisition Challenges and Common Errors', 'Plane Acquisition Challenges and Common Measurement Errors', 'Plane Acquisition Challenges'], order: 1 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Pitfalls in Plane Acquisition and Measurement', 'Plane Acquisition Challenges and Common Errors', 'Plane Acquisition Challenges and Common Measurement Errors'], resources: ['Artifacts'], order: 2 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Pitfalls in Plane Acquisition and Measurement', 'Plane Acquisition Challenges and Common Errors', 'Plane Acquisition Challenges and Common Measurement Errors'], resources: ['Common Measurement Errors'], order: 3 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Pitfalls in Plane Acquisition and Measurement', 'Plane Acquisition Challenges and Common Errors', 'Plane Acquisition Challenges and Common Measurement Errors'], resources: ['MindSparks - Picture Pick', 'Mind Sparks - Picture Pick'], order: 2 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Image Diagnosis', 'Image diagnosis', 'Percentile Charts  & Significance', 'Percentile Charts & Significance', 'Percentile Chart & Significance'], resources: ['Image Diagnosis'], order: 1 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Image Diagnosis', 'Image diagnosis', 'Percentile Charts  & Significance', 'Percentile Charts & Significance', 'Percentile Chart & Significance'], resources: ['Percentile Charts & Significance', 'Percentile Charts  & Significance', 'Percentile Chart & Significance'], order: 2 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Image Diagnosis', 'Image diagnosis', 'Percentile Charts  & Significance', 'Percentile Charts & Significance', 'Percentile Chart & Significance'], resources: ['BPD Chart'], order: 3 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Image Diagnosis', 'Image diagnosis', 'Percentile Charts  & Significance', 'Percentile Charts & Significance', 'Percentile Chart & Significance'], resources: ['HC Chart'], order: 4 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['Image Diagnosis', 'Image diagnosis', 'Percentile Charts  & Significance', 'Percentile Charts & Significance', 'Percentile Chart & Significance'], resources: ['MindSparks - Yes/No', 'Mind Sparks - Chart Interpretation'], order: 5 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['OB Boosters'], resources: ['Image Selection'], order: 1 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['OB Boosters'], resources: ['Picture Pick'], order: 2 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['OB Boosters'], resources: ['Visual Recognition'], order: 3 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['OB Boosters'], resources: ['True / False', 'True/False'], order: 4 },
  { units: ['BPD & HC', 'BPD/HC'], topics: ['OB Boosters'], resources: ['Wordsearch', 'Word Search'], order: 5 },

  { units: ['AC'], topics: ['AC - Fetal Abdomen', 'Fetal abdomen', 'Fetal Abdomen'], resources: ['Transabdominal plane'], order: 1 },
  { units: ['AC'], topics: ['AC - Fetal Abdomen', 'Fetal abdomen', 'Fetal Abdomen'], resources: ['Abdominal circumference'], order: 2 },
  { units: ['AC'], topics: ['AC - Fetal Abdomen', 'Fetal abdomen', 'Fetal Abdomen'], resources: ['Significance'], order: 3 },
  { units: ['AC'], topics: ['Anatomical Landmarks', 'Anatomical landmarks'], resources: ['Anatomical landmarks', 'Anatomical landmarks of the transabdominal plane', 'Anatomical Landmarks of the Transabdominal Plane'], order: 1 },
  { units: ['AC'], topics: ['Anatomical Landmarks', 'Anatomical landmarks'], resources: ['Mind Sparks - Geometric landmarks', 'Geometric shapes of key landmarks and their significance'], order: 2 },
  { units: ['AC'], topics: ['Anatomical Landmarks', 'Anatomical landmarks'], resources: ['MindSparks - Quiz', 'Mind Sparks - Anatomical Landmarks'], order: 3 },
  { units: ['AC'], topics: ['Imaging the Plane', 'Imaging the transabdominal plane'], resources: ['Cephalic Presentation'], order: 1 },
  { units: ['AC'], topics: ['Imaging the Plane', 'Imaging the transabdominal plane'], resources: ['Breech Presentation'], order: 2 },
  { units: ['AC'], topics: ['Imaging the Plane', 'Imaging the transabdominal plane'], resources: ['MindSparks - Probe movements', 'Mind Sparks - Probe movements'], order: 3 },
  { units: ['AC'], topics: ['Measurement', 'Measurements'], resources: ['Ellipse method'], order: 1 },
  { units: ['AC'], topics: ['Measurement', 'Measurements'], resources: ['Two-diameter method'], order: 2 },
  { units: ['AC'], topics: ['Measurement', 'Measurements'], resources: ['Interaction - Landmark placement and measurement'], order: 3 },
  { units: ['AC'], topics: ['Measurement', 'Measurements'], resources: ['MindSparks - Picture Pick', 'Mind Sparks - Picture Pick'], order: 4 },
  { units: ['AC'], topics: ['Pitfalls in Plane Acquisition and Measurement', 'Pitfalls', 'Pit Falls'], resources: ['Pit Falls', 'Plane Acquisition Challenges'], order: 1 },
  { units: ['AC'], topics: ['Pitfalls in Plane Acquisition and Measurement', 'Pitfalls', 'Pit Falls'], resources: ['Common Measurement Errors'], order: 2 },
  { units: ['AC'], topics: ['Pitfalls in Plane Acquisition and Measurement', 'Pitfalls', 'Pit Falls'], resources: ['Artifacts'], order: 3 },
  { units: ['AC'], topics: ['Pitfalls in Plane Acquisition and Measurement', 'Pitfalls', 'Pit Falls'], resources: ['MindSparks - Picture Pick', 'Mind Sparks - Picture Pick'], order: 4 },
  { units: ['AC'], topics: ['Image Diagnosis', 'Image diagnosis'], resources: ['Image Diagnosis'], order: 1 },
  { units: ['AC'], topics: ['Image Diagnosis', 'Image diagnosis'], resources: ['AC chart'], order: 2 },
  { units: ['AC'], topics: ['Image Diagnosis', 'Image diagnosis'], resources: ['MindSparks - True/False', 'Mind Sparks - Chart Interpretation'], order: 3 },
  { units: ['AC'], topics: ['OB Boosters'], resources: ['ALM - Crossword', 'Crossword puzzle'], order: 1 },
  { units: ['AC'], topics: ['OB Boosters'], resources: ['True/False'], order: 2 },
  { units: ['AC'], topics: ['OB Boosters'], resources: ['Picture Pick'], order: 3 },

  { units: ['FL'], topics: ['Introduction', 'Fetal Femur', 'FL Summary'], resources: ['Introduction', 'Fetal Femur', 'Fetal femur', 'Femur'], order: 1 },
  { units: ['FL'], topics: ['Introduction', 'Fetal Femur', 'FL Summary'], resources: ['Femur diaphysis'], order: 2 },
  { units: ['FL'], topics: ['Introduction', 'Fetal Femur', 'FL Summary'], resources: ['Significance'], order: 3 },
  { units: ['FL'], topics: ['Anatomical Landmarks', 'Anatomical landmarks'], resources: ['Anatomical landmarks', 'Anatomical landmarks of the femur diaphysis plane', 'Anatomical Landmarks of the femur diaphysis Plane'], order: 1 },
  { units: ['FL'], topics: ['Anatomical Landmarks', 'Anatomical landmarks'], resources: ['Mind sparks - Geometric Landmarks', 'Geometric shapes of key landmarks and their significance'], order: 1 },
  { units: ['FL'], topics: ['Anatomical Landmarks', 'Anatomical landmarks'], resources: ['Anatomical landmarks End card', 'Anatomical landmarks End Card', 'Interaction - Femur Bone'], order: 2 },
  { units: ['FL'], topics: ['Anatomical Landmarks', 'Anatomical landmarks'], resources: ['MindSparks - Quiz', 'Mind Sparks - Anatomical Landmarks'], order: 3 },
  { units: ['FL'], topics: ['Imaging the Plane', 'Imaging the transfemoral plane'], resources: ['Breech Presentation', 'Imaging the plane', 'How to acquire the femur diaphysis plane'], order: 1 },
  { units: ['FL'], topics: ['Imaging the Plane', 'Imaging the transfemoral plane'], resources: ['MindSparks - Probe movements', 'Mind Sparks - Probe movements'], order: 2 },
  { units: ['FL'], topics: ['Measurement', 'Measurements'], resources: ['Measurement of  FL', 'Measurements', 'Measurement', 'How to measure FL'], order: 1 },
  { units: ['FL'], topics: ['Measurement', 'Measurements'], resources: ['Mind Sparks - Measurements', 'MindSparks - Picture Pick'], order: 2 },
  { units: ['FL'], topics: ['Pitfalls in Plane Acquisition and Measurement', 'Pitfalls', 'Pit Falls'], resources: ['Plane acquisition errors', 'Pit Falls', 'Plane Acquisition Challenges', 'Plane Acquisition Challenges and Common Errors', 'Common measurement errors', 'Common Measurement Errors', 'Artifacts'], order: 1 },
  { units: ['FL'], topics: ['Pitfalls in Plane Acquisition and Measurement', 'Pitfalls', 'Pit Falls'], resources: ['Mind Sparks - Errors - Picture pick', 'MindSparks - Picture Pick'], order: 2 },
  { units: ['FL'], topics: ['Image Diagnosis', 'Image diagnosis', 'Diagnosis'], resources: ['FL chart', 'Diagnosis', 'Image Diagnosis', 'Image diagnosis'], order: 1 },
  { units: ['FL'], topics: ['Image Diagnosis', 'Image diagnosis', 'Diagnosis'], resources: ['MindSparks - True/False', 'Mind Sparks - Chart Interpretation'], order: 2 },
  { units: ['FL'], topics: ['OB Boosters'], resources: ['Image Diagnosis - Picture Pick', 'Picture Pick'], order: 1 },
  { units: ['FL'], topics: ['OB Boosters'], resources: ['Imaging the plane - True/False', 'True/False'], order: 2 },
];

const RESOURCE_ORDER_BY_TOPIC = RESOURCE_ORDER_BY_TOPIC_ALIASES.reduce((orderMap, entry) => {
  for (const unitName of entry.units) {
    for (const topicName of entry.topics) {
      for (const resourceName of entry.resources) {
        orderMap[makeResourceOrderKey(unitName, topicName, resourceName)] = entry.order;
      }
    }
  }
  return orderMap;
}, {});

const BPD_HC_TOPIC_BY_RESOURCE = {
  [normalizeOrderToken('Transthalamic Plane')]: 'Fetal Head',
  [normalizeOrderToken('Bi-Parietal Diameter')]: 'Fetal Head',
  [normalizeOrderToken('Head Circumference')]: 'Fetal Head',
  [normalizeOrderToken('Significance')]: 'Fetal Head',
  [normalizeOrderToken('Anatomical Landmarks and Significance')]: 'Anatomical Landmarks',
  [normalizeOrderToken('Anatomical Landmarks of the Transthalamic Plane')]: 'Anatomical Landmarks',
  [normalizeOrderToken('Geometric Shapes, Key Landmarks & Significance')]: 'Anatomical Landmarks',
  [normalizeOrderToken('Geometric shapes of key landmarks and their significance')]: 'Anatomical Landmarks',
  [normalizeOrderToken('Mind Sparks - Anatomical Landmarks')]: 'Anatomical Landmarks',
  [normalizeOrderToken('MindSparks - Anatomical Landmarks')]: 'Anatomical Landmarks',
  [normalizeOrderToken('MindSparks - Quiz')]: 'Anatomical Landmarks',
  [normalizeOrderToken('Imaging the plane')]: 'Imaging the Transthalamic Plane',
  [normalizeOrderToken('Imaging the Plane')]: 'Imaging the Transthalamic Plane',
  [normalizeOrderToken('Finding the Fetal Presentation')]: 'Imaging the Transthalamic Plane',
  [normalizeOrderToken('Finding the fetal presentation')]: 'Imaging the Transthalamic Plane',
  [normalizeOrderToken('How to acquire the transthalamic plane')]: 'Imaging the Transthalamic Plane',
  [normalizeOrderToken('How To Acquire The Transthalamic Plane')]: 'Imaging the Transthalamic Plane',
  [normalizeOrderToken('Interaction - Fetal Head Scanning Activity')]: 'Imaging the Transthalamic Plane',
  [normalizeOrderToken('Mind Sparks - Probe Movements')]: 'Imaging the Transthalamic Plane',
  [normalizeOrderToken('Mind Sparks - Probe movements')]: 'Imaging the Transthalamic Plane',
  [normalizeOrderToken('MindSparks - Probe movements')]: 'Imaging the Transthalamic Plane',
  [normalizeOrderToken('How to Measure BPD')]: 'Measurement',
  [normalizeOrderToken('How To Measure BPD')]: 'Measurement',
  [normalizeOrderToken('How to measure BPD')]: 'Measurement',
  [normalizeOrderToken('How to Measure HC')]: 'Measurement',
  [normalizeOrderToken('How To Measure HC')]: 'Measurement',
  [normalizeOrderToken('How to measure HC')]: 'Measurement',
  [normalizeOrderToken('Plane Acquisition Challenges & Common Errors')]: 'Pitfalls in Plane Acquisition and Measurement',
  [normalizeOrderToken('Plane Acquisition Challenges and Common Errors')]: 'Pitfalls in Plane Acquisition and Measurement',
  [normalizeOrderToken('Plane Acquisition Challenges and Common Measurement Errors')]: 'Pitfalls in Plane Acquisition and Measurement',
  [normalizeOrderToken('Plane Acquisition Challenges')]: 'Pitfalls in Plane Acquisition and Measurement',
  [normalizeOrderToken('Common Measurement Errors')]: 'Pitfalls in Plane Acquisition and Measurement',
  [normalizeOrderToken('MindSparks - Picture Pick')]: 'Pitfalls in Plane Acquisition and Measurement',
  [normalizeOrderToken('Mind Sparks - Picture Pick')]: 'Pitfalls in Plane Acquisition and Measurement',
  [normalizeOrderToken('Image Diagnosis')]: 'Image Diagnosis',
  [normalizeOrderToken('Percentile Charts & Significance')]: 'Image Diagnosis',
  [normalizeOrderToken('Percentile Charts  & Significance')]: 'Image Diagnosis',
  [normalizeOrderToken('Percentile Chart & Significance')]: 'Image Diagnosis',
  [normalizeOrderToken('BPD Chart')]: 'Image Diagnosis',
  [normalizeOrderToken('HC Chart')]: 'Image Diagnosis',
  [normalizeOrderToken('Mind Sparks - Chart Interpretation')]: 'Image Diagnosis',
  [normalizeOrderToken('MindSparks - Yes/No')]: 'Image Diagnosis',
  [normalizeOrderToken('Image Selection')]: 'OB Boosters',
  [normalizeOrderToken('Picture Pick')]: 'OB Boosters',
  [normalizeOrderToken('Visual Recognition')]: 'OB Boosters',
  [normalizeOrderToken('True / False')]: 'OB Boosters',
  [normalizeOrderToken('True/False')]: 'OB Boosters',
  [normalizeOrderToken('Wordsearch')]: 'OB Boosters',
  [normalizeOrderToken('Word Search')]: 'OB Boosters',
};

const AC_TOPIC_BY_RESOURCE = {
  [normalizeOrderToken('AC Introduction')]: 'Fetal Abdomen',
  [normalizeOrderToken('Transabdominal plane')]: 'Fetal Abdomen',
  [normalizeOrderToken('Abdominal circumference')]: 'Fetal Abdomen',
  [normalizeOrderToken('Transabdominal plane & Abdominal circumference')]: 'Fetal Abdomen',
  [normalizeOrderToken('Significance')]: 'Fetal Abdomen',
  [normalizeOrderToken('Anatomical landmarks')]: 'Anatomical Landmarks',
  [normalizeOrderToken('Anatomical landmarks of the transabdominal plane')]: 'Anatomical Landmarks',
  [normalizeOrderToken('Anatomical Landmarks of the Transabdominal Plane')]: 'Anatomical Landmarks',
  [normalizeOrderToken('Mind Sparks - Geometric landmarks')]: 'Anatomical Landmarks',
  [normalizeOrderToken('Geometric shapes of key landmarks and their significance')]: 'Anatomical Landmarks',
  [normalizeOrderToken('Mind Sparks - Anatomical Landmarks')]: 'Anatomical Landmarks',
  [normalizeOrderToken('MindSparks - Quiz')]: 'Anatomical Landmarks',
  [normalizeOrderToken('Imaging the plane')]: 'Imaging the Plane',
  [normalizeOrderToken('Imaging the Plane')]: 'Imaging the Plane',
  [normalizeOrderToken('How to acquire the transabdominal plane')]: 'Imaging the Plane',
  [normalizeOrderToken('Cephalic Presentation')]: 'Imaging the Plane',
  [normalizeOrderToken('Breech Presentation')]: 'Imaging the Plane',
  [normalizeOrderToken('Mind Sparks - Probe movements')]: 'Imaging the Plane',
  [normalizeOrderToken('MindSparks - Probe movements')]: 'Imaging the Plane',
  [normalizeOrderToken('Measurement')]: 'Measurement',
  [normalizeOrderToken('Measurements')]: 'Measurement',
  [normalizeOrderToken('How to measure AC')]: 'Measurement',
  [normalizeOrderToken('Ellipse method')]: 'Measurement',
  [normalizeOrderToken('Two-diameter method')]: 'Measurement',
  [normalizeOrderToken('Interaction - Landmark placement and measurement')]: 'Measurement',
  [normalizeOrderToken('Interaction - Plane orientation and measurement')]: 'Measurement',
  [normalizeOrderToken('Plane Acquisition Challenges and Common Errors')]: 'Pitfalls in Plane Acquisition and Measurement',
  [normalizeOrderToken('Plane Acquisition Challenges and Common Measurement Errors')]: 'Pitfalls in Plane Acquisition and Measurement',
  [normalizeOrderToken('Plane Acquisition Challenges')]: 'Pitfalls in Plane Acquisition and Measurement',
  [normalizeOrderToken('Common Measurement Errors')]: 'Pitfalls in Plane Acquisition and Measurement',
  [normalizeOrderToken('Image Diagnosis')]: 'Image Diagnosis',
  [normalizeOrderToken('AC chart')]: 'Image Diagnosis',
  [normalizeOrderToken('AC Chart')]: 'Image Diagnosis',
  [normalizeOrderToken('Mind Sparks - Chart Interpretation')]: 'Image Diagnosis',
  [normalizeOrderToken('MindSparks - True/False')]: 'Image Diagnosis',
  [normalizeOrderToken('ALM - Crossword')]: 'OB Boosters',
  [normalizeOrderToken('Crossword puzzle')]: 'OB Boosters',
  [normalizeOrderToken('True/False')]: 'OB Boosters',
  [normalizeOrderToken('Picture Pick')]: 'OB Boosters',
};

const getTopicOrder = (unitName, topic) => {
  const normalizedUnitName = normalizeOrderToken(unitName);
  const normalizedTopic = normalizeOrderToken(topic);
  const unitTopicOrder = NORMALIZED_UNIT_TOPIC_ORDER[normalizedUnitName];

  if (unitTopicOrder && unitTopicOrder[normalizedTopic] !== undefined) {
    return unitTopicOrder[normalizedTopic];
  }

  return TOPIC_ORDER[normalizedTopic] ?? 99;
};

const getAcResourceOrder = (resourceTopic, resourceName) => {
  const normalizedTopic = normalizeOrderToken(resourceTopic);
  const normalizedName = normalizeOrderToken(resourceName);

  const isAny = (...values) => values.some(value => normalizedName === normalizeOrderToken(value));
  const isTopic = (...values) => values.some(value => normalizedTopic === normalizeOrderToken(value));

  if (isTopic('Fetal Abdomen', 'Fetal abdomen', 'AC - Fetal Abdomen')) {
    if (isAny('AC Introduction')) return 1;
    if (isAny('Transabdominal plane', 'Abdominal circumference', 'Transabdominal plane & Abdominal circumference')) return 2;
    if (isAny('Significance')) return 3;
  }

  if (isTopic('Anatomical Landmarks', 'Anatomical landmarks')) {
    if (isAny('Anatomical landmarks', 'Anatomical landmarks of the transabdominal plane', 'Anatomical Landmarks of the Transabdominal Plane', 'Mind Sparks - Geometric landmarks', 'Geometric shapes of key landmarks and their significance')) return 1;
    if (isAny('MindSparks - Quiz', 'Mind Sparks - Anatomical Landmarks')) return 2;
  }

  if (isTopic('Imaging the Plane', 'Imaging the plane', 'Imaging the transabdominal plane')) {
    if (isAny('Imaging the plane', 'Imaging the Plane', 'How to acquire the transabdominal plane')) return 1;
    if (isAny('MindSparks - Probe movements', 'Mind Sparks - Probe movements')) return 2;
  }

  if (isTopic('Measurement', 'Measurements')) {
    if (isAny('Measurement', 'Measurements', 'How to measure AC', 'Ellipse method', 'Two-diameter method')) return 1;
    if (isAny('Interaction - Plane orientation and measurement', 'Interaction - Landmark placement and measurement')) return 2;
    if (isAny('MindSparks - Picture Pick', 'Mind Sparks - Picture Pick')) return 3;
  }

  if (isTopic('Pitfalls in Plane Acquisition and Measurement', 'Plane Acquisition Challenges and Common Errors', 'Plane Acquisition Challenges and Common Measurement Errors', 'Pitfalls', 'Pit Falls')) {
    if (isAny('Plane Acquisition Challenges and Common Errors', 'Plane Acquisition Challenges and Common Measurement Errors', 'Plane Acquisition Challenges', 'Common Measurement Errors')) return 1;
    if (isAny('MindSparks - Picture Pick', 'Mind Sparks - Picture Pick')) return 2;
  }

  if (isTopic('Image Diagnosis', 'Image diagnosis')) {
    if (isAny('AC chart', 'AC Chart', 'Image Diagnosis')) return 1;
    if (isAny('MindSparks - True/False', 'Mind Sparks - Chart Interpretation')) return 2;
  }

  if (isTopic('OB Boosters')) {
    if (isAny('Crossword puzzle', 'ALM - Crossword')) return 1;
    if (isAny('True/False')) return 2;
    if (isAny('Picture Pick')) return 3;
  }

  return undefined;
};

const getResourceOrder = (unit_name, resource_topic, resource_name) =>
  (isAcOrderScope(unit_name) ? getAcResourceOrder(resource_topic, resource_name) : undefined) ??
  RESOURCE_ORDER_BY_TOPIC[makeResourceOrderKey(unit_name, resource_topic, resource_name)] ??
  RESOURCE_ORDER[`${unit_name}::${resource_name}`] ??
  99;

const isBpdHcOrderScope = (unitName = '') => {
  const token = normalizeOrderToken(unitName);
  return token === normalizeOrderToken('BPD & HC') || (token.includes('bpd') && token.includes('hc'));
};

const isAcOrderScope = (unitName = '') => normalizeOrderToken(unitName).startsWith(normalizeOrderToken('AC'));
const isPrinciplesOfUltrasoundOrderScope = (unitName = '') =>
  normalizeOrderToken(unitName) === normalizeOrderToken('Principles of ultrasound');
const isProbeMovementsOrderScope = (unitName = '') =>
  normalizeOrderToken(unitName) === normalizeOrderToken('Probe Movements');
const isKnobologyOrderScope = (unitName = '') =>
  normalizeOrderToken(unitName) === normalizeOrderToken('Knobology');

const isMappedOrderScope = (unitName = '') => {
  return isBpdHcOrderScope(unitName) || isAcOrderScope(unitName) || isProbeMovementsOrderScope(unitName) || isKnobologyOrderScope(unitName);
};

const KNOBLOGY_TOPIC_BY_RESOURCE = {
  [normalizeOrderToken('Ultrasound machine')]: 'Overview of ultrasound machine',
  [normalizeOrderToken('Interaction - Ultrasound Machine Interaction')]: 'Function of the Knobs',
  [normalizeOrderToken('Mindsparks - Quiz')]: 'Function of the Knobs',
  [normalizeOrderToken('Mind Sparks - US Machine - Quiz')]: 'Function of the Knobs',
  [normalizeOrderToken('Functions of knobs')]: 'Function of the Knobs',
  [normalizeOrderToken('Function of knobs')]: 'Function of the Knobs',
  [normalizeOrderToken('Mindsparks - Drag & Drop')]: 'Function of the Knobs',
  [normalizeOrderToken('Interaction - Knobology Interaction Activity')]: 'Function of the Knobs',
  [normalizeOrderToken('Imaging Modes')]: 'Imaging Modes',
  [normalizeOrderToken('Imaging modes')]: 'Imaging Modes',
  [normalizeOrderToken('Mindsparks - True/False')]: 'Imaging Modes',
  [normalizeOrderToken('MindSparks - Imaging Modes - True / False')]: 'Imaging Modes',
  [normalizeOrderToken('Echo Dose - Match')]: 'Echo Dose',
  [normalizeOrderToken('Knobs - Match')]: 'Echo Dose',
  [normalizeOrderToken('Echo Dose - Crossword')]: 'Echo Dose',
  [normalizeOrderToken('Knobs & Machine - Crossword Puzzle')]: 'Echo Dose',
};

const KNOBLOGY_RESOURCE_BY_ALIAS = {
  [normalizeOrderToken('Mindsparks - Quiz')]: 'Mind Sparks - US Machine - Quiz',
  [normalizeOrderToken('Functions of knobs')]: 'Function of knobs',
  [normalizeOrderToken('Mindsparks - Drag & Drop')]: 'Interaction - Knobology Interaction Activity',
  [normalizeOrderToken('Imaging Modes')]: 'Imaging modes',
  [normalizeOrderToken('Mindsparks - True/False')]: 'MindSparks - Imaging Modes - True / False',
  [normalizeOrderToken('Echo Dose - Match')]: 'Knobs - Match',
  [normalizeOrderToken('Echo Dose - Crossword')]: 'Knobs & Machine - Crossword Puzzle',
};

const PRINCIPLES_OF_ULTRASOUND_TOPIC_BY_ALIAS = {
  [normalizeOrderToken('Interaction')]: 'Interaction of ultrasound waves',
  [normalizeOrderToken('Interaction - ultrasound waves')]: 'Interaction of ultrasound waves',
};

const PRINCIPLES_OF_ULTRASOUND_RESOURCE_BY_ALIAS = {
  [normalizeOrderToken('Interaction')]: 'Interaction of ultrasound waves',
  [normalizeOrderToken('Interaction - ultrasound waves')]: 'Interaction of ultrasound waves',
};

const PROBE_MOVEMENTS_TOPIC_BY_RESOURCE = {
  [normalizeOrderToken('Anatomy planes')]: 'Anatomy planes',
  [normalizeOrderToken('Anatomy Plane')]: 'Anatomy planes',
  [normalizeOrderToken('Mindsparks - Anatomical Plane - Quiz')]: 'Anatomy planes',
  [normalizeOrderToken('Mind Sparks - Anatomical Plane - Quiz')]: 'Anatomy planes',
  [normalizeOrderToken('Mindsparks - Drag & Drop')]: 'Anatomy planes',

  [normalizeOrderToken('Types of probe')]: 'Types of probe',
  [normalizeOrderToken('Types of Probe')]: 'Types of probe',
  [normalizeOrderToken('Interaction - Probe Selection')]: 'Types of probe',
  [normalizeOrderToken('Mind Sparks - Quiz')]: 'Types of probe',
  [normalizeOrderToken('Mindsparks - Quiz')]: 'Types of probe',

  [normalizeOrderToken('Probe Orientation')]: 'Probe orientation',
  [normalizeOrderToken('Probe orientation')]: 'Probe orientation',
  [normalizeOrderToken('Mind Sparks - Picture Pick')]: 'Probe orientation',
  [normalizeOrderToken('Mindsparks - Picture Pick')]: 'Probe orientation',

  [normalizeOrderToken('Probe Movements')]: 'Probe movements',
  [normalizeOrderToken('Probe movements')]: 'Probe movements',
  [normalizeOrderToken('Mindsparks - Probe Movements')]: 'Probe movements',
  [normalizeOrderToken('Mindsparks - probe movements')]: 'Probe movements',
  [normalizeOrderToken('Mindsparks - Probe movements')]: 'Probe movements',
  [normalizeOrderToken('Mind Sparks - Probe Movements')]: 'Probe movements',

  [normalizeOrderToken('Drag & drop')]: 'Echo Dose',
  [normalizeOrderToken('Drag & Drop')]: 'Echo Dose',
  [normalizeOrderToken('Drag & Drop - Directional terms')]: 'Echo Dose',
  [normalizeOrderToken('True/False')]: 'Echo Dose',
  [normalizeOrderToken('True / False')]: 'Echo Dose',
  [normalizeOrderToken('True or False - Probe Orientation')]: 'Echo Dose',
  [normalizeOrderToken('Probe movements - Real-time')]: 'Echo Dose',
};

const PROBE_MOVEMENTS_RESOURCE_BY_ALIAS = {
  [normalizeOrderToken('Anatomy planes')]: 'Anatomy Plane',
  [normalizeOrderToken('Anatomy Plane')]: 'Anatomy Plane',
  [normalizeOrderToken('Mindsparks - Drag & Drop')]: 'Mind Sparks - Anatomical Plane - Quiz',
  [normalizeOrderToken('Mindsparks - Anatomical Plane - Quiz')]: 'Mind Sparks - Anatomical Plane - Quiz',
  [normalizeOrderToken('Mind Sparks - Anatomical Plane - Quiz')]: 'Mind Sparks - Anatomical Plane - Quiz',

  [normalizeOrderToken('Types of probe')]: 'Types of probe',
  [normalizeOrderToken('Types of Probe')]: 'Types of probe',
  [normalizeOrderToken('Interaction - Probe Selection')]: 'Interaction - Probe Selection',
  [normalizeOrderToken('Mindsparks - Quiz')]: 'Mind Sparks - Quiz',
  [normalizeOrderToken('Mind Sparks - Quiz')]: 'Mind Sparks - Quiz',

  [normalizeOrderToken('Probe Orientation')]: 'Probe Orientation',
  [normalizeOrderToken('Probe orientation')]: 'Probe Orientation',
  [normalizeOrderToken('Mindsparks - Picture Pick')]: 'Mind Sparks - Picture Pick',
  [normalizeOrderToken('Mind Sparks - Picture Pick')]: 'Mind Sparks - Picture Pick',

  [normalizeOrderToken('Mindsparks - Probe movements')]: 'Mindsparks - probe movements',
  [normalizeOrderToken('Mindsparks - Probe Movements')]: 'Mindsparks - probe movements',
  [normalizeOrderToken('Mindsparks - probe movements')]: 'Mindsparks - probe movements',
  [normalizeOrderToken('Mind Sparks - Probe Movements')]: 'Mindsparks - probe movements',

  [normalizeOrderToken('Drag & Drop - Directional terms')]: 'Drag & drop',
  [normalizeOrderToken('Drag & Drop')]: 'Drag & drop',
  [normalizeOrderToken('Drag & drop')]: 'Drag & drop',
  [normalizeOrderToken('True or False - Probe Orientation')]: 'True/False',
  [normalizeOrderToken('True / False')]: 'True/False',
  [normalizeOrderToken('True/False')]: 'True/False',
  [normalizeOrderToken('Probe movements - Real-time')]: 'Probe movements',
};

const getDisplayResourceName = (unitName, resourceName, resourceTopic = '') => {
  if (isPrinciplesOfUltrasoundOrderScope(unitName)) {
    return PRINCIPLES_OF_ULTRASOUND_RESOURCE_BY_ALIAS[normalizeOrderToken(resourceName)] || resourceName;
  }

  if (isKnobologyOrderScope(unitName)) {
    return KNOBLOGY_RESOURCE_BY_ALIAS[normalizeOrderToken(resourceName)] || resourceName;
  }

  if (isProbeMovementsOrderScope(unitName)) {
    const resourceToken = normalizeOrderToken(resourceName);
    if (resourceToken === normalizeOrderToken('Probe Movements')) {
      return normalizeOrderToken(resourceTopic) === normalizeOrderToken('Echo Dose')
        ? 'Probe movements'
        : 'Probe Movements';
    }

    return PROBE_MOVEMENTS_RESOURCE_BY_ALIAS[resourceToken] || resourceName;
  }

  return resourceName;
};

const getDisplayResourceTopic = (unitName, resourceTopic, resourceName) => {
  if (isPrinciplesOfUltrasoundOrderScope(unitName)) {
    return (
      PRINCIPLES_OF_ULTRASOUND_TOPIC_BY_ALIAS[normalizeOrderToken(resourceTopic)] ||
      PRINCIPLES_OF_ULTRASOUND_TOPIC_BY_ALIAS[normalizeOrderToken(resourceName)] ||
      resourceTopic
    );
  }

  if (isKnobologyOrderScope(unitName)) {
    return KNOBLOGY_TOPIC_BY_RESOURCE[normalizeOrderToken(resourceName)] || resourceTopic;
  }

  if (isAcOrderScope(unitName)) {
    const resourceToken = normalizeOrderToken(resourceName);
    const topicToken = normalizeOrderToken(resourceTopic);

    if (
      resourceToken === normalizeOrderToken('MindSparks - Picture Pick') ||
      resourceToken === normalizeOrderToken('Mind Sparks - Picture Pick')
    ) {
      return topicToken.includes('pitfall') || topicToken.includes('planeacquisition')
        ? 'Pitfalls in Plane Acquisition and Measurement'
        : 'Measurement';
    }

    return AC_TOPIC_BY_RESOURCE[resourceToken] || resourceTopic;
  }

  if (isProbeMovementsOrderScope(unitName)) {
    const resourceToken = normalizeOrderToken(resourceName);
    if (
      resourceToken === normalizeOrderToken('Probe Movements') &&
      normalizeOrderToken(resourceTopic) === normalizeOrderToken('Echo Dose')
    ) {
      return 'Echo Dose';
    }

    return PROBE_MOVEMENTS_TOPIC_BY_RESOURCE[resourceToken] || resourceTopic;
  }

  if (!isBpdHcOrderScope(unitName)) {
    return resourceTopic;
  }

  return BPD_HC_TOPIC_BY_RESOURCE[normalizeOrderToken(resourceName)] || resourceTopic;
};

const COURSE_ORDER_BY_CERTIFICATE = {
  [normalizeOrderToken('UFC')]: {
    [normalizeOrderToken('Principles of Ultrasound')]: 1,
    [normalizeOrderToken('Probe Movements')]: 2,
    [normalizeOrderToken('Knobology')]: 3,
    [normalizeOrderToken('Morphology')]: 4,
  },
  [normalizeOrderToken('24d9e2c4-42b0-4133-b801-d8cace4600f5')]: {
    [normalizeOrderToken('Principles of Ultrasound')]: 1,
    [normalizeOrderToken('Probe Movements')]: 2,
    [normalizeOrderToken('Knobology')]: 3,
    [normalizeOrderToken('Morphology')]: 4,
  },
};

const sortCoursesForCertificate = (certificate, courses) => {
  const orderMap =
    COURSE_ORDER_BY_CERTIFICATE[normalizeOrderToken(certificate.certificate_id)] ||
    COURSE_ORDER_BY_CERTIFICATE[normalizeOrderToken(certificate.certificate_name)];

  if (!orderMap) {
    return courses;
  }

  return courses
    .map((course, index) => ({ course, index }))
    .sort((a, b) => {
      const aOrder = orderMap[normalizeOrderToken(a.course.course_name)] ?? Number.MAX_SAFE_INTEGER;
      const bOrder = orderMap[normalizeOrderToken(b.course.course_name)] ?? Number.MAX_SAFE_INTEGER;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return a.index - b.index;
    })
    .map(({ course }) => course);
};

const buildCertificateTree = (rows) => {
  const certMap = {};

  for (const row of rows) {
    const {
      certificate_id, certificate_name,
      course_name, module_name, unit_name,
      resource_type, resource_topic, resource_name, resource_id, display_order, is_completed, reattempt_count, max_reattempt_count
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

    const unitLabel = unit_name || course_name;
    const displayResourceName = getDisplayResourceName(unitLabel, resource_name, resource_topic);
    const leaf = { resource_id, resource_name: displayResourceName, display_order, is_completed: is_completed ?? false };
    const displayResourceTopic = getDisplayResourceTopic(unitLabel, resource_topic, resource_name);

    if (resource_type === 'Learning Resource') {
      if (!unit.learning_resources.items[displayResourceTopic]) {
        unit.learning_resources.items[displayResourceTopic] = { resource_topic: displayResourceTopic, resources: [] };
      }

      const existingLeaf = unit.learning_resources.items[displayResourceTopic].resources.find(resource =>
        normalizeOrderToken(resource.resource_name) === normalizeOrderToken(leaf.resource_name)
      );

      if (existingLeaf) {
        if (!existingLeaf.is_completed && is_completed) {
          unit.learning_resources.completed += 1;
        }
        existingLeaf.is_completed = existingLeaf.is_completed || (is_completed ?? false);
        existingLeaf.display_order = Math.min(
          Number.isFinite(Number(existingLeaf.display_order)) ? Number(existingLeaf.display_order) : 99,
          Number.isFinite(Number(display_order)) ? Number(display_order) : 99
        );
        continue;
      }

      unit.learning_resources.total += 1;
      if (is_completed) unit.learning_resources.completed += 1;
      unit.learning_resources.items[displayResourceTopic].resources.push(leaf);

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
      unit.tests.push({
        ...leaf,
        reattempt_count: Number(reattempt_count ?? 0),
        max_reattempt_count: Number(max_reattempt_count ?? 0),
      });
    }
  }

  return Object.values(certMap).map(cert => {
    const courses = Object.values(cert.courses).map(course => ({
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
                .sort((a, b) => {
                  const orderScope = unit.unit_name || course.course_name;
                  const aOrder = Math.min(...a.resources.map(resource => Number(resource.display_order)).filter(Number.isFinite));
                  const bOrder = Math.min(...b.resources.map(resource => Number(resource.display_order)).filter(Number.isFinite));

                  if (!isMappedOrderScope(orderScope) && Number.isFinite(aOrder) && Number.isFinite(bOrder) && aOrder !== bOrder) {
                    return aOrder - bOrder;
                  }

                  return getTopicOrder(orderScope, a.resource_topic) - getTopicOrder(orderScope, b.resource_topic);
                })
                .map(topicGroup => ({
                  ...topicGroup,
                  resources: [...topicGroup.resources]
                    .sort((a, b) => {
                      const aDisplayOrder = Number(a.display_order);
                      const bDisplayOrder = Number(b.display_order);
                      const orderScope = unit.unit_name || course.course_name;

                      if (!isMappedOrderScope(orderScope) && Number.isFinite(aDisplayOrder) && Number.isFinite(bDisplayOrder) && aDisplayOrder !== bDisplayOrder) {
                        return aDisplayOrder - bDisplayOrder;
                      }

                      return getResourceOrder(orderScope, topicGroup.resource_topic, a.resource_name) - getResourceOrder(orderScope, topicGroup.resource_topic, b.resource_name);
                    }),
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
    }));

    return {
      ...cert,
      courses: sortCoursesForCertificate(cert, courses),
    };
  });
};

//pakka va work agudhu
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

//new version 1
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
//           SELECT pd.resourse_id, pd.user_id, pd.is_completed, pd.updated_at
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
//           up.user_id AS progress_user_id,
//           up.is_completed,
//           up.updated_at
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

//       const vrProgressQuery = `
//         SELECT 
//           pd.user_id,
//           pd.resourse_id,
//           pd.is_completed,
//           pd.updated_at,
//           rd.resource_name,
//           rd.resource_type,
//           rd.resource_topic,
//           rd.learning_module_id,
//           rd.created_at AS resource_created_at
//         FROM progress_data pd
//         LEFT JOIN resource_data rd ON pd.resourse_id = rd.resource_id
//         WHERE pd.user_id = (
//           SELECT user_email 
//           FROM user_data 
//           WHERE people_id = $1
//         )
//         ORDER BY pd.updated_at DESC
//         LIMIT 1;
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
//         new Promise((res, rej) =>
//           client.query(vrProgressQuery, [people_id], (err, result) =>
//             err ? rej(err) : res(result.rows)
//           )
//         ),
//       ])
//         .then(([batchData, rawCertData, vrProgressData]) => {
//           const certificates = buildCertificateTree(rawCertData);
//           resolve({
//             status: 'Success',
//             code: 200,
//             currentBatches: batchData,
//             certificates: certificates,
//             latestProgress: vrProgressData[0] || null,
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
//         pdt.user_id AS progress_user_id,
//         pdt.is_completed,
//         pdt.updated_at
//       FROM user_info ui
//       CROSS JOIN learning_module lm
//       LEFT JOIN resource_data rd ON lm.learning_module_id = rd.learning_module_id
//       LEFT JOIN pdt ON pdt.rid = rd.resource_id
//       ORDER BY pdt.updated_at DESC;
//     `;

//     const lmsProgressQuery = `
//       SELECT 
//         pd.user_id,
//         pd.resourse_id,
//         pd.is_completed,
//         pd.updated_at,
//         rd.resource_name,
//         rd.resource_type,
//         rd.resource_topic,
//         rd.learning_module_id,
//         rd.created_at AS resource_created_at
//       FROM progress_data pd
//       LEFT JOIN resource_data rd ON pd.resourse_id = rd.resource_id
//       WHERE pd.user_id = (
//         SELECT user_email 
//         FROM user_data 
//         WHERE people_id = $1
//       )
//       ORDER BY pd.updated_at DESC
//       LIMIT 1;
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
//         client.query(lmsProgressQuery, [people_id], (err, result) =>
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
//       .then(([progressData, lmsProgressData, instructorData, testData, reAttemptsData, moduleCompletion]) => {
//         const currentBatches = instructorData.filter(b => b.batch_status === 'current');
//         const completedBatches = instructorData.filter(b => b.batch_status === 'completed');

//         resolve({
//           status: 'Success',
//           code: 200,
//           data: progressData,
//           latestProgress: lmsProgressData[0] || null,
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

//new version 2 
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
          SELECT pd.resourse_id, pd.user_id, pd.is_completed, pd.updated_at
          FROM progress_data pd
          WHERE pd.user_id IN (SELECT user_email FROM user_info)
        ),
        test_reattempts AS (
          SELECT t.r_id AS resource_id, COUNT(*)::int AS reattempt_count
          FROM test_attempts_logs t
          WHERE t.user_id IN (SELECT user_email FROM user_info)
          GROUP BY t.r_id
        ),
        reatt_config AS (
          SELECT DISTINCT ON (resource_id)
            certificate_id,
            course_id,
            unit_name,
            resource_type,
            resource_id,
            max_reattempt_count
          FROM reatt_data
          WHERE resource_type IS NULL OR resource_type = 'Test'
          ORDER BY resource_id, created_at DESC
        )
        SELECT
          ac.certificate_id,
          ac.certificate_name,
          lm.learning_module_id,
          lm.course_name,
          lm.module_name,
          lm.unit_name,
          rd.resource_id,
          rd.resource_name,
          rd.resource_type,
          rd.resource_topic,
          rd.display_order,
          COALESCE((to_jsonb(rd)->>'is_hidden')::boolean, false) AS is_hidden,
          up.user_id AS progress_user_id,
          up.is_completed,
          up.updated_at,
          COALESCE(tr.reattempt_count, 0) AS reattempt_count,
          COALESCE(NULLIF(rc.max_reattempt_count::text, '')::int, 0) AS max_reattempt_count
        FROM active_certificates ac
        JOIN learning_module lm ON lm.certificate_id = ac.certificate_id
        JOIN resource_data rd
          ON rd.learning_module_id = lm.learning_module_id
         AND COALESCE((to_jsonb(rd)->>'is_hidden')::boolean, false) IS NOT TRUE
        LEFT JOIN user_progress up ON up.resourse_id = rd.resource_id
        LEFT JOIN test_reattempts tr ON tr.resource_id = rd.resource_id
        LEFT JOIN reatt_config rc
          ON rc.resource_id = rd.resource_id
          AND (rc.certificate_id IS NULL OR rc.certificate_id = ac.certificate_id)
          AND (rc.course_id IS NULL OR rc.course_id = lm.learning_module_id)
          AND (rc.unit_name IS NULL OR rc.unit_name = lm.unit_name)
          AND (rc.resource_type IS NULL OR rc.resource_type = rd.resource_type)
        ORDER BY
          ac.certificate_name,
          lm.course_name,
          lm.module_name,
          lm.unit_name,
          rd.resource_type,
          rd.display_order ASC NULLS LAST,
          rd.created_at ASC,
          rd.resource_topic,
          rd.resource_name;
      `;

      const vrProgressQuery = `
        SELECT 
          pd.user_id,
          pd.resourse_id,
          pd.is_completed,
          pd.updated_at,
          rd.resource_name,
          rd.resource_type,
          rd.resource_topic,
          rd.learning_module_id,
          rd.created_at AS resource_created_at
        FROM progress_data pd
        LEFT JOIN resource_data rd
          ON pd.resourse_id = rd.resource_id
         AND COALESCE((to_jsonb(rd)->>'is_hidden')::boolean, false) IS NOT TRUE
        WHERE pd.user_id = (
          SELECT user_email 
          FROM user_data 
          WHERE people_id = $1
        )
        ORDER BY pd.updated_at DESC
        LIMIT 1;
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
        new Promise((res, rej) =>
          client.query(vrProgressQuery, [people_id], (err, result) =>
            err ? rej(err) : res(result.rows)
          )
        ),
      ])
        .then(([batchData, rawCertData, vrProgressData]) => {
          const certificates = buildCertificateTree(rawCertData);
          resolve({
            status: 'Success',
            code: 200,
            currentBatches: batchData,
            certificates: certificates,
            latestProgress: vrProgressData[0] || null,
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
        rd.resource_id, rd.resource_name, rd.resource_type, rd.resource_topic, rd.display_order,
        COALESCE((to_jsonb(rd)->>'is_hidden')::boolean, false) AS is_hidden,
        pdt.user_id AS progress_user_id,
        pdt.is_completed,
        pdt.updated_at
      FROM user_info ui
      CROSS JOIN learning_module lm
      LEFT JOIN resource_data rd
        ON lm.learning_module_id = rd.learning_module_id
       AND COALESCE((to_jsonb(rd)->>'is_hidden')::boolean, false) IS NOT TRUE
      LEFT JOIN pdt ON pdt.rid = rd.resource_id
      ORDER BY
        lm.course_name,
        lm.module_name,
        lm.unit_name,
        rd.resource_type,
        rd.display_order ASC NULLS LAST,
        rd.created_at ASC,
        rd.resource_topic,
        rd.resource_name;
    `;

    const lmsProgressQuery = `
      SELECT 
        pd.user_id,
        pd.resourse_id,
        pd.is_completed,
        pd.updated_at,
        rd.resource_id,
        rd.resource_name,
        rd.resource_type,
        rd.resource_topic,
        rd.learning_module_id,
        rd.created_at AS resource_created_at,
        lm.module_name,
        lm.unit_name,
        lm.course_name,
        lm.certificate_id,
        cd.certificate_name
      FROM progress_data pd
      LEFT JOIN resource_data rd
        ON pd.resourse_id = rd.resource_id
       AND COALESCE((to_jsonb(rd)->>'is_hidden')::boolean, false) IS NOT TRUE
      LEFT JOIN learning_module lm ON rd.learning_module_id = lm.learning_module_id
      LEFT JOIN certification_data cd ON lm.certificate_id = cd.certificate_id
      WHERE pd.user_id = (
        SELECT user_email 
        FROM user_data 
        WHERE people_id = $1
      )
      AND pd.is_completed = TRUE
      AND COALESCE((to_jsonb(rd)->>'is_hidden')::boolean, false) IS NOT TRUE
      ORDER BY pd.updated_at DESC NULLS LAST, rd.created_at DESC NULLS LAST
      LIMIT 1;
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
      LEFT JOIN resource_data rd
        ON lm.learning_module_id = rd.learning_module_id
       AND COALESCE((to_jsonb(rd)->>'is_hidden')::boolean, false) IS NOT TRUE
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
        client.query(lmsProgressQuery, [people_id], (err, result) =>
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
      .then(([progressData, lmsProgressData, instructorData, testData, reAttemptsData, moduleCompletion]) => {
        const currentBatches = instructorData.filter(b => b.batch_status === 'current');
        const completedBatches = instructorData.filter(b => b.batch_status === 'completed');

        const nextModule = [...moduleCompletion]
          .sort((a, b) => (UNIT_ORDER[a.unit_name] ?? 99) - (UNIT_ORDER[b.unit_name] ?? 99))
          .find(m =>
            Number(m.completed_learning_resources) < Number(m.total_learning_resources) ||
            Number(m.completed_image_interpretations) < Number(m.total_image_interpretations)
          ) || null;

        resolve({
          status: 'Success',
          code: 200,
          data: progressData,
          latestProgress: lmsProgressData[0] || null,
          currentBatches: currentBatches,
          completedBatches: completedBatches,
          testQuery: testData,
          reAttempts: reAttemptsData,
          moduleCompletion: moduleCompletion,
          nextModule: nextModule,
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
          const isSuperAdmin = Number(requester.role) === 99;
          if (!isSuperAdmin && !hasCenterScope(requester)) {
              return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'Your account is not linked to a scan center.'
              })
          }
          const batchIdArray = Array.isArray(batch_id) 
              ? batch_id 
              : [batch_id];

          const query = isSuperAdmin
              ? `UPDATE batch_people_data SET batch_id = $1 WHERE user_id = $2`
              : `UPDATE batch_people_data
                 SET batch_id = $1
                 WHERE user_id = $2
                 AND EXISTS (
                     SELECT 1 FROM public.user_data
                     WHERE user_email = $2 AND user_role = '103' AND centre_id = $3
                 )`;
          const params = isSuperAdmin ? [batchIdArray, user_id] : [batchIdArray, user_id, requester.centre_id];

          client.query(
              query,
              params,
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
                                message: result.rowCount === 0 ? 'No trainee found for this scan center' : 'Trainee batch updated successfully',
                                affectedRows: result.rowCount
                          });
                    } 
              }
          );
    })
}
module.exports = {traineem, getTraineesm, disableTraineem, deleteTraineem, indData, indDatauuid, updateTraineem};
