# FL - Freeze the Plane: Questions 11 to 15 (Questions 6 to 10)

## Module & Activity Information
- **Module:** FL (Femur Length)
- **Activity:** Freeze the plane (`freeze` / `type1` / `type2`)
- **Challenge:** Freeze the plane - FL (Ultrasound Video Freeze Timeframe)
- **API Endpoint:** `POST /api/v1/submit-ii`
- **Question Configuration Endpoint:** `POST /api/v1/mind-spark-questions`

> **Note:** In the curriculum challenge sequence, Freeze the Plane questions for FL correspond to questions **11 to 15** (and map to challenge questions **6 to 10** in the evaluation engine). Both indices are supported across API submissions and configurations.

---

## Question 11 (Question 6)

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `11` (or `6`)
- **Expected Landmarks:** diaphysis and metaphysis

### Feedback:
- **If correct:**  
  Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=11
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```
*(Also accepts `questionNo=6`)*

---

## Question 12 (Question 7)

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `12` (or `7`)
- **Expected Landmarks:** diaphysis and metaphysis

### Feedback:
- **If correct:**  
  Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=12
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```
*(Also accepts `questionNo=7`)*

---

## Question 13 (Question 8)

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `13` (or `8`)
- **Expected Landmarks:** diaphysis and metaphysis

### Feedback:
- **If correct:**  
  Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=13
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```
*(Also accepts `questionNo=8`)*

---

## Question 14 (Question 9)

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `14` (or `9`)
- **Expected Landmarks:** diaphysis and metaphysis

### Feedback:
- **If correct:**  
  Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=14
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```
*(Also accepts `questionNo=9`)*

---

## Question 15 (Question 10)

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `15` (or `10`)
- **Expected Landmarks:** diaphysis and metaphysis

### Feedback:
- **If correct:**  
  Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=15
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```
*(Also accepts `questionNo=10`)*

---

## MindSpark / Image Interpretation Question Configuration Payload (`POST /api/v1/mind-spark-questions`)

To configure Questions 11 to 15 (or 6 to 10) for the FL Freeze the Plane resource:

```json
{
  "resource_id": "<FL_FREEZE_THE_PLANE_RESOURCE_ID>",
  "mindspark_no": 1,
  "questions": [
    {
      "question_no": 11,
      "question_type": "type1",
      "prompt": "Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane",
      "options": [],
      "correct_answer": { "answer": "Femur plane frame", "timeframe": "Femur plane", "expected_timeframe": "Femur plane" },
      "feedback_correct": "Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.",
      "feedback_wrong": "Incorrect freeze! The frozen frame lacks one or more key landmarks"
    },
    {
      "question_no": 12,
      "question_type": "type1",
      "prompt": "Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane",
      "options": [],
      "correct_answer": { "answer": "Femur plane frame", "timeframe": "Femur plane", "expected_timeframe": "Femur plane" },
      "feedback_correct": "Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.",
      "feedback_wrong": "Incorrect freeze! The frozen frame lacks one or more key landmarks"
    },
    {
      "question_no": 13,
      "question_type": "type1",
      "prompt": "Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane",
      "options": [],
      "correct_answer": { "answer": "Femur plane frame", "timeframe": "Femur plane", "expected_timeframe": "Femur plane" },
      "feedback_correct": "Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.",
      "feedback_wrong": "Incorrect freeze! The frozen frame lacks one or more key landmarks"
    },
    {
      "question_no": 14,
      "question_type": "type1",
      "prompt": "Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane",
      "options": [],
      "correct_answer": { "answer": "Femur plane frame", "timeframe": "Femur plane", "expected_timeframe": "Femur plane" },
      "feedback_correct": "Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.",
      "feedback_wrong": "Incorrect freeze! The frozen frame lacks one or more key landmarks"
    },
    {
      "question_no": 15,
      "question_type": "type1",
      "prompt": "Watch the ultrasound video of the angulation of the probe over the fetal femur and find the correct timeframe revealing the femur plane",
      "options": [],
      "correct_answer": { "answer": "Femur plane frame", "timeframe": "Femur plane", "expected_timeframe": "Femur plane" },
      "feedback_correct": "Perfect freeze! The image shows all the key landmarks: the diaphysis and metaphysis.",
      "feedback_wrong": "Incorrect freeze! The frozen frame lacks one or more key landmarks"
    }
  ]
}
```
