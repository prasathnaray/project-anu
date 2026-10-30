require('dotenv').config({ path: require('node:path').resolve(__dirname, '../.env') });
const { Client } = require('pg');
const { databaseConfig } = require('../utils/databaseConfig');
(async () => {
  const client = new Client({ ...databaseConfig(), connectionTimeoutMillis: 10000, query_timeout: 10000 });
  try {
    await client.connect();
    const stream = client.connection.stream;
    if (!stream.encrypted || !stream.authorized) throw new Error('TLS_NOT_VERIFIED');
    await client.query('SELECT 1');
    console.log('PASS: database TLS certificate verified; encrypted connection; SELECT 1 succeeded.');
  } finally { await client.end(); }
})().catch(error => { console.error('Database TLS verification failed:', error.code || 'CONFIGURATION_OR_TLS_ERROR'); process.exitCode = 1; });
