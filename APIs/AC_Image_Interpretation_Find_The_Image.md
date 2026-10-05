# AC - Image Interpretation: Find the Image

## Module & Activity Information
- **Module:** AC (Abdominal Circumference)
- **Activity:** Image Interpretation (`interpret`)
- **Section / Challenge:** Find the Image (`type1`)
- **API Endpoint:** `POST /api/v1/submit-ii`
- **Question Configuration Endpoint:** `POST /api/v1/mind-spark-questions`

---

## Question 1

**Question:** Which among the given planes are used to measure AC?

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `1`

### Options:
- **A:** Both A & C
- **B:** Both B & D
- **C:** Only C
- **D:** None of the above

**Correct Answer:** A. Both A & C (Ans: a. A and C)

### Feedback:
- **If correct:**  
  Well done! A and C represent the correct transverse abdominal planes for AC measurement.
- **If wrong:**  
  Incorrect! Both A and C show the standard AC measurement view with symmetrical appearance and correct landmarks.

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

**Question:** Choose the correct option for measuring AC

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `2`

### Options:
- **A:** Both A & D
- **B:** Only B
- **C:** Both B & D
- **D:** None of the above

**Correct Answer:** B. Only B (Ans: B Only B)

### Feedback:
- **If correct:**  
  Perfect! You accurately selected image B — it displays the proper transverse view for measuring the fetal abdominal circumference.
- **If wrong:**  
  Incorrect! The selected image does not represent the correct AC measurement plane.
- **If they select None of the above:**  
  Your selection is incorrect. The correct AC plane present in B.

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=2
isCorrect=true
optionChosen=2
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 3

**Question:** Select among the given planes are used to measure AC?

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `3`

### Options:
- **A:** A
- **B:** B
- **C:** C
- **D:** D

**Correct Answer:** C (Ans: C)

### Feedback:
- **If correct:**  
  Well done! You identified the correct AC measurement plane that includes the stomach bubble, portal vein, ribs and cross-section of the spine.
- **If wrong:**  
  The selected image does not represent the proper AC plane.

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=3
isCorrect=true
optionChosen=3
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 4

**Question:** Which among the given planes are used to measure AC?

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `4`

### Options:
- **A:** A
- **B:** B
- **C:** C
- **D:** D

**Correct Answer:** D (Ans: D)

### Feedback:
- **If correct:**  
  Good job! You correctly identified D as the AC measurement plane with the appropriate fetal abdominal landmarks.
- **If wrong:**  
  The chosen plane is incorrect. The AC plane should include the fetal stomach and spine in a true transverse circular section of the abdomen.

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=4
isCorrect=true
optionChosen=4
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 5

**Question:** Select the correct planes for AC measurement

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `5`

### Options:
- **A:** A
- **B:** B
- **C:** C
- **D:** D

**Correct Answer:** D (Ans: D)

### Feedback:
- **If correct:**  
  Great work! You selected D — the correct plane for AC measurement that includes the stomach bubble and spine in a circular section.
- **If wrong:**  
  The chosen plane is not correct.

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=5
isCorrect=true
optionChosen=4
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## MindSpark / Image Interpretation Question Configuration Payload (`POST /api/v1/mind-spark-questions`)

To configure these questions in the database for the AC Image Interpretation resource:

```json
{
  "resource_id": "<AC_IMAGE_INTERPRETATION_RESOURCE_ID>",
  "mindspark_no": 1,
  "questions": [
    {
      "question_no": 1,
      "question_type": "type1",
      "prompt": "Which among the given planes are used to measure AC?",
      "options": [
        { "key": "A", "text": "Both A & C" },
        { "key": "B", "text": "Both B & D" },
        { "key": "C", "text": "Only C" },
        { "key": "D", "text": "None of the above" }
      ],
      "correct_answer": { "key": "A", "text": "Both A & C", "answer": "a.  A and C" },
      "feedback_correct": "Well done! A and C represent the correct transverse abdominal planes for AC measurement.",
      "feedback_wrong": "Incorrect! Both A and C show the standard AC measurement view with symmetrical appearance and correct landmarks."
    },
    {
      "question_no": 2,
      "question_type": "type1",
      "prompt": "Choose the correct option for measuring AC",
      "options": [
        { "key": "A", "text": "Both A & D" },
        { "key": "B", "text": "Only B" },
        { "key": "C", "text": "Both B & D" },
        { "key": "D", "text": "None of the above" }
      ],
      "correct_answer": { "key": "B", "text": "Only B", "answer": "B Only B" },
      "feedback_correct": "Perfect! You accurately selected image B — it displays the proper transverse view for measuring the fetal abdominal circumference.",
      "feedback_wrong": "Incorrect! The selected image does not represent the correct AC measurement plane. If they select None of the above: Your selection is incorrect. The correct AC plane present in B."
    },
    {
      "question_no": 3,
      "question_type": "type1",
      "prompt": "Select among the given planes are used to measure AC?",
      "options": [
        { "key": "A", "text": "A" },
        { "key": "B", "text": "B" },
        { "key": "C", "text": "C" },
        { "key": "D", "text": "D" }
      ],
      "correct_answer": { "key": "C", "text": "C", "answer": "C" },
      "feedback_correct": "Well done! You identified the correct AC measurement plane that includes the stomach bubble, portal vein, ribs and cross-section of the spine.",
      "feedback_wrong": "The selected image does not represent the proper AC plane."
    },
    {
      "question_no": 4,
      "question_type": "type1",
      "prompt": "Which among the given planes are used to measure AC?",
      "options": [
        { "key": "A", "text": "A" },
        { "key": "B", "text": "B" },
        { "key": "C", "text": "C" },
        { "key": "D", "text": "D" }
      ],
      "correct_answer": { "key": "D", "text": "D", "answer": "D" },
      "feedback_correct": "Good job! You correctly identified D as the AC measurement plane with the appropriate fetal abdominal landmarks.",
      "feedback_wrong": "The chosen plane is incorrect. The AC plane should include the fetal stomach and spine in a true transverse circular section of the abdomen."
    },
    {
      "question_no": 5,
      "question_type": "type1",
      "prompt": "Select the correct planes for AC measurement",
      "options": [
        { "key": "A", "text": "A" },
        { "key": "B", "text": "B" },
        { "key": "C", "text": "C" },
        { "key": "D", "text": "D" }
      ],
      "correct_answer": { "key": "D", "text": "D", "answer": "D" },
      "feedback_correct": "Great work! You selected D — the correct plane for AC measurement that includes the stomach bubble and spine in a circular section.",
      "feedback_wrong": "The chosen plane is not correct."
    }
  ]
}
```
