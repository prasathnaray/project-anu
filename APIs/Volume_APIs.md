# Volume API Documentation

Base URL:

```text
http://localhost:4004/api/v1
```

Production collection variable:

```text
http://{{base_url_prod}}/api/v1
```

All volume APIs are mounted behind `Authenticate` and require:

```http
Authorization: Bearer <token>
```

Most write and admin read operations are intended for privileged roles:

| Role | Typical access |
| --- | --- |
| `99` | Super admin, can view all volumes |
| `101` | Admin, can view all volumes |
| `102` | Instructor/admin user, can view own volumes for some endpoints |
| `103` | Allowed for source-volume upload, placement upload/read, uploaded-volume listing, and recording counts; not recording upload |

Note: authorization handling is not fully consistent in the current controllers. Non-privileged users may receive `401`, `500`, empty data, or no useful response depending on the endpoint.

## Endpoint Summary

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/sv-upload` | Upload a source volume file and metadata |
| `GET` | `/get-volumes` | List uploaded volumes |
| `PATCH` | `/approve-volume/:status_approval/:volume_id` | Update volume approval status |
| `GET` | `/get-volumes-by-instructor` | List volumes with conversion status for instructor/admin view |
| `PUT` | `/convert-vol/:volume_id` | Start volume conversion |
| `GET` | `/converted-volumes` | List successfully converted volumes |
| `POST` | `/volume-placement` | Upload placement JSON for a converted volume |
| `GET` | `/volume-placements` | List all placement records; optionally filter with `volume_id` |
| `GET` | `/volume-placements/:volume_id` | List placement records for one volume |
| `POST` | `/uploadvolumerecording` | Upload shadow or step recording JSON, audio, images, and one manifest |
| `GET` | `/shadow-recordings?volume_id=...` | Get recordings for a volume |
| `GET` | `/volume-recording-counts` | Get shadow count and step recording files by volume |
| `GET` | `/shadow-recording-counts` | Legacy alias of `/volume-recording-counts` |
| `POST` | `/associateVolume` | Associate a resource with a volume and recordings |
| `GET` | `/get-assovol?r_id=...` | Get volume associations for a resource |

## End-to-End Pipeline

1. Upload the source file with `POST /sv-upload`.
2. Review it with `GET /get-volumes` or `GET /get-volumes-by-instructor`.
3. Approve or reject it with `PATCH /approve-volume/:status_approval/:volume_id`.
4. Start conversion with `PUT /convert-vol/:volume_id`.
5. Read completed conversions with `GET /converted-volumes`.
6. Upload placement JSON with `POST /volume-placement`, then verify it with either placement-read endpoint.
7. Upload `shadow` and `step` recordings with `POST /uploadvolumerecording`.
8. Read recording details/counts, then associate the selected volume and recordings with a resource.

## 1. Upload Volume

Uploads a volume file to Supabase storage under `volumes/<original filename>` and inserts a row in `volumes`.

```http
POST /sv-upload
Content-Type: multipart/form-data
```

Form data:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `volume_type` | text | Yes | Anatomy/type label |
| `volume_name` | text | Yes | Display name |
| `volume_ga` | text | Yes | Gestational age |
| `volume_fetal_presentation` | text | Yes | Presentation text |
| `trimester` | text | Yes | Example: `Second Trimester` |
| `description` | text | Yes | Case description |
| `file` | file | Yes | Source volume file |

Example:

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

Success response:

```json
{
  "statusCode": 200,
  "message": "Volume Uploaded"
}
```

Error responses:

```json
{
  "error": "No file uploaded"
}
```

```json
{
  "message": "Fields should not be empty"
}
```

## 2. Get Uploaded Volumes

Returns uploaded volume records joined with uploader name.

```http
GET /get-volumes
```

Example:

```bash
curl -X GET "http://localhost:4004/api/v1/get-volumes" \
  -H "Authorization: Bearer <token>"
