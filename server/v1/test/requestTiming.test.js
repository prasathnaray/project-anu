const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const jwt = require('jsonwebtoken');
const { requestTiming, instrumentPool } = require('../utils/requestTiming');

test('authenticates once per request across the current router mount order and rechecks new requests', async () => {
  const connPath = require.resolve('../utils/conn');
  const original = require.cache[connPath];
  const oldSecret = process.env.ACCESS_TOKEN_SECRET;
  const oldTiming = process.env.API_TIMING;
  process.env.API_TIMING = 'true';
  process.env.ACCESS_TOKEN_SECRET = 'local-timing-test-only';
  let revoked = false;
  const pool = { query: async (sql) => ({ rows: sql.includes('FROM public.user_sessions')
    ? (revoked ? [] : [{ login_source: 'Normal Browser', device: 'browser' }])
    : [{ user_role: '101', status: 'active' }] }) };
  instrumentPool(pool);
  require.cache[connPath] = { id: connPath, filename: connPath, loaded: true, exports: pool };
  let server;
  try {
    const authenticate = require('../Auth/authenticate');
    const app = express();
    app.use(requestTiming);
    const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
    const mounts = [...source.matchAll(/app\.use\('([^']+)', Authenticate, (\w+)\);?/g)];
    let expectedPasses = 0;
    for (const [, prefix, routerName] of mounts) {
      const router = express.Router();
      if (prefix.replace(/\/$/, '') === '/api/v1') expectedPasses++;
      if (routerName === 'clusterRouter') router.get('/clusters', (req, res) => res.json({ ok: true }));
      app.use(prefix, authenticate, router);
      if (routerName === 'clusterRouter') break;
    }
    server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const token = jwt.sign({ sid: 'test-session', user_mail: 'test@example.invalid' }, process.env.ACCESS_TOKEN_SECRET);
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/v1/clusters`, { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(response.status, 200);
    const timing = response.headers.get('server-timing');
    assert.ok(expectedPasses > 1);
    assert.ok(timing.includes('desc="1 passes"'));
    assert.ok(timing.includes('desc="3 queries"'));
    console.info('MOCK DATABASE DIAGNOSTIC:', expectedPasses, 'router mounts; 1 authentication pass; 3 authentication queries');
    await response.text();
    const repeat = await fetch(`http://127.0.0.1:${server.address().port}/api/v1/clusters`, { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(repeat.status, 200);
    assert.ok(repeat.headers.get('server-timing').includes('desc="3 queries"'));
    await repeat.text();
    revoked = true;
    const denied = await fetch(`http://127.0.0.1:${server.address().port}/api/v1/clusters`, { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(denied.status, 401);
    await denied.text();
  } finally {
    if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
    if (original) require.cache[connPath] = original; else delete require.cache[connPath];
    if (oldSecret === undefined) delete process.env.ACCESS_TOKEN_SECRET; else process.env.ACCESS_TOKEN_SECRET = oldSecret;
    if (oldTiming === undefined) delete process.env.API_TIMING; else process.env.API_TIMING = oldTiming;
  }
});
