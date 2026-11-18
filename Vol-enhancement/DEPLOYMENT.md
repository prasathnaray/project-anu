# STIC volume enhancement

`reconstruct.py` accepts a supported Kretz STIC `.vol` and writes one `.nrrd`
volume per embedded cine frame, plus three `.pgm` previews per frame. A 40-frame
source produces 40 NRRD files, not 40 VOL files. Other supported inputs can have
a different frame count. The format validation currently accepts only packed raw
8-bit frames in tag `D600,0001`; unsupported layouts fail without a success status.

Clicking **Enhance** calls the authenticated API, which submits `vol-enhancement-job`
to the existing AWS Batch queue. The worker downloads the source from S3, runs the
script, uploads frames and previews to
`s3://<AWS_S3_BUCKET>/projectanu/converted_vol_files/enhanced/<volume_id>/`, writes `manifest.json`,
and updates the database status. The UI polls the status. The worker needs S3
`GetObject` on source keys, `PutObject` on output keys, and network access to the
database. The Batch execution role needs ECR image pull, CloudWatch Logs, and
Secrets Manager access for `DATABASE_URL`.

## Deploy (PowerShell, from repository root)

1. Apply `server/v1/migrations/20261118_volume_enhancement.sql` to the database
   used by the deployed API before deploying the API. Back up the database using
   the normal migration procedure.
2. Build and push the worker image. The existing `vol-conversion-image-build`
   CodeBuild project has permission to push to the `vol-conversion` ECR repository.
   The enhancement image uses its own `enhancement` tag. Create a ZIP containing
   `reconstruct.py`, `Dockerfile.enhancement`,
   `Dockerfile.enhancement.dockerignore`, `Vol-enhancement/run_enhancement.py`,
   and `Vol-enhancement/buildspec.yml` with their repository-relative paths.
   Upload that ZIP to the private CodeBuild source bucket, then start a build with
   the ZIP location and `Vol-enhancement/buildspec.yml` as overrides. The existing
   build project and converter image are left unchanged.

   A local Docker build is another option when Docker's Linux engine is running:

   ```powershell
   $region = 'ap-south-1'
   $account = '299822065337'
   $registry = "$account.dkr.ecr.$region.amazonaws.com"
   aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $registry
   docker build --platform linux/amd64 -f Dockerfile.enhancement -t "${registry}/vol-conversion:enhancement" .
   docker push "${registry}/vol-conversion:enhancement"
   ```

3. Register `terraform_/batch-enhancement-job-definition.json` as a new Batch job
   definition revision. Pin `containerProperties.image` to the pushed image digest
   for repeatable deployment. Verify the account-specific IAM roles, database
   secret ARN, bucket, queue, and network settings before registration:

   ```powershell
   aws batch register-job-definition --cli-input-json file://terraform_/batch-enhancement-job-definition.json --region ap-south-1
   ```

4. Deploy the `server/v1` API and `client` using their existing release flows.
   The API template sets `VOL_ENHANCEMENT_JOB_QUEUE=vol-conversion-queue` and
   `VOL_ENHANCEMENT_JOB_DEFINITION=vol-enhancement-job`. Its IAM role already has
   `batch:SubmitJob`; confirm that permission covers the new job definition.
5. Try Enhance on a known supported STIC file. Confirm the status moves from
   `running` to `completed`, inspect `enhancement_manifest`, and check that its
   `frame_count` matches the number of `frame_*.nrrd` objects in S3. On failure,
   inspect `enhancement_error` and the Batch job's CloudWatch log stream.

Do not use `enhancement_status = 'completed'` as proof that existing NIfTI
conversion can read the NRRD outputs. The conversion path still reads the original
`.vol` source, and any required handoff to its converter must be designed and
validated separately.
