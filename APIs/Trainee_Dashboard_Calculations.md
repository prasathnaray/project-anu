# Trainee Dashboard Calculation Guide

This document explains how LMS trainee dashboard metrics are calculated in the current backend implementation.

Product-owner version: `APIs/Trainee_Dashboard_Calculations_Product_Owner.md`

Primary implementation files:

- `server/v1/model/AnalyticsModel.js`
- `server/v1/controller/Analytics.js`
- `server/v1/routes/UserStatusRoute.js`
- `server/v1/routes/activityLastScoresRoute.js`
- `server/v1/routes/InteractionsAttemptStats.js`
- `server/v1/routes/skillCompetencyRoute.js`
- `server/v1/routes/performanceMetricsRoute.js`

## Shared Rules

### Auth scope

All trainee dashboard analytics are calculated for the authenticated user:

```text
user_id = requester.user_mail
```

The analytics endpoints allow roles `99`, `101`, `102`, and `103` where the model permits them. The existing trainee dashboard uses role `103` user data.

### Practice/test scope for competency and performance

Skill competency and performance metrics only use these LMS/VR scoring sessions:

```text
Practice 3
Practice 4
Test 1
Test 2
```

In SQL this is selected from `sessions` where:

```text
(LOWER(TRIM(session_type)) = 'practice' AND session_number IN ('3', '4'))
OR
(LOWER(TRIM(session_type)) = 'test' AND session_number IN ('1', '2'))
```

Rows are ordered by `sessions.created_at` when that column exists. If not, they are ordered by practice/test type, numeric session number, and session id.

### Numeric helpers

The backend uses these common helper rules:

```text
clamp(value) = value limited to 0..100
average(values) = sum(values) / count(values), or 0 when empty
roundTo(value) = rounded to 1 decimal place by default
percentageFromScore(score, maxScore) = clamp(score / maxScore * 100)
```

If `maxScore <= 0`, `percentageFromScore` returns `null`. Weighted averages ignore `null`, non-finite values, and weights less than or equal to 0.

## Learning Path Progress

Endpoint:

```http
GET /api/v1/user-stats
```

Source tables:

- `course_data`
- `chapter_data`
- `module_data`
- `resource_data`
- `progress_data`

Formula per course:

```text
total_resources = count(resource_data.resource_id in the course)
completed_resources = count(resource_data.resource_id where progress_data.user_id = requester.user_mail and progress_data.is_completed = true)
completion_percentage = round((completed_resources / total_resources) * 100, 2)
```

The result is ordered by `completion_percentage` descending.

Dashboard usage:

- Overall progress chart
- Completed resources count
- Total resources count
- Course-level completion percentage

## Last Activity Scores

Endpoint:

```http
GET /api/v1/activity-last-scores
```

Source tables:

- `activity_submissions`
- `resource_data`

The backend first finds the latest submitted session per user and resource:

```text
latest session = latest MAX(submitted_at) grouped by user_id, resource_id, session_id
```

Then for the latest session of each resource:

```text
total_questions = count(activity_submissions rows)
correct_answers = count(rows where is_correct = true)
wrong_answers = count(rows where is_correct = false)
score_percentage = round(correct_answers / count(rows where is_correct is not null) * 100, 2)
```

Dashboard usage:

- Last score per resource
- Correct/wrong answer summary
- Latest attempted activity

## Reattempt / Interaction Attempts

Endpoint:

```http
GET /api/v1/interactions-attempt-stats
```

Source tables:

- `activity_submissions`
- `resource_data`

Current formula:

```text
attempt_count = count(activity_submissions.session_id) per user and resource
```

Only resources with `attempt_count > 1` are returned.

Important current behavior:

- The current SQL counts submission rows, not distinct sessions.
- If one session submits multiple question rows, the count can be higher than the number of unique attempts.
- If the dashboard needs unique reattempts, use `COUNT(DISTINCT session_id)` instead.

## Skill Competency

Endpoint:

```http
GET /api/v1/skill-competency
```

Source tables:

- `sessions`
- `plane_identification`
- `image_optimization`
- `diagnostic_interpretation`
- `measurements`
- `session_scores`
- `resource_data`

### Per-attempt subskill scores

#### Probe Handling

```text
probeHandling =
  percentageFromScore(
    probe_position_score + probe_rotation_score,
    probe_position_max + probe_rotation_max
  )
```

#### Plane Acquisition

Plane acquisition currently uses a proxy because explicit plane/image similarity telemetry is not persisted.

```text
measurement correctness proxy = percentageFromScore(measurement_score, measurement_max)
acquisition time score = percentageFromScore(time_taken_score, time_taken_max_score)

planeAcquisition =
  weightedAverage([
    measurement correctness proxy at 60%,
    acquisition time score at 40%
  ])
```

#### Image Optimisation

```text
imageOptimisation =
  percentageFromScore(image_optimization_score, image_optimization_max)
```

This score comes from stored expert-versus-user image setting alignment:

- Gain
- Depth
- Zoom
- Focus
- Dynamic range

#### Interpretation and Emotional Intelligence

```text
interpretation =
  percentageFromScore(diagnostic_score, diagnostic_max)
```

This is currently based on diagnostic interpretation telemetry:

- Chart interpretation
- Range interpretation

### Per-skill summary calculation

For each skill, the backend builds a summary from all available per-attempt values:

```text
historicalAverage = average(all attempt values)
recentAverage = average(last 5 attempt values)
skillScore = clamp((recentAverage * 0.7) + (historicalAverage * 0.3))
```

The returned `score` is rounded to a whole number.

### Competency levels

```text
0-49   = Beginner
50-69  = Basic
70-84  = Intermediate
85-94  = Advanced
95-100 = Expert
```

### Trend

