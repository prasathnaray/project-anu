const test = require('node:test');
const assert = require('node:assert/strict');
const { ROLES } = require('../Auth/authorization');
const { canManageVolume, volumeAccessScope } = require('../Auth/volumeAuthorization');

const requester = (email, role, centreId = null) => ({ user_mail: email, role, centre_id: centreId });
const volume = (email, uploaderRole, centreId = null) => ({
    added_by: email,
    uploader_role: uploaderRole,
    owner_scope: uploaderRole === ROLES.SUPER_ADMIN ? 'super_admin' : 'institution',
    owner_centre_id: centreId
});

test('Super Admin users can manage only their own volumes', () => {
    const first = requester('first-super@example.test', ROLES.SUPER_ADMIN);
    assert.equal(canManageVolume(first, volume(first.user_mail, ROLES.SUPER_ADMIN)), true);
    assert.equal(canManageVolume(first, volume('second-super@example.test', ROLES.SUPER_ADMIN)), false);
    assert.equal(canManageVolume(first, volume('tutor@example.test', ROLES.TUTOR, 'centre-a')), false);
});

test('institution admins can manage their own and same-centre instructor volumes', () => {
    const admin = requester('admin@example.test', ROLES.INSTITUTION_ADMIN, 'centre-a');
    assert.equal(canManageVolume(admin, volume(admin.user_mail, ROLES.INSTITUTION_ADMIN, 'centre-a')), true);
    assert.equal(canManageVolume(admin, volume('tutor@example.test', ROLES.TUTOR, 'centre-a')), true);
    assert.equal(canManageVolume(admin, volume('peer-admin@example.test', ROLES.INSTITUTION_ADMIN, 'centre-a')), false);
    assert.equal(canManageVolume(admin, volume('other-tutor@example.test', ROLES.TUTOR, 'centre-b')), false);
    assert.equal(canManageVolume(admin, volume('super@example.test', ROLES.SUPER_ADMIN)), false);
});

test('instructors can manage only their own volumes', () => {
    const tutor = requester('tutor@example.test', ROLES.TUTOR, 'centre-a');
    assert.equal(canManageVolume(tutor, volume(tutor.user_mail, ROLES.TUTOR, 'centre-a')), true);
    assert.equal(canManageVolume(tutor, volume('peer@example.test', ROLES.TUTOR, 'centre-a')), false);
    assert.equal(canManageVolume(tutor, volume('admin@example.test', ROLES.INSTITUTION_ADMIN, 'centre-a')), false);
});

test('trainees and unauthenticated requesters have no volume-management scope', () => {
    assert.equal(canManageVolume(requester('trainee@example.test', ROLES.TRAINEE, 'centre-a'), volume('trainee@example.test', ROLES.TRAINEE, 'centre-a')), false);
    assert.equal(volumeAccessScope(requester('trainee@example.test', ROLES.TRAINEE, 'centre-a')), null);
    assert.equal(volumeAccessScope(null), null);
});

test('SQL scope uses uploader identity for Super Admin and instructor roles', () => {
    assert.deepEqual(
        volumeAccessScope(requester('super@example.test', ROLES.SUPER_ADMIN), 'v', 2),
        { clause: 'v.added_by = $2', params: ['super@example.test'] }
    );
    assert.deepEqual(
        volumeAccessScope(requester('tutor@example.test', ROLES.TUTOR, 'centre-a'), 'volumes', 4),
        { clause: 'volumes.added_by = $4', params: ['tutor@example.test'] }
    );
});

test('institution admin SQL scope includes only same-centre role-102 uploads', () => {
    assert.deepEqual(
        volumeAccessScope(requester('admin@example.test', ROLES.INSTITUTION_ADMIN, 'centre-a'), 'v', 3),
        {
            clause: "(v.added_by = $3 OR (v.uploader_role = $4 AND v.owner_scope = 'institution' AND v.owner_centre_id = $5))",
            params: ['admin@example.test', ROLES.TUTOR, 'centre-a']
        }
    );
});

test('stored uploader role keeps the instructor exception stable after account role changes', () => {
    const admin = requester('admin@example.test', ROLES.INSTITUTION_ADMIN, 'centre-a');
    const historicalInstructorUpload = volume('promoted-user@example.test', ROLES.TUTOR, 'centre-a');
    assert.equal(canManageVolume(admin, historicalInstructorUpload), true);
});
