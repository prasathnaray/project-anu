# FL - Annotation 1: Drag and Drop (Questions 1 to 5)

## Module & Activity Information
- **Module:** FL (Femur Length)
- **Activity:** Annotation : 1 Drag and drop in FL (`annotation1`)
- **Challenge:** Image Interpretation - Order 2 (`Annotation: Drag and Drop` / `Annotation 1`)
- **API Endpoint:** `POST /api/v1/submit-ii`
- **Question Configuration Endpoint:** `POST /api/v1/mind-spark-questions`
- **Expected Landmarks (2 total):**
  1. `Diaphysis`
  2. `Metaphysis`

---

## Feedback Rules

### If Correct:
```text
Your annotations are CORRECT!
Well done! You have correctly labelled all the key landmarks of the transfemoral plane. 
The expected landmarks to be labelled are Diaphysis and Metaphysis.
```

### If Wrong (6 Conditional Cases):

- **Case 1 (0 correct, with wrong labels):**
  ```text
  Your annotations are WRONG! 
  Oops! None of the key landmarks were correctly labelled. 
  Refer to the annotated reference image of the transfemoral plane and understand the key landmarks. 
  The correct landmarks to be labelled are Diaphysis and Metaphysis.
  ```

- **Case 2 (0 correct, 0 wrong, all/some unused):**
  ```text
  Your annotations are WRONG! 
  Oops! None of the key landmarks were correctly labelled. 
  Refer to the annotated reference image of the transfemoral plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Diaphysis and Metaphysis.
  ```

- **Case 3 (1 correct [some landmarks], with extra/non-essential landmarks):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have labelled some landmarks correctly, but have also included non-essential landmarks. 
  Refer to the annotated reference image of the transfemoral plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Diaphysis and Metaphysis.
  ```

- **Case 4 (1 correct [some landmarks], missed out on some, no extra labels):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have labelled some landmarks correctly and missed out on some. 
  Refer to the annotated reference image of the transfemoral plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Diaphysis and Metaphysis.
  ```

- **Case 5 (All 2 key landmarks correct, but included extra/non-essential landmarks):**
  ```text
  Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! 
  Almost there! You have correctly labelled all the key landmarks, but have also included non-essential landmarks. 
  Refer to the annotated reference image of the transfemoral plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Diaphysis and Metaphysis.
  ```

- **Case 6 (Partial/Identified some landmarks fallback):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have correctly identified some landmarks. 
  Refer to the annotated reference image of the transfemoral plane to learn and improve your understanding. 
  The correct landmarks to be labelled are Diaphysis and Metaphysis.
  ```

---

## Question 1

**Prompt:** Label the correct anatomical parts in the image

- **Question Type:** `annotation1`
- **Question Number:** `1`
- **Expected Landmarks:** Diaphysis, Metaphysis

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation1
questionNo=1
isCorrect=true
correctLabelCount=2
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
- **Expected Landmarks:** Diaphysis, Metaphysis

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation1
questionNo=2
isCorrect=true
correctLabelCount=2
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
- **Expected Landmarks:** Diaphysis, Metaphysis

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation1
questionNo=3
isCorrect=true
correctLabelCount=2
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
- **Expected Landmarks:** Diaphysis, Metaphysis

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation1
questionNo=4
isCorrect=true
correctLabelCount=2
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
- **Expected Landmarks:** Diaphysis, Metaphysis

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation1
questionNo=5
isCorrect=true
correctLabelCount=2
wrongLabelCount=0
unusedLabelCount=0
session_id=<session_uuid>
resource_id=<resource_uuid>
userImage=@annotated_image.png;type=image/png
```

---

## MindSpark Configuration Payload (Questions 1 to 5)

To configure or sync these questions in the backend database:

