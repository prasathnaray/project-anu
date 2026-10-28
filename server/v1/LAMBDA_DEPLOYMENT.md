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

Large volume uploads should not be sent through API Gateway. Use the existing S3/storage flow and keep conversion jobs on AWS Batch. Socket.IO remains local-only in this Lambda deployment; deploy it separately on a long-running service if realtime connections are required in production.
