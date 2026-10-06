# FL - Annotations 2: Labelling (Questions 1 to 5)

## Module & Activity Information
- **Module:** FL (Femur Length)
- **Activity:** Annotations 2: Labelling in FL (`annotation2`)
- **Challenge:** Image Interpretation - Order 3 (`Annotation: Label and Name` / `Annotation 2` / `Annotations 2: Labelling`)
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

### If Wrong (11 Conditional Cases):

- **Case 1 (None of the labelling was done):**
  ```text
  Your annotations are WRONG! 
  Oops! None of the labelling was done! 
  Refer to the annotated reference image of the transfemoral plane and label the key landmarks. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```

- **Case 2 (Only non-essential landmarks were labelled):**
  ```text
  Your annotations are WRONG! 
  Oops! Only non-essential landmarks were labelled. 
  Refer to the annotated reference image of the transfemoral plane and label the key landmarks. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```

- **Case 3 (Nearly correct, included extra landmarks):**
  ```text
  Your annotations are NEARLY CORRECT! INCLUDED EXTRA LANDMARKS! 
  Almost there!, You have correctly labelled the key landmarks, but have also used non-essential landmarks. 
  Refer to the annotated reference image of the transfemoral plane and label the key landmarks. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```

- **Case 4 (Selected correct landmarks, but placed in wrong positions):**
  ```text
  Your annotations are WRONG! 
  Oops! You have selected the correct landmarks, but placed them in wrong positions. 
  Refer to the annotated reference image of the transfemoral plane and correct your placements. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```

- **Case 5 (Correctly labelled some landmarks, but also used non-essential landmarks):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have correctly labelled some landmarks, but also used non-essential landmarks. 
  Refer to the annotated reference image of the transfemoral plane and correct your placements. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```

- **Case 6 (Correctly labelled some landmarks, but missed out on some):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have correctly labelled some landmarks, but missed out on some. 
  Refer to the annotated reference image of the transfemoral plane and correct your placements. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```

- **Case 7 (None of key landmarks correctly labelled and also used non-essential landmarks):**
  ```text
  Your annotations are WRONG! 
  Oops! None of the key landmarks were correctly labelled and also used non-essential landmarks. 
  Refer to the annotated reference image of the transfemoral plane and correct your placements. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```

- **Case 8 (The landmarks you selected are correct, but they are placed in wrong positions):**
  ```text
  Your annotations are WRONG! 
  Oops! The landmarks you selected are correct, but they are placed in wrong positions. 
  Refer to the annotated reference image of the transfemoral plane and correct your placements. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```

