# Mindspark Question Configuration API

Base path:

```text
/api/v1
```

All endpoints use the existing auth middleware.

## Create or update questions

```text
POST /api/v1/mind-spark-questions
```

This endpoint accepts one question or multiple questions. If a row already exists for the same `resource_id`, `mindspark_no`, and `question_no`, it is updated.

### MS1 multiple-question payload

```json
{
  "resource_id": "RESOURCE_UUID_HERE",
  "mindspark_no": 1,
  "questions": [
    {
      "question_no": 1,
      "question_type": "MCQ",
      "prompt": "Which of these landmarks must be visible in the correct transthalamic plane?",
      "options": [
        { "key": "a", "text": "Cavum Septi Pellucidi (CSP), Thalami, Falx cerebri" },
        { "key": "b", "text": "Cerebellum, Cisterna Magna, CSP" },
        { "key": "c", "text": "Lateral Ventricles, Cerebellum, Falx" },
        { "key": "d", "text": "Orbits, Falx, Thalami" }
      ],
      "correct_answer": { "key": "a" },
      "feedback_correct": "Great! You have identified the three essential landmarks for BPD measurement.",
      "feedback_wrong": "Incorrect! All three CSP, thalami, and falx cerebri are essential landmarks for identifying the transthalamic plane."
    },
    {
      "question_no": 2,
      "question_type": "MCQ",
      "prompt": "Why does the CSP appear black on ultrasound?",
      "options": [
        { "key": "a", "text": "It contains bone" },
        { "key": "b", "text": "It has calcification" },
        { "key": "c", "text": "It is muscle tissue" },
        { "key": "d", "text": "It is fluid-filled" }
      ],
      "correct_answer": { "key": "d" },
      "feedback_correct": "You're Right! CSP has cerebrospinal fluid, so it appears anechoic(black).",
      "feedback_wrong": "Oops! The CSP appears black because it has cerebrospinal fluid."
    }
  ]
}
```

## Get questions for a resource

```text
GET /api/v1/mind-spark-questions?resource_id=RESOURCE_UUID_HERE&mindspark_no=1
```

Use `include_inactive=true` to include soft-deleted questions.

## Update one question

```text
PUT /api/v1/mind-spark-questions/:question_id
```

Send only the fields that need to change.

## Delete one question

```text
DELETE /api/v1/mind-spark-questions/:question_id
```

This is a soft delete. It sets `is_active` to `false`.
