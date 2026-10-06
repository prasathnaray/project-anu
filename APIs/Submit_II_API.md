# Submit Image Interpretation API

## Endpoint

`POST http://{{local_base_url}}/api/v1/submit-ii`

> Note: use `http://{{local_base_url}}/...` if `local_base_url` contains only host and port, for example `localhost:4004`.

## Purpose

Submits a trainee's Image Interpretation answer for one question. The same endpoint supports five question types:


- `type1`
- `type2`
- `annotation1`
- `annotation2`
- `measurement`

## Authentication

Required.

Header:

```http
Authorization: Bearer <access_token>
```

Allowed roles in current implementation:

- `99`
- `101`
- `103`

## Request Body

Content type: `multipart/form-data`

Common required fields for all question types:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `questionType` | string enum | Yes | One of `type1`, `type2`, `annotation1`, `annotation2`, `measurement`. |
| `questionNo` | number | Yes | Question number being submitted. Sent as form text; API converts to number. |
| `session_id` | UUID string | Yes | Active II test/session ID. |
| `resource_id` | UUID string | Yes | Resource ID for the II activity. |

`isCorrect` is also required for `type1`, `type2`, `annotation1`, and `annotation2`. Send it as `true` or `false` text in form-data. For `measurement`, send `partial` instead of `isCorrect`.

### Type-Specific Required Fields

#### `type1`

Used for option-based questions.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `optionChosen` | number | Yes | Selected option number/index. |

No image file is required for `type1`.

Example form-data:

| Field | Value |
| --- | --- |
| `questionType` | `type1` |
| `questionNo` | `1` |
| `isCorrect` | `true` |
| `session_id` | `021306f8-580b-4634-a809-7796b5843387` |
| `resource_id` | `e196c6db-dc0b-4ebd-93b2-10a2125188e5` |
| `optionChosen` | `2` |

#### `type2`

Used for image-upload answer questions.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `userImage` | file | Yes | Image file uploaded by the user. |

Example form-data:

| Field | Value |
| --- | --- |
| `questionType` | `type2` |
| `questionNo` | `5` |
| `isCorrect` | `false` |
| `session_id` | `021306f8-580b-4634-a809-7796b5843387` |
| `resource_id` | `e196c6db-dc0b-4ebd-93b2-10a2125188e5` |
| `userImage` | image file |

#### `annotation1` and `annotation2`

Used for annotation questions where labels are counted and an image is uploaded.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `userImage` | file | Yes | Annotated image file uploaded by the user. |
| `correctLabelCount` | number | Yes | Number of labels placed correctly. |
| `wrongLabelCount` | number | Yes | Number of labels placed incorrectly. |
| `unusedLabelCount` | number | Yes | Number of labels not used. |

Example form-data:

| Field | Value |
| --- | --- |
| `questionType` | `annotation1` |
| `questionNo` | `3` |
| `isCorrect` | `true` |
| `session_id` | `021306f8-580b-4634-a809-7796b5843387` |
| `resource_id` | `e196c6db-dc0b-4ebd-93b2-10a2125188e5` |
| `correctLabelCount` | `4` |
| `wrongLabelCount` | `1` |
| `unusedLabelCount` | `0` |
| `userImage` | image file |

#### `measurement`

Used for measurement/caliper placement questions.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `userImage` | file | Yes | Measurement image file uploaded by the user. |
| `partial` | number enum | Yes | Measurement score. Must be exactly `0`, `0.5`, or `1`. |
| `value` | number | Yes | Measurement value. API stores it as a decimal number. |
| `interpretation` | string | Yes | Measurement interpretation. |
| `caliperPlacementInterpretation` | string | Yes | Caliper placement interpretation. Stored as `caliper_placement_interpretation`. |

Do not send `isCorrect` for `measurement`.

Example form-data:

| Field | Value |
| --- | --- |
| `questionType` | `measurement` |
| `questionNo` | `4` |
| `partial` | `0.5` |
| `session_id` | `021306f8-580b-4634-a809-7796b5843387` |
| `resource_id` | `e196c6db-dc0b-4ebd-93b2-10a2125188e5` |
| `value` | `32.5` |
| `interpretation` | `normal` |
| `caliperPlacementInterpretation` | `good` |
| `userImage` | image file |

## Success Response

HTTP status: `201 Created`

Response body shape:

```json
{
  "result": {
    "status": "Submission Successful",
    "code": 201,
    "data": {
      "question_type": "type2",
      "question_no": 5,
      "is_correct": false,
      "session_id": "021306f8-580b-4634-a809-7796b5843387",
      "user_mail": "user@example.com",
      "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
      "filename": "1780000000000-123456789.png",
      "original_name": "answer.png",
      "storage_path": "iisub/1780000000000-123456789.png",
      "public_url": "https://.../iisub/1780000000000-123456789.png",
      "mime_type": "image/png",
      "size": 123456
    }
  }
}
```

`data` is the inserted row returned from the `submissions` table. It includes the fields relevant to the submitted `questionType`.

