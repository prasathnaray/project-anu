const client = require('../utils/conn')

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(Number(value) || 0, min), max);

const average = (values) => {
    if (!Array.isArray(values) || values.length === 0) return 0;
    return values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length;
};

const roundTo = (value, decimals = 1) => {
    const factor = 10 ** decimals;
    return Math.round((Number(value) || 0) * factor) / factor;
};

const percentageFromScore = (score, maxScore) => {
    const safeMax = Number(maxScore) || 0;
    if (safeMax <= 0) return null;
    return clamp((Number(score || 0) / safeMax) * 100);
};

const weightedAverage = (entries) => {
    const usable = (entries || []).filter(([value, weight]) => Number.isFinite(value) && Number(weight) > 0);
    if (usable.length === 0) return null;
    const totalWeight = usable.reduce((sum, [, weight]) => sum + Number(weight), 0);
    const weightedSum = usable.reduce((sum, [value, weight]) => sum + (Number(value) * Number(weight)), 0);
    return totalWeight > 0 ? clamp(weightedSum / totalWeight) : null;
};

const stdDev = (values) => {
    if (!Array.isArray(values) || values.length <= 1) return 0;
    const avg = average(values);
    const variance = average(values.map((value) => (Number(value || 0) - avg) ** 2));
    return Math.sqrt(variance);
};

const getCompetencyLevel = (score) => {
    const safeScore = Number(score) || 0;
    if (safeScore < 50) return 'Beginner';
    if (safeScore < 70) return 'Basic';
    if (safeScore < 85) return 'Intermediate';
    if (safeScore < 95) return 'Advanced';
    return 'Expert';
};

const getTrend = (recentAverage, historicalAverage) => {
    const delta = Number(recentAverage || 0) - Number(historicalAverage || 0);
    if (delta > 3) return 'up';
    if (delta < -3) return 'down';
    return 'neutral';
};

const getConfidenceScore = (values) => {
    const attempts = values.length;
    if (!attempts) return 0;

    const attemptFactor = Math.min(attempts / 10, 1);
    const variabilityFactor = Math.max(0, 1 - (stdDev(values) / 25));
    return clamp((attemptFactor * 0.6 + variabilityFactor * 0.4) * 100);
};

const getConfidenceLevel = (score) => {
    if (score < 45) return 'Low';
    if (score < 75) return 'Medium';
    return 'High';
};

const getMeasurementAccuracyFromError = (errorValue) => {
    const error = Math.abs(Number(errorValue));
    if (!Number.isFinite(error)) return null;
    if (error <= 1) return 100;
    if (error <= 2) return 85;
    if (error <= 3) return 70;
    if (error <= 5) return 50;
    return 20;
};

const getConsistencyScore = (values) => {
    if (!Array.isArray(values) || values.length === 0) return 0;
    const avg = average(values);
    const variance = average(values.map((value) => (Number(value || 0) - avg) ** 2));
    return clamp(100 - (variance / 4));
};

const getConsistencyLevel = (score) => {
    if (score < 60) return 'Low';
    if (score < 80) return 'Medium';
    return 'High';
};

const splitCurrentPrev = (values, fallbackValue = 0) => {
    const usable = (values || []).filter((value) => Number.isFinite(value));
    if (usable.length === 0) {
        return { value: fallbackValue, prev: fallbackValue };
    }

    const recent = usable.slice(-5);
    const earlier = usable.slice(0, -5);
    const currentValue = average(recent);
    const previousValue = earlier.length > 0 ? average(earlier) : currentValue;

    return {
        value: currentValue,
        prev: previousValue,
    };
};

