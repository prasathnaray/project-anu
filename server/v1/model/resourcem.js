const client = require('../utils/conn');
const resourcem = (learning_module_id, resource_type, topic, resource_name, requester) => {
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
            client.query('INSERT INTO resource_data(learning_module_id, resource_type, resource_topic, resource_name) VALUES($1, $2, $3, $4)', [learning_module_id, resource_type, topic, resource_name], (err, result) => {
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
// const getResourcesModel = (requester, module_id) => {
//     return new Promise((resolve, reject) => {
//         const isPrivileged = [99, 101, 103].includes(Number(requester.role))
//         if(!isPrivileged)
//         {
//             return resolve({
//                 status: 'Unauthorized',
//                 code: 401,
//                 message: 'You do not have permission to access this profile.'
//             })
//         }
//         client.query('SELECT rd.resource_id, rd.resource_name, rd.module_id, COUNT(pd.user_id) AS trainee_completed FROM resource_data rd LEFT JOIN progress_data pd ON pd.resourse_id = rd.resource_id WHERE rd.module_id=$1 GROUP BY rd.resource_id, rd.resource_name, rd.module_id;', [module_id], (err, result) => {
//             if(err)
//             {
//                 return reject(err)
//             }
//             else
//             {
//                 return resolve(result)
//             }      
//         })
//     })
// }

const getResourcesModel = (requester, module_id) => {
  return new Promise((resolve, reject) => {
    const isPrivileged = [99, 101, 103, 102].includes(Number(requester.role));
    if (!isPrivileged) {
      return resolve({
        status: 'Unauthorized',
        code: 401,
        message: 'You do not have permission to access this profile.'
      });
    }

    let query;
    let params;

    if (requester.role == 103) {
      // Individual user progress
      query = `  
        SELECT 
          rd.resource_id,
          rd.resource_name,
          rd.module_id,
          CASE 
            WHEN pd.user_id IS NOT NULL AND pd.is_completed = TRUE THEN TRUE 
            ELSE FALSE 
          END AS is_completed
        FROM resource_data rd
        LEFT JOIN progress_data pd 
          ON rd.resource_id = pd.resourse_id
          AND pd.user_id = $2
        WHERE rd.module_id = $1
      `;
      params = [module_id, requester.user_mail];
    } else {
      // Admin view: aggregate for all users
      // query = `
      //   SELECT 
      //       rd.resource_id,
      //       rd.resource_name,
      //       rd.resource_topic,
      //       rd.created_at,
      //       rd.resource_type,
      //       rd.learning_module_id,
      //       pd.user_id AS attempted_user,
      //       COUNT(pd.user_id) AS trainee_completed,
      //       COUNT(*) OVER (PARTITION BY rd.learning_module_id) AS total_resource
      //   FROM resource_data rd
      //   LEFT JOIN progress_data pd 
      //       ON rd.resource_id = pd.resourse_id
      //   WHERE rd.learning_module_id = $1
      //   GROUP BY 
      //   rd.resource_id,
      //   rd.resource_name,
      //   rd.resource_type,
      //   rd.learning_module_id,
      //   rd.resource_topic,
      //   rd.created_at
      //   ORDER BY rd.created_at ASC
      // `;
      query = `SELECT 
    rd.resource_id,
    rd.resource_name,
    rd.resource_topic,
    rd.created_at,
    rd.resource_type,
    rd.learning_module_id,
    COUNT(DISTINCT pd.user_id) AS trainee_completed,
    COUNT(*) OVER (PARTITION BY rd.learning_module_id) AS total_resource,
    STRING_AGG(ud.user_name, ', ') AS completed_by_names,
    STRING_AGG(ud.people_id::text, ', ') AS completed_by_ids
FROM resource_data rd
LEFT JOIN progress_data pd 
    ON rd.resource_id = pd.resourse_id
LEFT JOIN user_data ud 
    ON pd.user_id = ud.user_email
WHERE rd.learning_module_id = $1
GROUP BY 
    rd.resource_id,
    rd.resource_name,
    rd.resource_type,
    rd.learning_module_id,
    rd.resource_topic,
    rd.created_at
ORDER BY rd.created_at ASC`;
      params = [module_id];
    }
    client.query(query, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
const getResourcesByModuleIds = (requester, moduleIds) => {
    return new Promise((resolve, reject) => {
           const isPrivileged = [99, 101, 102, 103].includes(Number(requester.role));
           if(!isPrivileged) {
                return resolve({
                  status: 'Unauthorized',
                  code: 401,
                  message: 'You do not have permission to access this profile.'
                });
           }
           if (!Array.isArray(moduleIds) || moduleIds.length === 0) {
                return resolve({ status: 'No Data', code: 200, data: [] });
           }
           client.query('select * from resource_data where module_id = ANY($1)', [moduleIds], (err, result) => {
              if(err)
              {
                reject(err)
              }
              else{
                resolve(result)
              }
           })
    })
}
const mindsparkm = (requester, r_id, user_opt, correct_opt, status, user_mail) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101, 102, 103].includes(Number(requester.role));
           if(!isPrivileged) {
                return resolve({
                  status: 'Unauthorized',
                  code: 401,
                  message: 'You do not have permission to access this profile.'
                });
        }
        const query = `
            INSERT INTO mind_sparks (r_id, user_opt, correct_opt, status, user_mail, created_at) 
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING *
        `;
        
        const values = [r_id, user_opt, correct_opt, status, requester.user_mail];
        
        client.query(query, values, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                reject(err);
            } else {
                resolve(result.rows[0]);
            }
        });
    });
};
module.exports = {resourcem, getResourcesModel, getResourcesByModuleIds, mindsparkm}