# BPD/HC - Measurement (Questions 1 to 15)

## Module & Activity Information
- **Module:** BPD & HC (Bi-Parietal Diameter & Head Circumference)
- **Activity:** Measurement (`measurement`)
- **Challenge:** Image Interpretation - Order 4 (`Measurement`)
- **API Endpoint:** `POST /api/v1/submit-ii`
- **Question Configuration Endpoint:** `POST /api/v1/mind-spark-questions`
- **Total Questions:** 15 questions
  - **Questions 1 to 5:** Caliper measurement of Biparietal Diameter (BPD)
  - **Questions 6 to 10:** Two-diameter caliper measurement of Head Circumference (HC) via BPD & OFD
  - **Questions 11 to 15:** Ellipse measurement of Head Circumference (HC)

---

## Feedback Rules

### 1. BPD Caliper Measurement (Questions 1 to 5)

**Prompt:**
> `Place the caliper and measure the Biparietal diameter and interpret the values, given the gestational age for each case.`

#### If Correct:
```text
Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.
```

#### If Wrong:
- **Case 1 (Accurate Caliper Placement, Incorrect Interpretation):**
  ```text
  Well done! Your caliper placement is accurate, but the interpretation is incorrect. 
  According to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. 
  ```

- **Case 2 (Inaccurate Caliper Placement, Clinically Correct Interpretation):**
  ```text
  Your interpretation is clinically correct, but the caliper placement is inaccurate. 
  The placement is suboptimal and does not align with the standard reference positioning. 
  ```

- **Case 3 (Both Caliper Placement and Interpretation Incorrect):**
  ```text
  The measurement and interpretation are both incorrect. 
  According to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. 
  ```

---

### 2. HC Caliper Measurement via BPD & OFD (Questions 6 to 10)

**Prompt:**
> `Place the caliper and measure the Head circumference by measuring  BPD and OFD, and interpret the values given the gestational age given in each case.`

#### If Correct:
```text
Excellent work! Your caliper placement is accurately positioned, and your interpretation is correct.
```

#### If Wrong:
- **Case 1 (Accurate Caliper Placement, Incorrect Interpretation):**
  ```text
  Well done! Your caliper placement is accurate, but the interpretation is incorrect. 
  According to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. 
  ```

- **Case 2 (Inaccurate Caliper Placement, Clinically Correct Interpretation):**
  ```text
  Your interpretation is clinically correct, but the caliper placement is inaccurate. 
  The placement is suboptimal and does not align with the standard reference positioning. 
  ```

- **Case 3 (Both Caliper Placement and Interpretation Incorrect):**
  ```text
  The measurement and interpretation are both incorrect. 
  According to standard biometry charts, BPD values between the 5th and 95th percentiles are considered normal. 
  ```

---

### 3. HC Ellipse Measurement (Questions 11 to 15)

**Prompt:**
> `Measure the head circumference using the ellipse method. Compare the measurement with the percentile chart to interpret it based on the given gestational age.`

#### If Correct:
```text
Excellent work! 
The ellipse is correctly positioned along the outer border of the cranium. 
Your interpretation based on this measurement is also accurate. 
```

#### If Wrong:
- **Case 1 (Accurate Ellipse Placement, Incorrect Interpretation):**
  ```text
  Good attempt! 
  The ellipse is correctly placed along the outer border of the cranium; however, the interpretation is incorrect. 
  According to standard biometry charts, HC values between the 5th and 95th percentiles are considered normal. 
  ```

- **Case 2 (Inaccurate Ellipse Placement, Correct Interpretation):**
  ```text
  The interpretation is correct; however, the ellipse placement does not match the reference standard. 
  Ensure the ellipse is positioned accurately along the outer border of the cranium to obtain a valid measurement. 
  ```

- **Case 3 (Both Ellipse Placement and Interpretation Incorrect):**
  ```text
  The measurement and interpretation are both incorrect. 
  The ellipse placement does not match the reference standard and is not positioned along the outer skin edge of the fetal abdomen. 
  According to standard biometry charts, AC values between the 5th and 95th percentiles are considered normal. 
  ```

---

## API Submissions (`POST /api/v1/submit-ii`)

### Example: Question 1 (BPD Caliper - Correct)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=1
isCorrect=true
value=48.2
interpretation=normal
caliper_placement_interpretation=good
session_id=d290f1ee-6c54-4b01-90e6-d701748f0851
resource_id=<bpd_hc_measurement_resource_id>
file=@caliper_bpd_submission.png
```

### Example: Question 2 (BPD Caliper - Wrong Case 1: Placement accurate, interpretation incorrect)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=2
isCorrect=false
case=case1
value=52.4
interpretation=incorrect
caliper_placement_interpretation=good
session_id=d290f1ee-6c54-4b01-90e6-d701748f0851
resource_id=<bpd_hc_measurement_resource_id>
file=@caliper_bpd_submission.png
```

### Example: Question 6 (HC Caliper BPD & OFD - Wrong Case 2: Interpretation correct, placement inaccurate)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=6
isCorrect=false
case=case2
value=182.5
interpretation=good
caliper_placement_interpretation=inaccurate
session_id=d290f1ee-6c54-4b01-90e6-d701748f0851
resource_id=<bpd_hc_measurement_resource_id>
file=@hc_two_diameter_submission.png
```

### Example: Question 11 (HC Ellipse - Correct)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=11
isCorrect=true
value=175.4
interpretation=good
caliper_placement_interpretation=good
session_id=d290f1ee-6c54-4b01-90e6-d701748f0851
resource_id=<bpd_hc_measurement_resource_id>
file=@hc_ellipse_submission.png
```

### Example: Question 12 (HC Ellipse - Wrong Case 3: Both incorrect)
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=measurement
questionNo=12
isCorrect=false
case=case3
value=140.2
interpretation=incorrect
caliper_placement_interpretation=inaccurate
session_id=d290f1ee-6c54-4b01-90e6-d701748f0851
resource_id=<bpd_hc_measurement_resource_id>
file=@hc_ellipse_submission.png
```

---

## Frontend Integration (`client/src/pages/MyLearning.js`)
- Order 4 under BPD/HC Image Interpretation challenges maps to `Measurement`.
- Questions 1 to 15 are supported without clipping (questions 11 to 15 are preserved specifically for `question_type = 'measurement'`).
- The session builder evaluates `isMeasurement` and maps correct/wrong cases accurately through `getBpdHcMeasurementWrongFeedback`.
