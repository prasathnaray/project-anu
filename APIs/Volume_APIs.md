# Volume API Reference

This document describes the authenticated volume workflow: source upload, approval, conversion, placement, recordings, and resource association.

## Connection and authentication

| Environment | Base URL |
| --- | --- |
| Local | `http://localhost:4004/api/v1` |
| Production collection | `http://{{base_url_prod}}/api/v1` |

Every endpoint in this document is mounted behind `Authenticate` and requires a bearer token:

```http
Authorization: Bearer <token>
```

Requests use JSON unless an endpoint explicitly specifies `multipart/form-data`.

### Role access

| Role | Manageable volumes |
| --- | --- |
| `99` Super Admin | Only volumes uploaded by that authenticated user |
| `101` Institution Admin | Own uploads and role-`102` uploads from the same institution |
| `102` Instructor | Only volumes uploaded by that authenticated user |
| `103` Trainee | No volume-management access |

The same scope applies to source lists, approval, conversion, placements, recordings, validation, associations, the MR workspace, and course-mapping selection. A role-`101` user's upload is not visible to another role-`101` user. Uploader role is captured at upload time, so later account role changes do not alter historical access.

List endpoints return only accessible records. An inaccessible volume identifier is reported as `404 Not Found`; a role without volume-management permission receives `403 Forbidden`.

## Endpoint index

| Area | Method | Endpoint | Description |
| --- | --- | --- | --- |
| Source | `POST` | `/sv-upload` | Upload a source volume and its metadata |
| Source | `GET` | `/get-volumes` | List uploaded volumes |
| Source | `PATCH` | `/approve-volume/:status_approval/:volume_id` | Approve or reject a volume |
| Source | `GET` | `/get-volumes-by-instructor` | List volumes with conversion status |
| Conversion | `PUT` | `/convert-vol/:volume_id` | Start an asynchronous conversion |
| Conversion | `GET` | `/converted-volumes` | List completed conversions |
| Placement | `POST` | `/volume-placement` | Upload placement JSON |
| Placement | `GET` | `/volume-placements` | List placements, optionally filtered by `volume_id` |
| Placement | `GET` | `/volume-placements/:volume_id` | List placements for one volume |
| Recording | `POST` | `/uploadvolumerecording` | Upload recording JSON, WAV, images, and one manifest |
| Recording | `GET` | `/shadow-recordings?volume_id=...` | List recordings for a volume |
| Recording | `GET` | `/volume-recording-counts` | Get shadow counts and step assets by volume |
| Recording | `GET` | `/shadow-recording-counts` | Legacy alias for recording counts |
| Association | `POST` | `/associateVolume` | Associate a resource, volume, and recordings |
| Association | `GET` | `/get-assovol?r_id=...` | Get associated volume data for a resource |

## Workflow

1. Upload a source volume with `POST /sv-upload`.
2. Review it through `GET /get-volumes` or `GET /get-volumes-by-instructor`.
3. Approve or reject it with `PATCH /approve-volume/:status_approval/:volume_id`.
4. Start conversion with `PUT /convert-vol/:volume_id`.
5. Retrieve completed output through `GET /converted-volumes`.
6. Upload and verify placement JSON.
7. Upload the `shadow` and `step` recording packages, each with one manifest.
8. Select the required recordings and associate them with a resource.

## Source volumes

### Upload a source volume

```http
POST /sv-upload
Content-Type: multipart/form-data
```

The file is stored at `volumes/<original-filename>`. Uploading the same object path overwrites the existing storage object because this endpoint uses `upsert: true`.

| Field | Type | Required | Description |
| --- | --- | :---: | --- |
| `volume_type` | text | Yes | Anatomy or volume type |
| `volume_name` | text | Yes | Display name |
| `volume_ga` | text | Yes | Gestational age |
| `volume_fetal_presentation` | text | Yes | Fetal presentation |
| `trimester` | text | Yes | For example, `Second Trimester` |
| `description` | text | Yes | Case description |
| `file` | file | Yes | One source volume file |

The default maximum file size is 100 MB. Set `MAX_VOLUME_UPLOAD_SIZE_MB` to change it.

