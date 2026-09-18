const fs = require('fs');
const path = require('path');
const db = require('../utils/conn');

const migrationPath = path.resolve(__dirname, '../migrations/20260918_center_streaming.sql');
const mode = process.argv[2];

const run = async () => {
  if (!['--check', '--apply'].includes(mode)) {
    throw new Error('Usage: node scripts/applyCenterStreamingMigration.js --check|--apply');
  }

  const connection = await db.connect();
  try {
    const result = await connection.query(
      `SELECT to_regclass('public.streaming_stages') AS stages,
              to_regclass('public.streaming_trainee_stages') AS trainee_stages,
              to_regclass('public.streaming_publishers') AS publishers`
    );
    if (mode === '--check') {
      const { stages, trainee_stages: traineeStages, publishers } = result.rows[0];
      console.log(stages && traineeStages && publishers ? 'center streaming schema exists' : 'center streaming schema is missing');
      return;
    }

    const statements = fs.readFileSync(migrationPath, 'utf8')
      .split(';')
      .map((statement) => statement.trim())
      .filter(Boolean);

    await connection.query('BEGIN');
    try {
      for (const statement of statements) await connection.query(statement);
      await connection.query('COMMIT');
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    }
    console.log('center streaming migration applied');
  } finally {
    connection.release();
    await db.end();
  }
};

run().catch((error) => {
  console.error('Center streaming migration failed:', error.code || error.message);
  process.exitCode = 1;
});