const buildSkillSummary = (key, skill, values, methodology) => {
    const usableValues = (values || []).filter((value) => Number.isFinite(value));
    const attempts = usableValues.length;
    if (!attempts) {
        return null;
    }

    const historicalAverage = average(usableValues);
    const recentValues = usableValues.slice(-5);
    const recentAverage = average(recentValues);
    const smoothedScore = clamp((recentAverage * 0.7) + (historicalAverage * 0.3));
    const confidenceScore = getConfidenceScore(usableValues);

    return {
        key,
        skill,
        score: Math.round(smoothedScore),
        recentAverage: roundTo(recentAverage),
        historicalAverage: roundTo(historicalAverage),
        level: getCompetencyLevel(smoothedScore),
        trend: getTrend(recentAverage, historicalAverage),
        attempts,
        confidence: {
            score: Math.round(confidenceScore),
            level: getConfidenceLevel(confidenceScore),
        },
        methodology,
    };
};
const GenderRatio = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101, 103, 102].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles'
            })
        }
        client.query('SELECT user_gender, COUNT(user_role) FROM user_data WHERE user_role NOT IN ($1, $2) GROUP BY user_gender', ['99', '101'], (err, result) => {
            if (err) {
                return reject(err)
            }
            else {
                return resolve(result.rows)
            }
        })
    })
}
const UserStats = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101, 103].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles'
            })
        }
        client.query(`
            WITH course_resources AS (
            SELECT 
                c.course_id,
                COUNT(r.resource_id) AS total_resources
            FROM course_data c
            JOIN chapter_data ch ON c.course_id = ch.course_id
            JOIN module_data m ON ch.chapter_id = m.chapter_id
            JOIN resource_data r ON m.module_id = r.module_id
            GROUP BY c.course_id
        ),
        user_completed AS (
            SELECT 
                c.course_id,
                COUNT(r.resource_id) AS completed_resources
            FROM course_data c
            JOIN chapter_data ch ON c.course_id = ch.course_id
            JOIN module_data m ON ch.chapter_id = m.chapter_id
            JOIN resource_data r ON m.module_id = r.module_id
            JOIN progress_data p ON r.resource_id = p.resourse_id
            WHERE p.user_id = $1
            AND p.is_completed = TRUE
            GROUP BY c.course_id
        )
        SELECT 
            cr.course_id,
            cr.total_resources,
            COALESCE(uc.completed_resources, 0) AS completed_resources,
            ROUND(
                (COALESCE(uc.completed_resources, 0)::decimal / cr.total_resources) * 100, 
                2
            ) AS completion_percentage
        FROM course_resources cr
        LEFT JOIN user_completed uc 
            ON cr.course_id = uc.course_id
        ORDER BY completion_percentage DESC;
            `, [requester.user_mail], (err, result) => {
            if (err) {
                return reject(err)
            }
            else {
                return resolve(result.rows)
            }
        })
    })
}
const InteractionsAttemptStatsM = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101, 103].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view trainee profiles'
            })
        }
        client.query(`SELECT 
                ass.resource_id,
                ass.user_id,
                rd.resource_name,
                COUNT(ass.session_id) AS attempt_count
                FROM resource_data rd
                JOIN activity_submissions ass ON rd.resource_id = ass.resource_id
                WHERE ass.user_id = $1
                GROUP BY ass.resource_id, ass.user_id, rd.resource_name
                HAVING COUNT(ass.session_id) > 1;` , 
                [requester.user_mail] , (err, result) => {
                 if (err)
                 {
                    return reject(err)
                 }
                 else {
                    return resolve(result.rows)
                 }
        })})}
