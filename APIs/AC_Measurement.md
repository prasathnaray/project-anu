# AC - Measurement (Questions 1 to 10)

## Module & Activity Information
- **Module:** AC (Abdominal Circumference)
- **Activity:** Measurement (`measurement`)
- **Challenge:** Image Interpretation - Order 4 (`Measurement`)
- **API Endpoint:** `POST /api/v1/submit-ii`
- **Question Configuration Endpoint:** `GET /api/v1/mind-spark-questions`
- **Total Questions:** 10 questions
  - **Questions 1 to 5:** Caliper measurement of Abdominal Circumference via APAD and TAD method (`caliper_apad_tad`)
  - **Questions 6 to 10:** Ellipse measurement of Abdominal Circumference (`ellipse`)

---

## Feedback Rules

### 1. AC Caliper Measurement via APAD & TAD Method (Questions 1 to 5)

**Prompt:**
> `Measure the AC through the APAD and TAD method and interpret the image, given the gestational age`

#### If Correct:
```text
Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct. 
```

#### If Wrong:
- **Case 1 (Accurate Caliper Placement, Incorrect Interpretation):**
  ```text
  Well done! Your caliper placement is accurate, but the interpretation is incorrect. 
  According to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. 
  ```

- **Case 2 (Inaccurate Caliper Placement, Clinically Correct Interpretation):**
  ```text
  Your interpretation is clinically correct, but the caliper placement is inaccurate. 
  The placement is suboptimal and does not align with the standard reference positioning. 
  ```

- **Case 3 (Both Caliper Placement and Interpretation Incorrect):**
  ```text
  The measurement and interpretation are both incorrect. 
  According to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. 
  ```

---

### 2. AC Ellipse Measurement (Questions 6 to 10)

**Prompt:**
> `Measure the abdominal circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.`

#### If Correct:
```text
Excellent work! 
The ellipse is correctly positioned along the outer skin edge of the fetal abdomen. 
Your interpretation based on this measurement is also accurate. 
```

#### If Wrong:
- **Case 1 (Accurate Ellipse Placement, Incorrect Interpretation):**
  ```text
  Good attempt! 
  The ellipse is accurately placed along the outer skin edge of the fetal abdomen; however, the interpretation is incorrect. 
  According to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. 
  ```

- **Case 2 (Inaccurate Ellipse Placement, Correct Interpretation):**
  ```text
  The interpretation is correct; however, the ellipse placement does not match the reference standard. 
  Ensure the ellipse is positioned along the outer skin edge of the fetal abdomen to obtain a valid measurement. 
  ```

- **Case 3 (Both Ellipse Placement and Interpretation Incorrect):**
  ```text
  The measurement and interpretation are both incorrect. 
  The ellipse placement does not match the reference standard and is not positioned along the outer skin edge of the fetal abdomen. 
  According to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. 
  ```

---

## API Submissions (`POST /api/v1/submit-ii`)

### Example: Question 1 (APAD & TAD Method - Correct)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=1
isCorrect=true
value=185.3
interpretation=good
caliper_placement_interpretation=good
session_id=7c9e6679-7425-40de-944b-e07fc1f90ae7
resource_id=<ac_measurement_resource_id>
file=@caliper_apad_tad_submission.png
```

### Example: Question 2 (APAD & TAD Method - Wrong Case 1: Placement accurate, interpretation incorrect)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=2
isCorrect=false
case=case1
value=190.2
interpretation=incorrect
caliper_placement_interpretation=good
session_id=7c9e6679-7425-40de-944b-e07fc1f90ae7
resource_id=<ac_measurement_resource_id>
file=@caliper_apad_tad_submission.png
```

### Example: Question 3 (APAD & TAD Method - Wrong Case 2: Interpretation correct, placement inaccurate)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=3
isCorrect=false
case=case2
value=175.0
interpretation=good
caliper_placement_interpretation=inaccurate
session_id=7c9e6679-7425-40de-944b-e07fc1f90ae7
resource_id=<ac_measurement_resource_id>
file=@caliper_apad_tad_submission.png
```

### Example: Question 4 (APAD & TAD Method - Wrong Case 3: Both incorrect)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=4
isCorrect=false
case=case3
value=150.0
interpretation=incorrect
caliper_placement_interpretation=inaccurate
session_id=7c9e6679-7425-40de-944b-e07fc1f90ae7
resource_id=<ac_measurement_resource_id>
file=@caliper_apad_tad_submission.png
```

### Example: Question 6 (AC Ellipse - Correct)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=6
isCorrect=true
value=205.4
interpretation=good
caliper_placement_interpretation=good
session_id=7c9e6679-7425-40de-944b-e07fc1f90ae7
resource_id=<ac_measurement_resource_id>
file=@ac_ellipse_submission.png
```

### Example: Question 7 (AC Ellipse - Wrong Case 1: Placement accurate, interpretation incorrect)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=7
isCorrect=false
case=case1
value=210.0
interpretation=incorrect
caliper_placement_interpretation=good
session_id=7c9e6679-7425-40de-944b-e07fc1f90ae7
resource_id=<ac_measurement_resource_id>
file=@ac_ellipse_submission.png
```

### Example: Question 8 (AC Ellipse - Wrong Case 2: Interpretation correct, placement inaccurate)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=8
isCorrect=false
case=case2
value=195.0
interpretation=good
caliper_placement_interpretation=inaccurate
session_id=7c9e6679-7425-40de-944b-e07fc1f90ae7
resource_id=<ac_measurement_resource_id>
file=@ac_ellipse_submission.png
```

### Example: Question 9 (AC Ellipse - Wrong Case 3: Both incorrect)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=9
isCorrect=false
case=case3
value=160.0
interpretation=incorrect
caliper_placement_interpretation=inaccurate
session_id=7c9e6679-7425-40de-944b-e07fc1f90ae7
resource_id=<ac_measurement_resource_id>
file=@ac_ellipse_submission.png
```

---

## Frontend Integration (`client/src/pages/MyLearning.js`)
- **Order 4** under AC Image Interpretation challenges maps to `Measurement`.
- Questions 1 to 10 are strictly configured:
  - Questions 1 to 5 map to APAD & TAD method with `caliper_apad_tad` metadata and 3 wrong case feedbacks.
  - Questions 6 to 10 map to Ellipse method with `ellipse` metadata and 3 wrong case feedbacks.
- `buildImageInterpretationSessions` recognizes AC measurement resources via name, topic, module, and question prompt patterns.
- Submissions dynamically resolve feedback using `getAcMeasurementWrongFeedback`, evaluating explicit `case` flags, `caliper_placement_interpretation` vs `interpretation`, and partial scoring.
