const client = require('../utils/conn');
const supabase = require('../utils/supaBaseConfig.js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const submitSession = (requester, sessionType, sessionNumber, payload, files) => {
    return new Promise(async (resolve, reject) => {
        const isPrivileged = [103].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to submit a session.',
            });
        }

        const dbClient = await client.connect();
        try {
            await dbClient.query('BEGIN');

            // 1. sessions
            const sessionResult = await dbClient.query(
                `INSERT INTO sessions (user_id, session_type, session_number)
                 VALUES ($1, $2, $3) RETURNING id`,
                [requester.user_mail, sessionType, sessionNumber]
            );
            const sessionId = sessionResult.rows[0].id;

            const { planeIdentification, imageOptimization, measurements,
                    diagnosticInterpretation, scores, feedback } = payload;

            // 2. plane_identification
            const pi = planeIdentification;
            await dbClient.query(
                `INSERT INTO plane_identification (
                    id, session_id,
                    time_taken_user, time_taken_expert, time_taken_score, time_taken_max_score,
                    probe_pos_user_x, probe_pos_user_y, probe_pos_user_z,
                    probe_rot_user_x, probe_rot_user_y, probe_rot_user_z,
                    probe_pos_expert_x, probe_pos_expert_y, probe_pos_expert_z,
                    probe_rot_expert_x, probe_rot_expert_y, probe_rot_expert_z,
                    probe_position_score, probe_position_max,
                    probe_rotation_score, probe_rotation_max,
                    subtotal_score, subtotal_max_score
                ) VALUES (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
                )`,
                [
                    requester.user_mail, sessionId,
                    pi.timeTakenSeconds.user, pi.timeTakenSeconds.expertExpected,
                    pi.timeTakenSeconds.score, pi.timeTakenSeconds.maxScore,
                    pi.probePosition.user.position.x, pi.probePosition.user.position.y,
                    pi.probePosition.user.position.z,
                    pi.probePosition.user.rotation.x, pi.probePosition.user.rotation.y,
                    pi.probePosition.user.rotation.z,
                    pi.probePosition.expert.position.x, pi.probePosition.expert.position.y,
                    pi.probePosition.expert.position.z,
                    pi.probePosition.expert.rotation.x, pi.probePosition.expert.rotation.y,
                    pi.probePosition.expert.rotation.z,
                    pi.probePosition.score, pi.probePosition.maxScore,
                    pi.probeRotationScore.score, pi.probeRotationScore.maxScore,
                    scores.planeIdentification,
                    pi.timeTakenSeconds.maxScore + pi.probePosition.maxScore + pi.probeRotationScore.maxScore,
                ]
            );

            // 3. image_optimization
            const io = imageOptimization;
            await dbClient.query(
                `INSERT INTO image_optimization (
                    id, session_id,
                    gain_user, gain_expert, gain_score, gain_max_score,
                    depth_user, depth_expert, depth_score, depth_max_score,
                    zoom_user, zoom_expert, zoom_score, zoom_max_score,
                    focus_user, focus_expert, focus_score, focus_max_score,
                    dynamic_range_user, dynamic_range_expert, dynamic_range_score, dynamic_range_max_score,
                    subtotal_score, subtotal_max_score
                ) VALUES (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
                )`,
                [
                    requester.user_mail, sessionId,
                    io.gain.user, io.gain.expert, io.gain.score, io.gain.maxScore,
                    io.depth.user, io.depth.expert, io.depth.score, io.depth.maxScore,
                    io.zoom.user, io.zoom.expert, io.zoom.score, io.zoom.maxScore,
                    io.focus.user, io.focus.expert, io.focus.score, io.focus.maxScore,
                    io.dynamicRange.user, io.dynamicRange.expert,
                    io.dynamicRange.score, io.dynamicRange.maxScore,
                    scores.imageOptimization,
                    io.gain.maxScore + io.depth.maxScore + io.zoom.maxScore +
                    io.focus.maxScore + io.dynamicRange.maxScore,
                ]
            );

            // 4. measurements (BPD + HC)
            for (let i = 0; i < measurements.length; i++) {
                const m = measurements[i];

                // Upload user image
                const userFile = files.userImages[i];
                const userFilePath = `measurement_images/${sessionId}_${m.type}_user_${Date.now()}`;
                const { error: userImgError } = await supabase.storage
                    .from(process.env.BUCKET_NAME)
                    .upload(userFilePath, userFile.buffer, {
                        contentType: userFile.mimetype,
                        upsert: true,
                    });
                if (userImgError) throw new Error(`User image upload failed: ${userImgError.message}`);

                // Upload expert image
                const expertFile = files.expertImages[i];
                const expertFilePath = `measurement_images/${sessionId}_${m.type}_expert_${Date.now()}`;
                const { error: expertImgError } = await supabase.storage
                    .from(process.env.BUCKET_NAME)
                    .upload(expertFilePath, expertFile.buffer, {
                        contentType: expertFile.mimetype,
                        upsert: true,
                    });
                if (expertImgError) throw new Error(`Expert image upload failed: ${expertImgError.message}`);

                await dbClient.query(
                    `INSERT INTO measurements (
                        id, session_id, measurement_type, caliper_method,
                        caliper_user_points, caliper_expert_points,
                        caliper_placement_score, caliper_placement_max,
                        value_user, value_expert, value_unit, value_error,
                        value_score, value_max_score,
                        user_image_id, expert_image_id,
                        subtotal_score, subtotal_max_score
                    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
                    [
                        requester.user_mail, sessionId, m.type, m.caliperPlacement.method,
                        JSON.stringify(m.caliperPlacement.userPoints),
                        JSON.stringify(m.caliperPlacement.expertPoints),
                        m.caliperPlacement.score, m.caliperPlacement.maxScore,
                        m.value.user, m.value.expert, m.value.unit, m.value.error,
                        m.value.score, m.value.maxScore,
                        userFilePath, expertFilePath,
                        m.caliperPlacement.score + m.value.score,
                        m.caliperPlacement.maxScore + m.value.maxScore,
                    ]
                );
            }

            // 5. diagnostic_interpretation
            const di = diagnosticInterpretation;
            await dbClient.query(
                `INSERT INTO diagnostic_interpretation (
                    id, session_id,
                    chart_interp_user, chart_interp_expert, chart_interp_score, chart_interp_max_score,
                    range_interp_user, range_interp_expert, range_interp_score, range_interp_max_score,
                    subtotal_score, subtotal_max_score
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
                [
                    requester.user_mail, sessionId,
                    di.chartInterpretation.user, di.chartInterpretation.expert,
                    di.chartInterpretation.score, di.chartInterpretation.maxScore,
                    di.rangeInterpretation.user, di.rangeInterpretation.expert,
                    di.rangeInterpretation.score, di.rangeInterpretation.maxScore,
                    scores.diagnosticInterpretation,
                    di.chartInterpretation.maxScore + di.rangeInterpretation.maxScore,
                ]
            );

            // 6. session_scores
            await dbClient.query(
                `INSERT INTO session_scores (
                    id, session_id,
                    plane_identification_score, image_optimization_score,
                    measurement_score, diagnostic_interpretation_score,
                    total_score, max_score, percentage
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                [
                    requester.user_mail, sessionId,
                    scores.planeIdentification, scores.imageOptimization,
                    scores.measurement, scores.diagnosticInterpretation,
                    scores.totalScore, scores.maxScore, scores.percentage,
                ]
            );

            // 7. session_feedback
            await dbClient.query(
                `INSERT INTO session_feedback (id, session_id, overall_feedback, needs_practice)
                 VALUES ($1,$2,$3,$4)`,
                [requester.user_mail, sessionId, feedback.overall, JSON.stringify(feedback.needsPractice)]
            );

            await dbClient.query('COMMIT');

            return resolve({
                status: 'Session Submitted Successfully',
                code: 201,
                data: { sessionId },
            });
        } catch (err) {
            await dbClient.query('ROLLBACK');
            return reject(err);
        } finally {
            dbClient.release();
        }
    });
};

module.exports = { submitSession };