```text
delta = recentAverage - historicalAverage

delta > 3   = up
delta < -3  = down
otherwise  = neutral
```

### Confidence

Confidence reflects both attempt volume and score stability:

```text
attemptFactor = min(attempt_count / 10, 1)
variabilityFactor = max(0, 1 - (standardDeviation(values) / 25))
confidenceScore = clamp(((attemptFactor * 0.6) + (variabilityFactor * 0.4)) * 100)
```

Confidence labels:

```text
0-44   = Low
45-74  = Medium
75-100 = High
```

### Overall competency

```text
overall.score = round(average(skill scores))
overall.level = competency level from overall.score
overall.confidence.score = round(average(skill confidence scores))
overall.confidence.level = confidence label from overall confidence score
weakestSkill = skill with the lowest score
```

Dashboard usage:

- Skill competency overview
- Overall trainee competency
- Skill trend arrows
- Weakest skill / focus area
- Confidence level for whether the score is reliable

## Performance Metrics

Endpoint:

```http
GET /api/v1/performance-metrics
```

Source tables:

- `sessions`
- `plane_identification`
- `measurements`
- `session_scores`

### Per-attempt metric components

#### Measurement Accuracy

The backend calculates average absolute measurement error from `measurements.value_error`:

```text
avg_value_error = AVG(ABS(value_error))
```

It is converted to a score by bands:

```text
0 mm to 1 mm       = 100
>1 mm to 2 mm      = 85
>2 mm to 3 mm      = 70
>3 mm to 5 mm      = 50
>5 mm              = 20
```

#### Landmark Accuracy

```text
landmarkAccuracy =
  percentageFromScore(caliper_placement_score, caliper_placement_max)
```

#### Plane Accuracy Proxy

```text
measurementPercent = percentageFromScore(measurement_score, measurement_max)
totalSessionPercent = percentageFromScore(total_score, total_max_score)

planeAccuracyProxy =
  weightedAverage([
    measurementPercent at 70%,
    totalSessionPercent at 30%
  ])
```

#### Probe Handling

```text
probeHandling =
  percentageFromScore(
    probe_position_score + probe_rotation_score,
    probe_position_max + probe_rotation_max
  )
```

#### Time Efficiency

```text
timeEfficiency =
  percentageFromScore(time_taken_score, time_taken_max_score)
```

### Accuracy

Per-attempt accuracy is a weighted average:

```text
accuracy =
  measurementAccuracy * 0.4
  + landmarkAccuracy * 0.2
  + planeAccuracyProxy * 0.2
  + probeHandling * 0.1
  + timeEfficiency * 0.1
```

When one component is missing, the weighted average is recalculated using only available components and their weights. If all components are missing, accuracy defaults to `0`.

### Error Rate

```text
errorRate = clamp(100 - accuracy)
```

### Time Per Task

```text
timePerTaskMinutes = time_taken_user / 60
```

### Current and previous values

For accuracy, error rate, and time per task:

```text
current value = average(last 5 attempts)
previous value = average(all attempts before the last 5)
```

If there are no earlier attempts, `previous value` equals `current value`.

### Consistency

Consistency is calculated from the accuracy series:

```text
variance = average((accuracy - averageAccuracy)^2)
consistencyScore = clamp(100 - (variance / 4))
```

Consistency labels:

```text
0-59   = Low
60-79  = Medium
80-100 = High
```

### Breakdown values

The `breakdown` object returns the average of each component across all considered attempts:

```text
measurementAccuracy = average(valid measurementAccuracy values)
landmarkAccuracy = average(valid landmarkAccuracy values)
planeAccuracy = average(valid planeAccuracyProxy values)
probeHandling = average(valid probeHandling values)
timeEfficiency = average(valid timeEfficiency values)
```

Dashboard usage:

- Accuracy card
- Time per task card
- Error rate card
- Consistency card
- Performance breakdown chart

## Recommended Dashboard Mapping

| Dashboard item | Endpoint | Field/formula |
| --- | --- | --- |
| Learning path progress | `GET /api/v1/user-stats` | `completion_percentage` |
| Completed resources | `GET /api/v1/user-stats` | `completed_resources / total_resources` |
| Last score | `GET /api/v1/activity-last-scores` | `score_percentage` from latest session per resource |
| Reattempts | `GET /api/v1/interactions-attempt-stats` | `attempt_count`; use `COUNT(DISTINCT session_id)` if unique attempts are required |
| Overall competency | `GET /api/v1/skill-competency` | `overall.score`, `overall.level` |
| Skill levels | `GET /api/v1/skill-competency` | `skills[].score`, `skills[].level` |
| Skill trend | `GET /api/v1/skill-competency` | `skills[].trend` |
| Weakest skill | `GET /api/v1/skill-competency` | `weakestSkill` |
| Accuracy | `GET /api/v1/performance-metrics` | `metrics.accuracy.value` |
| Previous accuracy | `GET /api/v1/performance-metrics` | `metrics.accuracy.prev` |
| Time per task | `GET /api/v1/performance-metrics` | `metrics.timePerTask.value` |
| Error rate | `GET /api/v1/performance-metrics` | `metrics.errorRate.value` |
| Consistency | `GET /api/v1/performance-metrics` | `metrics.consistency.value`, `metrics.consistency.label` |

## Notes for Frontend Implementation

- Show `attemptsConsidered` beside competency/performance metrics when the value is low, because confidence improves as attempts increase.
- Use `confidence.level` from skill competency to explain whether a skill score is reliable.
- Treat `null` component values as "not enough data" rather than `0` in the UI.
- For trend labels, `up` and `down` are based on a change greater than 3 percentage points.
- Current performance values are based on the last 5 attempts, not all-time averages.
- Plane acquisition and plane accuracy are proxies until explicit image similarity or plane-correctness telemetry is stored.
