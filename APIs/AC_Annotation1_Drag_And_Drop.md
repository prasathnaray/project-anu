# AC - Annotation 1: Drag and Drop (Questions 1 to 5)

## Module & Activity Information
- **Module:** AC (Abdominal Circumference)
- **Activity:** Annotations 1: Drag & Drop (`annotation1`)
- **Challenge:** Image Interpretation - Order 2 (`Annotation: Drag and Drop` / `Annotation 1`)
- **API Endpoint:** `POST /api/v1/submit-ii`
- **Question Configuration Endpoint:** `POST /api/v1/mind-spark-questions`
- **Expected Landmarks (5 total):**
  1. `Rib 1`
  2. `Rib 2`
  3. `Stomach bubble`
  4. `Spine`
  5. `Portal vein`

---

## Feedback Rules

### If Correct:
```text
Your annotations are CORRECT!
Well done! You have correctly labelled all the key landmarks of the abdominal plane. 
The expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.
```

### If Wrong (5 Conditional Cases):

- **Case 1 (0 correct key landmarks):**
  ```text
  Your annotations are WRONG! 
  Oops! None of the key landmarks were correctly labelled. 
  Refer to the annotated reference image of the abdominal plane and understand the key landmarks. 
  The correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.
  ```

- **Case 2 (Some correct [1-4], with extra/non-essential landmarks):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have labelled some landmarks correctly, but have also included non-essential landmarks. 
  Refer to the annotated reference image of the abdominal plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.
  ```

- **Case 3 (Some correct [1-4], missed out on some, no extra landmarks):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have labelled some landmarks correctly and missed out on some. 
  Refer to the annotated reference image of the abdominal plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.
  ```

- **Case 4 (All 5 key landmarks correct, but included extra/non-essential landmarks):**
  ```text
  Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! 
  Almost there! You have correctly labelled all the key landmarks, but have also included non-essential landmarks. 
  Refer to the annotated reference image of the abdominal plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.
  ```

- **Case 5 (Correctly identified some landmarks fallback):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have correctly identified some landmarks. 
  Refer to the annotated reference image of the abdominal plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.
  ```

---

## Question 1

**Prompt:** Label the correct anatomical parts in the image

- **Question Type:** `annotation1`
- **Question Number:** `1`
- **Expected Landmarks:** Rib 1, Rib 2, Stomach bubble, Spine, Portal vein

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
- **Expected Landmarks:** Rib 1, Rib 2, Stomach bubble, Spine, Portal vein

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
- **Expected Landmarks:** Rib 1, Rib 2, Stomach bubble, Spine, Portal vein

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
- **Expected Landmarks:** Rib 1, Rib 2, Stomach bubble, Spine, Portal vein

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
- **Expected Landmarks:** Rib 1, Rib 2, Stomach bubble, Spine, Portal vein

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
  "resource_id": "<AC_ANNOTATION1_RESOURCE_ID>",
  "mindspark_no": 1,
  "questions": [
    {
      "question_no": 1,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Rib 1", "Rib 2", "Stomach bubble", "Spine", "Portal vein"],
        "answer": "Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.",
      "metadata": {
        "expected_landmarks": ["Rib 1", "Rib 2", "Stomach bubble", "Spine", "Portal vein"]
      }
    },
    {
      "question_no": 2,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Rib 1", "Rib 2", "Stomach bubble", "Spine", "Portal vein"],
        "answer": "Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.",
      "metadata": {
        "expected_landmarks": ["Rib 1", "Rib 2", "Stomach bubble", "Spine", "Portal vein"]
      }
    },
    {
      "question_no": 3,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Rib 1", "Rib 2", "Stomach bubble", "Spine", "Portal vein"],
        "answer": "Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.",
      "metadata": {
        "expected_landmarks": ["Rib 1", "Rib 2", "Stomach bubble", "Spine", "Portal vein"]
      }
    },
    {
      "question_no": 4,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Rib 1", "Rib 2", "Stomach bubble", "Spine", "Portal vein"],
        "answer": "Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.",
      "metadata": {
        "expected_landmarks": ["Rib 1", "Rib 2", "Stomach bubble", "Spine", "Portal vein"]
      }
    },
    {
      "question_no": 5,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Rib 1", "Rib 2", "Stomach bubble", "Spine", "Portal vein"],
        "answer": "Rib 1, Rib 2, Stomach bubble, Spine, Portal vein"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the abdominal plane.\nThe expected landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the abdominal plane and understand the key landmarks.\nThe correct landmarks to be labelled are Rib 1, Rib 2, Stomach bubble, Spine, Portal vein.",
      "metadata": {
        "expected_landmarks": ["Rib 1", "Rib 2", "Stomach bubble", "Spine", "Portal vein"]
      }
    }
  ]
}
```
