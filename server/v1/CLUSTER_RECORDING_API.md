# Step and Shadow Recording API

Base URL:

```text
https://api.hticlab.org/api/v1
```

All endpoints require authentication:

```http
Authorization: Bearer <access_token>
```

## Recording types

Use `recording_type` with one of these values:

- `step`
- `shadow`

Both types use the same upload format. A step recording can contain multiple JSON, WAV, and image files. A shadow recording normally contains one set of each file type.

## Cluster-based APIs

Cluster endpoints scope recordings through `cluster_id`. The linked volume is resolved internally when uploading through a cluster.

### Upload a recording

```http
POST /clusters/{cluster_id}/recordings
Content-Type: multipart/form-data
```

Form fields:

| Field | Type | Required | Description |
|---|---|---:|---|
| `recording_type` | text | Yes | `step` or `shadow` |
| `recording_name` | text | No | Display name |
| `volume_id` | text | No | Optional when the cluster already has a linked volume |
| `recording_file` | file[] | Yes | JSON recording files, maximum 20 |
| `audio_file` | file[] | Yes | WAV audio files, maximum 20 |
| `images` | file[] | Yes | PNG/JPG/WEBP/GIF/BMP images, maximum 20 |
| `manifest_file` | file | Yes | `.json` or `.manifest` manifest file |

Example:

```bash
curl -X POST "https://api.hticlab.org/api/v1/clusters/CLU-ABC123/recordings" \
  -H "Authorization: Bearer <access_token>" \
  -F "recording_type=step" \
  -F "recording_name=Abdominal step recording" \
  -F "recording_file=@step-01.json" \
  -F "recording_file=@step-02.json" \
  -F "audio_file=@step-01.wav" \
  -F "audio_file=@step-02.wav" \
  -F "images=@step-01.png" \
  -F "manifest_file=@manifest.json"
```

The upload response contains the recording ID and signed URLs in `data`.

### List all recordings for a cluster

```http
GET /clusters/{cluster_id}/recordings
```

### List only shadow recordings

```http
GET /clusters/{cluster_id}/shadow-recordings
```

### List only step recordings

```http
GET /clusters/{cluster_id}/step-recordings
```

Each list endpoint returns recording metadata, including `recording_id`, `recording_type`, file counts, and signed file references.

### Get recording counts for one cluster

```http
GET /clusters/{cluster_id}/recording-counts
```

The response includes `shadow_recording_count`, `step_recording_count`, `step_recording_files`, and `step_recording_images`.

### Download a recording file

```http
GET /clusters/{cluster_id}/recordings/{recording_id}/download?file={file_type}&index={index}
```

Supported `file` values:

- `recording`
- `audio`
- `image`
- `manifest`

`index` is required for `recording`, `audio`, and `image`. It is not required for `manifest`.

### Replace recording files

```http
PUT /clusters/{cluster_id}/recordings/{recording_id}
Content-Type: multipart/form-data
```

The same file fields as upload are accepted. Only supplied fields are replaced. The following aliases are also accepted: `recording_files`, `rec_files`, `audio_files`, `image_files`, and `manifest`.

## Volume-based APIs

Use these endpoints when the operation is intentionally scoped to a volume instead of a cluster.

### Upload by volume

```http
POST /uploadvolumerecording
```

Required text fields include `volume_id` and `recording_type`. Use the same multipart file fields described above.

### List recordings by volume

```http
GET /recordings?volume_id={volume_id}
```

### List shadow recordings by volume

```http
GET /shadow-recordings?volume_id={volume_id}
```

### List volume recording files

```http
GET /volumes/{volume_id}/recordings
```

### Download a volume recording file

```http
GET /volumes/{volume_id}/recordings/{recording_id}/download
```

## Choosing the scope

- Use `cluster_id` when the recording belongs to a cluster and must not be returned for another cluster.
- Use `volume_id` for legacy or volume-level workflows.
- Do not send a different cluster and volume combination unless the volume is linked to that cluster.

## Common responses

Successful responses normally use HTTP `200` and include `code: 200` or a `data` payload.

Common errors:

| Status | Meaning |
|---:|---|
| `400` | Missing/invalid ID, recording type, or file |
| `403` | The authenticated user cannot access the cluster or volume |
| `404` | Cluster, volume, recording, or file not found |
| `413` | File or request is too large |
| `500` | Unexpected server error |
