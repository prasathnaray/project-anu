# Submit MSOB API - Product Guide

This document explains the `submit-msob` API in product language. It is used for Mindsparks and OB Booster activity submissions.

## 1. What This API Does

The API records a trainee's submission for a Mindsparks or OB Booster resource.

In simple terms, it stores:

- Which trainee submitted the activity
- Which resource was submitted
- Which activity type was submitted
- The answer or timing data for that activity
- Whether the answer was correct, when applicable
- A session ID for grouping submissions
- A completion record so the resource is marked as completed

## 2. Endpoint

```text
POST http://{{base_url_prod}}/api/v1/submit-msob
```

Local example:

```text
POST http://localhost:4004/api/v1/submit-msob
```

## 3. Authentication

Authentication is required.

Header:

```http
Authorization: Bearer <access_token>
```

Current allowed role in the model:

| Role code | Product meaning |
| --- | --- |
| `103` | Trainee / individual learner |

Product note: the route is behind normal authentication. The model only allows role `103` to submit the activity.

## 4. Request Body

Content type:

```text
application/json
```

Common fields:

| Field | Type | Required | Product meaning |
| --- | --- | --- | --- |
| `resourceType` | string enum | Yes | The type of Mindsparks/OB Booster activity being submitted. |
| `resourceId` | UUID string | Yes | The learning resource being completed/submitted. |
| `sessionId` | UUID string | No | Groups submissions from the same activity attempt. If not sent, the backend creates a new session ID. |

Supported `resourceType` values:

```text
TYPE1
MATCHING
WORDSEARCH
CROSSWORD
PROBEMOVEMENTS
```

The API is case-insensitive for `resourceType` because the backend converts it to uppercase.

## 5. Activity Types

### TYPE1

Used for a standard option-based question.

Required product fields:

| Field | Type | Product meaning |
| --- | --- | --- |
| `questionNo` | number | Question number within the activity. |
| `optionChosen` | string or number | Option selected by the trainee. |
| `isCorrect` | boolean | Whether the selected option was correct. |

Example:

```json
{
  "resourceType": "TYPE1",
  "resourceId": "d205a94c-cdfc-4e04-986f-0fe5e9432cc5",
  "sessionId": "7f4f5223-16f8-4e54-a3b3-251807fa2c12",
  "questionNo": 1,
  "optionChosen": "B",
  "isCorrect": true
}
```

### MATCHING

Used for matching-style questions where the trainee pairs items.

Required product fields:

| Field | Type | Product meaning |
| --- | --- | --- |
| `questionNo` | number | Question number within the activity. |
| `payload` | object or array | The matching answer data sent by the frontend. |
| `isCorrect` | boolean | Whether the matching answer was correct. |

Example:

```json
{
  "resourceType": "MATCHING",
  "resourceId": "d205a94c-cdfc-4e04-986f-0fe5e9432cc5",
  "sessionId": "7f4f5223-16f8-4e54-a3b3-251807fa2c12",
  "questionNo": 2,
  "payload": [
    { "left": "Probe tilt", "right": "Changes imaging plane" },
    { "left": "Probe rotation", "right": "Changes orientation" }
  ],
  "isCorrect": false
}
```

### WORDSEARCH

Used for word-search activities.

Required product fields:

| Field | Type | Product meaning |
| --- | --- | --- |
| `questionNo` | number | Question number or word-search item number. |
| `timeTaken` | number | Time taken for the item, usually in seconds. |
| `hasTakenClue` | boolean | Whether the trainee used a clue/hint. |

Example:

```json
{
  "resourceType": "WORDSEARCH",
  "resourceId": "d205a94c-cdfc-4e04-986f-0fe5e9432cc5",
  "sessionId": "7f4f5223-16f8-4e54-a3b3-251807fa2c12",
  "questionNo": 3,
  "timeTaken": 45,
  "hasTakenClue": true
}
```

### CROSSWORD

Used for crossword activities.

Required product fields:

| Field | Type | Product meaning |
| --- | --- | --- |
| `totalTimeTaken` | number | Total time taken to complete the crossword, usually in seconds. |

Example:

```json
{
  "resourceType": "CROSSWORD",
  "resourceId": "d205a94c-cdfc-4e04-986f-0fe5e9432cc5",
  "sessionId": "7f4f5223-16f8-4e54-a3b3-251807fa2c12",
  "totalTimeTaken": 180
}
```

### PROBEMOVEMENTS

Used for probe movement activities.

Required product fields:

| Field | Type | Product meaning |
| --- | --- | --- |
| `totalTimeTaken` | number | Total time taken to complete the probe movement activity, usually in seconds. |

Example:

```json
{
  "resourceType": "PROBEMOVEMENTS",
  "resourceId": "d205a94c-cdfc-4e04-986f-0fe5e9432cc5",
  "totalTimeTaken": 90
}
```

## 6. Success Response

HTTP status:

```text
200 OK
```