const ActivityLastScoresM = (requester) => {
    return new Promise((resolve, reject) => {
        const isPrivileged = [99, 101, 103].includes(Number(requester.role));
        if (!isPrivileged) {
            return resolve({
                status: 'Unauthorized',
                code: 401,
                message: 'You do not have permission to view this data'
            });
        }
        client.query(`
            WITH latest_sessions AS (
                SELECT
                    user_id,
                    resource_id,
                    session_id,
                    MAX(submitted_at) AS session_date,
                    ROW_NUMBER() OVER (
                        PARTITION BY user_id, resource_id
                        ORDER BY MAX(submitted_at) DESC
                    ) AS rn
                FROM activity_submissions
                WHERE user_id = $1
                GROUP BY user_id, resource_id, session_id
            ),
            unique_resources AS (
                SELECT DISTINCT ON (resource_id)
                    resource_id,
                    resource_name,
                    resource_type,
                    resource_topic
                FROM resource_data
            )
            SELECT
                ls.resource_id,
                ls.session_id,
                ls.session_date,
                ur.resource_name,
                ur.resource_type,
                ur.resource_topic,
                COUNT(*)                                                      AS total_questions,
                COUNT(*) FILTER (WHERE ass.is_correct = true)                AS correct_answers,
                COUNT(*) FILTER (WHERE ass.is_correct = false)               AS wrong_answers,
                ROUND(
                    COUNT(*) FILTER (WHERE ass.is_correct = true)::decimal /
                    NULLIF(COUNT(*) FILTER (WHERE ass.is_correct IS NOT NULL), 0) * 100,
                    2
                ) AS score_percentage
            FROM latest_sessions ls
            JOIN activity_submissions ass
                ON ass.session_id  = ls.session_id
               AND ass.resource_id = ls.resource_id
            JOIN unique_resources ur ON ur.resource_id = ls.resource_id
            WHERE ls.rn = 1
            GROUP BY ls.resource_id, ls.session_id, ls.session_date,
                     ur.resource_name, ur.resource_type, ur.resource_topic
            ORDER BY ls.session_date DESC;
        `, [requester.user_mail], (err, result) => {
            if (err) return reject(err);
            return resolve(result.rows);
        });
    });
};