```bash
curl -X POST "http://localhost:4004/api/v1/sv-upload" \
  -H "Authorization: Bearer <token>" \
  -F "volume_type=Fetal Anatomy" \
  -F "volume_name=FL - I0000004" \
  -F "volume_ga=22" \
  -F "volume_fetal_presentation=Cephalic" \
  -F "trimester=Second Trimester" \
  -F "description=Sample fetal anatomy case details" \
  -F "file=@./FL - I0000004.vol"
```

Success - `200 OK`:

```json
{
  "statusCode": 200,
  "message": "Volume Uploaded"
}
```

Common errors:

| Status | Condition | Response |
| --- | --- | --- |
| `404` | File is missing | `{ "error": "No file uploaded" }` |
| `406` | A metadata field is empty | `{ "message": "Fields should not be empty" }` |
| `413` | File exceeds the configured limit | `{ "error": "Volume file is too large. Maximum allowed size is 100MB." }` |

### List uploaded volumes

```http
GET /get-volumes
```

Returns accessible uploaded volumes joined with the uploader's `user_name`, newest first, according to the role-access rules above.

```bash
curl "http://localhost:4004/api/v1/get-volumes" \
  -H "Authorization: Bearer <token>"
```

Success - `200 OK`:

```json
[
  {
    "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "volume_type": "Fetal Anatomy",
    "volume_name": "FL - I0000004",
    "volume_ga": "22",
    "volume_fetal_presentation": "Cephalic",
    "trimester": "Second Trimester",
    "description": "Sample fetal anatomy case details",
    "volume_file": "volumes/FL - I0000004.vol",
    "status": "pending",
    "added_by": "admin@anu.in",
    "created_at": "2026-06-22T10:00:00.000Z",
    "user_name": "Admin"
  }
]
```

### Approve or reject a volume

```http
PATCH /approve-volume/:status_approval/:volume_id
```

| Path parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `status_approval` | string | Yes | Value stored in `volumes.status`, such as `approved` or `rejected` |
| `volume_id` | UUID | Yes | Volume to update |

```bash
curl -X PATCH "http://localhost:4004/api/v1/approve-volume/approved/6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

Success - `200 OK`:

```text
Updated Successfully
```

### List volumes for instructor/admin view

```http
GET /get-volumes-by-instructor
```

Role `99` and role `102` receive only their own volumes. Role `101` receives their own volumes plus volumes uploaded by role `102` users in the same institution.

```bash
curl "http://localhost:4004/api/v1/get-volumes-by-instructor" \
  -H "Authorization: Bearer <token>"
```

Success - `200 OK`:

```json
[
  {
    "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "volume_type": "Fetal Anatomy",
    "volume_name": "FL - I0000004",
    "trimester": "Second Trimester",
    "volume_ga": "22",
    "volume_fetal_presentation": "Cephalic",
    "status": "approved",
    "conversion_process_status": false,
    "volume_file": "volumes/FL - I0000004.vol",
    "added_by": "admin@anu.in",
    "approver_id": "admin@anu.in",
    "started_at": "2026-06-22T10:10:00.000Z",
    "conversion_completion": true,
    "converted_by": "admin@anu.in",
    "completed_at": "2026-06-22T10:12:00.000Z",
    "output_file": "https://example.com/output.nii"
  }
]
```

## Conversion

### Start conversion

```http
PUT /convert-vol/:volume_id
```

The endpoint validates the UUID, verifies that the volume exists, prevents concurrent conversion for the same volume, updates `volume_conv_logs`, and submits the asynchronous conversion job.

| Path parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `volume_id` | UUID | Yes | Existing source volume |

Conversion starts are limited to one request per authenticated user every two minutes.

```bash
curl -X PUT "http://localhost:4004/api/v1/convert-vol/6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

Success - `200 OK`:

```json
{
  "success": true,
  "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
  "job_id": "conversion-job-id",
  "status": "RUNNING",
  "message": "Volume conversion started successfully",
  "timestamp": "2026-06-22T10:10:00.000Z"
}
```

| Status | Condition | Error value |
| --- | --- | --- |
| `400` | Invalid UUID | `Invalid volume ID format` |
| `403` | Role is not allowed | `You do not have permission to convert volumes` |
| `404` | Volume does not exist | `Volume not found` |
| `409` | Conversion is already active | `Conversion already in progress for this volume` |
| `429` | Per-user rate limit exceeded | `Too many conversion requests. Please wait.` |

