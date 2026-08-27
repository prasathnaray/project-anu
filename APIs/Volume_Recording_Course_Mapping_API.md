# Volume, Recording, and Course Mapping API

This document covers the conversion, placement, recording, and course-mapping endpoints listed below.

## Base URLs

| Environment | Base URL |
| --- | --- |
| Local | `http://{{local_base_url}}/api/v1` |
| Production | `http://{{base_url_prod}}/api/v1` |

Replace the variable with the configured host. For example, if `local_base_url` is `localhost:4004`, the local base URL is `http://localhost:4004/api/v1`.

## Authentication

Every endpoint requires a JWT bearer token:

```http
Authorization: Bearer <token>
```

Authentication errors:

| Status | Meaning | Example response |
| --- | --- | --- |
| `401 Unauthorized` | Authorization token is missing | `{ "status": "Unauthorized: No token" }` |
| `403 Forbidden` | Token is invalid, the account does not exist, or the account is inactive | `{ "status": "Forbidden: Invalid token" }` |

## Endpoint summary

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/converted-volumes` | List the authenticated user's completed volume conversions |
| `POST` | `/volume-placement` | Upload a JSON placement file for a volume |
| `GET` | `/volume-placements` | List placements, optionally filtered by `volume_id` |
| `GET` | `/volume-placements/:volume_id` | List placements for a volume supplied in the path |
| `POST` | `/uploadvolumerecording` | Upload a shadow or step recording package |
| `GET` | `/recordings?volume_id=:volume_id` | List the authenticated user's recordings for a volume |
| `GET` | `/course-mappings` | List visible course mappings |
| `POST` | `/course-mappings` | Create a course mapping |
| `GET` | `/course-mappings/with-recordings` | List visible mappings with expanded recording data |

## 1. List converted volumes

```http
GET /converted-volumes
```

Returns completed conversions created by the authenticated volume uploader, newest completion first. Each row includes the conversion log, the volume name, and the placement reference when one exists. Stored asset references are returned as signed URLs.

### Example request

```bash
curl "http://{{local_base_url}}/api/v1/converted-volumes" \
  -H "Authorization: Bearer <token>"
```

### Success response

`200 OK`

```json
[
  {
    "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "conversion_completion": true,
    "started_at": "2026-08-25T08:00:00.000Z",
    "converted_by": "user@example.com",
    "completed_at": "2026-08-25T08:05:00.000Z",
    "output_file": "https://storage.example.com/signed-output-file",
    "error_message": null,
    "volume_name": "Sample Volume",
    "placed_url": "https://storage.example.com/signed-placement-file"
  }
]
```

An empty result is returned as `[]`.

### Endpoint-specific error

`403 Forbidden`

```json
{
  "error": "You do not have permission to view converted volumes."
}
```

## 2. Upload volume placement

```http
POST /volume-placement
Content-Type: multipart/form-data
```

Uploads a valid JSON placement file and associates it with an accessible volume.

### Form fields

| Field | Type | Required | Description |
| --- | --- | :---: | --- |
| `volume_id` | UUID text | Yes | ID of the volume being placed |
| `placed_file` | File | Yes | Valid `.json` file with `application/json` MIME type |

### Example request

```bash
curl -X POST "http://{{base_url_prod}}/api/v1/volume-placement" \
  -H "Authorization: Bearer <token>" \
  -F "volume_id=6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -F "placed_file=@./placement.json;type=application/json"
```

### Success response

`200 OK`

```json
{
  "message": "Volume Placed Successfully",
  "assetPath": "institutions/centre-id/volume-id/placements/1787645100000.json",
  "assetUrl": "https://storage.example.com/signed-placement-file"
}
```

### Validation errors

These errors return `400 Bad Request` as plain text:

- `No file uploaded`
- `Invalid file format. Only JSON files are allowed.`
- `Invalid file extension. Only .json files are allowed.`
- `Invalid JSON content. File contains malformed JSON.`

An unknown or inaccessible volume returns `404 Not Found`:

```json
{
  "message": "Volume not found."
}
```

## 3. List volume placements

```http
GET /volume-placements
GET /volume-placements?volume_id=:volume_id
```

The query parameter is optional. Without it, the endpoint lists all placements visible to the authenticated uploader. With it, the result is filtered to the specified volume.

### Query parameter

| Name | Type | Required | Description |
| --- | --- | :---: | --- |
| `volume_id` | UUID | No | Return placements for this volume only |

### Example request

```bash
curl "http://{{local_base_url}}/api/v1/volume-placements?volume_id=6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