### `data` Fields by Question Type

Common returned fields:

| Field | Type | Notes |
| --- | --- | --- |
| `question_type` | string | Submitted question type. |
| `question_no` | number | Submitted question number. |
| `is_correct` | boolean | Correctness submitted for non-measurement question types. |
| `session_id` | UUID string | Session/test ID. |
| `user_mail` | string | User email from authenticated token. |
| `resource_id` | UUID string | Resource ID. |

File upload returned fields for `type2`, `annotation1`, `annotation2`, and `measurement`:

| Field | Type | Notes |
| --- | --- | --- |
| `filename` | string | Generated file name in storage. |
| `original_name` | string | Original uploaded file name. |
| `storage_path` | string | Path in Supabase bucket, under `iisub/`. |
| `public_url` | string | Public URL for uploaded image. |
| `mime_type` | string | File MIME type, for example `image/png`. |
| `size` | number | File size in bytes. |

Additional fields:

| Question Type | Additional Returned Fields |
| --- | --- |
| `type1` | `option_chosen` |
| `annotation1` | `correct_label_count`, `wrong_label_count`, `unused_label_count` |
| `annotation2` | `correct_label_count`, `wrong_label_count`, `unused_label_count` |
| `measurement` | `partial`, `value`, `interpretation`, `caliper_placement_interpretation` |

If the database table has generated columns such as IDs or timestamps, they are also returned because the API uses `RETURNING *`.

## Error Responses

### Missing Common Required Fields

HTTP status: `400 Bad Request`

```json
{
  "success": false,
  "message": "questionType, questionNo, session_id, and resource_id are required"
}
```

### Invalid `questionType`

HTTP status: `400 Bad Request`

```json
{
  "success": false,
  "message": "questionType must be one of: type1, type2, annotation1, annotation2, measurement"
}
```

### Missing Type-Specific Fields

HTTP status: `400 Bad Request`

```json
{
  "success": false,
  "message": "Missing required fields for measurement: userImage, partial, value, interpretation, caliperPlacementInterpretation"
}
```

### Invalid Measurement Partial Score

HTTP status: `400 Bad Request`

```json
{
  "success": false,
  "message": "partial must be one of: 0, 0.5, 1"
}
```

### Missing Token

HTTP status: `401 Unauthorized`

```json
{
  "status": "Unauthorized: No token"
}
```

### Invalid Token

HTTP status: `403 Forbidden`

```json
{
  "status": "Forbidden: Invalid token"
}
```

### Role Not Allowed

HTTP status: `401 Unauthorized`

```json
{
  "result": {
    "status": "Unauthorized",
    "code": 401,
    "message": "You do not have permission to access this profile."
  }
}
```

## cURL Examples

### Measurement

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=measurement" \
  -F "questionNo=4" \
  -F "partial=0.5" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5" \
  -F "value=32.5" \
  -F "interpretation=normal" \
  -F "caliperPlacementInterpretation=good" \
  -F "userImage=@/path/to/measurement.png"
```

### Other Question Types

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=type2" \
  -F "questionNo=5" \
  -F "isCorrect=false" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5" \
  -F "userImage=@/path/to/answer.png"
```

---

## BPD/HC Module - Image Interpretation: Find the Image (`type1`)

The following questions specify the **Find the Image** (`type1`) activity under **Image Interpretation** in the **BPD/HC** module.

### Question 1

**Prompt:** Which image shows the biparietal diameter measurement plane with the thalami, arrow sign, midline falx, and cavum septi pellucidi visible?

- **Question Type:** `type1`
- **Question Number:** `1`
- **Options:**
  - A. Only A
  - B. Both A & D
  - C. Only C
  - D. Both A & C
- **Correct Answer:** `C` (Only C)
- **Feedback (If correct):** You correctly identified the BPD measurement plane, which shows the thalami, arrow sign, midline falx, and cavum septi pellucidi, consistent with the transthalamic view.
- **Feedback (If wrong):** The selected image does not correspond to the transthalamic plane. Ensure the thalami, CSP, arrow sign, and midline falx are clearly visualized for accurate BPD measurement.

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=type1" \
  -F "questionNo=1" \
  -F "isCorrect=true" \
  -F "optionChosen=3" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5"
```

---

### Question 2

**Prompt:** Which image shows the midline falx, arrow sign, thalami, and CSP essential for BPD measurement?

- **Question Type:** `type1`
- **Question Number:** `2`
- **Options:**
  - A. Only B
  - B. Both B & D
  - C. Only D
  - D. Both B & C
- **Correct Answer:** `B` (Both B & D)
- **Feedback (If correct):** Correct! You selected the transthalamic images, which show the midline falx, thalami, arrow sign, and cavum septi pellucidi, essential landmarks for BPD measurement.
- **Feedback (If wrong):** Incorrect. B & D are the correct images with all the key landmarks.

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=type1" \
  -F "questionNo=2" \
  -F "isCorrect=true" \
  -F "optionChosen=2" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5"
```

---

### Question 3