```

Success response:

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

## 3. Approve Or Reject Volume

Updates `volumes.status` for a volume.

```http
PATCH /approve-volume/:status_approval/:volume_id
```

Path parameters:

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `status_approval` | string | Yes | Stored directly in `volumes.status`; use values agreed by the UI, such as `approved` or `rejected` |
| `volume_id` | UUID | Yes | Volume ID |

Example:

```bash
curl -X PATCH "http://localhost:4004/api/v1/approve-volume/approved/6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

Success response:

```text
Updated Successfully
```

## 4. Get Volumes By Instructor/Admin View

Returns volume rows with conversion log details. Roles `99` and `101` can view all volumes. Role `102` only sees volumes where `added_by` matches the logged-in user.

```http
GET /get-volumes-by-instructor
```

Example:

```bash
curl -X GET "http://localhost:4004/api/v1/get-volumes-by-instructor" \
  -H "Authorization: Bearer <token>"
```

Success response:

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

## 5. Start Volume Conversion

Validates the UUID, checks that the volume exists, prevents duplicate conversion while `conversion_process_status` is true, writes/updates `volume_conv_logs`, and starts the Python conversion process asynchronously.

```http
PUT /convert-vol/:volume_id
```

Path parameters:

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `volume_id` | UUID | Yes | Existing volume ID |

Example:

```bash
curl -X PUT "http://localhost:4004/api/v1/convert-vol/6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

Success response:

```json
{
  "success": true,
  "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
  "status": "RUNNING",
  "message": "Volume conversion started successfully",
  "timestamp": "2026-06-22T10:10:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Invalid volume ID format"
}
```

```json
{
  "success": false,
  "error": "Volume not found"
}
```

```json
{
  "success": false,
  "error": "Conversion already in progress for this volume",
  "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c"
}
```

## 6. Get Converted Volumes

Returns completed conversion logs joined with volume name and optional placement URL.

```http
GET /converted-volumes
```

Example:

```bash
curl -X GET "http://localhost:4004/api/v1/converted-volumes" \
  -H "Authorization: Bearer <token>"
```

Success response:

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
    "placed_url": "https://example.com/volume_placements/file.json"
  }
]
```

## 7. Upload Volume Placement

Uploads a placement JSON file to Supabase storage under `volume_placements/<volume_id>_<timestamp>.json` and inserts a row in `volume_placements`.

```http
POST /volume-placement
Content-Type: multipart/form-data
```

Form data:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `volume_id` | text UUID | Yes | Converted volume ID |
| `placed_file` | file | Yes | Must be valid `.json` with MIME type `application/json` |

Example:

```bash
curl -X POST "http://localhost:4004/api/v1/volume-placement" \
  -H "Authorization: Bearer <token>" \
  -F "volume_id=6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -F "placed_file=@./placement.json;type=application/json"
```

Success response:

```json
{
  "message": "Volume Placed Successfully",
  "fileUrl": "https://example.com/storage/v1/object/public/bucket/volume_placements/6982d3f3-8617-49a7-9b0d-d160db9adf6c_1780910000000.json"
}
```

Validation errors:

```text
No file uploaded
Invalid file format. Only JSON files are allowed.
Invalid file extension. Only .json files are allowed.
Invalid JSON content. File contains malformed JSON.
```

### List All Volume Placements

Returns placement rows joined with the volume name. The optional `volume_id` query parameter filters the result to one volume.

```http
GET /volume-placements
GET /volume-placements?volume_id=:volume_id
```

Example:

```bash
curl -X GET "http://localhost:4004/api/v1/volume-placements" \
  -H "Authorization: Bearer <token>"
```

Success response:

```json
[
  {
    "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
    "placed_url": "https://example.com/storage/v1/object/public/bucket/volume_placements/6982d3f3-8617-49a7-9b0d-d160db9adf6c_1780910000000.json",
    "created_at": "2026-06-22T10:20:00.000Z",
    "volume_name": "FL - I0000004"
  }
]
```