### Success response

`200 OK`

```json
[
  {
    "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "placed_url": "https://storage.example.com/signed-placement-file",
    "placed_by": "user@example.com",
    "created_at": "2026-08-25T08:10:00.000Z",
    "volume_name": "Sample Volume"
  }
]
```

No matching placements returns `[]`.

## 4. List placements by volume path parameter

```http
GET /volume-placements/:volume_id
```

`:volume_id` is a placeholder and must be replaced with the actual UUID. Do not send the literal text `volume_id`.

### Path parameter

| Name | Type | Required | Description |
| --- | --- | :---: | --- |
| `volume_id` | UUID | Yes | Volume whose placement rows will be returned |

### Example request

```bash
curl "http://{{local_base_url}}/api/v1/volume-placements/6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

The `200 OK` response has the same array structure as `GET /volume-placements`. An unknown, inaccessible, or unplaced volume produces an empty array.

## 5. Upload a volume recording package

```http
POST /uploadvolumerecording
Content-Type: multipart/form-data
```

Uploads one `shadow` or `step` package. Both recording types require at least one recording JSON, one WAV file, one image, and exactly one manifest.

### Form fields

| Field | Type | Required | Limits and accepted values |
| --- | --- | :---: | --- |
| `volume_id` | UUID text | Yes | An accessible volume |
| `recording_name` | Text | Yes | Recording display name |
| `recording_type` | Text | Yes | `shadow` or `step` |
| `recording_file` | File, repeatable | Yes | 1-20 valid `.json` files |
| `audio_file` | File, repeatable | Yes | 1-20 `.wav` files |
| `images` | File, repeatable | Yes | 1-20 `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, or `.bmp` files |
| `manifest_file` | File | Yes | Exactly one valid `.json` or `.manifest` file |

Each file may be at most 50 MB. The whole request may contain at most 61 files.

### Example request

```bash
curl -X POST "http://{{base_url_prod}}/api/v1/uploadvolumerecording" \
  -H "Authorization: Bearer <token>" \
  -F "volume_id=6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -F "recording_name=Shadow Demo" \
  -F "recording_type=shadow" \
  -F "recording_file=@./shadow-1.json;type=application/json" \
  -F "recording_file=@./shadow-2.json;type=application/json" \
  -F "audio_file=@./shadow-1.wav;type=audio/wav" \
  -F "images=@./shadow-1.png;type=image/png" \
  -F "manifest_file=@./manifest.json;type=application/json"
```

### Success response

`200 OK`

```json
{
  "message": "Volume shadow Recording Uploaded Successfully",
  "recordingType": "shadow",
  "recordingUrl": "https://storage.example.com/signed-recording-1",
  "recordingFilesUploaded": 2,
  "recordingUrls": [
    "https://storage.example.com/signed-recording-1",
    "https://storage.example.com/signed-recording-2"
  ],
  "audioFilesUploaded": 1,
  "audioUrls": ["https://storage.example.com/signed-audio-1"],
  "imageFilesUploaded": 1,
  "imageUrls": ["https://storage.example.com/signed-image-1"],
  "manifestUrl": "https://storage.example.com/signed-manifest",
  "data": {
    "status": "Success",
    "code": 200,
    "message": "Volume recording saved successfully",
    "data": {
      "recording_id": "recording-uuid",
      "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
      "recording_name": "Shadow Demo",
      "recording_type": "shadow"
    }
  }
}
```

### Common errors

`400 Bad Request` for an unsupported recording type:

```json
{
  "error": "Invalid recording_type. Must be 'shadow' or 'step'",
  "received": "other"
}
```

`400 Bad Request` when a required file group is missing:

