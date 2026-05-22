const client = require('../utils/conn');
const supabase = require('../utils/supaBaseConfig.js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// const submitSession = async (requester, sessionType, sessionNumber, resource_id, session_id, payload, imageMap) => {
//     const isPrivileged = [103].includes(Number(requester.role));
//     if (!isPrivileged) {
//         return { status: 'Unauthorized', code: 401, message: 'You do not have permission to submit a session.' };
//     }

//     const dbClient = await client.connect();
//     try {
//         await dbClient.query('BEGIN');

//         // 1. sessions
//         const sessionResult = await dbClient.query(
//             `INSERT INTO sessions (id, user_id, session_type, session_number, resource_id)
//              VALUES ($1, $2, $3, $4, $5) RETURNING id`,
//             [session_id, requester.user_mail, sessionType, sessionNumber, resource_id]
//         );
//         const sessionId = session_id;

//         const { planeIdentification, imageOptimization, measurements,
//                 diagnosticInterpretation, scores, feedback } = payload;

//         // 2. plane_identification (no user_id/id insert — id is auto PK)
//         const pi = planeIdentification;
//         await dbClient.query(
//             `INSERT INTO plane_identification (
//                 session_id, resource_id,
//                 time_taken_user, time_taken_expert, time_taken_score, time_taken_max_score,
//                 probe_pos_user_x, probe_pos_user_y, probe_pos_user_z,
//                 probe_rot_user_x, probe_rot_user_y, probe_rot_user_z,
//                 probe_pos_expert_x, probe_pos_expert_y, probe_pos_expert_z,
//                 probe_rot_expert_x, probe_rot_expert_y, probe_rot_expert_z,
//                 probe_position_score, probe_position_max,
//                 probe_rotation_score, probe_rotation_max,
//                 subtotal_score, subtotal_max_score
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
//             [
//                 sessionId, resource_id,
//                 pi.timeTakenSeconds.user, pi.timeTakenSeconds.expertExpected,
//                 pi.timeTakenSeconds.score, pi.timeTakenSeconds.maxScore,
//                 pi.probePosition.user.position.x, pi.probePosition.user.position.y, pi.probePosition.user.position.z,
//                 pi.probePosition.user.rotation.x, pi.probePosition.user.rotation.y, pi.probePosition.user.rotation.z,
//                 pi.probePosition.expert.position.x, pi.probePosition.expert.position.y, pi.probePosition.expert.position.z,
//                 pi.probePosition.expert.rotation.x, pi.probePosition.expert.rotation.y, pi.probePosition.expert.rotation.z,
//                 pi.probePosition.score, pi.probePosition.maxScore,
//                 pi.probeRotationScore.score, pi.probeRotationScore.maxScore,
//                 scores.planeIdentification,
//                 pi.timeTakenSeconds.maxScore + pi.probePosition.maxScore + pi.probeRotationScore.maxScore,
//             ]
//         );

//         // 3. image_optimization (no id insert — id is auto PK)
//         const io = imageOptimization;
//         await dbClient.query(
//             `INSERT INTO image_optimization (
//                 session_id, resource_id,
//                 gain_user, gain_expert, gain_score, gain_max_score,
//                 depth_user, depth_expert, depth_score, depth_max_score,
//                 zoom_user, zoom_expert, zoom_score, zoom_max_score,
//                 focus_user, focus_expert, focus_score, focus_max_score,
//                 dynamic_range_user, dynamic_range_expert, dynamic_range_score, dynamic_range_max_score,
//                 subtotal_score, subtotal_max_score
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
//             [
//                 sessionId, resource_id,
//                 io.gain.user, io.gain.expert, io.gain.score, io.gain.maxScore,
//                 io.depth.user, io.depth.expert, io.depth.score, io.depth.maxScore,
//                 io.zoom.user, io.zoom.expert, io.zoom.score, io.zoom.maxScore,
//                 io.focus.user, io.focus.expert, io.focus.score, io.focus.maxScore,
//                 io.dynamicRange.user, io.dynamicRange.expert, io.dynamicRange.score, io.dynamicRange.maxScore,
//                 scores.imageOptimization,
//                 io.gain.maxScore + io.depth.maxScore + io.zoom.maxScore +
//                 io.focus.maxScore + io.dynamicRange.maxScore,
//             ]
//         );

//         // 4. measurements (no id insert — id is auto PK)
//         for (const m of measurements) {
//             const timestamp = Date.now();
//             const userFile = imageMap[m.type].user;
//             const expertFile = imageMap[m.type].expert;

//             const userFilePath = `measurement_images/${sessionId}_${m.type}_user_${timestamp}`;
//             const expertFilePath = `measurement_images/${sessionId}_${m.type}_expert_${timestamp}`;

//             const { error: userImgError } = await supabase.storage
//                 .from(process.env.BUCKET_NAME)
//                 .upload(userFilePath, userFile.buffer, { contentType: userFile.mimetype, upsert: true });
//             if (userImgError) throw new Error(`User image upload failed for ${m.type}: ${userImgError.message}`);
  
//             const { error: expertImgError } = await supabase.storage
//                 .from(process.env.BUCKET_NAME)
//                 .upload(expertFilePath, expertFile.buffer, { contentType: expertFile.mimetype, upsert: true });
//             if (expertImgError) throw new Error(`Expert image upload failed for ${m.type}: ${expertImgError.message}`);

//             await dbClient.query(
//                 `INSERT INTO measurements (
//                     session_id, resource_id, measurement_type, caliper_method,
//                     caliper_user_points, caliper_expert_points,
//                     caliper_placement_score, caliper_placement_max,
//                     value_user, value_expert, value_unit, value_error,
//                     value_score, value_max_score,
//                     user_image_id, expert_image_id,
//                     subtotal_score, subtotal_max_score
//                 ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
//                 [
//                     sessionId, resource_id, m.type, m.caliperPlacement.method,
//                     JSON.stringify(m.caliperPlacement.userPoints),
//                     JSON.stringify(m.caliperPlacement.expertPoints),
//                     m.caliperPlacement.score, m.caliperPlacement.maxScore,
//                     m.value.user, m.value.expert, m.value.unit, m.value.error,
//                     m.value.score, m.value.maxScore,
//                     userFilePath, expertFilePath,
//                     m.caliperPlacement.score + m.value.score,
//                     m.caliperPlacement.maxScore + m.value.maxScore,
//                 ]
//             );
//         }

//         // 5. diagnostic_interpretation (no id insert — id is auto PK)
//         const di = diagnosticInterpretation;
//         await dbClient.query(
//             `INSERT INTO diagnostic_interpretation (
//                 session_id, resource_id,
//                 chart_interp_user, chart_interp_expert, chart_interp_score, chart_interp_max_score,
//                 range_interp_user, range_interp_expert, range_interp_score, range_interp_max_score,
//                 subtotal_score, subtotal_max_score
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
//             [
//                 sessionId, resource_id,
//                 di.chartInterpretation.user, di.chartInterpretation.expert,
//                 di.chartInterpretation.score, di.chartInterpretation.maxScore,
//                 di.rangeInterpretation.user, di.rangeInterpretation.expert,
//                 di.rangeInterpretation.score, di.rangeInterpretation.maxScore,
//                 scores.diagnosticInterpretation,
//                 di.chartInterpretation.maxScore + di.rangeInterpretation.maxScore,
//             ]
//         );

//         // 6. session_scores (no id insert — id is auto PK)
//         await dbClient.query(
//             `INSERT INTO session_scores (
//                 session_id, resource_id,
//                 plane_identification_score, image_optimization_score,
//                 measurement_score, diagnostic_interpretation_score,
//                 total_score, max_score, percentage
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
//             [
//                 sessionId, resource_id,
//                 scores.planeIdentification, scores.imageOptimization,
//                 scores.measurement, scores.diagnosticInterpretation,
//                 scores.totalScore, scores.maxScore, scores.percentage,
//             ]
//         );

//         // 7. session_feedback (no id insert — id is auto PK)
//         await dbClient.query(
//             `INSERT INTO session_feedback (session_id, resource_id, overall_feedback, needs_practice)
//              VALUES ($1,$2,$3,$4)`,
//             [sessionId, resource_id, feedback.overall, JSON.stringify(feedback.needsPractice)]
//         );
        
//         //8. mark resource as practiced in practice_results
//         // 8. mark resource as practiced in practice_results
// console.log('Inserting into progress_data:', requester.user_mail, resource_id);

// await dbClient.query(
//     `INSERT INTO progress_data (user_id, resourse_id, is_completed, updated_at)
//      VALUES ($1, $2, TRUE, NOW())
//      ON CONFLICT (user_id, resourse_id)
//      DO UPDATE SET is_completed = TRUE, updated_at = NOW()`,
//     [requester.user_mail, resource_id]
// );

// console.log('progress_data insert done');
        
//         await dbClient.query('COMMIT');
//         return { status: 'Session Submitted Successfully', code: 201, data: { sessionId } };

//     } catch (err) {
//         await dbClient.query('ROLLBACK');
//         throw err;
//     } finally {
//         dbClient.release();
//     }
// };

// const submitSession = async (requester, sessionType, sessionNumber, resource_id, session_id, payload, imageMap) => {
//     const isPrivileged = [103].includes(Number(requester.role));
//     if (!isPrivileged) {
//         return { status: 'Unauthorized', code: 401, message: 'You do not have permission to submit a session.' };
//     }

//     const dbClient = await client.connect();
//     try {
//         await dbClient.query('BEGIN');

//         const { planeIdentification, imageOptimization, measurements,
//                 diagnosticInterpretation, scores, feedback } = payload;
//         const sessionId = session_id;

//         // 1. sessions
//         await dbClient.query(
//             `INSERT INTO sessions (id, user_id, session_type, session_number, resource_id)
//              VALUES ($1, $2, $3, $4, $5)`,
//             [sessionId, requester.user_mail, sessionType, sessionNumber, resource_id]
//         );
//         console.log('✅ Step 1 done: sessions');

//         // 2. plane_identification
//         const pi = planeIdentification;
//         await dbClient.query(
//             `INSERT INTO plane_identification (
//                 session_id, resource_id,
//                 time_taken_user, time_taken_expert, time_taken_score, time_taken_max_score,
//                 probe_pos_user_x, probe_pos_user_y, probe_pos_user_z,
//                 probe_rot_user_x, probe_rot_user_y, probe_rot_user_z,
//                 probe_pos_expert_x, probe_pos_expert_y, probe_pos_expert_z,
//                 probe_rot_expert_x, probe_rot_expert_y, probe_rot_expert_z,
//                 probe_position_score, probe_position_max,
//                 probe_rotation_score, probe_rotation_max,
//                 subtotal_score, subtotal_max_score
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
//             [
//                 sessionId, resource_id,
//                 pi.timeTakenSeconds.user, pi.timeTakenSeconds.expertExpected,
//                 pi.timeTakenSeconds.score, pi.timeTakenSeconds.maxScore,
//                 pi.probePosition.user.position.x, pi.probePosition.user.position.y, pi.probePosition.user.position.z,
//                 pi.probePosition.user.rotation.x, pi.probePosition.user.rotation.y, pi.probePosition.user.rotation.z,
//                 pi.probePosition.expert.position.x, pi.probePosition.expert.position.y, pi.probePosition.expert.position.z,
//                 pi.probePosition.expert.rotation.x, pi.probePosition.expert.rotation.y, pi.probePosition.expert.rotation.z,
//                 pi.probePosition.score, pi.probePosition.maxScore,
//                 pi.probeRotationScore.score, pi.probeRotationScore.maxScore,
//                 scores.planeIdentification,
//                 pi.timeTakenSeconds.maxScore + pi.probePosition.maxScore + pi.probeRotationScore.maxScore,
//             ]
//         );
//         console.log('✅ Step 2 done: plane_identification');

//         // 3. image_optimization
//         const io = imageOptimization;
//         await dbClient.query(
//             `INSERT INTO image_optimization (
//                 session_id, resource_id,
//                 gain_user, gain_expert, gain_score, gain_max_score,
//                 depth_user, depth_expert, depth_score, depth_max_score,
//                 zoom_user, zoom_expert, zoom_score, zoom_max_score,
//                 focus_user, focus_expert, focus_score, focus_max_score,
//                 dynamic_range_user, dynamic_range_expert, dynamic_range_score, dynamic_range_max_score,
//                 subtotal_score, subtotal_max_score
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
//             [
//                 sessionId, resource_id,
//                 io.gain.user, io.gain.expert, io.gain.score, io.gain.maxScore,
//                 io.depth.user, io.depth.expert, io.depth.score, io.depth.maxScore,
//                 io.zoom.user, io.zoom.expert, io.zoom.score, io.zoom.maxScore,
//                 io.focus.user, io.focus.expert, io.focus.score, io.focus.maxScore,
//                 io.dynamicRange.user, io.dynamicRange.expert, io.dynamicRange.score, io.dynamicRange.maxScore,
//                 scores.imageOptimization,
//                 io.gain.maxScore + io.depth.maxScore + io.zoom.maxScore +
//                 io.focus.maxScore + io.dynamicRange.maxScore,
//             ]
//         );
//         console.log('✅ Step 3 done: image_optimization');

//         // 4. measurements
//         for (const m of measurements) {
//             const timestamp = Date.now();
//             const userFile = imageMap[m.type].user;
//             const expertFile = imageMap[m.type].expert;

//             const userFilePath = `measurement_images/${sessionId}_${m.type}_user_${timestamp}`;
//             const expertFilePath = `measurement_images/${sessionId}_${m.type}_expert_${timestamp}`;

//             const { error: userImgError } = await supabase.storage
//                 .from(process.env.BUCKET_NAME)
//                 .upload(userFilePath, userFile.buffer, { contentType: userFile.mimetype, upsert: true });
//             if (userImgError) throw new Error(`User image upload failed for ${m.type}: ${userImgError.message}`);

//             const { error: expertImgError } = await supabase.storage
//                 .from(process.env.BUCKET_NAME)
//                 .upload(expertFilePath, expertFile.buffer, { contentType: expertFile.mimetype, upsert: true });
//             if (expertImgError) throw new Error(`Expert image upload failed for ${m.type}: ${expertImgError.message}`);

//             await dbClient.query(
//                 `INSERT INTO measurements (
//                     session_id, resource_id, measurement_type, caliper_method,
//                     caliper_user_points, caliper_expert_points,
//                     caliper_placement_score, caliper_placement_max,
//                     value_user, value_expert, value_unit, value_error,
//                     value_score, value_max_score,
//                     user_image_id, expert_image_id,
//                     subtotal_score, subtotal_max_score
//                 ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
//                 [
//                     sessionId, resource_id, m.type, m.caliperPlacement.method,
//                     JSON.stringify(m.caliperPlacement.userPoints),
//                     JSON.stringify(m.caliperPlacement.expertPoints),
//                     m.caliperPlacement.score, m.caliperPlacement.maxScore,
//                     m.value.user, m.value.expert, m.value.unit, m.value.error,
//                     m.value.score, m.value.maxScore,
//                     userFilePath, expertFilePath,
//                     m.caliperPlacement.score + m.value.score,
//                     m.caliperPlacement.maxScore + m.value.maxScore,
//                 ]
//             );
//         }
//         console.log('✅ Step 4 done: measurements');

//         // 5. diagnostic_interpretation
//         const di = diagnosticInterpretation;
//         await dbClient.query(
//             `INSERT INTO diagnostic_interpretation (
//                 session_id, resource_id,
//                 chart_interp_user, chart_interp_expert, chart_interp_score, chart_interp_max_score,
//                 range_interp_user, range_interp_expert, range_interp_score, range_interp_max_score,
//                 subtotal_score, subtotal_max_score
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
//             [
//                 sessionId, resource_id,
//                 di.chartInterpretation.user, di.chartInterpretation.expert,
//                 di.chartInterpretation.score, di.chartInterpretation.maxScore,
//                 di.rangeInterpretation.user, di.rangeInterpretation.expert,
//                 di.rangeInterpretation.score, di.rangeInterpretation.maxScore,
//                 scores.diagnosticInterpretation,
//                 di.chartInterpretation.maxScore + di.rangeInterpretation.maxScore,
//             ]
//         );
//         console.log('✅ Step 5 done: diagnostic_interpretation');

//         // 6. session_scores
//         await dbClient.query(
//             `INSERT INTO session_scores (
//                 session_id, resource_id,
//                 plane_identification_score, image_optimization_score,
//                 measurement_score, diagnostic_interpretation_score,
//                 total_score, max_score, percentage
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
//             [
//                 sessionId, resource_id,
//                 scores.planeIdentification, scores.imageOptimization,
//                 scores.measurement, scores.diagnosticInterpretation,
//                 scores.totalScore, scores.maxScore, scores.percentage,
//             ]
//         );
//         console.log('✅ Step 6 done: session_scores');

//         // 7. session_feedback
//         await dbClient.query(
//             `INSERT INTO session_feedback (session_id, resource_id, overall_feedback, needs_practice)
//              VALUES ($1,$2,$3,$4)`,
//             [sessionId, resource_id, feedback.overall, JSON.stringify(feedback.needsPractice)]
//         );
//         console.log('✅ Step 7 done: session_feedback');

//         // 8. progress_data
//         console.log('⏳ Inserting into progress_data...', { user: requester.user_mail, resource_id });
//         await dbClient.query(
//             `INSERT INTO progress_data (user_id, resourse_id, is_completed, updated_at)
//              VALUES ($1, $2, TRUE, NOW())
//              ON CONFLICT (user_id, resourse_id)
//              DO UPDATE SET is_completed = TRUE, updated_at = NOW()`,
//             [requester.user_mail, resource_id]
//         );
//         console.log('✅ Step 8 done: progress_data');

//         await dbClient.query('COMMIT');
//         console.log('✅ Transaction committed successfully');
//         return { status: 'Session Submitted Successfully', code: 201, data: { sessionId } };

//     } catch (err) {
//         await dbClient.query('ROLLBACK');
//         console.error('❌ Transaction rolled back at step:', err.message);
//         throw err;
//     } finally {
//         dbClient.release();
//     }
// };


//the above code is working

// const submitSession = async (requester, sessionType, sessionNumber, resource_id, session_id, payload, imageMap) => {
//     const isPrivileged = [103].includes(Number(requester.role));
//     if (!isPrivileged) {
//         return { status: 'Unauthorized', code: 401, message: 'You do not have permission to submit a session.' };
//     }

//     const dbClient = await client.connect();
//     try {
//         await dbClient.query('BEGIN');

//         const { planeIdentification, imageOptimization, measurements,
//                 diagnosticInterpretation, scores, feedback } = payload;
//         const sessionId = session_id;
//         const userId = requester.user_mail;
//         // 1. sessions
//         await dbClient.query(
//             `INSERT INTO sessions (id, user_id, session_type, session_number, resource_id)
//              VALUES ($1, $2, $3, $4, $5)`,
//             [sessionId, userId, sessionType, sessionNumber, resource_id]
//         );
//         console.log('✅ Step 1 done: sessions');

//         // 2. plane_identification
//         const pi = planeIdentification;
//         await dbClient.query(
//             `INSERT INTO plane_identification (
//                 id, session_id, resource_id,
//                 time_taken_user, time_taken_expert, time_taken_score, time_taken_max_score,
//                 probe_pos_user_x, probe_pos_user_y, probe_pos_user_z,
//                 probe_rot_user_x, probe_rot_user_y, probe_rot_user_z,
//                 probe_pos_expert_x, probe_pos_expert_y, probe_pos_expert_z,
//                 probe_rot_expert_x, probe_rot_expert_y, probe_rot_expert_z,
//                 probe_position_score, probe_position_max,
//                 probe_rotation_score, probe_rotation_max,
//                 subtotal_score, subtotal_max_score
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)`,
//             [
//                 userId, sessionId, resource_id,
//                 pi.timeTakenSeconds.user, pi.timeTakenSeconds.expertExpected,
//                 pi.timeTakenSeconds.score, pi.timeTakenSeconds.maxScore,
//                 pi.probePosition.user.position.x, pi.probePosition.user.position.y, pi.probePosition.user.position.z,
//                 pi.probePosition.user.rotation.x, pi.probePosition.user.rotation.y, pi.probePosition.user.rotation.z,
//                 pi.probePosition.expert.position.x, pi.probePosition.expert.position.y, pi.probePosition.expert.position.z,
//                 pi.probePosition.expert.rotation.x, pi.probePosition.expert.rotation.y, pi.probePosition.expert.rotation.z,
//                 pi.probePosition.score, pi.probePosition.maxScore,
//                 pi.probeRotationScore.score, pi.probeRotationScore.maxScore,
//                 scores.planeIdentification,
//                 pi.timeTakenSeconds.maxScore + pi.probePosition.maxScore + pi.probeRotationScore.maxScore,
//             ]
//         );
//         console.log('✅ Step 2 done: plane_identification');

//         // 3. image_optimization
//         const io = imageOptimization;
//         await dbClient.query(
//             `INSERT INTO image_optimization (
//                 id, session_id, resource_id,
//                 gain_user, gain_expert, gain_score, gain_max_score,
//                 depth_user, depth_expert, depth_score, depth_max_score,
//                 zoom_user, zoom_expert, zoom_score, zoom_max_score,
//                 focus_user, focus_expert, focus_score, focus_max_score,
//                 dynamic_range_user, dynamic_range_expert, dynamic_range_score, dynamic_range_max_score,
//                 subtotal_score, subtotal_max_score
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)`,
//             [
//                 userId, sessionId, resource_id,
//                 io.gain.user, io.gain.expert, io.gain.score, io.gain.maxScore,
//                 io.depth.user, io.depth.expert, io.depth.score, io.depth.maxScore,
//                 io.zoom.user, io.zoom.expert, io.zoom.score, io.zoom.maxScore,
//                 io.focus.user, io.focus.expert, io.focus.score, io.focus.maxScore,
//                 io.dynamicRange.user, io.dynamicRange.expert, io.dynamicRange.score, io.dynamicRange.maxScore,
//                 scores.imageOptimization,
//                 io.gain.maxScore + io.depth.maxScore + io.zoom.maxScore +
//                 io.focus.maxScore + io.dynamicRange.maxScore,
//             ]
//         );
//         console.log('✅ Step 3 done: image_optimization');

//         // 4. measurements
//         for (const m of measurements) {
//             const timestamp = Date.now();
//             const userFile = imageMap[m.type].user;
//             const expertFile = imageMap[m.type].expert;

//             const userFilePath = `measurement_images/${sessionId}_${m.type}_user_${timestamp}`;
//             const expertFilePath = `measurement_images/${sessionId}_${m.type}_expert_${timestamp}`;

//             const { error: userImgError } = await supabase.storage
//                 .from(process.env.BUCKET_NAME)
//                 .upload(userFilePath, userFile.buffer, { contentType: userFile.mimetype, upsert: true });
//             if (userImgError) throw new Error(`User image upload failed for ${m.type}: ${userImgError.message}`);

//             const { error: expertImgError } = await supabase.storage
//                 .from(process.env.BUCKET_NAME)
//                 .upload(expertFilePath, expertFile.buffer, { contentType: expertFile.mimetype, upsert: true });
//             if (expertImgError) throw new Error(`Expert image upload failed for ${m.type}: ${expertImgError.message}`);

//             await dbClient.query(
//                 `INSERT INTO measurements (
//                     id, session_id, resource_id,
//                     measurement_type, caliper_method,
//                     caliper_user_points, caliper_expert_points,
//                     caliper_placement_score, caliper_placement_max,
//                     value_user, value_expert, value_unit, value_error,
//                     value_score, value_max_score,
//                     user_image_id, expert_image_id,
//                     subtotal_score, subtotal_max_score
//                 ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
//                 [
//                     userId, sessionId, resource_id,
//                     m.type, m.caliperPlacement.method,
//                     JSON.stringify(m.caliperPlacement.userPoints),
//                     JSON.stringify(m.caliperPlacement.expertPoints),
//                     m.caliperPlacement.score, m.caliperPlacement.maxScore,
//                     m.value.user, m.value.expert, m.value.unit, m.value.error,
//                     m.value.score, m.value.maxScore,
//                     userFilePath, expertFilePath,
//                     m.caliperPlacement.score + m.value.score,
//                     m.caliperPlacement.maxScore + m.value.maxScore,
//                 ]
//             );
//         }
//         console.log('✅ Step 4 done: measurements');

//         // 5. diagnostic_interpretation
//         const di = diagnosticInterpretation;
//         await dbClient.query(
//             `INSERT INTO diagnostic_interpretation (
//                 id, session_id, resource_id,
//                 chart_interp_user, chart_interp_expert, chart_interp_score, chart_interp_max_score,
//                 range_interp_user, range_interp_expert, range_interp_score, range_interp_max_score,
//                 subtotal_score, subtotal_max_score
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
//             [
//                 userId, sessionId, resource_id,
//                 di.chartInterpretation.user, di.chartInterpretation.expert,
//                 di.chartInterpretation.score, di.chartInterpretation.maxScore,
//                 di.rangeInterpretation.user, di.rangeInterpretation.expert,
//                 di.rangeInterpretation.score, di.rangeInterpretation.maxScore,
//                 scores.diagnosticInterpretation,
//                 di.chartInterpretation.maxScore + di.rangeInterpretation.maxScore,
//             ]
//         );
//         console.log('✅ Step 5 done: diagnostic_interpretation');

//         // 6. session_scores
//         await dbClient.query(
//             `INSERT INTO session_scores (
//                 id, session_id, resource_id,
//                 plane_identification_score, image_optimization_score,
//                 measurement_score, diagnostic_interpretation_score,
//                 total_score, max_score, percentage
//             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
//             [
//                 userId, sessionId, resource_id,
//                 scores.planeIdentification, scores.imageOptimization,
//                 scores.measurement, scores.diagnosticInterpretation,
//                 scores.totalScore, scores.maxScore, scores.percentage,
//             ]
//         );
//         console.log('✅ Step 6 done: session_scores');

//         // 7. session_feedback
//         await dbClient.query(
//             `INSERT INTO session_feedback (id, session_id, resource_id, overall_feedback, needs_practice)
//              VALUES ($1,$2,$3,$4,$5)`,
//             [userId, sessionId, resource_id, feedback.overall, JSON.stringify(feedback.needsPractice)]
//         );
//         console.log('✅ Step 7 done: session_feedback');

//         // 8. progress_data
//         await dbClient.query(
//             `INSERT INTO progress_data (user_id, resourse_id, is_completed, updated_at)
//              VALUES ($1, $2, TRUE, NOW())
//              ON CONFLICT (user_id, resourse_id)
//              DO UPDATE SET is_completed = TRUE, updated_at = NOW()`,
//             [userId, resource_id]
//         );
//         console.log('✅ Step 8 done: progress_data');

//         await dbClient.query('COMMIT');
//         console.log('✅ Transaction committed successfully');
//         return { status: 'Session Submitted Successfully', code: 201, data: { sessionId } };

//     } catch (err) {
//         await dbClient.query('ROLLBACK');
//         console.error('❌ Transaction rolled back at step:', err.message);
//         throw err;
//     } finally {
//         dbClient.release();
//     }
// };


//the above code is working
const submitSession = async (
  requester,
  sessionType,
  sessionNumber,
  resource_id,
  session_id,
  payload,
  imageMap
) => {
  // ─── Auth Guard ───────────────────────────────────────────────────────────
  const PRIVILEGED_ROLES = [103];
  if (!PRIVILEGED_ROLES.includes(Number(requester.role))) {
    return {
      status: 'Unauthorized',
      code: 401,
      message: 'You do not have permission to submit a session.',
    };
  }

  // ─── Input Validation ─────────────────────────────────────────────────────
  const { planeIdentification, imageOptimization, measurements, diagnosticInterpretation, scores, feedback } = payload;

  if (!planeIdentification || !imageOptimization || !measurements || !diagnosticInterpretation || !scores || !feedback) {
    return {
      status: 'Bad Request',
      code: 400,
      message: 'Payload is missing required fields.',
    };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /** Safely parse any value to float; returns 0 if invalid */
  const f = (val) => parseFloat(val) || 0;

  /** Upload a file to Supabase storage, throws on failure */
  const uploadToStorage = async (path, file) => {
    const { error } = await supabase.storage
      .from(process.env.BUCKET_NAME)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: true });
    if (error) throw new Error(`Storage upload failed [${path}]: ${error.message}`);
  };

  // ─── Aliases ──────────────────────────────────────────────────────────────
  const sessionId = session_id;
  const userId    = requester.user_mail;
  const pi        = planeIdentification;
  const io        = imageOptimization;
  const di        = diagnosticInterpretation;

  // ─── Transaction ──────────────────────────────────────────────────────────
  const dbClient = await client.connect();
  let currentStep = 0;

  try {
    await dbClient.query('BEGIN');

    // ── Step 1: sessions ────────────────────────────────────────────────────
    currentStep = 1;
    await dbClient.query(
      `INSERT INTO sessions (id, user_id, session_type, session_number, resource_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [sessionId, userId, sessionType, sessionNumber, resource_id]
    );
    console.log('✅ Step 1 done: sessions');

    // ── Step 2: plane_identification ────────────────────────────────────────
    currentStep = 2;
    await dbClient.query(
      `INSERT INTO plane_identification (
          id, session_id, resource_id,
          time_taken_user, time_taken_expert, time_taken_score, time_taken_max_score,
          probe_pos_user_x, probe_pos_user_y, probe_pos_user_z,
          probe_rot_user_x, probe_rot_user_y, probe_rot_user_z,
          probe_pos_expert_x, probe_pos_expert_y, probe_pos_expert_z,
          probe_rot_expert_x, probe_rot_expert_y, probe_rot_expert_z,
          probe_position_score, probe_position_max,
          probe_rotation_score, probe_rotation_max,
          subtotal_score, subtotal_max_score
      ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,
          $14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25
      )`,
      [
        userId, sessionId, resource_id,

        f(pi.timeTakenSeconds.user),           // float — stored as NUMERIC
        f(pi.timeTakenSeconds.expertExpected),  // float — stored as NUMERIC
        f(pi.timeTakenSeconds.score),
        f(pi.timeTakenSeconds.maxScore),

        f(pi.probePosition.user.position.x),
        f(pi.probePosition.user.position.y),
        f(pi.probePosition.user.position.z),
        f(pi.probePosition.user.rotation.x),
        f(pi.probePosition.user.rotation.y),
        f(pi.probePosition.user.rotation.z),

        f(pi.probePosition.expert.position.x),
        f(pi.probePosition.expert.position.y),
        f(pi.probePosition.expert.position.z),
        f(pi.probePosition.expert.rotation.x),
        f(pi.probePosition.expert.rotation.y),
        f(pi.probePosition.expert.rotation.z),

        f(pi.probePosition.score),
        f(pi.probePosition.maxScore),
        f(pi.probeRotationScore.score),
        f(pi.probeRotationScore.maxScore),

        f(scores.planeIdentification),
        f(pi.timeTakenSeconds.maxScore) + f(pi.probePosition.maxScore) + f(pi.probeRotationScore.maxScore),
      ]
    );
    console.log('✅ Step 2 done: plane_identification');

    // ── Step 3: image_optimization ──────────────────────────────────────────
    currentStep = 3;
    await dbClient.query(
      `INSERT INTO image_optimization (
          id, session_id, resource_id,
          gain_user, gain_expert, gain_score, gain_max_score,
          depth_user, depth_expert, depth_score, depth_max_score,
          zoom_user, zoom_expert, zoom_score, zoom_max_score,
          focus_user, focus_expert, focus_score, focus_max_score,
          dynamic_range_user, dynamic_range_expert, dynamic_range_score, dynamic_range_max_score,
          subtotal_score, subtotal_max_score
      ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,
          $14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25
      )`,
      [
        userId, sessionId, resource_id,

        f(io.gain.user),         f(io.gain.expertExpected),         f(io.gain.score),         f(io.gain.maxScore),
        f(io.depth.user),        f(io.depth.expertExpected),        f(io.depth.score),        f(io.depth.maxScore),
        f(io.zoom.user),         f(io.zoom.expertExpected),         f(io.zoom.score),         f(io.zoom.maxScore),
        f(io.focus.user),        f(io.focus.expertExpected),        f(io.focus.score),        f(io.focus.maxScore),
        f(io.dynamicRange.user), f(io.dynamicRange.expertExpected), f(io.dynamicRange.score), f(io.dynamicRange.maxScore),

        f(scores.imageOptimization),
        f(io.gain.maxScore) + f(io.depth.maxScore) + f(io.zoom.maxScore) +
        f(io.focus.maxScore) + f(io.dynamicRange.maxScore),
      ]
    );
    console.log('✅ Step 3 done: image_optimization');

    // ── Step 4: measurements ────────────────────────────────────────────────
    currentStep = 4;
    for (const m of measurements) {
      const timestamp    = Date.now();
      const userFile     = imageMap[m.type]?.user;
      const expertFile   = imageMap[m.type]?.expert;

      if (!userFile || !expertFile) {
        throw new Error(`Missing image files for measurement type: ${m.type}`);
      }

      const userFilePath   = `measurement_images/${sessionId}_${m.type}_user_${timestamp}`;
      const expertFilePath = `measurement_images/${sessionId}_${m.type}_expert_${timestamp}`;

      await uploadToStorage(userFilePath, userFile);
      await uploadToStorage(expertFilePath, expertFile);

      await dbClient.query(
        `INSERT INTO measurements (
            id, session_id, resource_id,
            measurement_type, caliper_method,
            caliper_user_points, caliper_expert_points,
            caliper_placement_score, caliper_placement_max,
            value_user, value_expert, value_unit, value_error,
            value_score, value_max_score,
            user_image_id, expert_image_id,
            subtotal_score, subtotal_max_score
        ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,$17,$18,$19
        )`,
        [
          userId, sessionId, resource_id,
          m.type,
          m.caliperPlacement.method,
          JSON.stringify(m.caliperPlacement.userPoints),
          JSON.stringify(m.caliperPlacement.expertPoints),
          f(m.caliperPlacement.score),
          f(m.caliperPlacement.maxScore),
          f(m.value.user),
          f(m.value.expertExpected),
          m.value.unit,
          f(m.value.error),
          f(m.value.score),
          f(m.value.maxScore),
          userFilePath,
          expertFilePath,
          f(m.caliperPlacement.score) + f(m.value.score),
          f(m.caliperPlacement.maxScore) + f(m.value.maxScore),
        ]
      );
    }
    console.log('✅ Step 4 done: measurements');

    // ── Step 5: diagnostic_interpretation ───────────────────────────────────
    currentStep = 5;
    await dbClient.query(
      `INSERT INTO diagnostic_interpretation (
          id, session_id, resource_id,
          chart_interp_user, chart_interp_expert, chart_interp_score, chart_interp_max_score,
          range_interp_user, range_interp_expert, range_interp_score, range_interp_max_score,
          subtotal_score, subtotal_max_score
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        userId, sessionId, resource_id,
        di.chartInterpretation.user,
        di.chartInterpretation.expertExpected,
        f(di.chartInterpretation.score),
        f(di.chartInterpretation.maxScore),
        di.rangeInterpretation.user,
        di.rangeInterpretation.expertExpected,
        f(di.rangeInterpretation.score),
        f(di.rangeInterpretation.maxScore),
        f(scores.diagnosticInterpretation),
        f(di.chartInterpretation.maxScore) + f(di.rangeInterpretation.maxScore),
      ]
    );
    console.log('✅ Step 5 done: diagnostic_interpretation');

    // ── Step 6: session_scores ──────────────────────────────────────────────
    currentStep = 6;
    await dbClient.query(
      `INSERT INTO session_scores (
          id, session_id, resource_id,
          plane_identification_score, image_optimization_score,
          measurement_score, diagnostic_interpretation_score,
          total_score, max_score, percentage
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        userId, sessionId, resource_id,
        f(scores.planeIdentification),
        f(scores.imageOptimization),
        f(scores.measurement),
        f(scores.diagnosticInterpretation),
        f(scores.totalScore),
        f(scores.maxScore),
        f(scores.percentage),
      ]
    );
    console.log('✅ Step 6 done: session_scores');

    // ── Step 7: session_feedback ────────────────────────────────────────────
    currentStep = 7;
    await dbClient.query(
      `INSERT INTO session_feedback (id, session_id, resource_id, overall_feedback, needs_practice)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        userId, sessionId, resource_id,
        feedback.overall,
        JSON.stringify(feedback.needsPractice ?? []),
      ]
    );
    console.log('✅ Step 7 done: session_feedback');

    // ── Step 8: progress_data ───────────────────────────────────────────────
    currentStep = 8;
    await dbClient.query(
      `INSERT INTO progress_data (user_id, resourse_id, is_completed, updated_at)
       VALUES ($1, $2, TRUE, NOW())
       ON CONFLICT (user_id, resourse_id)
       DO UPDATE SET is_completed = TRUE, updated_at = NOW()`,
      [userId, resource_id]
    );
    console.log('✅ Step 8 done: progress_data');

    // ── Commit ──────────────────────────────────────────────────────────────
    await dbClient.query('COMMIT');
    console.log('✅ Transaction committed successfully');

    return {
      status: 'Session Submitted Successfully',
      code: 201,
      data: { sessionId },
    };

  } catch (err) {
    await dbClient.query('ROLLBACK');
    console.error(`❌ Transaction rolled back at Step ${currentStep}:`, err.message);
    throw err;
  } finally {
    dbClient.release();
  }
};