### List Placements By Volume ID

```http
GET /volume-placements/:volume_id
```

Example:

```bash
curl -X GET "http://localhost:4004/api/v1/volume-placements/6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

The success response has the same array shape as `GET /volume-placements`. An unknown volume currently returns an empty array.

## 8. Upload Volume Recording

Uploads recording JSON, WAV, image, and manifest files to Supabase storage and inserts their URLs into `vol_recordings`.

```http
POST /uploadvolumerecording
Content-Type: multipart/form-data
```

Form data:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `volume_id` | text UUID | Yes | Volume ID |
| `recording_name` | text | Yes | Display name |
| `recording_type` | text | Yes | Must be `shadow` or `step` |
| `recording_file` | file | Yes | One or more valid `.json` files; repeat this field for multiple files |
| `audio_file` | file | Yes | One or more `.wav` files; repeat this field for multiple files |
| `images` | file | Yes | One or more `png`, `jpg`, `jpeg`, `webp`, `gif`, or `bmp` files; repeat this field for multiple files |
| `manifest_file` | file | Yes | Exactly one valid `.json` or `.manifest` file |

Shadow recording example:

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

Step recording example with multiple files:

```bash
curl -X POST "http://localhost:4004/api/v1/uploadvolumerecording" \
  -H "Authorization: Bearer <token>" \
  -F "volume_id=6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -F "recording_name=Step Demo" \
  -F "recording_type=step" \
  -F "recording_file=@./step-1.json;type=application/json" \
  -F "recording_file=@./step-2.json;type=application/json" \
  -F "audio_file=@./step-1.wav;type=audio/wav" \
  -F "audio_file=@./step-2.wav;type=audio/wav" \
  -F "images=@./step-1.png;type=image/png" \
  -F "images=@./step-2.jpg;type=image/jpeg" \
  -F "manifest_file=@./manifest.json;type=application/json"
```

Success response:

```json
{
  "message": "Volume step Recording Uploaded Successfully",
  "recordingType": "step",
  "recordingUrl": "https://example.com/storage/v1/object/public/bucket/volume_recordings/6982d3f3-8617-49a7-9b0d-d160db9adf6c_1780910000000_0.json",
  "recordingFilesUploaded": 2,
  "recordingUrls": [
    "https://example.com/storage/v1/object/public/bucket/volume_recordings/6982d3f3-8617-49a7-9b0d-d160db9adf6c_1780910000000_0.json",
    "https://example.com/storage/v1/object/public/bucket/volume_recordings/6982d3f3-8617-49a7-9b0d-d160db9adf6c_1780910000000_1.json"
  ],
  "audioFilesUploaded": 2,
  "audioUrls": [
    "https://example.com/storage/v1/object/public/bucket/volume_audio/6982d3f3-8617-49a7-9b0d-d160db9adf6c_1780910000000_0.wav",
    "https://example.com/storage/v1/object/public/bucket/volume_audio/6982d3f3-8617-49a7-9b0d-d160db9adf6c_1780910000000_1.wav"
  ],
  "imageFilesUploaded": 2,
  "imageUrls": [
    "https://example.com/storage/v1/object/public/bucket/volume_images/6982d3f3-8617-49a7-9b0d-d160db9adf6c_1780910000000_0.png",
    "https://example.com/storage/v1/object/public/bucket/volume_images/6982d3f3-8617-49a7-9b0d-d160db9adf6c_1780910000000_1.jpg"
  ],
  "manifestUrl": "https://example.com/storage/v1/object/public/bucket/volume_manifests/6982d3f3-8617-49a7-9b0d-d160db9adf6c_1780910000000.json",
  "data": {
    "status": "Success",
    "code": 200,
    "message": "Volume recording saved successfully",
    "data": {
      "recording_id": "recording-uuid",
      "volume_id": "6982d3f3-8617-49a7-9b0d-d160db9adf6c",
      "recording_name": "Step Demo",
      "recording_type": "step",
      "rec_files": ["https://example.com/step-1.json", "https://example.com/step-2.json"],
      "audio_files": ["https://example.com/step-1.wav", "https://example.com/step-2.wav"],
      "image_files": ["https://example.com/step-1.png", "https://example.com/step-2.jpg"],
      "manifest_file": "https://example.com/manifest.json"
    }
  }
}
```

Common validation errors:

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
    "images": 0,
    "manifest_file": 0
  }
}
```

