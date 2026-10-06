# BPD/HC - Image Interpretation: Find the Image

## Module & Activity Information
- **Module:** BPD/HC (Bi-Parietal Diameter & Head Circumference)
- **Activity:** Image Interpretation (`interpret`)
- **Section / Challenge:** Find the Image (`type1`)
- **API Endpoint:** `POST /api/v1/submit-ii`
- **Question Configuration Endpoint:** `POST /api/v1/mind-spark-questions`

---

## Question 1

**Question:** Which image shows the biparietal diameter measurement plane with the thalami, arrow sign, midline falx, and cavum septi pellucidi visible?

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `1`

### Options:
- **A:** Only A
- **B:** Both A & D
- **C:** Only C
- **D:** Both A & C

**Correct Answer:** C. (Only C)

### Feedback:
- **If correct:**  
  You correctly identified the BPD measurement plane, which shows the thalami, arrow sign, midline falx, and cavum septi pellucidi, consistent with the transthalamic view.
- **If wrong:**  
  The selected image does not correspond to the transthalamic plane. Ensure the thalami, CSP, arrow sign, and midline falx are clearly visualized for accurate BPD measurement.

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=1
isCorrect=true
optionChosen=3
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 2

**Question:** Which image shows the midline falx, arrow sign, thalami, and CSP essential for BPD measurement?

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `2`

### Options:
- **A:** Only B
- **B:** Both B & D
- **C:** Only D
- **D:** Both B & C

**Correct Answer:** B. (Both B & D)

### Feedback:
- **If correct:**  
  Correct! You selected the transthalamic images, which show the midline falx, thalami, arrow sign, and cavum septi pellucidi, essential landmarks for BPD measurement.
- **If wrong:**  
  Incorrect. B & D are the correct images with all the key landmarks.

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

**Question:** Which of the following images corresponds to the transthalamic section without visualization of the cerebellum or orbits?

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `3`

### Options:
- **A:** Both B & C
- **B:** Both B & A
- **C:** Only A
- **D:** None of the above

**Correct Answer:** A. Both B & C

### Feedback:
- **If correct:**  
  Correct! You chose the transthalamic section showing the thalami, arrow sign, midline falx and CSP, while excluding the cerebellum and orbits.
- **If wrong / If none of the above:**  
  Incorrect! Images B and C actually show the correct transthalamic plane with visible thalami, arrow sign, falx and CSP, and without cerebellum or orbits.

#### Alternative Feedback:
- **If correct:** Correct! You successfully identified the proper transthalamic plane.
- **If wrong:** Incorrect! A, C & D represent the correct plane with proper anatomical landmarks.

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

**Question:** Select the correct image for BPD measurement.

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `4`

### Options:
- **A:** A
- **B:** B
- **C:** C
- **D:** D

**Correct Option:** B

### Feedback:
- **If correct:**  
  Excellent! You chose the correct transthalamic image suitable for BPD measurement where thalami and CSP are seen clearly.
- **If wrong:**  
  The selected image corresponds to a transventricular plane. Remember, the BPD is measured in the transthalamic section showing falx, arrow sign, thalami and CSP.

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

**Question:** Select the correct image for HC measurement

- **Question Type:** `type1` (Find the Image / Option-based)
- **Question Number:** `5`

### Options:
- **A:** A
- **B:** B
- **C:** C
- **D:** D

**Correct Option:** C

### Feedback:
- **If correct:**  
  Correct! You identified the appropriate image for HC measurement - a symmetrical transthalamic plane with the midline falx, arrow sign, thalami and CSP in view.
- **If wrong:**  
  Incorrect. The chosen image is not suitable for HC measurement.

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=5
isCorrect=true
optionChosen=3
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## MindSpark / Image Interpretation Question Configuration Payload (`POST /api/v1/mind-spark-questions`)

To configure these questions in the database for the BPD/HC Image Interpretation resource:

```json
{
  "resource_id": "<BPD_HC_IMAGE_INTERPRETATION_RESOURCE_ID>",
  "mindspark_no": 1,
  "questions": [
    {
      "question_no": 1,
      "question_type": "type1",
      "prompt": "Which image shows the biparietal diameter measurement plane with the thalami, arrow sign, midline falx, and cavum septi pellucidi visible?",
      "options": [
        { "key": "A", "text": "Only A" },
        { "key": "B", "text": "Both A & D" },
        { "key": "C", "text": "Only C" },
        { "key": "D", "text": "Both A & C" }
      ],
      "correct_answer": { "key": "C", "text": "Only C" },
      "feedback_correct": "You correctly identified the BPD measurement plane, which shows the thalami, arrow sign, midline falx, and cavum septi pellucidi, consistent with the transthalamic view.",
      "feedback_wrong": "The selected image does not correspond to the transthalamic plane. Ensure the thalami, CSP, arrow sign, and midline falx are clearly visualized for accurate BPD measurement."
    },
    {
      "question_no": 2,
      "question_type": "type1",
      "prompt": "Which image shows the midline falx, arrow sign, thalami, and CSP essential for BPD measurement?",
      "options": [
        { "key": "A", "text": "Only B" },
        { "key": "B", "text": "Both B & D" },
        { "key": "C", "text": "Only D" },
        { "key": "D", "text": "Both B & C" }
      ],
      "correct_answer": { "key": "B", "text": "Both B & D" },
      "feedback_correct": "Correct! You selected the transthalamic images, which show the midline falx, thalami, arrow sign, and cavum septi pellucidi, essential landmarks for BPD measurement.",
      "feedback_wrong": "Incorrect. B & D are the correct images with all the key landmarks."
    },
    {
      "question_no": 3,
      "question_type": "type1",
      "prompt": "Which of the following images corresponds to the transthalamic section without visualization of the cerebellum or orbits?",
      "options": [
        { "key": "A", "text": "Both B & C" },
        { "key": "B", "text": "Both B & A" },
        { "key": "C", "text": "Only A" },
        { "key": "D", "text": "None of the above" }
      ],
      "correct_answer": { "key": "A", "text": "Both B & C" },
      "feedback_correct": "Correct! You chose the transthalamic section showing the thalami, arrow sign, midline falx and CSP, while excluding the cerebellum and orbits.",
      "feedback_wrong": "Incorrect! Images B and C actually show the correct transthalamic plane with visible thalami, arrow sign, falx and CSP, and without cerebellum or orbits."
    },
    {
      "question_no": 4,
      "question_type": "type1",
      "prompt": "Select the correct image for BPD measurement.",
      "options": [
        { "key": "A", "text": "A" },
        { "key": "B", "text": "B" },
        { "key": "C", "text": "C" },
        { "key": "D", "text": "D" }
      ],
      "correct_answer": { "key": "B", "text": "B" },
      "feedback_correct": "Excellent! You chose the correct transthalamic image suitable for BPD measurement where thalami and CSP are seen clearly.",
      "feedback_wrong": "The selected image corresponds to a transventricular plane. Remember, the BPD is measured in the transthalamic section showing falx, arrow sign, thalami and CSP."
    },
    {
      "question_no": 5,
      "question_type": "type1",
      "prompt": "Select the correct image for HC measurement",
      "options": [
        { "key": "A", "text": "A" },
        { "key": "B", "text": "B" },
        { "key": "C", "text": "C" },
        { "key": "D", "text": "D" }
      ],
      "correct_answer": { "key": "C", "text": "C" },
      "feedback_correct": "Correct! You identified the appropriate image for HC measurement - a symmetrical transthalamic plane with the midline falx, arrow sign, thalami and CSP in view.",
      "feedback_wrong": "Incorrect. The chosen image is not suitable for HC measurement."
    }
  ]
}
```