const isValidUUID = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const getPublicUrl = (storagePath) => {
  if (!storagePath) return null;
  const { data } = supabase.storage.from(process.env.BUCKET_NAME).getPublicUrl(storagePath);
  return data?.publicUrl || null;
};

const parseJson = (value, fallback = null) => {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (_) {
    return fallback;
  }
};

const getPracTestAttemptDetails = async (requester, resource_id) => {
  const PRIVILEGED_ROLES = [103];
  if (!PRIVILEGED_ROLES.includes(Number(requester.role))) {
    return {
      status: 'Unauthorized',
      code: 401,
      message: 'You do not have permission to view session details.',
    };
  }

  if (!isValidUUID(resource_id)) {
    return {
      status: 'Bad Request',
      code: 400,
      message: 'resource_id must be a valid UUID.',
    };
  }

  const userId = requester.user_mail;
  const { rows: columnRows } = await client.query(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'sessions'
         AND column_name = 'created_at'
     ) AS has_created_at`
  );
  const hasCreatedAt = columnRows[0]?.has_created_at === true;

  const sessionQuery = `
    SELECT
      id AS session_id,
      user_id,
      session_type,
      session_number,
      resource_id
      ${hasCreatedAt ? ', created_at' : ''}
    FROM sessions
    WHERE resource_id = $1
      AND user_id = $2
    ORDER BY
      ${hasCreatedAt ? 'created_at DESC,' : ''}
      session_number DESC,
      id DESC
  `;

  const { rows: sessions } = await client.query(sessionQuery, [resource_id, userId]);
  if (sessions.length === 0) {
    return {
      status: 'Success',
      code: 200,
      data: [],
    };
  }

  const sessionIds = sessions.map((row) => row.session_id);

  const [
    planeResult,
    imageResult,
    measurementResult,
    diagnosticResult,
    scoreResult,
    feedbackResult,
  ] = await Promise.all([
    client.query(
      `SELECT *
       FROM plane_identification
       WHERE session_id = ANY($1::uuid[])
         AND resource_id = $2
         AND id = $3`,
      [sessionIds, resource_id, userId]
    ),
    client.query(
      `SELECT *
       FROM image_optimization
       WHERE session_id = ANY($1::uuid[])
         AND resource_id = $2
         AND id = $3`,
      [sessionIds, resource_id, userId]
    ),
    client.query(
      `SELECT *
       FROM measurements
       WHERE session_id = ANY($1::uuid[])
         AND resource_id = $2
         AND id = $3
       ORDER BY session_id, measurement_type`,
      [sessionIds, resource_id, userId]
    ),
    client.query(
      `SELECT *
       FROM diagnostic_interpretation
       WHERE session_id = ANY($1::uuid[])
         AND resource_id = $2
         AND id = $3`,
      [sessionIds, resource_id, userId]
    ),
    client.query(
      `SELECT *
       FROM session_scores
       WHERE session_id = ANY($1::uuid[])
         AND resource_id = $2
         AND id = $3`,
      [sessionIds, resource_id, userId]
    ),
    client.query(
      `SELECT *
       FROM session_feedback
       WHERE session_id = ANY($1::uuid[])
         AND resource_id = $2
         AND id = $3`,
      [sessionIds, resource_id, userId]
    ),
  ]);

  const planeMap = Object.fromEntries(planeResult.rows.map((row) => [row.session_id, row]));
  const imageMap = Object.fromEntries(imageResult.rows.map((row) => [row.session_id, row]));
  const diagnosticMap = Object.fromEntries(diagnosticResult.rows.map((row) => [row.session_id, row]));
  const scoreMap = Object.fromEntries(scoreResult.rows.map((row) => [row.session_id, row]));
  const feedbackMap = Object.fromEntries(feedbackResult.rows.map((row) => [row.session_id, row]));

  const measurementsBySession = {};
  for (const row of measurementResult.rows) {
    if (!measurementsBySession[row.session_id]) measurementsBySession[row.session_id] = [];
    measurementsBySession[row.session_id].push({
      type: row.measurement_type,
      caliperPlacement: {
        method: row.caliper_method,
        userPoints: parseJson(row.caliper_user_points, []),
        expertPoints: parseJson(row.caliper_expert_points, []),
        score: Number(row.caliper_placement_score ?? 0),
        maxScore: Number(row.caliper_placement_max ?? 0),
      },
      value: {
        user: Number(row.value_user ?? 0),
        expertExpected: Number(row.value_expert ?? 0),
        unit: row.value_unit,
        error: Number(row.value_error ?? 0),
        score: Number(row.value_score ?? 0),
        maxScore: Number(row.value_max_score ?? 0),
      },
      userImagePath: row.user_image_id || null,
      expertImagePath: row.expert_image_id || null,
      userImageUrl: getPublicUrl(row.user_image_id),
      expertImageUrl: getPublicUrl(row.expert_image_id),
    });
  }

  const data = sessions.map((session, index) => {
    const plane = planeMap[session.session_id];
    const image = imageMap[session.session_id];
    const diagnostic = diagnosticMap[session.session_id];
    const scores = scoreMap[session.session_id];
    const feedback = feedbackMap[session.session_id];

    return {
      sessionId: session.session_id,
      sessionType: session.session_type,
      sessionNumber: session.session_number,
      attemptNumber: sessions.length - index,
      attemptedAt: hasCreatedAt ? session.created_at : null,
      payload: {
        planeIdentification: plane ? {
          timeTakenSeconds: {
            user: Number(plane.time_taken_user ?? 0),
            expertExpected: Number(plane.time_taken_expert ?? 0),
            score: Number(plane.time_taken_score ?? 0),
            maxScore: Number(plane.time_taken_max_score ?? 0),
          },
          probePosition: {
            user: {
              position: {
                x: Number(plane.probe_pos_user_x ?? 0),
                y: Number(plane.probe_pos_user_y ?? 0),
                z: Number(plane.probe_pos_user_z ?? 0),
              },
              rotation: {
                x: Number(plane.probe_rot_user_x ?? 0),
                y: Number(plane.probe_rot_user_y ?? 0),
                z: Number(plane.probe_rot_user_z ?? 0),
              },
            },
            expert: {
              position: {
                x: Number(plane.probe_pos_expert_x ?? 0),
                y: Number(plane.probe_pos_expert_y ?? 0),
                z: Number(plane.probe_pos_expert_z ?? 0),
              },
              rotation: {
                x: Number(plane.probe_rot_expert_x ?? 0),
                y: Number(plane.probe_rot_expert_y ?? 0),
                z: Number(plane.probe_rot_expert_z ?? 0),
              },
            },
            score: Number(plane.probe_position_score ?? 0),
            maxScore: Number(plane.probe_position_max ?? 0),
          },
          probeRotationScore: {
            score: Number(plane.probe_rotation_score ?? 0),
            maxScore: Number(plane.probe_rotation_max ?? 0),
          },
        } : null,
        imageOptimization: image ? {
          gain: {
            user: Number(image.gain_user ?? 0),
            expertExpected: Number(image.gain_expert ?? 0),
            score: Number(image.gain_score ?? 0),
            maxScore: Number(image.gain_max_score ?? 0),
          },
          depth: {
            user: Number(image.depth_user ?? 0),
            expertExpected: Number(image.depth_expert ?? 0),
            score: Number(image.depth_score ?? 0),
            maxScore: Number(image.depth_max_score ?? 0),
          },
          zoom: {
            user: Number(image.zoom_user ?? 0),
            expertExpected: Number(image.zoom_expert ?? 0),
            score: Number(image.zoom_score ?? 0),
            maxScore: Number(image.zoom_max_score ?? 0),
          },
          focus: {
            user: Number(image.focus_user ?? 0),
            expertExpected: Number(image.focus_expert ?? 0),
            score: Number(image.focus_score ?? 0),
            maxScore: Number(image.focus_max_score ?? 0),
          },
          dynamicRange: {
            user: Number(image.dynamic_range_user ?? 0),
            expertExpected: Number(image.dynamic_range_expert ?? 0),
            score: Number(image.dynamic_range_score ?? 0),
            maxScore: Number(image.dynamic_range_max_score ?? 0),
          },
        } : null,
        measurements: measurementsBySession[session.session_id] || [],
        diagnosticInterpretation: diagnostic ? {
          chartInterpretation: {
            user: diagnostic.chart_interp_user,
            expertExpected: diagnostic.chart_interp_expert,
            score: Number(diagnostic.chart_interp_score ?? 0),
            maxScore: Number(diagnostic.chart_interp_max_score ?? 0),
          },
          rangeInterpretation: {
            user: diagnostic.range_interp_user,
            expertExpected: diagnostic.range_interp_expert,
            score: Number(diagnostic.range_interp_score ?? 0),
            maxScore: Number(diagnostic.range_interp_max_score ?? 0),
          },
        } : null,
        scores: scores ? {
          planeIdentification: Number(scores.plane_identification_score ?? 0),
          imageOptimization: Number(scores.image_optimization_score ?? 0),
          measurement: Number(scores.measurement_score ?? 0),
          diagnosticInterpretation: Number(scores.diagnostic_interpretation_score ?? 0),
          totalScore: Number(scores.total_score ?? 0),
          maxScore: Number(scores.max_score ?? 0),
          percentage: Number(scores.percentage ?? 0),
        } : null,
        feedback: feedback ? {
          overall: feedback.overall_feedback,
          needsPractice: parseJson(feedback.needs_practice, []),
        } : null,
      },
    };
  });

  return {
    status: 'Success',
    code: 200,
    data,
  };
};

module.exports = { submitSession, getPracTestAttemptDetails };
// module.exports = { submitSession };
