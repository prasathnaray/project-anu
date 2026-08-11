const supabase = require('../supaBaseClient');

const bucket = process.env.PRIVATE_CONTENT_BUCKET;
const shouldApply = process.argv.includes('--apply');

const run = async () => {
    if (!bucket) throw new Error('PRIVATE_CONTENT_BUCKET is required.');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;
    const exists = buckets.some((item) => item.name === bucket);
    if (!shouldApply) {
        console.log(JSON.stringify({ action: exists ? 'make-private' : 'create-private', bucket, applied: false }));
        return;
    }
    const operation = exists
        ? supabase.storage.updateBucket(bucket, { public: false })
        : supabase.storage.createBucket(bucket, { public: false });
    const { error } = await operation;
    if (error) throw error;
    console.log(JSON.stringify({ action: exists ? 'made-private' : 'created-private', bucket, applied: true }));
};

run().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
