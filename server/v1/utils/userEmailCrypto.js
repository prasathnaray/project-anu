const crypto = require('node:crypto');
const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const ENCRYPTION_INFO = 'project-anu/user-data/aes-256-gcm';
const LOOKUP_INFO = 'project-anu/user-data/email-lookup';

function masterKey() {
  const encoded = process.env.USER_DATA_ENCRYPTION_KEY || process.env.BASE64_KEY;
  if (!encoded || !/^[A-Za-z0-9+/_-]+={0,2}$/.test(encoded)) {
    throw new Error('USER_DATA_ENCRYPTION_KEY or BASE64_KEY must be base64');
  }
  const key = Buffer.from(encoded, 'base64url');
  if (key.length !== 32) {
    throw new Error('USER_DATA_ENCRYPTION_KEY or BASE64_KEY must decode to 32 bytes');
  }
  return key;
}

function deriveKey(info) {
  // Matches the Python importer's HKDF-SHA256 settings (no salt, 32 bytes).
  return Buffer.from(crypto.hkdfSync('sha256', masterKey(), Buffer.alloc(0), info, 32));
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function emailLookup(email) {
  return crypto.createHmac('sha256', deriveKey(LOOKUP_INFO))
    .update(normalizeEmail(email), 'utf8')
    .digest('hex');
}

function decryptPii(encoded, field) {
  if (!encoded) throw new Error(`Missing encrypted ${field}`);
  const data = Buffer.from(encoded, 'base64url');
  if (data.length < 28) throw new Error(`Invalid encrypted ${field}`);
  const nonce = data.subarray(0, 12);
  const tag = data.subarray(data.length - 16);
  const ciphertext = data.subarray(12, data.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', deriveKey(ENCRYPTION_INFO), nonce);
  decipher.setAAD(Buffer.from(field, 'utf8'));
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

function encryptPii(value, field) {
  if (value == null || value === '') return null;
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', deriveKey(ENCRYPTION_INFO), nonce);
  cipher.setAAD(Buffer.from(field, 'utf8'));
  const ciphertext = Buffer.concat([
    cipher.update(String(value), 'utf8'), cipher.final()
  ]);
  return Buffer.concat([nonce, ciphertext, cipher.getAuthTag()]).toString('base64url');
}

function encryptedUserFields(email, name, phone) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail.includes('@') || !String(name || '').trim()) {
    throw new Error('A valid email and name are required to create a user');
  }
  return {
    user_email: normalizedEmail,
    user_email_lookup: emailLookup(normalizedEmail),
    user_email_enc: encryptPii(normalizedEmail, 'user_email'),
    user_name_enc: encryptPii(name, 'user_name'),
    user_contact_num_enc: encryptPii(phone, 'user_contact_num')
  };
}

module.exports = { normalizeEmail, emailLookup, decryptPii, encryptPii, encryptedUserFields };