## 9. Get Recordings For A Volume

Returns recording metadata for a volume.

```http
GET /shadow-recordings?volume_id=:volume_id
```

Query parameters:

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `volume_id` | UUID | Yes | Volume ID |

Example:

```bash
curl -X GET "http://localhost:4004/api/v1/shadow-recordings?volume_id=6982d3f3-8617-49a7-9b0d-d160db9adf6c" \
  -H "Authorization: Bearer <token>"
```

Success response:

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

## 10. Get Volume Recording Counts

Returns one row per volume with the number of shadow recordings plus the JSON and image URLs for step recordings.

```http
GET /volume-recording-counts
```

The older `GET /shadow-recording-counts` route calls the same controller and returns the same response. New clients should use `/volume-recording-counts`.

Roles `99` and `101` can view all volumes. Role `102` only sees records for volumes added by the logged-in user. Role `103` is currently allowed by the model.

Example:

```bash
curl -X GET "http://localhost:4004/api/v1/volume-recording-counts" \
  -H "Authorization: Bearer <token>"
```

Success response:

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

Unauthorized response:

```json
{
  "error": "You do not have permission to view volume recordings"
}
```

## 11. Associate Resource, Volume, And Recordings

Creates a row in `asso_volume`.

```http
POST /associateVolume
Content-Type: application/json
```

Body:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `r_id` | UUID | Yes | Resource ID |
| `volume_id` | UUID | Yes | Volume ID |
| `shadowrec_id` | UUID | Yes | Shadow recording ID |
| `steprec_id` | UUID | Yes | Step recording ID |

Example:

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

Success response:

```text
Associated Successfully
```

## 12. Get Associated Volume By Resource

Returns resource, volume, and recording data for a resource association.

```http
GET /get-assovol?r_id=:resource_id
```

Query parameters:

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `r_id` | UUID | Yes | Resource ID |

Example:

```bash
curl -X GET "http://localhost:4004/api/v1/get-assovol?r_id=e196c6db-dc0b-4ebd-93b2-10a2125188e5" \
  -H "Authorization: Bearer <token>"
```

Success response:

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
    "image_files": ["https://example.com/shadow-1.png", "https://example.com/shadow-2.jpg"]
  }
]
```

## Bruno Request Files

Existing request files for volume APIs:

- `APIs/API_Prod_Test/Volume upload.yml`
- `APIs/API_Prod_Test/COnversion.yml`
- `APIs/API_Prod_Test/Get Volumes.yml`
- `APIs/API_Prod_Test/Approve Volume.yml`
- `APIs/API_Prod_Test/Get Volumes By Instructor.yml`
- `APIs/API_Prod_Test/Converted Volumes.yml`
- `APIs/API_Prod_Test/Volume Placement.yml`
- `APIs/API_Prod_Test/Get Volume Placements.yml`
- `APIs/API_Prod_Test/Get Volume Placements By ID.yml`
- `APIs/API_Prod_Test/Upload Volume Recording.yml`
- `APIs/API_Prod_Test/Shadow Recordings.yml`
- `APIs/API_Prod_Test/Volume Recording Counts.yml`
- `APIs/API_Prod_Test/Shadow Recording Counts Legacy.yml`
- `APIs/API_Prod_Test/Associate Volume.yml`
- `APIs/API_Prod_Test/Get Associated Volume.yml`
