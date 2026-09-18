const test = require('node:test');
const assert = require('node:assert/strict');
const { HttpError, ROLES } = require('../Auth/authorization');
const { requirePublisher, requireViewer, traineeUserId } = require('../services/streamingPolicy');

const user = (role, centreId = '11111111-1111-1111-1111-111111111111') => ({
  user_mail: `${role}@example.test`, role, centre_id: centreId
});

test('only a center-linked trainee can request a publisher session', () => {
  assert.equal(requirePublisher(user(ROLES.TRAINEE)), '11111111-1111-1111-1111-111111111111');
  assert.throws(() => requirePublisher(user(ROLES.INSTITUTION_ADMIN)), (error) => error instanceof HttpError && error.statusCode === 403);
  assert.throws(() => requirePublisher(user(ROLES.TRAINEE, null)), (error) => error instanceof HttpError && error.statusCode === 403);
});

test('only a center-linked institution admin can request a viewer session', () => {
  assert.equal(requireViewer(user(ROLES.INSTITUTION_ADMIN)), '11111111-1111-1111-1111-111111111111');
  for (const role of [ROLES.SUPER_ADMIN, ROLES.TUTOR, ROLES.TRAINEE]) {
    assert.throws(() => requireViewer(user(role)), (error) => error instanceof HttpError && error.statusCode === 403);
  }
});

test('IVS trainee user IDs are opaque and reject missing profile IDs', () => {
  assert.equal(traineeUserId('TR-123'), 'trainee:TR-123');
  assert.throws(() => traineeUserId(null), (error) => error instanceof HttpError && error.statusCode === 409);
});