### List completed conversions

```http
GET /converted-volumes
```

Returns completed conversion logs joined with `volume_name` and an optional placement URL.

```bash
curl "http://localhost:4004/api/v1/converted-volumes" \
  -H "Authorization: Bearer <token>"
```

Success - `200 OK`:

```json
[
  {
    "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "conversion_completion": true,
    "started_at": "2026-06-22T10:10:00.000Z",
    "converted_by": "admin@anu.in",
    "completed_at": "2026-06-22T10:12:00.000Z",
    "output_file": "https://example.com/output.nii",
    "error_message": null,
    "volume_name": "FL - I0000004",
    "placed_url": "https://example.com/volume_placements/placement.json"
  }
]
```

## Placements

### Upload placement JSON

```http
POST /volume-placement
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
| --- | --- | :---: | --- |
| `volume_id` | text UUID | Yes | Converted volume ID |
| `placed_file` | file | Yes | Valid `.json` with MIME type `application/json` |

The file is stored at `volume_placements/<volume_id>_<timestamp>.json`.

```bash
curl -X POST "http://localhost:4004/api/v1/volume-placement" \
  -H "Authorization: Bearer <token>" \
  -F "volume_id=6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -F "placed_file=@./placement.json;type=application/json"
```

Success - `200 OK`:

```json
{
  "message": "Volume Placed Successfully",
  "fileUrl": "https://example.com/storage/v1/object/public/bucket/volume_placements/6982d3f3-8617-49a7-9b0d-d160db9adf6c_1780910000000.json"
}
```

Validation failures return `400 Bad Request` as plain text:

- `No file uploaded`
- `Invalid file format. Only JSON files are allowed.`
- `Invalid file extension. Only .json files are allowed.`
- `Invalid JSON content. File contains malformed JSON.`

### List placements

```http
GET /volume-placements
GET /volume-placements?volume_id=:volume_id
```

The optional query parameter filters the result to one volume.

| Query parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `volume_id` | UUID | No | Volume filter |

```bash
curl "http://localhost:4004/api/v1/volume-placements?volume_id=6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

Success - `200 OK`:

```json
[
  {
    "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "placed_url": "https://example.com/storage/v1/object/public/bucket/volume_placements/placement.json",
    "created_at": "2026-06-22T10:20:00.000Z",
    "volume_name": "FL - I0000004"
  }
]
```

### List placements by path ID

```http
GET /volume-placements/:volume_id
```

```bash
curl "http://localhost:4004/api/v1/volume-placements/6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

The response has the same array shape as `GET /volume-placements`. An unknown volume returns an empty array.

## Recordings

### Recording package contract

Each `shadow` or `step` request contains three repeatable file groups and exactly one manifest.

| Multipart field | Count | Accepted files | Storage prefix | Database column |
| --- | ---: | --- | --- | --- |
| `recording_file` | 1-20 | Valid `.json` | `volume_recordings/` | `rec_files` JSONB array |
| `audio_file` | 1-20 | `.wav` | `volume_audio/` | `audio_files` JSONB array |
| `images` | 1-20 | `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.bmp` | `volume_images/` | `image_files` JSONB array |
| `manifest_file` | Exactly 1 | `.json` or `.manifest` | `volume_manifests/` | `manifest_file` text |

Each file may be at most 50 MB. A request can contain no more than 61 files in total. JSON recording files and `.json` manifests are parsed before any upload begins.

The `manifest_file` database column is introduced by:

```text
server/v1/migrations/20260806_add_manifest_to_volume_recordings.sql
```

Apply this migration before deploying the updated recording endpoint.

### Upload a recording package

```http
POST /uploadvolumerecording
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
| --- | --- | :---: | --- |
| `volume_id` | text UUID | Yes | Parent volume ID |
| `recording_name` | text | Yes | Display name |
| `recording_type` | text | Yes | `shadow` or `step` |
| `recording_file` | file | Yes | Repeat for each recording JSON |
| `audio_file` | file | Yes | Repeat for each WAV file |
| `images` | file | Yes | Repeat for each image |
| `manifest_file` | file | Yes | Supply once only |