```json
{
  "error": "Shadow and step recordings require at least 1 JSON file, 1 WAV file, 1 image, and 1 manifest file",
  "received": {
    "recording_files": 1,
    "audio_files": 0,
    "images": 1,
    "manifest_file": 1
  }
}
```

Invalid extensions, MIME types, or malformed JSON also return `400 Bad Request`. An unknown or inaccessible volume returns `404 Not Found`.

## 6. List recordings for a volume

```http
GET /recordings?volume_id=:volume_id
```

Returns recording rows for the requested volume only when they were created by the currently authenticated user. Results are ordered newest first. Asset references in `rec_files`, `audio_files`, `image_files`, and `manifest_file` are returned as signed URLs.

### Query parameter

| Name | Type | Required | Description |
| --- | --- | :---: | --- |
| `volume_id` | UUID/string | Yes | Volume whose recordings will be returned |

### Example request

```bash
curl "http://{{local_base_url}}/api/v1/recordings?volume_id=6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

### Success response

`200 OK`

```json
[
  {
    "recording_id": "recording-uuid",
    "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "recording_name": "Shadow Demo",
    "recording_type": "shadow",
    "rec_files": ["https://storage.example.com/signed-recording"],
    "audio_files": ["https://storage.example.com/signed-audio"],
    "image_files": ["https://storage.example.com/signed-image"],
    "manifest_file": "https://storage.example.com/signed-manifest",
    "validation_status": "draft",
    "created_by": "user@example.com",
    "created_at": "2026-08-25T08:15:00.000Z"
  }
]
```

No matching recordings returns `[]`.

### Missing query parameter

`400 Bad Request`

```json
{
  "error": "volume_id is required"
}
```

## 7. Course mappings

The `/course-mappings` path supports both listing and creation.

### 7.1 List course mappings

```http
GET /course-mappings
```

Returns visible mapping rows without expanding the linked recording files.

### Optional query filters

| Name | Match behavior |
| --- | --- |
| `trimester` | Case-insensitive exact match |
| `anatomy_type` | Case-insensitive exact match |
| `volume_name` | Case-insensitive partial match |
| `module_name` | Case-insensitive exact match |
| `course_type` | Case-insensitive exact match |

### Example request

```bash
curl "http://{{local_base_url}}/api/v1/course-mappings?trimester=Second%20Trimester&course_type=Free%20Scan" \
  -H "Authorization: Bearer <token>"
```

### Success response

`200 OK`

```json
{
  "code": 200,
  "status": "Success",
  "data": [
    {
      "mapping_id": "mapping-uuid",
      "trimester": "Second Trimester",
      "anatomy_type": "Fetal Anatomy",
      "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
      "volume_name": "Sample Volume",
      "course_name": "Sample Course",
      "description": "Course description",
      "doctor_name": "Dr Example",
      "module_name": "SVT Course",
      "course_type": "Free Scan",
      "shadow_recording_id": "shadow-recording-uuid",
      "step_recording_id": "step-recording-uuid",
      "created_by": "user@example.com",
      "created_by_name": "Example User",
      "created_at": "2026-08-25T08:20:00.000Z"
    }
  ]
}
```

### 7.2 Create a course mapping

```http
POST /course-mappings
Content-Type: application/json
```

Only Super Admin (`99`) and Institution Admin (`101`) users may create mappings. Ownership is derived from the authenticated user and must not be supplied by the client.

### JSON body

| Field | Type | Required | Accepted values or description |
| --- | --- | :---: | --- |
| `trimester` | String | Yes | `First Trimester`, `Second Trimester`, `Third Trimester` |
| `anatomy_type` | String | Yes | Must identify the accessible volume's anatomy/unit type when needed |
| `volume_name` | String | Yes | Name of an accessible existing volume |
| `module_name` | String | Yes | `Biometry`, `Six Step`, `20 + 2 planes`, `SVT Course` |
| `course_type` | String | Yes | `p1`, `p2`, `p3`, `p4`, `t1`, `t2`, `Practice`, `Test`, `Free scan`, `Free Scan`, or `Single Plane` |
| `shadow_recording_id` | UUID | No | Existing shadow recording belonging to the resolved volume |
| `step_recording_id` | UUID | No | Existing step recording belonging to the resolved volume |
| `course_name` | String | No | Course display name |
| `description` | String | No | Course description |
| `doctor_name` | String | No | Doctor/instructor display name |

### Example request

```bash
curl -X POST "http://{{local_base_url}}/api/v1/course-mappings" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "trimester": "Second Trimester",
    "anatomy_type": "Fetal Anatomy",
    "volume_name": "Sample Volume",
    "module_name": "SVT Course",
    "course_type": "Free Scan",
    "shadow_recording_id": "11111111-1111-1111-1111-111111111111",
    "step_recording_id": "22222222-2222-2222-2222-222222222222",
    "course_name": "Sample Course",
    "description": "Course description",
    "doctor_name": "Dr Example"
  }'
