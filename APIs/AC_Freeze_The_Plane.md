# AC - Freeze the Plane: Questions 6 to 10

## Module & Activity Information
- **Module:** AC (Abdominal Circumference)
- **Activity:** Freeze the plane (`freeze` / `type1` / `type2`)
- **Challenge:** Freeze the plane - AC (Ultrasound Video Freeze Timeframe)
- **API Endpoint:** `POST /api/v1/submit-ii`
- **Question Configuration Endpoint:** `POST /api/v1/mind-spark-questions`

---

## Question 6

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `6`
- **Expected Landmarks:** stomach bubble, ribs, portal vein, spine

### Feedback:
- **If correct:**  
  Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=6
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 7

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `7`
- **Expected Landmarks:** stomach bubble, ribs, portal vein, spine

### Feedback:
- **If correct:**  
  Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=7
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 8

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `8`
- **Expected Landmarks:** stomach bubble, ribs, portal vein, spine

### Feedback:
- **If correct:**  
  Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=8
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 9

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `9`
- **Expected Landmarks:** stomach bubble, ribs, portal vein, spine

### Feedback:
- **If correct:**  
  Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=9
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 10

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `10`
- **Expected Landmarks:** stomach bubble, ribs, portal vein, spine

### Feedback:
- **If correct:**  
  Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=10
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## MindSpark / Image Interpretation Question Configuration Payload (`POST /api/v1/mind-spark-questions`)

To configure Questions 6 to 10 for the AC Freeze the Plane resource:

```json
{
  "resource_id": "<AC_FREEZE_THE_PLANE_RESOURCE_ID>",
  "mindspark_no": 1,
  "questions": [
    {
      "question_no": 6,
      "question_type": "type1",
      "prompt": "Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane",
      "options": [],
      "correct_answer": { "answer": "Transabdominal plane frame", "timeframe": "Transabdominal plane", "expected_timeframe": "Transabdominal plane" },
      "feedback_correct": "Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.",
      "feedback_wrong": "Incorrect freeze! The frozen frame lacks one or more key landmarks"
    },
    {
      "question_no": 7,
      "question_type": "type1",
      "prompt": "Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane",
      "options": [],
      "correct_answer": { "answer": "Transabdominal plane frame", "timeframe": "Transabdominal plane", "expected_timeframe": "Transabdominal plane" },
      "feedback_correct": "Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.",
      "feedback_wrong": "Incorrect freeze! The frozen frame lacks one or more key landmarks"
    },
    {
      "question_no": 8,
      "question_type": "type1",
      "prompt": "Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane",
      "options": [],
      "correct_answer": { "answer": "Transabdominal plane frame", "timeframe": "Transabdominal plane", "expected_timeframe": "Transabdominal plane" },
      "feedback_correct": "Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.",
      "feedback_wrong": "Incorrect freeze! The frozen frame lacks one or more key landmarks"
    },
    {
      "question_no": 9,
      "question_type": "type1",
      "prompt": "Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane",
      "options": [],
      "correct_answer": { "answer": "Transabdominal plane frame", "timeframe": "Transabdominal plane", "expected_timeframe": "Transabdominal plane" },
      "feedback_correct": "Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.",
      "feedback_wrong": "Incorrect freeze! The frozen frame lacks one or more key landmarks"
    },
    {
      "question_no": 10,
      "question_type": "type1",
      "prompt": "Watch the ultrasound video of the angulation of the probe over the fetal abdomen and find the correct timeframe revealing the transabdominal plane",
      "options": [],
      "correct_answer": { "answer": "Transabdominal plane frame", "timeframe": "Transabdominal plane", "expected_timeframe": "Transabdominal plane" },
      "feedback_correct": "Perfect freeze! The image shows all the key landmarks: the stomach bubble, ribs, portal vein, and spine.",
      "feedback_wrong": "Incorrect freeze! The frozen frame lacks one or more key landmarks"
    }
  ]
}
```
