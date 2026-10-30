const path = require('path');
const { Pool } = require('pg');
const { databaseConfig } = require('./databaseConfig');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const client = new Pool(databaseConfig());
require('./requestTiming').instrumentPool(client);
client.on('error', (err) => {
  console.error('Unexpected error on idle database client', err?.code || 'DATABASE_ERROR');
});
module.exports = client;
