const test = require('node:test');
const assert = require('node:assert/strict');
const { Client } = require('pg');
const { databaseConfig } = require('../utils/databaseConfig');
test('TLS cannot be disabled by connection URL options', () => {
  for (const suffix of ['sslmode=disable', 'sslmode=no-verify', 'ssl=false', 'sslmode=require&uselibpqcompat=true', 'sslrootcert=missing.pem']) {
    const client = new Client(databaseConfig({ DATABASE_URL: `postgres://test:example@db.example/test?${suffix}` }));
    assert.equal(client.connectionParameters.ssl.rejectUnauthorized, true);
    assert.equal(client.connectionParameters.ssl.checkServerIdentity, undefined);
  }
});
test('missing credentials and invalid custom trust configuration fail closed', () => {
  assert.throws(() => databaseConfig({}), /DATABASE_URL is required/);
  assert.throws(() => databaseConfig({ DATABASE_URL: 'postgres://db/test', DATABASE_CA_CERT: 'invalid' }), /PEM/);
  assert.throws(() => databaseConfig({ DATABASE_URL: 'postgres://db/test', DATABASE_CA_CERT: 'x', DATABASE_CA_FILE: 'y' }), /only/);
});
