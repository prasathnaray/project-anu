const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { canManageSessions } = require('../Auth/sessionAuthorization');

test('session permissions follow role and institution boundaries', () => {
  const self = { user_mail: 'tutor@example.com', role: 102, centre_id: 'centre-a' };
  const sameCentre = { user_email: 'trainee@example.com', centre_id: 'centre-a' };
  const otherCentre = { user_email: 'other@example.com', centre_id: 'centre-b' };
  assert.equal(canManageSessions(self, { user_email: self.user_mail }), true);
  assert.equal(canManageSessions(self, sameCentre), false);
  assert.equal(canManageSessions({ ...self, role: 103 }, sameCentre), false);
  assert.equal(canManageSessions({ ...self, role: 101 }, sameCentre), true);
  assert.equal(canManageSessions({ ...self, role: 101 }, otherCentre), false);
  assert.equal(canManageSessions({ ...self, role: 101, centre_id: null }, sameCentre), false);
  assert.equal(canManageSessions({ ...self, role: 99 }, otherCentre), true);
});

const databaseModule = require.resolve('../utils/conn');
const storeModule = require.resolve('../Auth/sessionStore');
let active = true;
let accountActive = true;
require.cache[databaseModule] = {
  id: databaseModule, filename: databaseModule, loaded: true,
  exports: { query: async () => ({ rows: accountActive
    ? [{ user_role: '102', status: 'active', centre_id: 'centre-a', center_name: 'A' }]
    : [{ user_role: '102', status: 'inactive', centre_id: 'centre-a', center_name: 'A' }] }) }
};
require.cache[storeModule] = {
  id: storeModule, filename: storeModule, loaded: true,
  exports: {
    getActiveSession: async () => active ? { id: 'session-one' } : null,
    touchSession: async () => {}
  }
};

process.env.ACCESS_TOKEN_SECRET = 'session-test-access-secret';
process.env.REFRESH_TOKEN_SECRET = 'session-test-refresh-secret';
const Authenticate = require('../Auth/Authenticate');
const refreshToken = require('../Auth/refreshToken');
const payload = { user_mail: 'tutor@example.com', role: '102', sid: 'session-one' };
const response = () => ({
  code: 200, body: null,
  status(code) { this.code = code; return this; },
  json(body) { this.body = body; return this; }
});

test('revoked access and refresh tokens are rejected immediately', async () => {
  active = false;
  const access = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
  const refresh = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  const accessRes = response();
  let nextCalled = false;
  await Authenticate({ headers: { authorization: `Bearer ${access}` } }, accessRes,
    () => { nextCalled = true; });
  assert.equal(accessRes.code, 401);
  assert.equal(nextCalled, false);

  const refreshRes = response();
  await refreshToken({ cookies: { refreshToken: refresh } }, refreshRes);
  assert.equal(refreshRes.code, 401);
  active = true;
});

test('legacy tokens and inactive accounts cannot authenticate', async () => {
  const legacy = jwt.sign({ user_mail: payload.user_mail, role: '102' },
    process.env.ACCESS_TOKEN_SECRET);
  const legacyRes = response();
  await Authenticate({ headers: { authorization: `Bearer ${legacy}` } }, legacyRes, () => {});
  assert.equal(legacyRes.code, 401);

  accountActive = false;
  const access = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
  const inactiveRes = response();
  await Authenticate({ headers: { authorization: `Bearer ${access}` } }, inactiveRes, () => {});
  assert.equal(inactiveRes.code, 401);
  accountActive = true;
});

test('active access tokens use current account role and centre', async () => {
  const access = jwt.sign({ ...payload, role: '99', centre_id: 'old-centre' },
    process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
  const req = { headers: { authorization: `Bearer ${access}` } };
  let nextCalled = false;
  await Authenticate(req, response(), () => { nextCalled = true; });
  assert.equal(nextCalled, true);
  assert.equal(req.user.role, '102');
  assert.equal(req.user.centre_id, 'centre-a');
});
