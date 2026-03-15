const client = require('../utils/conn.js');
const createBatchm = (batch_name, batch_start_date, batch_end_date, certification_data, curiculum_name, requester) => {
        return new Promise((resolve, reject) => {
                const isPrivileged = [101].includes(Number(requester.role));
                if(!isPrivileged) {
                    return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this course data.'
                    });
                }
                client.query('INSERT INTO batch_data(batch_name, batch_start_date, batch_end_date, certification_data, curiculum_id) VALUES($1, $2, $3, $4, $5)', [batch_name, batch_start_date, batch_end_date, certification_data, curiculum_name], (err, result) => {
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
// const getBatchm = (requester, page, limit) => {
//     const isPrivileged = [101, 102].includes(Number(requester.role));
//     if(!isPrivileged) {
//         return resolve({
//             status: 'Unauthorized',
//             code: 401,
//             message: 'You do not have permission to access this course data.'
//         });
//     }
//     const offset = (page - 1) * limit;
//     return new Promise((resolve, reject) => {
//         const query = `
//         WITH role_counts AS (
//   SELECT 
//     b.batch_id,
//     b.batch_name,
//     b.batch_start_date,
//     b.batch_end_date,
//     ud.user_role,
//     COUNT(*) AS role_count
//   FROM 
//     batch_data b
//     LEFT JOIN batch_people_data bpd ON b.batch_id = ANY(bpd.batch_id)
//     LEFT JOIN user_data ud ON bpd.user_id = ud.user_email
//   GROUP BY 
//     b.batch_id, b.batch_name, b.batch_start_date, b.batch_end_date, ud.user_role
// ),
// batch_summary AS (
//   SELECT
//     COUNT(*) OVER() AS total_count,
//     batch_id,
//     batch_name,
//     batch_start_date,
//     batch_end_date,
//     SUM(role_count) AS total_users,
//     JSON_AGG(
//       JSON_BUILD_OBJECT('role', user_role, 'count', role_count)
//     ) FILTER (WHERE user_role IS NOT NULL) AS role_counts
//   FROM 
//     role_counts
//   GROUP BY 
//     batch_id, batch_name, batch_start_date, batch_end_date
// )
// SELECT *
// FROM batch_summary
// ORDER BY batch_name ASC
// LIMIT $1 OFFSET $2;
//         `;
//         client.query(query, [limit, offset], (err, result) => {
//             if(err)
//             {
//                 reject(err)
//             }
//             else
//             {
//                 resolve(result)
//             }
//         })
//     })
// }
const getBatchm = (requester, page, limit) => {
  return new Promise((resolve, reject) => {

    const isAdmin = Number(requester.role) === 101; 
    const offset = (page - 1) * limit;
    let query;
    let params;

    if (isAdmin) {
      query = `
        WITH role_counts AS (
          SELECT 
            b.batch_id,
            b.batch_name,
            b.batch_start_date,
            b.batch_end_date,
            ud.user_role,
            COUNT(*) AS role_count
          FROM 
            batch_data b
            LEFT JOIN batch_people_data bpd ON b.batch_id = ANY(bpd.batch_id)
            LEFT JOIN user_data ud ON bpd.user_id = ud.user_email
          GROUP BY 
            b.batch_id, b.batch_name, b.batch_start_date, b.batch_end_date, ud.user_role
        ),
        batch_summary AS (
          SELECT
            COUNT(*) OVER() AS total_count,
            batch_id,
            batch_name,
            batch_start_date,
            batch_end_date,
            SUM(role_count) AS total_users,
            JSON_AGG(JSON_BUILD_OBJECT('role', user_role, 'count', role_count))
              FILTER (WHERE user_role IS NOT NULL) AS role_counts
          FROM role_counts
          GROUP BY batch_id, batch_name, batch_start_date, batch_end_date
        )
        SELECT * 
        FROM batch_summary
        ORDER BY batch_name ASC
        LIMIT $1 OFFSET $2;
      `;
      params = [limit, offset];

    } else {
      query = `
        WITH instructor_batches AS (
            SELECT UNNEST(batch_id) AS batch_id
            FROM batch_people_data
            WHERE user_id = $3
        ),
        role_counts AS (
            SELECT
                bd.batch_id,
                bd.batch_name,
                bd.batch_start_date,
                bd.batch_end_date,
                ud.user_role,
                COUNT(*) AS role_count
            FROM 
                batch_data bd
                LEFT JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
                LEFT JOIN user_data ud ON bpd.user_id = ud.user_email
            WHERE 
                bd.batch_id IN (SELECT batch_id FROM instructor_batches)
            GROUP BY 
                bd.batch_id, bd.batch_name, bd.batch_start_date, bd.batch_end_date, ud.user_role
        ),

        batch_summary AS (
            SELECT
                COUNT(*) OVER() AS total_count,
                batch_id,
                batch_name,
                batch_start_date,
                batch_end_date,
                JSON_AGG(JSON_BUILD_OBJECT('role', user_role, 'count', role_count))
                    FILTER (WHERE user_role IS NOT NULL) AS role_counts
            FROM role_counts
            GROUP BY batch_id, batch_name, batch_start_date, batch_end_date
        )
        SELECT *
        FROM batch_summary
        ORDER BY batch_name ASC
        LIMIT $1 OFFSET $2;
      `;
      params = [limit, offset, requester.user_mail];
    }

    client.query(query, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const associateBatchm = (requester, batch_id, user_id) => {
    const isPrivileged = [101,  102].includes(Number(requester.role));
    if(!isPrivileged)
    {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view trainee profiles'
        })
    }
    return new Promise((resolve, reject) => {
        client.query('INSERT INTO public.batch_people_data(batch_id, user_id) VALUES($1, $2)', [batch_id, user_id] ,(err, result) => {
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
const deleteBatchm = (requester, batch_id) => {
    const isPrivileged = [101,  102].includes(Number(requester.role));
    if(!isPrivileged)
    {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view trainee profiles'
        })
    }
    return new Promise((resolve, reject) => {
        client.query('DELETE FROM batch_data WHERE batch_id=$1', [batch_id], (err, result) => {
            if(err)
            {
                reject(err)
            }   
            else
            {
                resolve(result);
            }
        })
    })
}
const createTargetedLearning = (requester, tar_name, curiculum_id, certificate_id, learning_module_id, resources_id, start_date, end_date, resource_type, trainee_id) => {
    const isPrivileged = [101, 102].includes(Number(requester.role))
    if(!isPrivileged)
    {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view trainee profiles'  
        })
    }
    //  const safeModuleIds = Array.isArray(module_id) && module_id.length > 0 ? module_id : null;
     const safeResourceIds = Array.isArray(resources_id) && resources_id.length > 0 ? resources_id : null;
     const traineeIds = Array.isArray(trainee_id) && trainee_id.length > 0 ? trainee_id : null;
    return new Promise((resolve, reject) => {
        client.query('INSERT INTO targeted_learning(tar_name, curiculum_id, certificate_id, learning_module_id, resources_id, start_date, end_date, resource_type, trainee_id, created_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [tar_name, curiculum_id, certificate_id, learning_module_id, safeResourceIds, start_date, end_date, resource_type, traineeIds, requester.user_mail], (err, result) => {
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

const getTargetedLearningListModel = (requester) => {
    const isPrivileged = [101, 102].includes(Number(requester.role));
    if(!isPrivileged)
    {
            return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'You do not have permission to view trainee profiles'  
            })
    }
    return new Promise((resolve, reject) => {
        client.query('SELECT * FROM targeted_learning', (err, result) => {
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
const deleteTargetedLearningModel = (requester, targeted_learning_id) => {
    const isPrivileged = [101, 102].includes(Number(requester.role))
    if(!isPrivileged)
    {
        return resolve({
            status: 'Unauthorized',
            code: 401,
            message: "You do not have permission to view"
        })
    }
    return new Promise((resolve, reject) => {
        client.query('DELETE FROM targeted_learning WHERE target_learning_id=$1', [targeted_learning_id], (err, result) => {
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
const IndividualtllList = (requester) => {
    const isPrivileged = [103].includes(Number(requester.role));
    if(!isPrivileged)
    {
            return resolve({
                    status: 'Unauthorized',
                    code: 401,
                    message: 'You do not have permission to view trainee profiles'  
            })
    }
    return new Promise((resolve, reject) => {
        client.query('SELECT * FROM targeted_learning where trainee_id@>$1', [`{${requester.user_mail}}`], (err, result) => {
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

const filterBatchm = (requester, batch_name, instructor_name) => {
  const isPrivileged = [101].includes(Number(requester.role));
  if (!isPrivileged) {
    return Promise.resolve({
      status: 'Unauthorized',
      code: 401,
      message: 'You do not have permission to view trainee profiles'
    });
  }

  return new Promise((resolve, reject) => {
    client.query(
      `
      WITH role_counts AS (
        SELECT 
          b.batch_id, 
          b.batch_name, 
          b.batch_start_date, 
          b.batch_end_date, 
          ud.user_role, 
          COUNT(*) AS role_count
        FROM batch_data b
        LEFT JOIN batch_people_data bpd 
          ON b.batch_id = ANY(bpd.batch_id)
        LEFT JOIN user_data ud 
          ON bpd.user_id = ud.user_email
        WHERE 
          ($1::text IS NULL OR b.batch_name ILIKE '%' || $1::text || '%') AND
          ($2::text IS NULL OR ud.user_name ILIKE '%' || $2::text || '%')
        GROUP BY 
          b.batch_id, b.batch_name, b.batch_start_date, b.batch_end_date, ud.user_role
      )
      SELECT 
        batch_id, 
        batch_name, 
        batch_start_date, 
        batch_end_date,
        SUM(role_count) AS total_users,
        JSON_AGG(
          JSON_BUILD_OBJECT('role', user_role, 'count', role_count)
        ) FILTER (WHERE user_role IS NOT NULL) AS role_counts
      FROM role_counts
      GROUP BY 
        batch_id, batch_name, batch_start_date, batch_end_date
      `,
      [batch_name || null, instructor_name || null],
      (err, result) => {
        if (err) reject(err);
        else resolve(result.rows);
      }
    );
  });
};

// const individualBatchStats = (requester, batch_id) => {
//     const isPrivileged = [101, 102].includes(Number(requester.role));
//     if (!isPrivileged) {
//         return Promise.resolve({
//         status: 'Unauthorized',
//         code: 401,
//         message: 'You do not have permission to view trainee profiles'
//         });
//     }
//     return new Promise((resolve, reject) => {
//         client.query(`
//             WITH user_info AS (
//                     SELECT user_role, user_email FROM user_data GROUP BY user_role, user_email
//             )
//             SELECT * FROM batch_data bd JOIN batch_people_data bpd ON bd.batch_id=ANY(bpd.batch_id) JOIN user_info ui ON bpd.user_id = ui.user_email WHERE bd.batch_id=$1
//         `, [batch_id],  (err, result) => {
//             if(err)
//             {
//                 reject(err)
//             }
//             else {
//                 resolve(result)
//             }
//         })
//     })
// }

//the above code is working if in case of error comment down the below code and uncomment the above code and check the functionality. The below code is optimized for better performance and reduced redundancy. It fetches batch info, instructors, and trainees in a single query and processes the data in JavaScript to separate instructors and trainees, which should be more efficient than multiple queries or complex SQL joins.
// const individualBatchStats = (requester, batch_id) => {
//     const isPrivileged = [101, 102, 103].includes(Number(requester.role));
//     if (!isPrivileged) {
//         return Promise.resolve({
//             status: 'Unauthorized',
//             code: 401,
//             message: 'You do not have permission to view this batch'
//         });
//     }

//     return new Promise((resolve, reject) => {
//         client.query(`
//             WITH user_info AS (
//                 SELECT user_role, user_email FROM user_data GROUP BY user_role, user_email
//             ),
//             last_login AS (
//                 SELECT DISTINCT ON (user_id) 
//                     user_id, 
//                     logged_at
//                 FROM login_activity
//                 ORDER BY user_id, logged_at DESC
//             ),
//             user_names AS (
//                 SELECT 
//                     user_email,
//                     user_name AS full_name,
//                     created_at,
//                     user_profile_photo
//                 FROM user_data
//             )
//             SELECT 
//                 bd.batch_id,
//                 bd.batch_name,
//                 bd.batch_start_date,
//                 bd.batch_end_date,
//                 ui.user_role,
//                 ui.user_email,
//                 un.full_name,
//                 un.user_profile_photo,
//                 un.created_at AS user_created_at,
//                 ll.logged_at AS last_login
//             FROM batch_data bd
//             JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id)
//             JOIN user_info ui ON bpd.user_id = ui.user_email
//             LEFT JOIN user_names un ON ui.user_email = un.user_email
//             LEFT JOIN last_login ll ON ui.user_email = ll.user_id
//             WHERE bd.batch_id = $1
//         `, [batch_id], (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 const rows = result.rows;

//                 // Batch meta (same for all rows)
//                 const batchInfo = {
//                     batch_id: rows[0]?.batch_id || null,
//                     batch_name: rows[0]?.batch_name || null,
//                     batch_start_date: rows[0]?.batch_start_date || null,
//                     batch_end_date: rows[0]?.batch_end_date || null,
//                 };

//                 // Split instructors and trainees
//                 const instructors = rows
//                     .filter(row => row.user_role === "102")
//                     .map(row => ({
//                         user_email: row.user_email,
//                         full_name: row.full_name,
//                         user_profile_photo: row.user_profile_photo,
//                         user_created_at: row.user_created_at,
//                         last_login: row.last_login,
//                         user_role: row.user_role
//                     }));

//                 const trainees = rows
//                     .filter(row => row.user_role === "103")
//                     .map(row => ({
//                         user_email: row.user_email,
//                         full_name: row.full_name,
//                         user_profile_photo: row.user_profile_photo,
//                         user_created_at: row.user_created_at,
//                         last_login: row.last_login,
//                         user_role: row.user_role
//                     }));

//                 resolve({
//                     batchInfo,
//                     instructors,
//                     trainees,
//                     instructorCount: instructors.length,
//                     traineeCount: trainees.length
//                 });
//             }
//         });
//     });
// };

//update batch details like batch name, start date and end date
const individualBatchStats = (requester, batch_id) => { 
    const isPrivileged = [101, 102, 103].includes(Number(requester.role)); 
    if (!isPrivileged) { 
        return Promise.resolve({ 
            status: 'Unauthorized', 
            code: 401, 
            message: 'You do not have permission to view this batch' 
        }); 
    } 
 
    return new Promise((resolve, reject) => { 
        client.query(` 
            WITH user_info AS ( 
                SELECT user_role, user_email FROM user_data GROUP BY user_role, user_email 
            ), 
            last_login AS ( 
                SELECT DISTINCT ON (user_id)  
                    user_id,  
                    logged_at 
                FROM login_activity 
                ORDER BY user_id, logged_at DESC 
            ), 
            user_names AS ( 
                SELECT  
                    user_email, 
                    user_name AS full_name, 
                    created_at, 
                    user_profile_photo 
                FROM user_data 
            ) 
            SELECT  
                bd.batch_id, 
                bd.batch_name, 
                bd.batch_start_date, 
                bd.batch_end_date, 
                ui.user_role, 
                ui.user_email, 
                un.full_name, 
                un.user_profile_photo, 
                un.created_at AS user_created_at, 
                ll.logged_at AS last_login,
                cd.certificate_id,
                cd.certificate_name
            FROM batch_data bd 
            JOIN batch_people_data bpd ON bd.batch_id = ANY(bpd.batch_id) 
            JOIN user_info ui ON bpd.user_id = ui.user_email 
            LEFT JOIN user_names un ON ui.user_email = un.user_email 
            LEFT JOIN last_login ll ON ui.user_email = ll.user_id
            LEFT JOIN certification_data cd ON cd.certificate_id::text = ANY(
                SELECT jsonb_array_elements_text(bd.certification_data)
            )
            WHERE bd.batch_id = $1 
        `, [batch_id], (err, result) => { 
            if (err) { 
                reject(err); 
            } else { 
                const rows = result.rows; 

                if (!rows.length) {
                    return resolve({
                        status: 'Not Found',
                        code: 404,
                        message: 'No batch found with the given ID'
                    });
                }
 
                // Batch meta (same for all rows) 
                const batchInfo = { 
                    batch_id: rows[0]?.batch_id || null, 
                    batch_name: rows[0]?.batch_name || null, 
                    batch_start_date: rows[0]?.batch_start_date || null, 
                    batch_end_date: rows[0]?.batch_end_date || null,
                    certificate: {
                        certificate_id: rows[0]?.certificate_id || null,
                        certificate_name: rows[0]?.certificate_name || null,
                        certificate_status: rows[0]?.certificate_status || null,
                    }
                }; 
 
                // Split instructors and trainees 
                const instructors = rows 
                    .filter(row => row.user_role === "102") 
                    .map(row => ({ 
                        user_email: row.user_email, 
                        full_name: row.full_name, 
                        user_profile_photo: row.user_profile_photo, 
                        user_created_at: row.user_created_at, 
                        last_login: row.last_login, 
                        user_role: row.user_role 
                    })); 
 
                const trainees = rows 
                    .filter(row => row.user_role === "103") 
                    .map(row => ({ 
                        user_email: row.user_email, 
                        full_name: row.full_name, 
                        user_profile_photo: row.user_profile_photo, 
                        user_created_at: row.user_created_at, 
                        last_login: row.last_login, 
                        user_role: row.user_role 
                    })); 
 
                resolve({ 
                    batchInfo, 
                    instructors, 
                    trainees, 
                    instructorCount: instructors.length, 
                    traineeCount: trainees.length 
                }); 
            } 
        }); 
    }); 
};
 
const updateBatchm = (requester, batch_id, new_batch_name, new_start_date, new_end_date) => {
    const isPrivileged = [101, 99].includes(Number(requester.role));
    if (!isPrivileged) {
            return Promise.resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles'
            });
    }
    return new Promise((resolve, reject) => {
        client.query('UPDATE batch_data SET batch_name=$1, batch_start_date=$2, batch_end_date=$3 WHERE batch_id=$4', [new_batch_name, new_start_date, new_end_date, batch_id], (err, result) => {
            if(err)
            {
                reject(err)
            }
            else {
                resolve(result)
            }
        })
    })
}
module.exports = {filterBatchm, updateBatchm, createBatchm, getBatchm, associateBatchm, deleteBatchm, createTargetedLearning, getTargetedLearningListModel, deleteTargetedLearningModel, IndividualtllList, individualBatchStats};