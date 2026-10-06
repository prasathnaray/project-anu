# BPD/HC - Annotation 1: Drag and Drop (Questions 1 to 5)

## Module & Activity Information
- **Module:** BPD/HC (Bi-Parietal Diameter & Head Circumference)
- **Activity:** Annotation : 1 Drag and Drop (`annotation1`)
- **Challenge:** Image Interpretation - Order 2 (`Annotation: Drag and Drop` / `Annotation 1`)
- **API Endpoint:** `POST /api/v1/submit-ii`
- **Question Configuration Endpoint:** `POST /api/v1/mind-spark-questions`
- **Expected Landmarks (5 total):**
  1. `Arrow Sign`
  2. `Midline Falx`
  3. `Thalamus`
  4. `CSP`
  5. `Cranium`

---

## Feedback Rules

### If Correct:
```text
Your annotations are CORRECT!
Well done! You have correctly labelled all the key landmarks of the transthalamic plane. 
The expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.
```

### If Wrong (6 Conditional Cases):

- **Case 1 (0 correct, with wrong labels):**
  ```text
  Your annotations are WRONG! 
  Oops! None of the key landmarks were correctly labelled. 
  Refer to the annotated reference image of the transthalamic plane and understand the key landmarks. 
  The correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.
  ```

- **Case 2 (0 correct, 0 wrong, all/some unused):**
  ```text
  Your annotations are WRONG! 
  Oops! None of the key landmarks were correctly labelled. 
  Refer to the annotated reference image of the transthalamic plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.
  ```

- **Case 3 (1-4 correct, with extra/wrong labels):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have labelled some landmarks correctly, but have also included non-essential landmarks. 
  Refer to the annotated reference image of the transthalamic plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.
  ```

- **Case 4 (1-4 correct, missed out on some, no wrong labels):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have labelled some landmarks correctly and missed out on some. 
  Refer to the annotated reference image of the transthalamic plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.
  ```

- **Case 5 (All 5 key landmarks correct, but included extra/wrong landmarks):**
  ```text
  Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! 
  Almost there! You have correctly labelled all the key landmarks, but have also included non-essential landmarks. 
  Refer to the annotated reference image of the transthalamic plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.
  ```

- **Case 6 (Partial/Identified some landmarks fallback):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have correctly identified some landmarks. 
  Refer to the annotated reference image of the transthalamic plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.
  ```

---

## Question 1

**Prompt:** Label the correct anatomical parts in the image

- **Question Type:** `annotation1`
- **Question Number:** `1`
- **Expected Landmarks:** Arrow Sign, Midline Falx, Thalamus, CSP, Cranium

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation1
questionNo=1
isCorrect=true
correctLabelCount=5
wrongLabelCount=0
unusedLabelCount=0
session_id=<session_uuid>
resource_id=<resource_uuid>
userImage=@annotated_image.png;type=image/png
```

---

## Question 2

**Prompt:** Label the correct anatomical parts in the image

- **Question Type:** `annotation1`
- **Question Number:** `2`
- **Expected Landmarks:** Arrow Sign, Midline Falx, Thalamus, CSP, Cranium

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation1
questionNo=2
isCorrect=true
correctLabelCount=5
wrongLabelCount=0
unusedLabelCount=0
session_id=<session_uuid>
resource_id=<resource_uuid>
userImage=@annotated_image.png;type=image/png
```

---

## Question 3

**Prompt:** Label the correct anatomical parts in the image

- **Question Type:** `annotation1`
- **Question Number:** `3`
- **Expected Landmarks:** Arrow Sign, Midline Falx, Thalamus, CSP, Cranium

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation1
questionNo=3
isCorrect=true
correctLabelCount=5
wrongLabelCount=0
unusedLabelCount=0
session_id=<session_uuid>
resource_id=<resource_uuid>
userImage=@annotated_image.png;type=image/png
```

---

## Question 4

**Prompt:** Label the correct anatomical parts in the image

- **Question Type:** `annotation1`
- **Question Number:** `4`
- **Expected Landmarks:** Arrow Sign, Midline Falx, Thalamus, CSP, Cranium

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation1
questionNo=4
isCorrect=true
correctLabelCount=5
wrongLabelCount=0
unusedLabelCount=0
session_id=<session_uuid>
resource_id=<resource_uuid>
userImage=@annotated_image.png;type=image/png
```

---

## Question 5

**Prompt:** Label the correct anatomical parts in the image

- **Question Type:** `annotation1`
- **Question Number:** `5`
- **Expected Landmarks:** Arrow Sign, Midline Falx, Thalamus, CSP, Cranium

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation1
questionNo=5
isCorrect=true
correctLabelCount=5
wrongLabelCount=0
unusedLabelCount=0
session_id=<session_uuid>
resource_id=<resource_uuid>
userImage=@annotated_image.png;type=image/png
```

---

## MindSpark Configuration Payload (`POST /api/v1/mind-spark-questions`)

```json
{
  "resource_id": "<BPD_HC_ANNOTATION1_RESOURCE_ID>",
  "mindspark_no": 1,
  "questions": [
    {
      "question_no": 1,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "answer": "Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.",
      "feedback_wrong": "Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled. \nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks. \nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.",
      "metadata": {
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"]
      }
    },
    {
      "question_no": 2,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "answer": "Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.",
      "feedback_wrong": "Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled. \nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks. \nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.",
      "metadata": {
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"]
      }
    },
    {
      "question_no": 3,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "answer": "Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.",
      "feedback_wrong": "Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled. \nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks. \nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.",
      "metadata": {
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"]
      }
    },
    {
      "question_no": 4,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "answer": "Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.",
      "feedback_wrong": "Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled. \nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks. \nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.",
      "metadata": {
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"]
      }
    },
    {
      "question_no": 5,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "answer": "Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.",
      "feedback_wrong": "Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled. \nRefer to the annotated reference image of the transthalamic plane and understand the key landmarks. \nThe correct landmarks to be labelled are Arrow Sign, Midline Falx, Thalamus, CSP and Cranium.",
      "metadata": {
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"]
      }
    }
  ]
}
```