```

### Success response

`201 Created`

```json
{
  "code": 201,
  "status": "Created Successfully",
  "data": {
    "mapping_id": "mapping-uuid",
    "trimester": "Second Trimester",
    "anatomy_type": "Fetal Anatomy",
    "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "volume_name": "Sample Volume",
    "module_name": "SVT Course",
    "course_type": "Free Scan",
    "shadow_recording_id": "11111111-1111-1111-1111-111111111111",
    "step_recording_id": "22222222-2222-2222-2222-222222222222"
  }
}
```

### Common errors

| Status | Condition |
| --- | --- |
| `400` | A required field is missing or an enum value is invalid |
| `401` | Authenticated role cannot create mappings |
| `403` | Account lacks an institution or cannot use the selected volume |
| `404` | Volume or supplied recording does not exist in the required scope |
| `409` | Multiple volumes match, or the same mapping combination already exists |

## 8. List course mappings with recordings

```http
GET /course-mappings/with-recordings
```

Accepts the same optional filters as `GET /course-mappings`. Each mapping also contains `shadow_recording` and `step_recording`. Either value is `null` when no matching recording is linked. Asset references are returned as signed URLs.

### Example request

```bash
curl "http://{{local_base_url}}/api/v1/course-mappings/with-recordings" \
  -H "Authorization: Bearer <token>"
```

### Success response

`200 OK`

```json
{
  "code": 200,
  "status": "Success",
  "data": [
    {
      "mapping_id": "mapping-uuid",
      "trimester": "Second Trimester",
      "anatomy_type": "Fetal Anatomy",
      "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
      "volume_name": "Sample Volume",
      "module_name": "SVT Course",
      "course_type": "Free Scan",
      "shadow_recording_id": "shadow-recording-uuid",
      "step_recording_id": "step-recording-uuid",
      "created_by": "user@example.com",
      "created_by_name": "Example User",
      "shadow_recording": {
        "recording_id": "shadow-recording-uuid",
        "recording_name": "Shadow Demo",
        "recording_type": "shadow",
        "rec_files": ["https://storage.example.com/signed-shadow-json"],
        "audio_files": ["https://storage.example.com/signed-shadow-audio"],
        "image_files": ["https://storage.example.com/signed-shadow-image"],
        "manifest_file": "https://storage.example.com/signed-shadow-manifest",
        "validation_status": "draft",
        "created_at": "2026-08-25T08:15:00.000Z",
        "created_by": "user@example.com"
      },
      "step_recording": null
    }
  ]
}
```

## Visibility rules

- Volume conversion, placement, and recording management is available to roles `99`, `101`, and `102`, subject to server-side ownership rules.
- `/converted-volumes` returns only volumes uploaded by the authenticated user.
- `/recordings` returns only recording rows created by the authenticated user for the supplied volume.
- A Super Admin sees only global course mappings that they created.
- Institution Admin, Instructor, and Trainee users see institution-owned mappings for their current `centre_id`.
- List endpoints return an empty collection when the authenticated scope contains no matching rows.

## Content types at a glance

| Endpoint | Request content type |
| --- | --- |
| `POST /volume-placement` | `multipart/form-data` |
| `POST /uploadvolumerecording` | `multipart/form-data` |
| `POST /course-mappings` | `application/json` |
| All `GET` endpoints | No request body |
