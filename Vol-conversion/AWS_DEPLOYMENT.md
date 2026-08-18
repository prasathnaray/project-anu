# VOL Conversion AWS Deployment

The converter is designed to run as an AWS Batch Fargate job.

The CodeBuild deployment uses `Dockerfile.deploy` to layer application changes on
the currently published image. This preserves the tested Slicer extensions while
updating the converter and Python storage dependencies. `Dockerfile` remains the
full image definition for rebuilding the Slicer runtime when updated extension
package identifiers are available.

## Backend Environment

Set these in `server/v1/.env` or the deployed backend environment:

```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=<aws-access-key-with-batch-submit-permission>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
VOL_CONVERSION_JOB_QUEUE=vol-conversion-queue
VOL_CONVERSION_JOB_DEFINITION=vol-conversion-job
AWS_S3_BUCKET=project-anu-content-299822065337-ap-south-1
```

The backend route `PUT /api/v1/convert-vol/:volume_id` submits a Batch job and returns the AWS Batch `job_id`.

The tracked Batch definition in `terraform_/batch-job-definition.json` pins the
deployed ECR digest. Register a new revision after every converter image publish;
updating only the `latest` tag does not update an already registered Batch revision.

## Batch Container Environment

The Batch job definition must inject the database connection secret into the container:

```env
DATABASE_URL=<postgres-connection-url>
SUPABASE_BUCKET=projectanu
AWS_S3_BUCKET=project-anu-content-299822065337-ap-south-1
AWS_REGION=ap-south-1
```

`SUPABASE_BUCKET` remains only as the logical prefix used by existing storage
references. Source and converted files are stored in S3, while conversion status
is written through the direct PostgreSQL connection.

The container command receives three arguments from the backend:

```text
<volume_id> <s3_input_storage_key> <volume_name>
```

## Required AWS Permissions

The deployment user needs permissions for:

```text
ecr:*
codebuild:*
batch:*
iam:CreateRole
iam:AttachRolePolicy
iam:PutRolePolicy
iam:PassRole
logs:*
s3:CreateBucket
s3:PutObject
s3:GetObject
secretsmanager:CreateSecret
secretsmanager:PutSecretValue
secretsmanager:GetSecretValue
ec2:DescribeVpcs
ec2:DescribeSubnets
ec2:DescribeSecurityGroups
```

The key currently present in `server/v1/.env` can call STS, but AWS denied ECR access, so it cannot complete deployment until IAM permissions are expanded.
