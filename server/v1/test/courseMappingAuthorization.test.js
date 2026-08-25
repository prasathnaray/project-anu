const test = require('node:test');
const assert = require('node:assert/strict');

const {
    courseMappingOwnership,
    courseMappingReadScope
} = require('../Auth/courseMappingAuthorization');

test('Super Admin course mappings are global but remain creator-scoped', () => {
    const requester = { user_mail: 'super@example.test', role: 99, centre_id: null };

    assert.deepEqual(courseMappingOwnership(requester), {
        ownerScope: 'super_admin',
        ownerCentreId: null
    });
    assert.deepEqual(courseMappingReadScope(requester, 'cm', 2), {
        clause: "cm.owner_scope = 'super_admin' AND cm.created_by = $2",
        params: [requester.user_mail]
    });
});

test('Institution Admin creates mappings owned by the authenticated center', () => {
    const requester = {
        user_mail: 'admin@example.test',
        role: 101,
        centre_id: '11111111-1111-1111-1111-111111111111'
    };

    assert.deepEqual(courseMappingOwnership(requester), {
        ownerScope: 'institution',
        ownerCentreId: requester.centre_id
    });
});

test('all institution roles read mappings from their authenticated center', () => {
    for (const role of [101, 102, 103]) {
        const requester = {
            user_mail: `${role}@example.test`,
            role,
            centre_id: '11111111-1111-1111-1111-111111111111'
        };

        assert.deepEqual(courseMappingReadScope(requester), {
            clause: "cm.owner_scope = 'institution' AND cm.owner_centre_id = $1",
            params: [requester.centre_id]
        });
    }
});

test('institution users without a center receive no course-mapping scope', () => {
    assert.equal(courseMappingOwnership({ user_mail: 'admin@example.test', role: 101 }), null);
    assert.equal(courseMappingReadScope({ user_mail: 'trainee@example.test', role: 103 }), null);
});
