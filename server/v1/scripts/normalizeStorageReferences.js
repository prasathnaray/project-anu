const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { canonicalReference } = require('../utils/storageAdapter');
const apply = process.argv.includes('--apply');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const changes = [];

const hasColumn = async (db, table, column) => {
    const result = await db.query(
        `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2) AS present`,
        [table, column]
    );
    return result.rows[0].present;
};

const normalizeNestedUrls = (value, defaultBucket) => {
    if (Array.isArray(value)) return value.map((item) => normalizeNestedUrls(item, defaultBucket));
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeNestedUrls(item, defaultBucket)]));
    }
    if (typeof value === 'string' && (/supabase\.co\/storage\/v1\/object\//.test(value) || /^s3:\/\//.test(value))) {
        return canonicalReference(value, defaultBucket) || value;
    }
    return value;
};

const updateColumn = async (db, table, column, defaultBucket, transform = (value) => canonicalReference(value, defaultBucket)) => {
    if (!await hasColumn(db, table, column)) return;
    const result = await db.query(`SELECT ctid::text AS row_id, "${column}" AS value FROM public."${table}" WHERE "${column}" IS NOT NULL`);
    for (const row of result.rows) {
        const next = transform(row.value);
        const before = typeof row.value === 'object' ? JSON.stringify(row.value) : String(row.value);
        const after = typeof next === 'object' ? JSON.stringify(next) : String(next ?? '');
        if (!next || before === after) continue;
        changes.push({ table, column, rowId: row.row_id, before, after });
        if (apply) {
            const jsonCast = typeof next === 'object' ? '::jsonb' : '';
            await db.query(`UPDATE public."${table}" SET "${column}" = $1${jsonCast} WHERE ctid = $2::tid`, [typeof next === 'object' ? JSON.stringify(next) : next, row.row_id]);
        }
    }
};

(async () => {
    const db = await pool.connect();
    try {
        await db.query('BEGIN');
        if (apply) await db.query("SET LOCAL session_replication_role = 'replica'");
        const direct = [
            ['submissions', 'storage_path', 'projectanu'],
            ['measurements', 'user_image_id', 'projectanu'],
            ['measurements', 'expert_image_id', 'projectanu'],
            ['user_data', 'user_profile_photo', 'projectanu'],
            ['volumes', 'volume_file', 'projectanu'],
            ['volumes', 'converted_file_path', 'projectanu'],
            ['volume_conv_logs', 'output_file', 'projectanu'],
            ['volume_placements', 'placed_url', 'projectanu']
        ];
        for (const args of direct) await updateColumn(db, ...args);
        for (const column of ['rec_files', 'audio_files', 'image_files', 'manifest_file']) {
            await updateColumn(db, 'vol_recordings', column, 'projectanu', (value) =>
                column === 'manifest_file' ? canonicalReference(value, 'projectanu') : normalizeNestedUrls(value, 'projectanu')
            );
        }
        for (const column of ['assets', 'options', 'correct_answer', 'metadata']) {
            await updateColumn(db, 'mind_spark_questions', column, 'question-images', (value) => normalizeNestedUrls(value, 'question-images'));
        }

        const coupled = [
            ['submissions', 'public_url', 'storage_path'],
            ['volume_conv_logs', 'public_url', 'output_file']
        ];
        for (const [table, target, source] of coupled) {
            if (!await hasColumn(db, table, target) || !await hasColumn(db, table, source)) continue;
            const result = await db.query(`SELECT ctid::text AS row_id, "${target}" AS before, "${source}" AS source FROM public."${table}" WHERE "${source}" IS NOT NULL AND "${target}" IS DISTINCT FROM "${source}"`);
            for (const row of result.rows) {
                changes.push({ table, column: target, rowId: row.row_id, before: row.before, after: row.source });
                if (apply) await db.query(`UPDATE public."${table}" SET "${target}" = $1 WHERE ctid = $2::tid`, [row.source, row.row_id]);
            }
        }

        if (apply) await db.query('COMMIT'); else await db.query('ROLLBACK');
        console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', changedValues: changes.length, byTable: changes.reduce((out, row) => ({ ...out, [row.table]: (out[row.table] || 0) + 1 }), {}) }, null, 2));
    } catch (error) {
        await db.query('ROLLBACK');
        throw error;
    } finally {
        db.release();
        await pool.end();
    }
})().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
});
