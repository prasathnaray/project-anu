// const client = require('../utils/conn');

// const isValidUUID = (value) =>
//   /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

// const updateProgress = async (userId, resourceId) => {
//     try {
//         console.log("Updating progress for:", userId, resourceId);

//         const res = await client.query(
//             `INSERT INTO progress_data (user_id, resourse_id, is_completed, updated_at)
//              VALUES ($1, $2, TRUE, NOW())
//              ON CONFLICT (user_id, resourse_id)
//              DO UPDATE SET 
//                 is_completed = TRUE,
//                 updated_at = NOW()
//              RETURNING *`,
//             [userId, resourceId]
//         );
//         console.log("Progress updated:", res.rows);
//         return res;

//     } catch (err) {
//         console.error("Progress ERROR:", err);
//         throw err;
//     }
// };

// const bulkCreatePracticeResults = (requester, practice_id, resource_id, practice_number, practiceresults) => {
//     return new Promise((resolve, reject) => {
//         const isPrivileged = [101, 99, 102, 103].includes(Number(requester.role));
//         if (!isPrivileged) {
//             return resolve({
//                 status: 'Unauthorized',
//                 code: 401,
//                 message: 'You do not have permission to access this profile.',
//             });
//         }
//         if (!isValidUUID(resource_id)) {
//             return resolve({
//                 status: 'Bad Request',
//                 code: 400,
//                 message: 'resource_id must be a valid UUID',
//             });
//         }
//         const results = practiceresults.map((r) => ({
//             index: r.index,
//             time: r.Time ?? r.time,
//         }));
//         const query = `
//             INSERT INTO practice_results (practice_id, resource_id, user_id, practice_number, results)
//             VALUES ($1, $2, $3, $4, $5)
//             RETURNING *
//         `;
//         const values = [practice_id, resource_id, requester.user_mail, practice_number, JSON.stringify(results)];
//         client.query(query, values, (err, result) => {
//             if (err) {
//                 console.error('Database error:', err);
//                 return reject(err);
//             }
//             return resolve(result.rows[0]);
//         });
//     });
// };

// module.exports = { bulkCreatePracticeResults };


//the above code is working good
const client = require('../utils/conn');

const isValidUUID = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const PRIVILEGED_ROLES = [99, 101, 102, 103];

/**
 * Upserts a completed progress record for a given user and resource.
 */
const updateProgress = async (userId, resourceId) => {
  try {
    console.log('Updating progress for:', userId, resourceId);

    const res = await client.query(
      `INSERT INTO progress_data (user_id, resourse_id, is_completed, updated_at)
       VALUES ($1, $2, TRUE, NOW())
       ON CONFLICT (user_id, resourse_id)
       DO UPDATE SET
         is_completed = TRUE,
         updated_at   = NOW()
       RETURNING *`,
      [userId, resourceId]
    );

    console.log('Progress updated:', res.rows);
    return res;
  } catch (err) {
    console.error('Progress ERROR:', err);
    throw err;
  }
};
const bulkCreatePracticeResults = async (requester, practice_id, resource_id, practice_number, practiceresults) => {
  const isPrivileged = PRIVILEGED_ROLES.includes(Number(requester.role));
  if (!isPrivileged) {
    return {
      status: 'Unauthorized',
      code: 401,
      message: 'You do not have permission to access this profile.',
    };
  }
  if (!isValidUUID(resource_id)) {
    return {
      status: 'Bad Request',
      code: 400,
      message: 'resource_id must be a valid UUID',
    };
  }
  console.log('requester object:', requester);
  const userId = requester.user_id ?? requester.id ?? requester.sub ?? requester.user_mail ?? null;

  if (!userId) {
    return {
      status: 'Bad Request',
      code: 400,
      message: 'Could not resolve user identity from request token.',
    };
  }

  const results = practiceresults.map((r) => ({
    index: r.index,
    time: r.Time ?? r.time,
  }));
  try {
    const existing = await client.query(
      `SELECT user_id FROM practice_results WHERE user_id = $1 AND resource_id = $2`,
      [userId, resource_id]
    );
    let result;
    if (existing.rows.length > 0) {
      result = await client.query(
        `UPDATE practice_results
         SET practice_id     = $1,
             practice_number = $2,
             results         = $3
         WHERE user_id = $4 AND resource_id = $5
         RETURNING *`,
        [practice_id, practice_number, JSON.stringify(results), userId, resource_id]
      );
    } else {
      result = await client.query(
        `INSERT INTO practice_results (practice_id, resource_id, user_id, practice_number, results)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [practice_id, resource_id, userId, practice_number, JSON.stringify(results)]
      );
    }
    await updateProgress(userId, resource_id);
    return result.rows[0];
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};
const getPractice12ByUserId = async (user_id, requester) => {
  const isPrivileged = PRIVILEGED_ROLES.includes(Number(requester.role));
  if (!isPrivileged) {
    return {
      status: 'Unauthorized',
      code: 401,
      message: 'You do not have permission to access this profile.',
    };
  }
  const result = await client.query(
    `SELECT 
        rd.resource_id,
        rd.resource_name,
        rd.resource_type,
        pr.user_id,
        pr.practice_id,
        pr.practice_number,W
        pr.results
     FROM practice_results pr
     JOIN resource_data rd ON rd.resource_id = pr.resource_id
     WHERE pr.user_id = $1`,
    [user_id]
  );
  return result.rows;
};
module.exports = {updateProgress, bulkCreatePracticeResults, getPractice12ByUserId};