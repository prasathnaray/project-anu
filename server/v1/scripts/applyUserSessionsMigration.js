const fs = require('fs');
const path = require('path');
const db = require('../utils/conn');

const migrationPath = path.resolve(__dirname, '../migrations/20260915_user_sessions.sql');
const mode = process.argv[2];

const run = async () => {
  if (!['--check', '--apply'].includes(mode)) {
    throw new Error('Usage: node scripts/applyUserSessionsMigration.js --check|--apply');
  }
  const connection = await db.connect();
  try {
    const result = await connection.query(
      "SELECT to_regclass('public.user_sessions') AS user_sessions"
    );
    if (mode === '--check') {
      console.log(result.rows[0].user_sessions ? 'user_sessions exists' : 'user_sessions is missing');
      return;
    }
    const statements = fs.readFileSync(migrationPath, 'utf8')
      .split(';').map((statement) => statement.trim()).filter(Boolean);
    await connection.query('BEGIN');
    try {
      for (const statement of statements) await connection.query(statement);
      await connection.query('COMMIT');
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    }
    console.log('user_sessions migration applied');
  } finally {
    connection.release();
    await db.end();
  }
};

run().catch((error) => {
  console.error('Session migration failed:', error.code || error.message);
  process.exitCode = 1;
});
