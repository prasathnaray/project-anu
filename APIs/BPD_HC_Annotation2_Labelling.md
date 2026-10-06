# BPD/HC - Annotations 2: Labelling (Questions 1 to 5)

## Module & Activity Information
- **Module:** BPD/HC (Bi-Parietal Diameter & Head Circumference)
- **Activity:** Annotations 2: Labelling in BPD/HC (`annotation2`)
- **Challenge:** Image Interpretation - Order 3 (`Annotation: Label and Name` / `Annotation 2` / `Annotations 2: Labelling`)
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
The expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. 
```

### If Wrong (10 Conditional Cases):

- **Case 1 (None of the labelling was done):**
  ```text
  Your annotations are WRONG!
  Oops! None of the labelling was done! 
  Refer to the annotated reference image of the transthalamic plane and label the key landmarks. 
  The expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. 
  ```

- **Case 2 (Only non-essential landmarks were labelled):**
  ```text
  Your annotations are WRONG! 
  Oops! Only non-essential landmarks were labelled. 
  Refer to the annotated reference image of the transthalamic plane and label the key landmarks. 
  The expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. 
  ```

- **Case 3 (Key landmarks correct, but included non-essential landmarks):**
  ```text
  Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! 
  Almost there!You have correctly labelled the key landmarks, but have also used non-essential landmarks. 
  Refer to the annotated reference image of the transthalamic plane and label the key landmarks. 
  The expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. 
  ```

- **Case 4 (Selected correct landmarks, but placed in wrong positions):**
  ```text
  Your annotations are WRONG! 
  Oops! You have selected the correct landmarks, but placed them in wrong positions. 
  Refer to the annotated reference image of the transthalamic plane and correct your placements. 
  The expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. 
  ```

- **Case 5 (Correctly labelled some landmarks, but also used non-essential landmarks):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have correctly labelled some landmarks, but also used non-essential landmarks. 
  Refer to the annotated reference image of the transthalamic plane and correct your placements. 
  The expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. 
  ```

- **Case 6 (Correctly labelled some landmarks, but missed out on some):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have correctly labelled some landmarks, but missed out on some. 
  Refer to the annotated reference image of the transthalamic plane and correct your placements. 
  The expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. 
  ```

- **Case 7 (None of key landmarks correctly labelled, and used non-essential landmarks):**
  ```text
  Your annotations are WRONG! 
  Oops! None of the key landmarks were correctly labelled and also used non-essential landmarks. 
  Refer to the annotated reference image of the transthalamic plane and correct your placements. 
  The expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. 
  ```

- **Case 8 (Selected correct landmarks, placed in wrong positions):**
  ```text
  Your annotations are WRONG! 
  Oops! The landmarks you selected are correct, but they are placed in wrong positions. 
  Refer to the annotated reference image of the transthalamic plane and correct your placements. 
  The expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. 
  ```

- **Case 9 (Identified all correct landmarks, but some in wrong positions):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have identified all the correct landmarks, but some are placed in wrong positions. 
  Refer to the annotated reference image of the transthalamic plane and correct your placements. 
  The expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. 
  ```