Example with two files in each repeatable group:

```bash
curl -X POST "http://localhost:4004/api/v1/uploadvolumerecording" \
  -H "Authorization: Bearer <token>" \
  -F "volume_id=6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -F "recording_name=Shadow Demo" \
  -F "recording_type=shadow" \
  -F "recording_file=@./shadow-1.json;type=application/json" \
  -F "recording_file=@./shadow-2.json;type=application/json" \
  -F "audio_file=@./shadow-1.wav;type=audio/wav" \
  -F "audio_file=@./shadow-2.wav;type=audio/wav" \
  -F "images=@./shadow-1.png;type=image/png" \
  -F "images=@./shadow-2.jpg;type=image/jpeg" \
  -F "manifest_file=@./manifest.json;type=application/json"
```

For a step recording, use `recording_type=step` and the corresponding step assets.

Success - `200 OK`:

```json
{
  "message": "Volume shadow Recording Uploaded Successfully",
  "recordingType": "shadow",
  "recordingUrl": "https://example.com/storage/v1/object/public/bucket/volume_recordings/shadow-1.json",
  "recordingFilesUploaded": 2,
  "recordingUrls": [
    "https://example.com/storage/v1/object/public/bucket/volume_recordings/shadow-1.json",
    "https://example.com/storage/v1/object/public/bucket/volume_recordings/shadow-2.json"
  ],
  "audioFilesUploaded": 2,
  "audioUrls": [
    "https://example.com/storage/v1/object/public/bucket/volume_audio/shadow-1.wav",
    "https://example.com/storage/v1/object/public/bucket/volume_audio/shadow-2.wav"
  ],
  "imageFilesUploaded": 2,
  "imageUrls": [
    "https://example.com/storage/v1/object/public/bucket/volume_images/shadow-1.png",
    "https://example.com/storage/v1/object/public/bucket/volume_images/shadow-2.jpg"
  ],
  "manifestUrl": "https://example.com/storage/v1/object/public/bucket/volume_manifests/manifest.json",
  "data": {
    "status": "Success",
    "code": 200,
    "message": "Volume recording saved successfully",
    "data": {
      "recording_id": "recording-uuid",
      "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
      "recording_name": "Shadow Demo",
      "recording_type": "shadow",
      "rec_files": ["https://example.com/shadow-1.json", "https://example.com/shadow-2.json"],
      "audio_files": ["https://example.com/shadow-1.wav", "https://example.com/shadow-2.wav"],
      "image_files": ["https://example.com/shadow-1.png", "https://example.com/shadow-2.jpg"],
      "manifest_file": "https://example.com/manifest.json"
    }
  }
}
```

Common validation errors - `400 Bad Request`:

```json
{
  "error": "Invalid recording_type. Must be 'shadow' or 'step'",
  "received": "demo"
}
```

```json
{
  "error": "Shadow and step recordings require at least 1 JSON file, 1 WAV file, 1 image, and 1 manifest file",
  "received": {
    "recording_files": 2,
    "audio_files": 2,
    "images": 2,
    "manifest_file": 0
  }
}
```

Other validation failures identify the invalid file index, MIME type, extension, filename, or malformed JSON content.

### List recordings for a volume

```http
GET /shadow-recordings?volume_id=:volume_id
```

Despite the route name, this query returns both shadow and step recording rows for the volume.

| Query parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `volume_id` | UUID | Yes | Parent volume ID |

```bash
curl "http://localhost:4004/api/v1/shadow-recordings?volume_id=6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

Success - `200 OK`:

```json
[
  {
    "recording_type": "shadow",
    "recording_name": "Shadow Demo",
    "recording_id": "recording-uuid",
    "rec_files": ["https://example.com/shadow-1.json", "https://example.com/shadow-2.json"],
    "audio_files": ["https://example.com/shadow-1.wav", "https://example.com/shadow-2.wav"],
    "image_files": ["https://example.com/shadow-1.png", "https://example.com/shadow-2.jpg"],
    "manifest_file": "https://example.com/manifest.json"
  }
]
```

### Get recording counts

```http
GET /volume-recording-counts
```

Returns one row per volume with the shadow recording count and deduplicated JSON/image URLs for step recordings. It does not currently include step audio or manifest URLs.

`GET /shadow-recording-counts` is a legacy alias with the same controller and response.

```bash
curl "http://localhost:4004/api/v1/volume-recording-counts" \
  -H "Authorization: Bearer <token>"
