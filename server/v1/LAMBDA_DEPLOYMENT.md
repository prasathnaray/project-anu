# Server v1 local and Lambda deployment

## Local mode

Local development still runs the Express server and Socket.IO on port 4004:

```powershell
npm install
npm start
```

Use `npm run dev` for nodemon-based development. Local configuration is read from `server/v1/.env`.

## Lambda mode

The Lambda entrypoint is `lambda.handler`. It loads the JSON configuration stored in the `LAMBDA_SECRET_ID` Secrets Manager secret, then initializes the Express application once per warm execution environment.

The SAM template is `template.yaml`. Deploy from this directory with:

```powershell
sam build --cached
sam deploy --stack-name project-anu-server-v1 --region ap-south-1 --resolve-s3 --capabilities CAPABILITY_IAM --parameter-overrides RuntimeSecretId=project-anu/server-v1 --no-confirm-changeset
```

The deployed health endpoint is:

```text
https://84z54to5vl.execute-api.ap-south-1.amazonaws.com/health
```

Volume uploads from the frontend use POST /api/v1/sv-upload/prepare to obtain a short-lived S3 PUT URL, upload the file directly with Content-Type: application/octet-stream and If-None-Match: *, then call POST /api/v1/sv-upload/complete with the uploadToken. The direct flow supports files up to 100 MB; the legacy multipart /sv-upload endpoint remains subject to Lambda/API Gateway limits. Completion checks the authenticated owner, stored size and volume header before saving metadata. The S3 bucket must allow PUT from the frontend origin with content-type and if-none-match headers (see tmp/volume-storage-cors.json at the repository root).

Keep conversion jobs on AWS Batch. Socket.IO remains local-only in this Lambda deployment; deploy it separately on a long-running service if realtime connections are required in production.