const SkillCompetencyM = async (requester) => {
    const isPrivileged = [99, 101, 102, 103].includes(Number(requester.role));
    if (!isPrivileged) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view this data'
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

    const query = `
        WITH measurement_totals AS (
            SELECT
                session_id,
                resource_id,
                id AS user_id,
                SUM(COALESCE(caliper_placement_score, 0)) AS caliper_score,
                SUM(COALESCE(caliper_placement_max, 0)) AS caliper_max,
                SUM(COALESCE(value_score, 0)) AS value_score,
                SUM(COALESCE(value_max_score, 0)) AS value_max,
                SUM(COALESCE(subtotal_score, 0)) AS measurement_score,
                SUM(COALESCE(subtotal_max_score, 0)) AS measurement_max
            FROM measurements
            GROUP BY session_id, resource_id, id
        )
        SELECT
            s.id AS session_id,
            s.session_type,
            s.session_number,
            s.resource_id,
            rd.resource_name,
            rd.resource_topic,
            ${hasCreatedAt ? 's.created_at,' : ''}
            COALESCE(pi.time_taken_score, 0) AS time_taken_score,
            COALESCE(pi.time_taken_max_score, 0) AS time_taken_max_score,
            COALESCE(pi.probe_position_score, 0) AS probe_position_score,
            COALESCE(pi.probe_position_max, 0) AS probe_position_max,
            COALESCE(pi.probe_rotation_score, 0) AS probe_rotation_score,
            COALESCE(pi.probe_rotation_max, 0) AS probe_rotation_max,
            COALESCE(io.subtotal_score, 0) AS image_optimization_score,
            COALESCE(io.subtotal_max_score, 0) AS image_optimization_max,
            COALESCE(di.subtotal_score, 0) AS diagnostic_score,
            COALESCE(di.subtotal_max_score, 0) AS diagnostic_max,
            COALESCE(mt.caliper_score, 0) AS caliper_score,
            COALESCE(mt.caliper_max, 0) AS caliper_max,
            COALESCE(mt.value_score, 0) AS value_score,
            COALESCE(mt.value_max, 0) AS value_max,
            COALESCE(mt.measurement_score, 0) AS measurement_score,
            COALESCE(mt.measurement_max, 0) AS measurement_max,
            COALESCE(ss.total_score, 0) AS total_score,
            COALESCE(ss.max_score, 0) AS total_max_score,
            COALESCE(ss.percentage, 0) AS total_percentage
        FROM sessions s
        LEFT JOIN plane_identification pi
            ON pi.session_id = s.id
           AND pi.resource_id = s.resource_id
           AND pi.id = $1
        LEFT JOIN image_optimization io
            ON io.session_id = s.id
           AND io.resource_id = s.resource_id
           AND io.id = $1
        LEFT JOIN diagnostic_interpretation di
            ON di.session_id = s.id
           AND di.resource_id = s.resource_id
           AND di.id = $1
        LEFT JOIN measurement_totals mt
            ON mt.session_id = s.id
           AND mt.resource_id = s.resource_id
           AND mt.user_id = $1
        LEFT JOIN session_scores ss
            ON ss.session_id = s.id
           AND ss.resource_id = s.resource_id
           AND ss.id = $1
        LEFT JOIN resource_data rd
            ON rd.resource_id = s.resource_id
        WHERE s.user_id = $1
          AND (
                (LOWER(TRIM(s.session_type)) = 'practice' AND TRIM(s.session_number::text) IN ('3', '4'))
             OR (LOWER(TRIM(s.session_type)) = 'test' AND TRIM(s.session_number::text) IN ('1', '2'))
          )
        ORDER BY
            ${hasCreatedAt ? 's.created_at ASC,' : ''}
            CASE WHEN LOWER(TRIM(s.session_type)) = 'practice' THEN 0 ELSE 1 END,
            COALESCE(NULLIF(REGEXP_REPLACE(s.session_number::text, '[^0-9]', '', 'g'), '')::int, 0),
            s.id
    `;

    const { rows } = await client.query(query, [userId]);

    const attempts = rows.map((row) => {
        const probeHandling = percentageFromScore(
            Number(row.probe_position_score) + Number(row.probe_rotation_score),
            Number(row.probe_position_max) + Number(row.probe_rotation_max)
        );

        const planeCorrectnessProxy = percentageFromScore(row.measurement_score, row.measurement_max);
        const planeAcquisitionTime = percentageFromScore(row.time_taken_score, row.time_taken_max_score);
        const planeAcquisition = weightedAverage([
            [planeCorrectnessProxy, 0.6],
            [planeAcquisitionTime, 0.4],
        ]);

        const imageOptimisation = percentageFromScore(row.image_optimization_score, row.image_optimization_max);
        const interpretation = percentageFromScore(row.diagnostic_score, row.diagnostic_max);

        return {
            sessionId: row.session_id,
            sessionType: row.session_type,
            sessionNumber: row.session_number,
            resourceId: row.resource_id,
            resourceName: row.resource_name,
            resourceTopic: row.resource_topic,
            attemptedAt: hasCreatedAt ? row.created_at : null,
            subskills: {
                probeHandling,
                planeAcquisition,
                imageOptimisation,
                interpretation,
            },
        };
    });

    const skills = [
        buildSkillSummary(
            'probe_handling',
            'Probe Handling',
            attempts.map((attempt) => attempt.subskills.probeHandling),
            'Practice 3, Practice 4, Test 1 and Test 2 probe position and rotation scores'
        ),
        buildSkillSummary(
            'plane_acquisition',
            'Plane Acquisition',
            attempts.map((attempt) => attempt.subskills.planeAcquisition),
            '0.6 x measurement-image correctness proxy + 0.4 x acquisition-time score across targeted sessions'
        ),
        buildSkillSummary(
            'image_optimisation',
            'Image optimisation',
            attempts.map((attempt) => attempt.subskills.imageOptimisation),
            'Expert-versus-user gain, depth, zoom, focus and dynamic-range alignment across targeted sessions'
        ),
        buildSkillSummary(
            'interpretation_emotional_intelligence',
            'Interpretation & Emotional Intelligence',
            attempts.map((attempt) => attempt.subskills.interpretation),
            'Diagnostic interpretation scoring currently available from chart and range interpretation telemetry'
        ),
    ].filter(Boolean);

    const overallScore = skills.length ? average(skills.map((skill) => skill.score)) : 0;
    const overallConfidenceScore = skills.length ? average(skills.map((skill) => skill.confidence.score)) : 0;
    const weakestSkill = skills.length
        ? [...skills].sort((a, b) => a.score - b.score)[0]
        : null;

    return {
        status: 'Success',
        code: 200,
        scope: {
            practices: ['Practice 3', 'Practice 4'],
            tests: ['Test 1', 'Test 2'],
        },
        attemptsConsidered: attempts.length,
        overall: {
            score: Math.round(overallScore),
            level: getCompetencyLevel(overallScore),
            confidence: {
                score: Math.round(overallConfidenceScore),
                level: getConfidenceLevel(overallConfidenceScore),
            },
        },
        weakestSkill: weakestSkill
            ? {
                key: weakestSkill.key,
                skill: weakestSkill.skill,
                score: weakestSkill.score,
                level: weakestSkill.level,
            }
            : null,
        skills,
    };
};

