const test = require('node:test');
const assert = require('node:assert/strict');

const connPath = require.resolve('../utils/conn');
const cryptoPath = require.resolve('../utils/userEmailCrypto');
const verificationPath = require.resolve('../utils/accountVerification');
const modelPath = require.resolve('../model/profilem');

const queries = [];
require.cache[connPath] = { id: connPath, filename: connPath, loaded: true, exports: {
    query: async (sql, values) => {
        queries.push({ sql, values });
        return { rows: [{ user_name: values[0], user_email: values[6], user_contact_num: values[2] }] };
    }
} };
require.cache[cryptoPath] = { id: cryptoPath, filename: cryptoPath, loaded: true, exports: {
    encryptPii: (value, field) => value ? `encrypted:${field}:${value}` : null
} };
require.cache[verificationPath] = { id: verificationPath, filename: verificationPath, loaded: true, exports: {
    validPhoneNumber: (value) => /^\+[1-9]\d{7,14}$/.test(value.replace(/\s/g, '')) ? value.replace(/\s/g, '') : null
} };

const { updateProfile } = require(modelPath);

test('profile update changes only the authenticated account and allowed fields', async () => {
    queries.length = 0;
    const result = await updateProfile({ role: 101, user_mail: 'owner@example.com' }, {
        user_name: ' New Name ', user_contact_num: '+91 9876543210', user_dob: '2000-02-29',
        user_gender: 'female', user_email: 'other@example.com', institution_name: 'Other Center'
    });
    assert.equal(result.code, 200);
    assert.equal(queries.length, 1);
    assert.match(queries[0].sql, /WHERE user_email = \$7/);
    assert.doesNotMatch(queries[0].sql, /institution_name|SET user_email/);
    assert.equal(queries[0].values[0], 'New Name');
    assert.equal(queries[0].values[2], '+919876543210');
    assert.equal(queries[0].values[6], 'owner@example.com');
});

test('profile update rejects invalid data and unauthorized users before writing', async () => {
    queries.length = 0;
    assert.equal((await updateProfile({ role: 103, user_mail: 'x@example.com' }, {
        user_name: 'A', user_contact_num: '123', user_dob: ''
    })).code, 422);
    assert.equal((await updateProfile({ role: 103, user_mail: 'x@example.com' }, {
        user_name: 'A', user_contact_num: '', user_dob: '2023-02-30'
    })).code, 422);
    assert.equal((await updateProfile({ role: 103, user_mail: 'x@example.com' }, {
        user_name: 'A', user_contact_num: '', user_dob: '', user_gender: 'Female'
    })).code, 422);
    assert.equal((await updateProfile({ role: 103, user_mail: 'x@example.com' }, {
        user_name: 'A'.repeat(51), user_contact_num: '', user_dob: ''
    })).code, 422);
    assert.equal((await updateProfile({ role: 500, user_mail: 'x@example.com' }, {
        user_name: 'A', user_contact_num: '', user_dob: ''
    })).code, 401);
    assert.equal(queries.length, 0);
});
