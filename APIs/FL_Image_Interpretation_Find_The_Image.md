# FL - Image Interpretation: Find the Image

## Module & Activity Information
- **Module:** FL (Femur Length)
- **Activity:** Image Interpretation (`interpret`)
- **Section / Challenge:** Find the Image (`type1`)
- **API Endpoint:** `POST /api/v1/submit-ii`
- **Question Configuration Endpoint:** `POST /api/v1/mind-spark-questions`

---

## Question 1

**Question:** Select the correct planes for the Femur Length measurement

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `1`

### Options:
- **A:** Both A & B
- **B:** A, B & D
- **C:** Both B & D
- **D:** None of the above

**Correct Answer:** A. Both A & B (Ans: a. Both A & B)

### Feedback:
- **If correct:**  
  Correct! The selected planes show the femur in proper orientation for measurement.
- **If wrong:**  
  Not correct! Both A and B are the correct femur diaphysis.

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=1
isCorrect=true
optionChosen=1
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 2

**Question:** Select the correct planes for Femur Length(FL) measurement

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `2`

### Options:
- **A:** Both A & D
- **B:** A, B & D
- **C:** A, B & C
- **D:** None of the above

**Correct Answer:** C. A, B & C (Ans: c. A, B & C)

### Feedback:
- **If correct:**  
  Great! You selected all correct FL planes, clearly depicting the long axis of the femur suitable for accurate biometry.
- **If wrong:**  
  Incorrect. A, B & C images represent the proper femur orientation.

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=2
isCorrect=true
optionChosen=3
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 3

**Question:** Select the correct planes for Femur Length(FL) measurement

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `3`

### Options:
- **A:** Both A & C
- **B:** Only D
- **C:** Both C & D
- **D:** None of the above

**Correct Answer:** A. Both A & C (Ans: a. Both A & C)

### Feedback:
- **If correct:**  
  Nice work! You correctly picked the planes displaying the femur in its entirety, suitable for accurate length measurement.
- **If wrong:**  
  Incorrect selection! Both A and C are the accurate femur diaphysis length.

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=3
isCorrect=true
optionChosen=1
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 4

**Question:** Choose the correct options that contain the correct plane for  measuring Femur Length.

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `4`

### Options:
- **A:** Both A & D
- **B:** Only C
- **C:** Both C & D
- **D:** None of the above

**Correct Answer:** B. Only C (Ans: B Only C)

### Feedback:
- **If correct:**  
  Perfect! You accurately selected the correct femur plane showing a clear and complete visualization of the femoral shaft.
- **If wrong:**  
  Incorrect. The selected planes do not show the femur.
- **If they select None of the above:**  
  Your selection is incorrect. The correct FL planes are present in C.

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=4
isCorrect=true
optionChosen=2
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 5

**Question:** Select the correct planes for Femur Length(FL) measurement

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `5`

### Options:
- **A:** A
- **B:** B
- **C:** C
- **D:** D

**Correct Answer:** A. A (Ans: A)

### Feedback:
- **If correct:**  
  You accurately identified the correct FL plane with full femur visualization.
- **If wrong:**  
  Incorrect choice! The selected image does not represent the proper femur orientation.

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=5
isCorrect=true
optionChosen=1
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## MindSpark / Image Interpretation Question Configuration Payload (`POST /api/v1/mind-spark-questions`)

To configure these questions in the database for the FL Image Interpretation resource:

```json
{
  "resource_id": "<FL_IMAGE_INTERPRETATION_RESOURCE_ID>",
  "mindspark_no": 1,
  "questions": [
    {
      "question_no": 1,
      "question_type": "type1",
      "prompt": "Select the correct planes for the Femur Length measurement",
      "options": [
        { "key": "A", "text": "Both A & B" },
        { "key": "B", "text": "A, B & D" },
        { "key": "C", "text": "Both B & D" },
        { "key": "D", "text": "None of the above" }
      ],
      "correct_answer": { "key": "A", "text": "Both A & B", "answer": "a.  Both A & B" },
      "feedback_correct": "Correct! The selected planes show the femur in proper orientation for measurement.",
      "feedback_wrong": "Not correct! Both A and B are the correct femur diaphysis."
    },
    {
      "question_no": 2,
      "question_type": "type1",
      "prompt": "Select the correct planes for Femur Length(FL) measurement",
      "options": [
        { "key": "A", "text": "Both A & D" },
        { "key": "B", "text": "A, B & D" },
        { "key": "C", "text": "A, B & C" },
        { "key": "D", "text": "None of the above" }
      ],
      "correct_answer": { "key": "C", "text": "A, B & C", "answer": "c. A, B & C" },
      "feedback_correct": "Great! You selected all correct FL planes, clearly depicting the long axis of the femur suitable for accurate biometry.",
      "feedback_wrong": "Incorrect. A, B & C images represent the proper femur orientation."
    },
    {
      "question_no": 3,
      "question_type": "type1",
      "prompt": "Select the correct planes for Femur Length(FL) measurement",
      "options": [
        { "key": "A", "text": "Both A & C" },
        { "key": "B", "text": "Only D" },
        { "key": "C", "text": "Both C & D" },
        { "key": "D", "text": "None of the above" }
      ],
      "correct_answer": { "key": "A", "text": "Both A & C", "answer": "a. Both A & C" },
      "feedback_correct": "Nice work! You correctly picked the planes displaying the femur in its entirety, suitable for accurate length measurement.",
      "feedback_wrong": "Incorrect selection! Both A and C are the accurate femur diaphysis length."
    },
    {
      "question_no": 4,
      "question_type": "type1",
      "prompt": "Choose the correct options that contain the correct plane for  measuring Femur Length.",
      "options": [
        { "key": "A", "text": "Both A & D" },
        { "key": "B", "text": "Only C" },
        { "key": "C", "text": "Both C & D" },
        { "key": "D", "text": "None of the above" }
      ],
      "correct_answer": { "key": "B", "text": "Only C", "answer": "B Only C" },
      "feedback_correct": "Perfect! You accurately selected the correct femur plane showing a clear and complete visualization of the femoral shaft.",
      "feedback_wrong": "Incorrect. The selected planes do not show the femur. If they select None of the above: Your selection is incorrect. The correct FL planes are present in C."
    },
    {
      "question_no": 5,
      "question_type": "type1",
      "prompt": "Select the correct planes for Femur Length(FL) measurement",
      "options": [
        { "key": "A", "text": "A" },
        { "key": "B", "text": "B" },
        { "key": "C", "text": "C" },
        { "key": "D", "text": "D" }
      ],
      "correct_answer": { "key": "A", "text": "A", "answer": "A" },
      "feedback_correct": "You accurately identified the correct FL plane with full femur visualization.",
      "feedback_wrong": "Incorrect choice! The selected image does not represent the proper femur orientation."
    }
  ]
}
```