const PerformanceMetricsM = async (requester) => {
    const isPrivileged = [99, 101, 102, 103].includes(Number(requester.role));
    if (!isPrivileged) {
        return {
            status: 'Unauthorized',
            code: 401,
            message: 'You do not have permission to view this data'
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

    const query = `
        WITH measurement_totals AS (
            SELECT
                session_id,
                resource_id,
                id AS user_id,
                AVG(ABS(value_error)) FILTER (WHERE value_error IS NOT NULL) AS avg_value_error,
                SUM(COALESCE(caliper_placement_score, 0)) AS caliper_score,
                SUM(COALESCE(caliper_placement_max, 0)) AS caliper_max,
                SUM(COALESCE(value_score, 0)) AS value_score,
                SUM(COALESCE(value_max_score, 0)) AS value_max,
                SUM(COALESCE(subtotal_score, 0)) AS measurement_score,
                SUM(COALESCE(subtotal_max_score, 0)) AS measurement_max
            FROM measurements
            GROUP BY session_id, resource_id, id
        )
        SELECT
            s.id AS session_id,
            s.session_type,
            s.session_number,
            s.resource_id,
            ${hasCreatedAt ? 's.created_at,' : ''}
            COALESCE(pi.time_taken_user, 0) AS time_taken_user,
            COALESCE(pi.time_taken_score, 0) AS time_taken_score,
            COALESCE(pi.time_taken_max_score, 0) AS time_taken_max_score,
            COALESCE(pi.probe_position_score, 0) AS probe_position_score,
            COALESCE(pi.probe_position_max, 0) AS probe_position_max,
            COALESCE(pi.probe_rotation_score, 0) AS probe_rotation_score,
            COALESCE(pi.probe_rotation_max, 0) AS probe_rotation_max,
            mt.avg_value_error AS avg_value_error,
            COALESCE(mt.caliper_score, 0) AS caliper_score,
            COALESCE(mt.caliper_max, 0) AS caliper_max,
            COALESCE(mt.measurement_score, 0) AS measurement_score,
            COALESCE(mt.measurement_max, 0) AS measurement_max,
            COALESCE(ss.total_score, 0) AS total_score,
            COALESCE(ss.max_score, 0) AS total_max_score
        FROM sessions s
        LEFT JOIN plane_identification pi
            ON pi.session_id = s.id
           AND pi.resource_id = s.resource_id
           AND pi.id = $1
        LEFT JOIN measurement_totals mt
            ON mt.session_id = s.id
           AND mt.resource_id = s.resource_id
           AND mt.user_id = $1
        LEFT JOIN session_scores ss
            ON ss.session_id = s.id
           AND ss.resource_id = s.resource_id
           AND ss.id = $1
        WHERE s.user_id = $1
          AND (
                (LOWER(TRIM(s.session_type)) = 'practice' AND TRIM(s.session_number::text) IN ('3', '4'))
             OR (LOWER(TRIM(s.session_type)) = 'test' AND TRIM(s.session_number::text) IN ('1', '2'))
          )
        ORDER BY
            ${hasCreatedAt ? 's.created_at ASC,' : ''}
            CASE WHEN LOWER(TRIM(s.session_type)) = 'practice' THEN 0 ELSE 1 END,
            COALESCE(NULLIF(REGEXP_REPLACE(s.session_number::text, '[^0-9]', '', 'g'), '')::int, 0),
            s.id
    `;

    const { rows } = await client.query(query, [userId]);

    const attempts = rows.map((row) => {
        const measurementAccuracy = getMeasurementAccuracyFromError(row.avg_value_error);
        const landmarkAccuracy = percentageFromScore(row.caliper_score, row.caliper_max);
        const planeAccuracyProxy = weightedAverage([
            [percentageFromScore(row.measurement_score, row.measurement_max), 0.7],
            [percentageFromScore(row.total_score, row.total_max_score), 0.3],
        ]);
        const probeHandling = percentageFromScore(
            Number(row.probe_position_score) + Number(row.probe_rotation_score),
            Number(row.probe_position_max) + Number(row.probe_rotation_max)
        );
        const timeEfficiency = percentageFromScore(row.time_taken_score, row.time_taken_max_score);

        const accuracy = weightedAverage([
            [measurementAccuracy, 0.4],
            [landmarkAccuracy, 0.2],
            [planeAccuracyProxy, 0.2],
            [probeHandling, 0.1],
            [timeEfficiency, 0.1],
        ]) ?? 0;

        const errorRate = clamp(100 - accuracy);
        const timePerTaskMinutes = Number(row.time_taken_user || 0) / 60;

        return {
            sessionId: row.session_id,
            sessionType: row.session_type,
            sessionNumber: row.session_number,
            attemptedAt: hasCreatedAt ? row.created_at : null,
            accuracy,
            errorRate,
            timePerTaskMinutes,
            breakdown: {
                measurementAccuracy,
                landmarkAccuracy,
                planeAccuracy: planeAccuracyProxy,
                probeHandling,
                timeEfficiency,
            },
        };
    });

    const accuracySeries = attempts.map((attempt) => attempt.accuracy);
    const errorRateSeries = attempts.map((attempt) => attempt.errorRate);
    const timeSeries = attempts.map((attempt) => attempt.timePerTaskMinutes);
    const consistencyScore = getConsistencyScore(accuracySeries);

    const accuracyTrend = splitCurrentPrev(accuracySeries);
    const errorRateTrend = splitCurrentPrev(errorRateSeries);
    const timeTrend = splitCurrentPrev(timeSeries);

    const breakdownCurrent = {
        measurementAccuracy: roundTo(average(attempts.map((attempt) => attempt.breakdown.measurementAccuracy).filter(Number.isFinite))),
        landmarkAccuracy: roundTo(average(attempts.map((attempt) => attempt.breakdown.landmarkAccuracy).filter(Number.isFinite))),
        planeAccuracy: roundTo(average(attempts.map((attempt) => attempt.breakdown.planeAccuracy).filter(Number.isFinite))),
        probeHandling: roundTo(average(attempts.map((attempt) => attempt.breakdown.probeHandling).filter(Number.isFinite))),
        timeEfficiency: roundTo(average(attempts.map((attempt) => attempt.breakdown.timeEfficiency).filter(Number.isFinite))),
    };

    return {
        status: 'Success',
        code: 200,
        scope: {
            practices: ['Practice 3', 'Practice 4'],
            tests: ['Test 1', 'Test 2'],
        },
        attemptsConsidered: attempts.length,
        metrics: {
            accuracy: {
                value: roundTo(accuracyTrend.value),
                prev: roundTo(accuracyTrend.prev),
                unit: '%',
            },
            timePerTask: {
                value: roundTo(timeTrend.value),
                prev: roundTo(timeTrend.prev),
                unit: 'min',
            },
            errorRate: {
                value: roundTo(errorRateTrend.value),
                prev: roundTo(errorRateTrend.prev),
                unit: '%',
            },
            consistency: {
                value: Math.round(consistencyScore),
                label: getConsistencyLevel(consistencyScore),
            },
        },
        breakdown: breakdownCurrent,
        methodology: {
            accuracyWeights: {
                measurementAccuracy: 0.4,
                landmarkAccuracy: 0.2,
                planeAccuracyProxy: 0.2,
                probeHandling: 0.1,
                timeEfficiency: 0.1,
            },
            measurementBandsMm: [
                { min: 0, max: 1, score: 100 },
                { min: 1, max: 2, score: 85 },
                { min: 2, max: 3, score: 70 },
                { min: 3, max: 5, score: 50 },
                { min: 5, max: null, score: 20 },
            ],
            note: 'Plane acquisition currently uses a proxy derived from stored measurement and total session alignment because explicit image similarity telemetry is not persisted yet.',
        },
    };
};

module.exports = { GenderRatio, UserStats, InteractionsAttemptStatsM, ActivityLastScoresM, SkillCompetencyM, PerformanceMetricsM }