```

Success - `200 OK`:

```json
[
  {
    "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "shadow_recording_count": 1,
    "step_recording_files": [
      "https://example.com/storage/v1/object/public/bucket/volume_recordings/step.json"
    ],
    "step_recording_images": [
      "https://example.com/storage/v1/object/public/bucket/volume_images/step.png"
    ]
  }
]
```

Forbidden - `403 Forbidden`:

```json
{
  "error": "You do not have permission to view volume recordings"
}
```

## Resource associations

### Associate a resource, volume, and recordings

```http
POST /associateVolume
Content-Type: application/json
```

| Body field | Type | Required | Description |
| --- | --- | :---: | --- |
| `r_id` | UUID | Yes | Resource ID |
| `volume_id` | UUID | Yes | Volume ID |
| `shadowrec_id` | UUID | Yes | Shadow recording ID |
| `steprec_id` | UUID | Yes | Step recording ID |

```bash
curl -X POST "http://localhost:4004/api/v1/associateVolume" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "r_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
    "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "shadowrec_id": "11111111-1111-1111-1111-111111111111",
    "steprec_id": "22222222-2222-2222-2222-222222222222"
  }'
```

Success - `200 OK`:

```text
Associated Successfully
```

### Get associated volume data

```http
GET /get-assovol?r_id=:resource_id
```

| Query parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `r_id` | UUID | Yes | Resource ID |

```bash
curl "http://localhost:4004/api/v1/get-assovol?r_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5" \
  -H "Authorization: Bearer <token>"
```

Success - `200 OK`:

```json
[
  {
    "r_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
    "vol_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "shadowrec_id": "11111111-1111-1111-1111-111111111111",
    "steprec_id": "22222222-2222-2222-2222-222222222222",
    "volume_name": "FL - I0000004",
    "resource_id": "e196c6db-dc0b-4ebd-93b2-10a2125188e5",
    "resource_name": "Image Interpretation Practice",
    "created_at": "2026-06-22T10:00:00.000Z",
    "recording_id": "11111111-1111-1111-1111-111111111111",
    "recording_name": "Shadow Demo",
    "recording_type": "shadow",
    "rec_files": ["https://example.com/shadow-1.json", "https://example.com/shadow-2.json"],
    "audio_files": ["https://example.com/shadow-1.wav", "https://example.com/shadow-2.wav"],
    "image_files": ["https://example.com/shadow-1.png", "https://example.com/shadow-2.jpg"],
    "manifest_file": "https://example.com/manifest.json"
  }
]
```

The current query joins recordings by `volume_id`, so a volume with multiple recordings can produce multiple rows.

## Bruno request files

The production API collection contains the following volume requests:

| Area | Request file |
| --- | --- |
| Source | `APIs/API_Prod_Test/Volume upload.yml` |
| Source | `APIs/API_Prod_Test/Get Volumes.yml` |
| Source | `APIs/API_Prod_Test/Approve Volume.yml` |
| Source | `APIs/API_Prod_Test/Get Volumes By Instructor.yml` |
| Conversion | `APIs/API_Prod_Test/COnversion.yml` |
| Conversion | `APIs/API_Prod_Test/Converted Volumes.yml` |
| Placement | `APIs/API_Prod_Test/Volume Placement.yml` |
| Placement | `APIs/API_Prod_Test/Get Volume Placements.yml` |
| Placement | `APIs/API_Prod_Test/Get Volume Placements By ID.yml` |
| Recording | `APIs/API_Prod_Test/Upload Volume Recording.yml` |
| Recording | `APIs/API_Prod_Test/Shadow Recordings.yml` |
| Recording | `APIs/API_Prod_Test/Volume Recording Counts.yml` |
| Recording | `APIs/API_Prod_Test/Shadow Recording Counts Legacy.yml` |
| Association | `APIs/API_Prod_Test/Associate Volume.yml` |
| Association | `APIs/API_Prod_Test/Get Associated Volume.yml` |