```http
POST /api/v1/mind-spark-questions
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "resource_id": "<fl_annotation1_resource_uuid>",
  "questions": [
    {
      "mindspark_no": 1,
      "question_no": 1,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 2,
        "expected_landmarks": ["Diaphysis", "Metaphysis"],
        "answer": "Diaphysis and Metaphysis"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
      "metadata": {
        "expected_landmarks": ["Diaphysis", "Metaphysis"],
        "feedback_wrong_cases": {
          "case1": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case2": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case3": "Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case4": "Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly and missed out on some.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case5": "Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS!\nAlmost there! You have correctly labelled all the key landmarks, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case6": "Your annotations are ALMOST CORRECT!\nAlmost there! You have correctly identified some landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis."
        }
      },
      "is_active": true
    },
    {
      "mindspark_no": 1,
      "question_no": 2,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 2,
        "expected_landmarks": ["Diaphysis", "Metaphysis"],
        "answer": "Diaphysis and Metaphysis"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
      "metadata": {
        "expected_landmarks": ["Diaphysis", "Metaphysis"],
        "feedback_wrong_cases": {
          "case1": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case2": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case3": "Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case4": "Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly and missed out on some.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case5": "Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS!\nAlmost there! You have correctly labelled all the key landmarks, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case6": "Your annotations are ALMOST CORRECT!\nAlmost there! You have correctly identified some landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis."
        }
      },
      "is_active": true
    },
    {
      "mindspark_no": 1,
      "question_no": 3,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 2,
        "expected_landmarks": ["Diaphysis", "Metaphysis"],
        "answer": "Diaphysis and Metaphysis"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
      "metadata": {
        "expected_landmarks": ["Diaphysis", "Metaphysis"],
        "feedback_wrong_cases": {
          "case1": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case2": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case3": "Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case4": "Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly and missed out on some.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case5": "Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS!\nAlmost there! You have correctly labelled all the key landmarks, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case6": "Your annotations are ALMOST CORRECT!\nAlmost there! You have correctly identified some landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis."
        }
      },
      "is_active": true
    },
    {
      "mindspark_no": 1,
      "question_no": 4,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 2,
        "expected_landmarks": ["Diaphysis", "Metaphysis"],
        "answer": "Diaphysis and Metaphysis"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
      "metadata": {
        "expected_landmarks": ["Diaphysis", "Metaphysis"],
        "feedback_wrong_cases": {
          "case1": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case2": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case3": "Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case4": "Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly and missed out on some.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case5": "Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS!\nAlmost there! You have correctly labelled all the key landmarks, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case6": "Your annotations are ALMOST CORRECT!\nAlmost there! You have correctly identified some landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis."
        }
      },
      "is_active": true
    },
    {
      "mindspark_no": 1,
      "question_no": 5,
      "question_type": "annotation1",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 2,
        "expected_landmarks": ["Diaphysis", "Metaphysis"],
        "answer": "Diaphysis and Metaphysis"
      },
      "feedback_correct": "Your annotations are CORRECT!\nWell done! You have correctly labelled all the key landmarks of the transfemoral plane.\nThe expected landmarks to be labelled are Diaphysis and Metaphysis.",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
      "metadata": {
        "expected_landmarks": ["Diaphysis", "Metaphysis"],
        "feedback_wrong_cases": {
          "case1": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane and understand the key landmarks.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case2": "Your annotations are WRONG!\nOops! None of the key landmarks were correctly labelled.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case3": "Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case4": "Your annotations are ALMOST CORRECT!\nAlmost there! You have labelled some landmarks correctly and missed out on some.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case5": "Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS!\nAlmost there! You have correctly labelled all the key landmarks, but have also included non-essential landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis.",
          "case6": "Your annotations are ALMOST CORRECT!\nAlmost there! You have correctly identified some landmarks.\nRefer to the annotated reference image of the transfemoral plane to learn and improve your understanding.\nThe correct landmarks to be labelled are Diaphysis and Metaphysis."
        }
      },
      "is_active": true
    }
  ]
}
```
