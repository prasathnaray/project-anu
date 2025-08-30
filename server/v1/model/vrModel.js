const client = require('../utils/conn.js');
const generateToken = require('../utils/generateIvsToken.js')
const vrModel = (requester, data_check) => {
    return new Promise((resolve, reject) => {
        const isPriviledged = [101, 99, 102, 103].includes(Number(requester.role));
        if(!isPriviledged)
        {
                return resolve({
                        status: 'Unauthorized',
                        code: 401,
                        message: 'You do not have permission to access this profile.'
                });
        }
        resolve({
            code: 200,
            user_mail: requester.user_mail,
            data: data_check
        })
    })
}

// const streamData = async (requester, stageArn, userId, capabilities, attributes, duration) => {
//     return new Promise((resolve, reject) => {
//         const isPriviledged = [99,101,102,103].includes(Number(requester.role));
//         if(!isPriviledged)
//         {
//             return resolve({
//                 status: "Unauthorized",
//                 code: 401,
//                 message: 'You do not have permission to access this profile.'
//             })
//         }
//         const tokenResponse = await generateToken(
//             stageArn,
//             userId || "user-" + Math.random().toString(36).substring(2, 8),
//             capabilities || ["PUBLISH", "SUBSCRIBE"],
//             attributes || {},
//             duration || 720
//         );
//         console.log(tokenResponse)
//         // const participantId = tokenResponse?.participantToken; 
//         //  if (!participantId) {
//         //             throw new Error("Failed to generate participant token");
//         //  }
//         // client.query('INSERT INTO streaming_data(user_id, participant_id, status) VALUES($1, $2, $3)', [userId, participant, false], (err, result) => {
//         //     if(err)
//         //     {
//         //         reject(err)
//         //     }
//         //     else{
//         //         resolve(result)
//         //     }
//         // })
//     })
// }

const streamData = async (stageArn, userId, capabilities, attributes, duration) => {
  // const isPrivileged = [99,101,102,103].includes(Number(requester?.role));
  // if (!isPrivileged) {
  //   return {
  //     status: "Unauthorized",
  //     code: 401,
  //     message: "You do not have permission to access this profile."
  //   };
  // }
  const tokenResponse = await generateToken(
    stageArn,
    userId || "user-" + Math.random().toString(36).substring(2, 8),
    capabilities || ["PUBLISH", "SUBSCRIBE"],
    attributes || {},
    duration || 720
  );
  const participantId = tokenResponse?.participantToken?.participantId;
  if (!participantId) {
    throw new Error("Failed to generate participant token");
  }
  const result = await client.query(
    'INSERT INTO streaming_data (user_id, participant_id, status) VALUES ($1, $2, $3) RETURNING *',
    [userId, participantId, false]
  );
  return {
    status: "Success",
    data: result.rows[0],
    token: tokenResponse.participantToken
  };
};
module.exports = {vrModel, streamData};