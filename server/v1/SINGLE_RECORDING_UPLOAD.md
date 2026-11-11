# Single-request recording upload

Standalone AWS deployment (11 November 2026):

`POST https://d6963f2uvwgca.cloudfront.net/api/v1/recordings/new-upload`

Stack: `project-anu-recording-upload` in `ap-south-1`.
CloudFront distribution: `E3E8AIY091FA5K`.
The existing `api-v1.anuxr.com` DNS has not been changed.
Live HTTPS health and unauthenticated-request rejection were verified. A real
500 MiB multipart receive test passed inside the production Linux image using
a stubbed save operation; an authenticated production upload is not yet verified.

This is implemented by `recording-upload-server.js`, a separate long-running Node
service. It must be exposed through HTTPS ingress that bypasses API Gateway.
It is not deployed merely by deploying the existing Lambda SAM template.

`POST /api/v1/recordings/new-upload`

Send `Authorization: Bearer <access_token>` and `multipart/form-data`:

| Field | Value |
| --- | --- |
| cluster_id | Cluster identifier (required) |
| recording_type | `step` or `shadow` (required) |
| recording_name | Optional display name |
| volume_id | Optional linked volume; resolved from cluster when omitted |
| recording_file | 1–20 JSON files |
| audio_file | 1–20 WAV files |
| images | 1–20 images |
| manifest_file | One `.json` or `.manifest` file |

One request saves one step OR shadow package. To save both types, send two
requests to the same endpoint. The client does not call prepare/complete or S3.
Files may be up to 500 MiB each, with a 2 GiB package limit.

The service also accepts `POST /api/v1/clusters/{cluster_id}/recordings` with
the existing multipart format. Routing that path to this server preserves
existing clients. Changing only a path in the Lambda API cannot bypass its
ingress payload limit.

Success: HTTP 200 with `code`, `message`, `recording_id`, and `data` containing
the saved recording. File references are private storage references. Use the
existing authenticated recording GET APIs to obtain signed download URLs.

```sh
curl -X POST "https://<upload-host>/api/v1/recordings/new-upload" \
  -H "Authorization: Bearer <access_token>" \
  -F "cluster_id=CLU-ABC123" \
  -F "recording_type=step" \
  -F "recording_name=Step recording" \
  -F "recording_file=@step.json" \
  -F "audio_file=@audio.wav" \
  -F "images=@image.png" \
  -F "manifest_file=@manifest.json"
```

## Deployment requirements

Build `Dockerfile.recording-upload` from `server/v1`. Provide the existing
runtime database/session configuration, `AWS_S3_BUCKET`, `BUCKET_NAME`, and
`AWS_REGION`. `LAMBDA_SECRET_ID` can load the existing runtime secret using the
container task role. Environment variables explicitly set on the service take
precedence over secret values.

The task role needs access to that secret and S3 `PutObject`, `GetObject`,
`DeleteObject`, and `AbortMultipartUpload` on the content bucket. Allow temporary
disk space for concurrent packages. Configure the HTTPS proxy to permit more
than 2 GiB requests and an upload duration up to 30 minutes. Authenticate before
accepting file bytes. `/health` is the unauthenticated health check.

API Gateway must not sit between the caller and this service. For the existing
`api-v1.anuxr.com` hostname, its DNS/proxy routing must be changed so these paths
reach this service while other paths reach the existing API. No such DNS or
proxy change has been made as part of the endpoint implementation.

`recording-upload.template.yaml` provisions Fargate, an ALB restricted to
CloudFront traffic, and a CloudFront distribution. The default
`AttachCustomDomain=false` provides a standalone `cloudfront.net` address and
does not change DNS. Only `/api/v1/recordings/new-upload` and `/upload-health`
use the upload service; other paths are forwarded to the existing API Gateway.
The CloudFront origin response timeout is 120 seconds after request forwarding;
the service and ALB allow up to 30 minutes for receiving uploads.

To enable the existing hostname later, set `AttachCustomDomain=true`, wait for
the distribution update, then change the `api-v1` DNS CNAME to the distribution
domain. Keep the existing API Gateway custom domain until the migration has
been verified. The old CNAME is `d-x9gzc3bt45.execute-api.ap-south-1.amazonaws.com`.
