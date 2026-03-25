const client = require('../utils/conn');
// const updateProgress = async (userId, resourceId) => {
//     console.log("Updating progress for:", userId, resourceId);

//     try {
//         const res = await client.query(
//             `INSERT INTO progress_data (user_id, resource_id, is_completed, updated_at)
//              VALUES ($1, $2, TRUE, NOW())
//              ON CONFLICT (user_id, resource_id)
//              DO UPDATE SET 
//                 is_completed = TRUE,
//                 updated_at = NOW()
//              RETURNING *`,
//             [userId, resourceId]
//         );

//         console.log("Progress result:", res.rows);
//         return res;

//     } catch (err) {
//         console.error("Progress error:", err);
//         throw err;
//     }
// };
// const submitActivity = (requester, payload) => {
//     return new Promise((resolve, reject) => {
//         const isPrivileged = [103].includes(Number(requester.role));
//         if (!isPrivileged) {
//             return resolve({
//                 status: 'Unauthorized',
//                 code: 401,
//                 message: 'You do not have permission to access this profile.'
//             });
//         }
//         client.query(
//             `INSERT INTO activity_submissions 
//              (session_id, user_id, resource_id, resource_type, question_no, option_chosen, is_correct, match_payload, time_taken, has_taken_clue, total_time_taken, submitted_at)
//              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())`,
//             [
//                 payload.sessionId,
//                 requester.user_mail,
//                 payload.resourceId,
//                 payload.resourceType,
//                 payload.questionNo ?? null,
//                 payload.optionChosen ?? null,
//                 payload.isCorrect ?? null,
//                 payload.matchPayload ? JSON.stringify(payload.matchPayload) : null,
//                 payload.timeTaken ?? null,
//                 payload.hasTakenClue ?? null,
//                 payload.totalTimeTaken ?? null,
//             ],
//             (err, result) => {
//                 if (err) reject(err);
//                 else resolve(result);
//             }
//         );
//     });
// };
// const submitActivity = (requester, payload) => {
//     return new Promise((resolve, reject) => {
//         const isPrivileged = [103].includes(Number(requester.role));

//         if (!isPrivileged) {
//             return resolve({
//                 status: 'Unauthorized',
//                 code: 401,
//                 message: 'You do not have permission to access this profile.'
//             });
//         }

//         client.query(
//             `INSERT INTO activity_submissions 
//              (session_id, user_id, resource_id, resource_type, question_no, option_chosen, is_correct, match_payload, time_taken, has_taken_clue, total_time_taken, submitted_at)
//              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())`,
//             [
//                 payload.sessionId,
//                 requester.user_mail,
//                 payload.resourceId,
//                 payload.resourceType,
//                 payload.questionNo ?? null,
//                 payload.optionChosen ?? null,
//                 payload.isCorrect ?? null,
//                 payload.matchPayload ? JSON.stringify(payload.matchPayload) : null,
//                 payload.timeTaken ?? null,
//                 payload.hasTakenClue ?? null,
//                 payload.totalTimeTaken ?? null,
//             ],
//             async (err, result) => {
//                 if (err) return reject(err);

//                 try {
//                     // 👉 mark progress complete (ONLY once per resource)
//                     if (payload.isCompleted) {
//                         await updateProgress(requester.user_mail, payload.resourceId);
//                     }

//                     resolve(result);
//                 } catch (e) {
//                     reject(e);
//                 }
//             }
//         );
//     });
// };
/**
 * Insert or update progress (always runs)
 */
const updateProgress = async (userId, resourceId) => {
    try {
        console.log("Updating progress for:", userId, resourceId);

        const res = await client.query(
            `INSERT INTO progress_data (user_id, resourse_id, is_completed, updated_at)
             VALUES ($1, $2, TRUE, NOW())
             ON CONFLICT (user_id, resourse_id)
             DO UPDATE SET 
                is_completed = TRUE,
                updated_at = NOW()
             RETURNING *`,
            [userId, resourceId]
        );
        console.log("Progress updated:", res.rows);
        return res;

    } catch (err) {
        console.error("Progress ERROR:", err);
        throw err;
    }
};


/**
 * Insert activity + ALWAYS update progress
 */
const submitActivity = async (requester, payload) => {
    const isPrivileged = [103].includes(Number(requester.role));

    if (!isPrivileged) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to access this profile.'
        };
    }

    try {
        // ✅ Insert activity log
        await client.query(
            `INSERT INTO activity_submissions 
             (session_id, user_id, resource_id, resource_type, question_no, option_chosen, is_correct, match_payload, time_taken, has_taken_clue, total_time_taken, submitted_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())`,
            [
                payload.sessionId,
                requester.user_mail,
                payload.resourceId,
                payload.resourceType,
                payload.questionNo ?? null,
                payload.optionChosen ?? null,
                payload.isCorrect ?? null,
                payload.matchPayload ? JSON.stringify(payload.matchPayload) : null,
                payload.timeTaken ?? null,
                payload.hasTakenClue ?? null,
                payload.totalTimeTaken ?? null,
            ]
        );

        console.log("Activity inserted");

        // 🔥 ALWAYS update progress (no conditions)
        await updateProgress(requester.user_mail, payload.resourceId);

        return {
            status: 'Success',
            code: 200,
            message: 'Activity recorded successfully'
        };

    } catch (err) {
        console.error("SubmitActivity ERROR:", err);
        throw err;
    }
};
module.exports = { submitActivity };
