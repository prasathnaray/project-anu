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
| `isCorrect` | boolean | Yes | Whether the answer is correct. Send as `true` or `false` text in form-data. |
| `session_id` | UUID string | Yes | Active II test/session ID. |
| `resource_id` | UUID string | Yes | Resource ID for the II activity. |

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
| `value` | number | Yes | Measurement value. API stores it as a decimal number. |
| `interpretation` | string | Yes | Measurement interpretation. |
| `caliperPlacementInterpretation` | string | Yes | Caliper placement interpretation. Stored as `caliper_placement_interpretation`. |

Example form-data:

| Field | Value |
| --- | --- |
| `questionType` | `measurement` |
| `questionNo` | `4` |
| `isCorrect` | `true` |
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
| `is_correct` | boolean | Correctness submitted by client. |
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
| `measurement` | `value`, `interpretation`, `caliper_placement_interpretation` |

If the database table has generated columns such as IDs or timestamps, they are also returned because the API uses `RETURNING *`.

## Error Responses

### Missing Common Required Fields

HTTP status: `400 Bad Request`

```json
{
  "success": false,
  "message": "questionType, questionNo, isCorrect, session_id, and resource_id are required"
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
  "message": "Missing required fields for measurement: userImage, value, interpretation, caliperPlacementInterpretation"
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

## cURL Example

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
