# Unity direct S3 recording uploads

Use this flow for recordings larger than Lambda's request limit. The existing multipart endpoint cannot accept large packages. Unity must adopt these three steps; deploying the backend alone does not change an existing Unity client.

## 1. Prepare

POST `https://api-v1.anuxr.com/api/v1/clusters/CLU-F2E5607/recordings/prepare`

Headers: `Authorization: Bearer <access_token>`, `Content-Type: application/json`.

```json
{
  "recording_name": "test1s",
  "recording_type": "step",
  "files": [
    { "field": "recording_file", "filename": "step.json", "size": 19922944 },
    { "field": "audio_file", "filename": "audio.wav", "size": 1000 },
    { "field": "images", "filename": "image.png", "size": 2000 },
    { "field": "manifest_file", "filename": "manifest.json", "size": 100 }
  ]
}
```

Replace every size with the actual file length in bytes. An optional `volume_id` must belong to the cluster and be editable by the caller. Without it the server selects a linked editable volume. `recording_type` is `step` or `shadow`.

Response: `uploadToken`, `expiresIn: 3600`, and `uploads` in the same order as `files`. Each upload contains `index`, `field`, `filename`, `uploadUrl`, `method: PUT`, and `headers`.

## 2. PUT each file directly to S3

For each item in `uploads`, send the raw file bytes to its exact `uploadUrl` using PUT. Use the returned `Content-Type` and `If-None-Match: *` headers and the actual content length. Do not send multipart form data or the API bearer token to S3. Do not modify the URL or add query parameters. In Unity use `UnityWebRequest.Put(url, fileBytes)` and apply the returned headers.

Wait for all uploads to succeed before completing. URLs expire after one hour. After an interrupted PUT, retry the same bytes; a 412 may mean the earlier PUT succeeded. Completion will verify size/type and JSON content. To replace a failed package, prepare a new upload rather than overwriting existing objects.

## 3. Complete

POST `https://api-v1.anuxr.com/api/v1/clusters/CLU-F2E5607/recordings/complete`

Use the API bearer token and JSON body:

```json
{ "uploadToken": "<token from prepare>" }
```

Success returns HTTP 200 with `recording_id`. Retrying with the same unexpired token does not duplicate the recording. Fetch existing cluster recording GET APIs for signed download URLs; completion's stored references are not browser URLs.

Limits: 100 MiB per file, 250 MiB per package, 1–20 JSON recordings, 1–20 WAV files, 1–20 images and exactly one JSON or `.manifest` file. These are storage workflow limits, not Lambda request-body limits. The API receives metadata only; S3 receives the bytes. Missing objects, incorrect sizes/types or malformed JSON prevent completion. Uncompleted uploads remain private in S3 and require a future retention/cleanup policy.

Native Unity does not require browser CORS. Unity WebGL requires the existing bucket CORS policy to permit its origin, PUT, content-type and if-none-match.
