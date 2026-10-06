const fs = require('fs');
const path = require('path');
const db = require('../utils/conn');

const migrationPath = path.resolve(__dirname, '../migrations/20261003_create_activity_logs.sql');
const mode = process.argv[2] || '--apply';

const run = async () => {
  if (!['--check', '--apply'].includes(mode)) {
    throw new Error('Usage: node scripts/applyActivityLogsMigration.js --check|--apply');
  }
  const connection = await db.connect();
  try {
    const result = await connection.query(
      "SELECT to_regclass('public.activity_logs') AS activity_logs"
    );
    if (mode === '--check') {
      console.log(result.rows[0].activity_logs ? 'activity_logs exists' : 'activity_logs is missing');
      return;
    }
    const statements = fs.readFileSync(migrationPath, 'utf8')
      .split(';').map((statement) => statement.trim()).filter(Boolean);
    await connection.query('BEGIN');
    try {
      for (const statement of statements) {
        await connection.query(statement);
      }
      await connection.query('COMMIT');
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    }
    console.log('activity_logs migration applied successfully');
  } finally {
    connection.release();
    await db.end();
  }
};

run().catch((error) => {
  console.error('Activity logs migration failed:', error.code || error.message);
  process.exitCode = 1;
});
