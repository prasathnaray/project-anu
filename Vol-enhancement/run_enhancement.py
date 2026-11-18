"""AWS Batch worker: reconstruct a STIC volume and store its frames in S3."""
import json
import os
from pathlib import Path
import subprocess
import tempfile

import boto3
import psycopg2


def main():
    volume_id = os.environ['VOLUME_ID']
    source = os.environ['S3_INPUT_KEY']
    bucket = os.environ['AWS_S3_BUCKET']
    database_url = os.environ['DATABASE_URL']
    if not bucket or not source:
        raise ValueError('AWS_S3_BUCKET and S3_INPUT_KEY are required')

    if source.startswith('s3://'):
        source_bucket, source_key = source[5:].split('/', 1)
        if source_bucket != bucket:
            raise ValueError('Source volume is in an unexpected S3 bucket')
    else:
        source_key = source.lstrip('/')
    if not source_key or '..' in Path(source_key).parts:
        raise ValueError('Invalid source S3 key')

    s3 = boto3.client('s3')
    output_prefix = f'projectanu/converted_vol_files/enhanced/{volume_id}'
    with tempfile.TemporaryDirectory() as temporary:
        input_file = Path(temporary) / 'source.vol'
        output_dir = Path(temporary) / 'frames'
        s3.download_file(bucket, source_key, str(input_file))
        subprocess.run(
            ['python', '/app/reconstruct.py', str(input_file), '--output', str(output_dir)],
            check=True,
        )
        frames = sorted(output_dir.glob('frame_*.nrrd'))
        if not frames:
            raise RuntimeError('Reconstruction produced no NRRD frames')

        uploaded = []
        for file in sorted(output_dir.rglob('*')):
            if not file.is_file():
                continue
            key = f'{output_prefix}/{file.relative_to(output_dir).as_posix()}'
            content_type = 'application/octet-stream' if file.suffix == '.nrrd' else 'image/x-portable-graymap'
            s3.upload_file(str(file), bucket, key, ExtraArgs={'ContentType': content_type})
            uploaded.append(key)

        manifest_key = f'{output_prefix}/manifest.json'
        manifest = {
            'volume_id': volume_id,
            'source': source_key,
            'frame_count': len(frames),
            'frames': [f'{output_prefix}/{file.name}' for file in frames],
            'files': uploaded,
        }
        s3.put_object(
            Bucket=bucket, Key=manifest_key,
            Body=json.dumps(manifest).encode('utf-8'), ContentType='application/json',
        )
        with psycopg2.connect(database_url) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """UPDATE public.volumes SET enhancement_status = 'completed',
                       enhancement_manifest = %s, enhancement_error = NULL
                       WHERE volume_id = %s AND enhancement_status = 'running'""",
                    (manifest_key, volume_id),
                )
        print(f'Uploaded {len(frames)} NRRD frames to s3://{bucket}/{output_prefix}/', flush=True)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'Enhancement failed: {error}', flush=True)
        try:
            with psycopg2.connect(os.environ['DATABASE_URL']) as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """UPDATE public.volumes SET enhancement_status = 'failed', enhancement_error = %s
                           WHERE volume_id = %s AND enhancement_status = 'running'""",
                        (str(error)[:1000], os.environ['VOLUME_ID']),
                    )
        except Exception as update_error:
            print(f'Could not persist failure: {update_error}', flush=True)
        raise
