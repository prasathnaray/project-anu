# VR-published live streaming

Each trainee publishes the VR-rendered output and headset microphone to a private Amazon IVS Real-Time stage. The LMS trainee page receives a subscribe-only token for that private stage so it can show a safe self-preview. The server automatically replicates that participant into the scan-center stage watched by institution administrators.

## Unity API contract

All requests require the trainee's LMS bearer token.

1. `POST /api/v1/tokenn` creates the publisher session. Client-provided stage ARNs, user IDs, capabilities, attributes, and durations are ignored. The IVS token remains at `result.data.token`; the application session ID is at `result.sessionId`.
2. Join the stage and publish the local VR video and microphone. The server retries activation in the background, so existing VR builds become visible to admins without another request.
3. A VR client may also call `POST /api/v1/streaming/publisher-session/:sessionId/activate` as soon as its IVS SDK reports a published state. A `409` response means publishing is not visible to IVS yet and the caller should retry with bounded backoff.
4. Call `DELETE /api/v1/streaming/publisher-session/:sessionId` when the VR stream stops.

The LMS uses `POST /api/v1/streaming/self-viewer-session` for the trainee preview and `POST /api/v1/streaming/viewer-session` for the existing institution-admin view.

## Deployment

1. Apply the schema before deploying the streaming server:

   `npm run migrate:center-streaming`

2. Configure the server environment:

   - `AWS_REGION` (defaults to `ap-south-1`)
   - `AWS_IVS_ACCESS_KEY` and `AWS_IVS_SECRET_KEY`, unless the runtime uses an IAM role
   - `AWS_IVS_TOKEN_DURATION_MINUTES` (optional; defaults to `720`)

3. Grant the runtime IAM identity these IVS Real-Time actions:

   - `ivs:CreateStage`
   - `ivs:DeleteStage`
   - `ivs:CreateParticipantToken`
   - `ivs:DisconnectParticipant`
   - `ivs:StartParticipantReplication`
   - `ivs:StopParticipantReplication`

The first streaming request creates and records the required center or trainee stage. Tokens and stage ARNs must not be written to application logs.

## Capacity and monitoring

The center stage supports at most 12 concurrent replicated trainee publishers. Monitor the `Publishers`, `ConcurrentPublishers`, and `ConcurrentSubscriptions` CloudWatch metrics and configure quota alarms before production rollout.