Current response shape:

```json
{
  "status": "Success",
  "code": 200,
  "message": "Activity submitted successfully"
}
```

Product note: the controller currently attempts to return `data: result.rows`, but the model returns a plain success object, not database rows. Because of that, the response may not include useful submitted row data.

## 7. Error Responses

### Missing `resourceType`

HTTP status:

```text
400 Bad Request
```

Response:

```json
{
  "status": "Bad Request",
  "code": 400,
  "message": "resourceType is required"
}
```

### Missing `resourceId`

HTTP status:

```text
400 Bad Request
```

Response:

```json
{
  "status": "Bad Request",
  "code": 400,
  "message": "resourceId is required"
}
```

### Unknown `resourceType`

HTTP status:

```text
400 Bad Request
```

Response:

```json
{
  "status": "Bad Request",
  "code": 400,
  "message": "Unknown resourceType: <value>"
}
```

### Missing Token

HTTP status:

```text
401 Unauthorized
```

Response:

```json
{
  "status": "Unauthorized: No token"
}
```

### Invalid Token

HTTP status:

```text
403 Forbidden
```

Response:

```json
{
  "status": "Forbidden: Invalid token"
}
```

### Server Error

HTTP status:

```text
500 Internal Server Error
```

Response:

```json
{
  "status": "Error",
  "code": 500,
  "message": "<technical error message>"
}
```

## 8. What Gets Stored

The API writes to `activity_submissions`.

| Stored field | Product meaning |
| --- | --- |
| `session_id` | Attempt/session identifier. Generated automatically if the frontend does not send one. |
| `user_id` | Logged-in trainee email from the token. |
| `resource_id` | The submitted Mindsparks/OB Booster resource. |
| `resource_type` | One of `TYPE1`, `MATCHING`, `WORDSEARCH`, `CROSSWORD`, `PROBEMOVEMENTS`. |
| `question_no` | Question/item number, for activity types that use it. |
| `option_chosen` | Selected option for `TYPE1`. |
| `is_correct` | Correctness for `TYPE1` and `MATCHING`. |
| `match_payload` | Matching answer payload for `MATCHING`. |
| `time_taken` | Per-question/item time for `WORDSEARCH`. |
| `has_taken_clue` | Whether a clue was used in `WORDSEARCH`. |
| `total_time_taken` | Overall activity time for `CROSSWORD` and `PROBEMOVEMENTS`. |
| `submitted_at` | Timestamp when the activity was submitted. |

The API also updates `progress_data`:

| Stored field | Product meaning |
| --- | --- |
| `user_id` | Logged-in trainee email. |
| `resourse_id` | Completed resource ID. |
| `is_completed` | Set to `true`. |
| `updated_at` | Completion timestamp. |

Product note: the database column is currently spelled `resourse_id` in code.

## 9. Product Behavior Notes

- Submitting this API marks the resource as completed for the trainee.
- `sessionId` is optional. If omitted, each call gets a new generated session ID.
- If multiple question-level submissions should belong to the same attempt, the frontend should send the same `sessionId` for all of them.
- `TYPE1`, `MATCHING`, and `WORDSEARCH` are question/item-level submissions.
- `CROSSWORD` and `PROBEMOVEMENTS` are activity-level submissions based on total time.
- The backend validates only `resourceType`, `resourceId`, and whether `resourceType` is recognized.
- Type-specific fields such as `questionNo`, `isCorrect`, `payload`, and `totalTimeTaken` are not strictly validated by the backend today.

## 10. Recommended Product Rules

| Decision needed | Recommendation |
| --- | --- |
| Session handling | Use one `sessionId` for all submissions from a single activity attempt. |
| Time unit | Standardize all time fields as seconds. |
| Correctness | Send boolean `true` or `false` for `isCorrect`. |
| Matching payload format | Keep a stable frontend schema for `payload` so analytics can parse it later. |
| Completion behavior | Treat any successful `submit-msob` call as resource completion. |

## 11. Reporting Ideas

| Metric | How to calculate |
| --- | --- |
| Total attempts | Count rows in `activity_submissions`. |
| Attempts per resource | Group submissions by `resource_id`. |
| Attempts per trainee | Group submissions by `user_id`. |
| TYPE1 accuracy | Correct `TYPE1` rows divided by total `TYPE1` rows. |
| Matching accuracy | Correct `MATCHING` rows divided by total `MATCHING` rows. |
| Hint usage | Count `WORDSEARCH` rows where `has_taken_clue = true`. |
| Average completion time | Average `time_taken` or `total_time_taken`, depending on activity type. |
| Completion progress | Read completed resources from `progress_data`. |

## 12. Product Summary

`submit-msob` is the shared submission API for Mindsparks and OB Booster activities. It captures answer/timing data in `activity_submissions` and marks the resource complete in `progress_data`.

For reliable analytics, product should standardize `sessionId` usage, time units, matching payload structure, and correctness rules.
