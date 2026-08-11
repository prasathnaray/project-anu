const test = require('node:test');
const assert = require('node:assert/strict');
const {
    ROLES,
    HttpError,
    requireRole,
    requireInstitution,
    canEditOwnedEntity
} = require('../Auth/authorization');

const user = (role, centreId = null) => ({ user_mail: `${role}@example.test`, role, centre_id: centreId });

test('Super Admin can edit global and institution-owned entities', () => {
    const requester = user(ROLES.SUPER_ADMIN);
    assert.equal(canEditOwnedEntity(requester, 'super_admin', null), true);
    assert.equal(canEditOwnedEntity(requester, 'institution', 'institution-b'), true);
});

test('institution editors can edit only content owned by their institution', () => {
    for (const role of [ROLES.INSTITUTION_ADMIN, ROLES.TUTOR]) {
        const requester = user(role, 'institution-a');
        assert.equal(canEditOwnedEntity(requester, 'institution', 'institution-a'), true);
        assert.equal(canEditOwnedEntity(requester, 'institution', 'institution-b'), false);
        assert.equal(canEditOwnedEntity(requester, 'super_admin', null), false);
    }
});

test('trainees cannot edit content', () => {
    assert.equal(canEditOwnedEntity(user(ROLES.TRAINEE, 'institution-a'), 'institution', 'institution-a'), false);
});

test('role checks distinguish unauthenticated and forbidden requests', () => {
    assert.throws(() => requireRole(null, [ROLES.SUPER_ADMIN]), (error) => error instanceof HttpError && error.statusCode === 401);
    assert.throws(
        () => requireRole(user(ROLES.TRAINEE, 'institution-a'), [ROLES.SUPER_ADMIN]),
        (error) => error instanceof HttpError && error.statusCode === 403
    );
});

test('institution scope is mandatory for institution users', () => {
    assert.equal(requireInstitution(user(ROLES.INSTITUTION_ADMIN, 'institution-a')), 'institution-a');
    assert.throws(
        () => requireInstitution(user(ROLES.INSTITUTION_ADMIN)),
        (error) => error instanceof HttpError && error.statusCode === 403
    );
});