**Prompt:** Which of the following images corresponds to the transthalamic section without visualization of the cerebellum or orbits?

- **Question Type:** `type1`
- **Question Number:** `3`
- **Options:**
  - A. Both B & C
  - B. Both B & A
  - C. Only A
  - D. None of the above
- **Correct Answer:** `A` (Both B & C)
- **Feedback (If correct):** Correct! You chose the transthalamic section showing the thalami, arrow sign, midline falx and CSP, while excluding the cerebellum and orbits.
- **Feedback (If wrong / If none of the above):** Incorrect! Images B and C actually show the correct transthalamic plane with visible thalami, arrow sign, falx and CSP, and without cerebellum or orbits.
- **Alternative Feedback:**
  - *If correct:* Correct! You successfully identified the proper transthalamic plane.
  - *If wrong:* Incorrect! A, C & D represent the correct plane with proper anatomical landmarks.

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=type1" \
  -F "questionNo=3" \
  -F "isCorrect=true" \
  -F "optionChosen=1" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5"
```

---

### Question 4

**Prompt:** Select the correct image for BPD measurement.

- **Question Type:** `type1`
- **Question Number:** `4`
- **Options:**
  - A
  - B
  - C
  - D
- **Correct Option:** `B`
- **Feedback (If correct):** Excellent! You chose the correct transthalamic image suitable for BPD measurement where thalami and CSP are seen clearly.
- **Feedback (If wrong):** The selected image corresponds to a transventricular plane. Remember, the BPD is measured in the transthalamic section showing falx, arrow sign, thalami and CSP.

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=type1" \
  -F "questionNo=4" \
  -F "isCorrect=true" \
  -F "optionChosen=2" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5"
```

---

### Question 5

**Prompt:** Select the correct image for HC measurement

- **Question Type:** `type1`
- **Question Number:** `5`
- **Options:**
  - A
  - B
  - C
  - D
- **Correct Option:** `C`
- **Feedback (If correct):** Correct! You identified the appropriate image for HC measurement - a symmetrical transthalamic plane with the midline falx, arrow sign, thalami and CSP in view.
- **Feedback (If wrong):** Incorrect. The chosen image is not suitable for HC measurement.

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=type1" \
  -F "questionNo=5" \
  -F "isCorrect=true" \
  -F "optionChosen=3" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5"
```

---

## BPD/HC Module - Freeze the Plane (Questions 6 to 10)

The following questions specify the **Freeze the plane** activity under the **BPD/HC** module.

### Question 6

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal head and find the correct timeframe revealing the transthalamic plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `6`
- **Feedback (If correct):** Perfect freeze! The image consists of all the key landmarks: midline falx, box-shaped CSP, and symmetric thalami.
- **Feedback (If wrong):** Incorrect freeze! The frozen frame lacks one or more key landmarks

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=type1" \
  -F "questionNo=6" \
  -F "isCorrect=true" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5"
```

---

### Question 7

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal head and find the correct timeframe revealing the transthalamic plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `7`
- **Feedback (If correct):** Perfect freeze! The image consists of all the key landmarks: midline falx, box-shaped CSP, and symmetric thalami.
- **Feedback (If wrong):** Incorrect freeze! The frozen frame lacks one or more key landmarks

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=type1" \
  -F "questionNo=7" \
  -F "isCorrect=true" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5"
```

---

### Question 8

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal head and find the correct timeframe revealing the transthalamic plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `8`
- **Feedback (If correct):** Perfect freeze! The image consists of all the key landmarks: midline falx, box-shaped CSP, and symmetric thalami.
- **Feedback (If wrong):** Incorrect freeze! The frozen frame lacks one or more key landmarks

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=type1" \
  -F "questionNo=8" \
  -F "isCorrect=true" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5"
```

---

### Question 9

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal head and find the correct timeframe revealing the transthalamic plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `9`
- **Feedback (If correct):** Perfect freeze! The image consists of all the key landmarks: midline falx, box-shaped CSP, and symmetric thalami.
- **Feedback (If wrong):** Incorrect freeze! The frozen frame lacks one or more key landmarks

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=type1" \
  -F "questionNo=9" \
  -F "isCorrect=true" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5"
```

---

### Question 10

**Prompt:** Watch the ultrasound video of the angulation of the probe over the fetal head and find the correct timeframe revealing the transthalamic plane

- **Question Type:** `type1` (or `freeze` / `type2`)
- **Question Number:** `10`
- **Feedback (If correct):** Perfect freeze! The image consists of all the key landmarks: midline falx, box-shaped CSP, and symmetric thalami.
- **Feedback (If wrong):** Incorrect freeze! The frozen frame lacks one or more key landmarks

```bash
curl -X POST "http://localhost:4004/api/v1/submit-ii" \
  -H "Authorization: Bearer <access_token>" \
  -F "questionType=type1" \
  -F "questionNo=10" \
  -F "isCorrect=true" \
  -F "session_id=021306f8-580b-4634-a809-7796b5843387" \
  -F "resource_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5"
```



