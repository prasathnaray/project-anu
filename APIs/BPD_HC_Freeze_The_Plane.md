# BPD/HC - Freeze the Plane: Questions 6 to 10

## Module & Activity Information
- **Module:** BPD/HC (Bi-Parietal Diameter & Head Circumference)
- **Activity:** Freeze the plane (`freeze` / `type1` / `type2`)
- **Challenge:** Freeze the plane - BPD/HC (Ultrasound Video Freeze Timeframe)
- **API Endpoint:** `POST /api/v1/submit-ii`
- **Question Configuration Endpoint:** `POST /api/v1/mind-spark-questions`

---

## Question 6

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal head and find the correct timeframe revealing the transthalamic plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `6`
- **Expected Landmarks:** midline falx, box-shaped CSP, symmetric thalami

### Feedback:
- **If correct:**  
  Perfect freeze! The image consists of all the key landmarks: midline falx, box-shaped CSP, and symmetric thalami.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=6
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 7

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal head and find the correct timeframe revealing the transthalamic plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `7`
- **Expected Landmarks:** midline falx, box-shaped CSP, symmetric thalami

### Feedback:
- **If correct:**  
  Perfect freeze! The image consists of all the key landmarks: midline falx, box-shaped CSP, and symmetric thalami.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=7
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 8

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal head and find the correct timeframe revealing the transthalamic plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `8`
- **Expected Landmarks:** midline falx, box-shaped CSP, symmetric thalami

### Feedback:
- **If correct:**  
  Perfect freeze! The image consists of all the key landmarks: midline falx, box-shaped CSP, and symmetric thalami.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=8
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 9

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal head and find the correct timeframe revealing the transthalamic plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `9`
- **Expected Landmarks:** midline falx, box-shaped CSP, symmetric thalami

### Feedback:
- **If correct:**  
  Perfect freeze! The image consists of all the key landmarks: midline falx, box-shaped CSP, and symmetric thalami.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=9
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```

---

## Question 10

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal head and find the correct timeframe revealing the transthalamic plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `10`
- **Expected Landmarks:** midline falx, box-shaped CSP, symmetric thalami

### Feedback:
- **If correct:**  
  Perfect freeze! The image consists of all the key landmarks: midline falx, box-shaped CSP, and symmetric thalami.
- **If wrong:**  
  Incorrect freeze! The frozen frame lacks one or more key landmarks

### Submit Payload (`multipart/form-data`):
```http
POST /api/v1/submit-ii
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

questionType=type1
questionNo=10
isCorrect=true
session_id=<session_uuid>
resource_id=<resource_uuid>
```
