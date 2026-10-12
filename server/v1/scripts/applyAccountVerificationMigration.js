const fs = require('fs');
const path = require('path');
const db = require('../utils/conn');

const migrationPath = path.resolve(__dirname, '../migrations/20261010_account_verification.sql');

const run = async () => {
  const connection = await db.connect();
  try {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await connection.query('BEGIN');
    await connection.query(sql);

    const columns = await connection.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'user_data'
        AND column_name IN ('phone_verified_at', 'verification_required')
    `);
    const table = await connection.query("SELECT to_regclass('public.account_verification_challenges') AS table_name");
    const statusConstraint = await connection.query(`
      SELECT pg_get_constraintdef(oid) AS definition
      FROM pg_constraint
      WHERE conrelid = 'public.user_data'::regclass
        AND conname = 'status_check'
    `);
    const constraintDefinition = statusConstraint.rows[0]?.definition || '';
    if (columns.rows.length !== 2 || !table.rows[0].table_name
      || !constraintDefinition.includes('pending_verification')
      || !constraintDefinition.includes('pending_reverification')) {
      throw new Error('Account-verification schema validation failed');
    }

    await connection.query('COMMIT');
    console.log('Account-verification migration applied successfully.');
  } catch (error) {
    await connection.query('ROLLBACK');
    throw error;
  } finally {
    connection.release();
    await db.end();
  }
};

run().catch((error) => {
  console.error('Account-verification migration failed:', error.message);
  process.exitCode = 1;
});
