const fs = require('fs/promises');
const path = require('path');
const { Pool } = require('pg');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const migrationPath = path.resolve(
    __dirname,
    '../migrations/20260825_course_mapping_ownership.sql'
);

const run = async () => {
    const sql = await fs.readFile(migrationPath, 'utf8');
    const connection = await pool.connect();

    try {
        await connection.query('BEGIN');
        await connection.query(sql);

        const result = await connection.query(
            `SELECT column_name
             FROM information_schema.columns
             WHERE table_schema = 'public'
               AND table_name = 'course_mapping'
               AND column_name IN ('owner_scope', 'owner_centre_id')`
        );

        if (result.rows.length !== 2) {
            throw new Error('Course-mapping ownership columns were not created.');
        }

        await connection.query('COMMIT');
        console.log('Course-mapping ownership migration applied successfully.');
    } catch (error) {
        await connection.query('ROLLBACK');
        throw error;
    } finally {
        connection.release();
    }
};

run()
    .catch((error) => {
        console.error('Course-mapping ownership migration failed:', error.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