- **Case 9 (Identified all correct landmarks, but some are placed in wrong positions):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have identified all the correct landmarks, but some are placed in wrong positions. 
  Refer to the annotated reference image of the transfemoral plane and correct your placements. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```

- **Case 10 (Identified the correct landmarks, but misplaced and also used non-essential landmarks):**
  ```text
  Your annotations are ALMOST CORRECT! 
  Almost there! You have identified the correct landmarks, but misplaced and also used non-essential landmarks. 
  Refer to the annotated reference image of the transfemoral plane and improve your understanding. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```

- **Case 11 (Review needed):**
  ```text
  Your annotations are REVIEW NEEDED 
  Review needed Please review your selections. 
  Refer to the annotated reference image of the transfemoral plane and try again. 
  ```

---

## Questions 1 to 5 Details

### Question 1
- **Question Number:** `1`
- **Question Type:** `annotation2`
- **Prompt:** `Label the correct anatomical parts in the image`
- **Options:** `[]`
- **Correct Answer:**
  ```json
  {
    "expected_label_count": 2,
    "expected_landmarks": ["Diaphysis", "Metaphysis"],
    "answer": "Diaphysis and Metaphysis"
  }
  ```
- **Feedback Correct:**
  ```text
  Your annotations are CORRECT! 
  Well done! You have correctly labelled all the key landmarks of the transfemoral plane. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```
- **Default Feedback Wrong:** Case 1 (dynamic per evaluation case)

### Question 2
- **Question Number:** `2`
- **Question Type:** `annotation2`
- **Prompt:** `Label the correct anatomical parts in the image`
- **Options:** `[]`
- **Correct Answer:**
  ```json
  {
    "expected_label_count": 2,
    "expected_landmarks": ["Diaphysis", "Metaphysis"],
    "answer": "Diaphysis and Metaphysis"
  }
  ```
- **Feedback Correct:**
  ```text
  Your annotations are CORRECT! 
  Well done! You have correctly labelled all the key landmarks of the transfemoral plane. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```
- **Default Feedback Wrong:** Case 1 (dynamic per evaluation case)

### Question 3
- **Question Number:** `3`
- **Question Type:** `annotation2`
- **Prompt:** `Label the correct anatomical parts in the image`
- **Options:** `[]`
- **Correct Answer:**
  ```json
  {
    "expected_label_count": 2,
    "expected_landmarks": ["Diaphysis", "Metaphysis"],
    "answer": "Diaphysis and Metaphysis"
  }
  ```
- **Feedback Correct:**
  ```text
  Your annotations are CORRECT! 
  Well done! You have correctly labelled all the key landmarks of the transfemoral plane. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```
- **Default Feedback Wrong:** Case 1 (dynamic per evaluation case)

### Question 4
- **Question Number:** `4`
- **Question Type:** `annotation2`
- **Prompt:** `Label the correct anatomical parts in the image`
- **Options:** `[]`
- **Correct Answer:**
  ```json
  {
    "expected_label_count": 2,
    "expected_landmarks": ["Diaphysis", "Metaphysis"],
    "answer": "Diaphysis and Metaphysis"
  }
  ```
- **Feedback Correct:**
  ```text
  Your annotations are CORRECT! 
  Well done! You have correctly labelled all the key landmarks of the transfemoral plane. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```
- **Default Feedback Wrong:** Case 1 (dynamic per evaluation case)

### Question 5
- **Question Number:** `5`
- **Question Type:** `annotation2`
- **Prompt:** `Label the correct anatomical parts in the image`
- **Options:** `[]`
- **Correct Answer:**
  ```json
  {
    "expected_label_count": 2,
    "expected_landmarks": ["Diaphysis", "Metaphysis"],
    "answer": "Diaphysis and Metaphysis"
  }
  ```
- **Feedback Correct:**
  ```text
  Your annotations are CORRECT! 
  Well done! You have correctly labelled all the key landmarks of the transfemoral plane. 
  The expected landmarks to be labelled are Diaphysis and Metaphysis. 
  ```
- **Default Feedback Wrong:** Case 1 (dynamic per evaluation case)

---

## Submission & Feedback Resolution Logic

When an annotation submission is sent via `POST /api/v1/submit-ii`, the client and backend evaluate the response:

```javascript
function getFlAnnotation2WrongFeedback(submission) {
  const explicitCase = submission?.case || submission?.case_no || submission?.caseNo || submission?.case_num || submission?.feedback_case;
  if (explicitCase) {
    const caseKey = String(explicitCase).toLowerCase().startsWith('case') ? String(explicitCase).toLowerCase() : `case${explicitCase}`;
    if (FL_ANNOTATION2_FEEDBACK_WRONG_CASES[caseKey]) {
      return FL_ANNOTATION2_FEEDBACK_WRONG_CASES[caseKey];
    }
  }

  const correct = Number(submission?.correct_label_count ?? 0);
  const wrong = Number(submission?.wrong_label_count ?? 0);
  const misplaced = Number(submission?.misplaced_label_count ?? submission?.misplaced_count ?? 0);
  const unused = Number(submission?.unused_label_count ?? 0);
  const totalPlaced = Number(submission?.total_placed ?? (correct + wrong + misplaced));

  if (submission?.status === 'review_needed' || submission?.review_needed) {
    return FL_ANNOTATION2_FEEDBACK_WRONG_CASES.case11;
  }

  if (misplaced > 0) {
    if (wrong > 0) return FL_ANNOTATION2_FEEDBACK_WRONG_CASES.case10;
    if (correct > 0 && (correct + misplaced >= 2)) return FL_ANNOTATION2_FEEDBACK_WRONG_CASES.case9;
    if (correct === 0 && misplaced >= 2) return FL_ANNOTATION2_FEEDBACK_WRONG_CASES.case4;
    return FL_ANNOTATION2_FEEDBACK_WRONG_CASES.case8;
  }

  if (correct >= 2 && wrong > 0) return FL_ANNOTATION2_FEEDBACK_WRONG_CASES.case3;
  if (correct > 0 && correct < 2 && wrong > 0) return FL_ANNOTATION2_FEEDBACK_WRONG_CASES.case5;
  if (correct > 0 && correct < 2 && wrong === 0) return FL_ANNOTATION2_FEEDBACK_WRONG_CASES.case6;
  if (correct === 0 && wrong === 0 && (unused > 0 || totalPlaced === 0)) return FL_ANNOTATION2_FEEDBACK_WRONG_CASES.case1;
  if (correct === 0 && wrong > 0) return FL_ANNOTATION2_FEEDBACK_WRONG_CASES.case2;

  return FL_ANNOTATION2_FEEDBACK_WRONG_CASES.case11;
}
```

---

## Example API Payloads

### 1. Configure Questions via `POST /api/v1/mind-spark-questions`
```json
{
  "resource_id": "<FL_ANNOTATION2_RESOURCE_ID>",
  "mindspark_no": 1,
  "questions": [
    {
      "question_no": 1,
      "question_type": "annotation2",
      "prompt": "Label the correct anatomical parts in the image",
      "options": [],
      "correct_answer": {
        "expected_label_count": 2,
        "expected_landmarks": ["Diaphysis", "Metaphysis"],
        "answer": "Diaphysis and Metaphysis"
      },
      "metadata": {
        "expected_landmarks": ["Diaphysis", "Metaphysis"]
      },
      "feedback_correct": "Your annotations are CORRECT! \nWell done! You have correctly labelled all the key landmarks of the transfemoral plane. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ",
      "feedback_wrong": "Your annotations are WRONG! \nOops! None of the labelling was done! \nRefer to the annotated reference image of the transfemoral plane and label the key landmarks. \nThe expected landmarks to be labelled are Diaphysis and Metaphysis. ",
      "is_active": true
    }
  ]
}
```

### 2. Submit Annotation via `POST /api/v1/submit-ii`
**Headers:**
- `Content-Type: multipart/form-data`
- `Authorization: Bearer <TOKEN>`

**Fields:**
- `resource_id`: `<FL_ANNOTATION2_RESOURCE_ID>`
- `question_no`: `1`
- `question_type`: `annotation2`
- `correct_label_count`: `2`
- `wrong_label_count`: `0`
- `misplaced_label_count`: `0`
- `is_correct`: `true`
- `case`: `case1` (when wrong, optional explicit case 1–11)
- `submission_image`: `<canvas snapshot image file>`
