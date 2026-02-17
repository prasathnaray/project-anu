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

    // VR login: only batch and certificate data
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

      const vrCertificateQuery = `
        SELECT DISTINCT
          cd.certificate_id,
          cd.certificate_name,
          lm.course_name
        FROM user_data ud
        JOIN batch_people_data bpd ON bpd.user_id = ud.user_email
        JOIN batch_data bd ON bd.batch_id = ANY(bpd.batch_id)
        JOIN learning_module lm ON lm.certificate_id IS NOT NULL
        JOIN certification_data cd ON cd.certificate_id = lm.certificate_id
        WHERE ud.people_id = $1;
      `;

      Promise.all([
        new Promise((res, rej) =>
          client.query(vrBatchQuery, [people_id], (err, result) =>
            err ? rej(err) : res(result.rows)
          )
        ),
        new Promise((res, rej) =>
          client.query(vrCertificateQuery, [people_id], (err, result) =>
            err ? rej(err) : res(result.rows)
          )
        ),
      ])
        .then(([batchData, certificateData]) => {
          resolve({
            status: 'Success',
            code: 200,
            currentBatches: batchData,
            certificates: certificateData,
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

    // LMS login: full data
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
        rd.resource_id, rd.resource_name, rd.resource_type,
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
    ])
      .then(([progressData, instructorData, testData, reAttemptsData]) => {
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
module.exports = {traineem, getTraineesm, disableTraineem, deleteTraineem, indData, indDatauuid};