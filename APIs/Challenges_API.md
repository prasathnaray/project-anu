# Challenges API

Base URL:

```text
http://localhost:4004/api/v1
```

All endpoints require:

```http
Authorization: Bearer <access_token>
```

## Submit Challenge Answer

```http
POST /challenges/submit
Content-Type: application/json
```

Required body:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `resource_id` | UUID string | Yes | Challenge resource ID. |
| `session_id` | UUID string | Yes | Same value for all answers in one attempt. |
| `question_number` | number | Yes | Challenge question number. |
| `choose_option` | string or string array | Yes | Selected answer. Use an array for multi-select questions. |
| `isCorrect` | boolean | Yes | Whether the selected answer is correct. |

Optional body:

| Field | Type | Notes |
| --- | --- | --- |
| `question_part` | string | Useful when one displayed question has multiple prompts, for example `shapes` and `resemblance`. |
| `question_text` | string | Prompt text for debugging/reporting. |
| `correct_answer` | string or array | Correct answer snapshot. |
| `feedback_correct` | string | Correct feedback snapshot. |
| `feedback_wrong` | string | Wrong feedback snapshot. |
| `time_taken` | number | Time for this question, preferably seconds. |
| `total_time_taken` | number | Total attempt time, preferably seconds. |
| `mark_completed` | boolean | Defaults to `true`. Send `false` if this answer should not mark the resource complete. |

## Challenge Content Example

Use the same `resource_id` for the challenge resource and the same `session_id` for all answers submitted in one attempt.

### Question 1

Prompt:

```text
Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface. Select the number of squares visible in the ultrasound image.
```

Options:

```text
6
8
4
5
```

Feedback:

| Result | Message |
| --- | --- |
| Correct | Great job! You have correctly identified the number of squares. |
| Wrong | Not quite! The number of squares selected is incorrect. |

Submit payload:

```json
{
  "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
  "session_id": "021306f8-580b-4634-a809-7796b5843387",
  "question_number": 1,
  "choose_option": "6",
  "isCorrect": true,
  "question_text": "Select the number of squares visible in the ultrasound image.",
  "correct_answer": "6",
  "feedback_correct": "Great job! You have correctly identified the number of squares.",
  "feedback_wrong": "Not quite! The number of squares selected is incorrect."
}
```

### Question 2A

Prompt:

```text
Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface. Select the shapes identified during the ultrasound examination.
```

Options:

```text
Circle, Arc
Square, Cylinder, Triangle
Rectangle, Dotted line
```

Feedback:

| Result | Message |
| --- | --- |
| Correct | Good job! You have correctly identified the structures. |
| Wrong | Not quite! The structures you have identified are wrong. |

Submit payload:

```json
{
  "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
  "session_id": "021306f8-580b-4634-a809-7796b5843387",
  "question_number": 2,
  "question_part": "shapes",
  "choose_option": ["Circle", "Arc"],
  "isCorrect": true,
  "question_text": "Select the shapes identified during the ultrasound examination.",
  "correct_answer": ["Circle", "Arc"],
  "feedback_correct": "Good job! You have correctly identified the structures.",
  "feedback_wrong": "Not quite! The structures you have identified are wrong."
}
```

### Question 2B

Prompt:

```text
What does the scanned structure resemble?
```

Options:

```text
Metal Box
Smiley face
Coil
```

Feedback:

| Result | Message |
| --- | --- |
| Correct | Good job! You have correctly identified the structure. |
| Wrong | Not quite! The structure you have identified is wrong. |

Submit payload:

```json
{
  "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
  "session_id": "021306f8-580b-4634-a809-7796b5843387",
  "question_number": 2,
  "question_part": "resemblance",
  "choose_option": "Smiley face",
  "isCorrect": true,
  "question_text": "What does the scanned structure resemble?",
  "correct_answer": "Smiley face",
  "feedback_correct": "Good job! You have correctly identified the structure.",
  "feedback_wrong": "Not quite! The structure you have identified is wrong."
}
```

### Question 3

Prompt:

```text
Place the probe on the maternal abdomen and scan to identify the structure located beneath the abdominal surface. What does the scanned structure resemble?
```

Options:

```text
Leaf
Spear
Arrow
```

Feedback:

| Result | Message |
| --- | --- |
| Correct | Good job! You have correctly identified the structure. |
| Wrong | Not quite! The selected option is incorrect. |

Submit payload:

```json
{
  "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
  "session_id": "021306f8-580b-4634-a809-7796b5843387",
  "question_number": 3,
  "choose_option": "Arrow",
  "isCorrect": true,
  "question_text": "What does the scanned structure resemble?",
  "correct_answer": "Arrow",
  "feedback_correct": "Good job! You have correctly identified the structure.",
  "feedback_wrong": "Not quite! The selected option is incorrect."
}
```

## Request Examples

Single-select example:

```json
{
  "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
  "session_id": "021306f8-580b-4634-a809-7796b5843387",
  "question_number": 1,
  "choose_option": "6",
  "isCorrect": true,
  "question_text": "Select the number of squares visible in the ultrasound image."
}
```

Multi-select example:

```json
{
  "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
  "session_id": "021306f8-580b-4634-a809-7796b5843387",
  "question_number": 2,
  "question_part": "shapes",
  "choose_option": ["Circle", "Arc"],
  "isCorrect": true
}
```

Second part of the same displayed question:

```json
{
  "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
  "session_id": "021306f8-580b-4634-a809-7796b5843387",
  "question_number": 2,
  "question_part": "resemblance",
  "choose_option": "Smiley face",
  "isCorrect": true
}
```

curl example:

```bash
curl -X POST "http://localhost:4004/api/v1/challenges/submit" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
    "session_id": "021306f8-580b-4634-a809-7796b5843387",
    "question_number": 1,
    "choose_option": "6",
    "isCorrect": true
  }'
```

Success response:

```json
{
  "status": "Success",
  "code": 201,
  "message": "Challenge answer submitted successfully",
  "data": {
    "session_id": "021306f8-580b-4634-a809-7796b5843387",
    "user_id": "trainee@example.com",
    "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
    "resource_type": "CHALLENGE",
    "question_no": 1,
    "option_chosen": "6",
    "is_correct": true,
    "match_payload": {
      "selected_options": ["6"],
      "question_part": null
    },
    "submitted_at": "2026-07-15T10:00:00.000Z"
  }
}
```

## Get Challenge Attempt Details

```http
GET /challenges/attempt-details?resource_id=<resource_id>&session_id=<session_id>
```

`session_id` is optional. If omitted, all challenge submissions for the authenticated user and resource are returned.

Success response:

```json
{
  "status": "Success",
  "code": 200,
  "data": [],
  "summary": {
    "total_questions": 0,
    "correct_answers": 0,
    "wrong_answers": 0,
    "score_percentage": null
  }
}
```

## Implementation Notes

- Answers are stored in `activity_submissions`.
- `resource_type` is stored as `CHALLENGE`.
- `choose_option` is stored as comma-separated text in `option_chosen`.
- The full answer details are also stored in `match_payload`.
- `user_id` is taken from the authenticated token as `req.user.user_mail`.
- Successful submissions mark the resource complete in `progress_data` unless `mark_completed` is `false`.
