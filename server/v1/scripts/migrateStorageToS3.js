const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const {
    S3Client,
    HeadObjectCommand,
    PutObjectCommand
} = require('@aws-sdk/client-s3');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const apply = process.argv.includes('--apply');
const verifyOnly = process.argv.includes('--verify-only');
const rootArg = process.argv.find((value) => value.startsWith('--backup-root='));
const defaultRoot = fs.readFileSync(path.resolve(__dirname, '../backups/.latest_full_backup'), 'utf8').trim();
const backupRoot = path.resolve(rootArg ? rootArg.split('=', 2)[1] : defaultRoot);
const manifestPath = path.join(backupRoot, 'storage', 'storage_manifest.jsonl');
const reportPath = path.join(backupRoot, 's3_migration_report.json');
const bucket = process.env.AWS_S3_BUCKET;
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-south-1';
const concurrency = Number(process.env.STORAGE_MIGRATION_CONCURRENCY || 8);

if (!bucket) throw new Error('AWS_S3_BUCKET is required.');
if (!fs.existsSync(manifestPath)) throw new Error(`Storage manifest not found: ${manifestPath}`);

const entries = fs.readFileSync(manifestPath, 'utf8').trim().split(/\r?\n/).filter(Boolean).map(JSON.parse);
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_IVS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_IVS_SECRET_KEY;
const s3 = new S3Client({
    region,
    ...(accessKeyId && secretAccessKey ? { credentials: { accessKeyId, secretAccessKey } } : {})
});
const results = { copied: [], skipped: [], failed: [], verified: [] };

const head = (key) => s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key, ChecksumMode: 'ENABLED' }));

const processEntry = async (entry) => {
    const key = `${entry.bucket_id}/${entry.object_name}`;
    const localPath = path.join(backupRoot, ...entry.local_relative_path.split('/'));
    try {
        let existing;
        try { existing = await head(key); } catch (error) {
            if (error?.name !== 'NotFound' && error?.$metadata?.httpStatusCode !== 404) throw error;
        }
        const matches = existing
            && Number(existing.ContentLength) === Number(entry.size)
            && existing.Metadata?.sha256 === entry.sha256;

        if (!matches && !verifyOnly) {
            if (!apply) {
                results.copied.push({ key, bytes: entry.size, dryRun: true });
                return;
            }
            const sha256Base64 = Buffer.from(entry.sha256, 'hex').toString('base64');
            await s3.send(new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: fs.createReadStream(localPath),
                ContentLength: entry.size,
                ContentType: entry.content_type || 'application/octet-stream',
                ChecksumSHA256: sha256Base64,
                Metadata: {
                    sha256: entry.sha256,
                    'supabase-bucket': entry.bucket_id,
                    'supabase-object-id': String(entry.object_id || '')
                }
            }));
            results.copied.push({ key, bytes: entry.size });
        } else if (matches) {
            results.skipped.push({ key, bytes: entry.size });
        } else {
            throw new Error('Destination object is missing or does not match the manifest');
        }

        if (apply || verifyOnly) {
            const verified = await head(key);
            if (Number(verified.ContentLength) !== Number(entry.size) || verified.Metadata?.sha256 !== entry.sha256) {
                throw new Error('Post-upload size or SHA-256 metadata mismatch');
            }
            results.verified.push({ key, bytes: entry.size });
        }
    } catch (error) {
        results.failed.push({ key, error: error.message });
    }
};

(async () => {
    let next = 0;
    let complete = 0;
    const worker = async () => {
        while (true) {
            const index = next++;
            if (index >= entries.length) return;
            await processEntry(entries[index]);
            complete++;
            if (complete % 100 === 0 || complete === entries.length) {
                console.log(`S3 migration progress: ${complete}/${entries.length}`);
            }
        }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
    const summary = {
        mode: verifyOnly ? 'verify' : apply ? 'apply' : 'dry-run',
        bucket,
        region,
        backupRoot,
        manifestObjects: entries.length,
        copied: results.copied.length,
        skipped: results.skipped.length,
        verified: results.verified.length,
        failed: results.failed.length,
        copiedBytes: results.copied.reduce((sum, row) => sum + Number(row.bytes || 0), 0),
        completedAt: new Date().toISOString()
    };
    await fsp.writeFile(reportPath, JSON.stringify({ summary, ...results }, null, 2));
    console.log(JSON.stringify(summary, null, 2));
    if (results.failed.length) process.exitCode = 1;
})().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
});