- **Case 10 (Identified correct landmarks, but misplaced and used non-essential landmarks):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have identified the correct landmarks, but misplaced and also used non-essential landmarks. 
  Refer to the annotated reference image of the transthalamic plane and correct your placements. 
  The expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. 
  ```

---

## Question 1

**Prompt:** Label the correct anatomical parts in the image

- **Question Type:** `annotation2`
- **Question Number:** `1`
- **Expected Landmarks:** Arrow Sign, Midline Falx, Thalamus, CSP, Cranium

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation2
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

- **Question Type:** `annotation2`
- **Question Number:** `2`
- **Expected Landmarks:** Arrow Sign, Midline Falx, Thalamus, CSP, Cranium

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation2
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

- **Question Type:** `annotation2`
- **Question Number:** `3`
- **Expected Landmarks:** Arrow Sign, Midline Falx, Thalamus, CSP, Cranium

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation2
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

- **Question Type:** `annotation2`
- **Question Number:** `4`
- **Expected Landmarks:** Arrow Sign, Midline Falx, Thalamus, CSP, Cranium

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation2
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

- **Question Type:** `annotation2`
- **Question Number:** `5`
- **Expected Landmarks:** Arrow Sign, Midline Falx, Thalamus, CSP, Cranium

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=annotation2
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

## MindSpark Configuration Payload (Questions 1 to 5)

To configure or sync these questions in the backend database:

```http
POST /api/v1/mind-spark-questions
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "resource_id": "<bpd_hc_annotation2_resource_uuid>",
  "questions": [
    {
      "mindspark_no": 1,
      "question_no": 1,
      "question_type": "annotation2",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "answer": "Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"
      },
      "feedback_correct": "Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
      "metadata": {
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "feedback_wrong_cases": {
          "case1": "Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case2": "Your annotations are WRONG! \nOops! Only non-essential landmarks were labelled. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case3": "Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! \nAlmost there!You have correctly labelled the key landmarks, but have also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case4": "Your annotations are WRONG! \nOops! You have selected the correct landmarks, but placed them in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case5": "Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case6": "Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but missed out on some. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case7": "Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case8": "Your annotations are WRONG! \nOops! The landmarks you selected are correct, but they are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case9": "Your annotations are ALMOST CORRECT! \nAlmost there! You have identified all the correct landmarks, but some are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case10": "Your annotations are ALMOST CORRECT! \nAlmost there! You have identified the correct landmarks, but misplaced and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. "
        }
      },
      "is_active": true
    },
    {
      "mindspark_no": 1,
      "question_no": 2,
      "question_type": "annotation2",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "answer": "Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"
      },
      "feedback_correct": "Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
      "metadata": {
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "feedback_wrong_cases": {
          "case1": "Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case2": "Your annotations are WRONG! \nOops! Only non-essential landmarks were labelled. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case3": "Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! \nAlmost there!You have correctly labelled the key landmarks, but have also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case4": "Your annotations are WRONG! \nOops! You have selected the correct landmarks, but placed them in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case5": "Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case6": "Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but missed out on some. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case7": "Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case8": "Your annotations are WRONG! \nOops! The landmarks you selected are correct, but they are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case9": "Your annotations are ALMOST CORRECT! \nAlmost there! You have identified all the correct landmarks, but some are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case10": "Your annotations are ALMOST CORRECT! \nAlmost there! You have identified the correct landmarks, but misplaced and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. "
        }
      },
      "is_active": true
    },
    {
      "mindspark_no": 1,
      "question_no": 3,
      "question_type": "annotation2",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "answer": "Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"
      },
      "feedback_correct": "Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
      "metadata": {
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "feedback_wrong_cases": {
          "case1": "Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case2": "Your annotations are WRONG! \nOops! Only non-essential landmarks were labelled. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case3": "Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! \nAlmost there!You have correctly labelled the key landmarks, but have also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case4": "Your annotations are WRONG! \nOops! You have selected the correct landmarks, but placed them in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case5": "Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case6": "Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but missed out on some. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case7": "Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case8": "Your annotations are WRONG! \nOops! The landmarks you selected are correct, but they are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case9": "Your annotations are ALMOST CORRECT! \nAlmost there! You have identified all the correct landmarks, but some are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case10": "Your annotations are ALMOST CORRECT! \nAlmost there! You have identified the correct landmarks, but misplaced and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. "
        }
      },
      "is_active": true
    },
    {
      "mindspark_no": 1,
      "question_no": 4,
      "question_type": "annotation2",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "answer": "Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"
      },
      "feedback_correct": "Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
      "metadata": {
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "feedback_wrong_cases": {
          "case1": "Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case2": "Your annotations are WRONG! \nOops! Only non-essential landmarks were labelled. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case3": "Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! \nAlmost there!You have correctly labelled the key landmarks, but have also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case4": "Your annotations are WRONG! \nOops! You have selected the correct landmarks, but placed them in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case5": "Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case6": "Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but missed out on some. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case7": "Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case8": "Your annotations are WRONG! \nOops! The landmarks you selected are correct, but they are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case9": "Your annotations are ALMOST CORRECT! \nAlmost there! You have identified all the correct landmarks, but some are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case10": "Your annotations are ALMOST CORRECT! \nAlmost there! You have identified the correct landmarks, but misplaced and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. "
        }
      },
      "is_active": true
    },
    {
      "mindspark_no": 1,
      "question_no": 5,
      "question_type": "annotation2",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 5,
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "answer": "Arrow Sign, Midline Falx, Thalamus, CSP, Cranium"
      },
      "feedback_correct": "Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transthalamic plane. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
      "feedback_wrong": "Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
      "metadata": {
        "expected_landmarks": ["Arrow Sign", "Midline Falx", "Thalamus", "CSP", "Cranium"],
        "feedback_wrong_cases": {
          "case1": "Your annotations are WRONG!\nOops! None of the labelling was done! \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case2": "Your annotations are WRONG! \nOops! Only non-essential landmarks were labelled. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case3": "Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! \nAlmost there!You have correctly labelled the key landmarks, but have also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and label the key landmarks. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case4": "Your annotations are WRONG! \nOops! You have selected the correct landmarks, but placed them in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case5": "Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case6": "Your annotations are ALMOST CORRECT! \nAlmost there! You have correctly labelled some landmarks, but missed out on some. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case7": "Your annotations are WRONG! \nOops! None of the key landmarks were correctly labelled and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case8": "Your annotations are WRONG! \nOops! The landmarks you selected are correct, but they are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case9": "Your annotations are ALMOST CORRECT! \nAlmost there! You have identified all the correct landmarks, but some are placed in wrong positions. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. ",
          "case10": "Your annotations are ALMOST CORRECT! \nAlmost there! You have identified the correct landmarks, but misplaced and also used non-essential landmarks. \nRefer to the annotated reference image of the transthalamic plane and correct your placements. \nThe expected landmarks to be labelled are the Arrow Sign, Midline Falx, Thalamus, CSP and Cranium. "
        }
      },
      "is_active": true
    }
  ]
}
```
