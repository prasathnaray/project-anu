const crypto = require('crypto');
const path = require('path')
const bcrypt = require('bcrypt');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.SECRET_KEY, 'salt', 32);
const iv = crypto.randomBytes(16);
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log({
        iv: iv.toString('hex'),
        encryptedData: encrypted
      })
    // return {
    //   iv: iv.toString('hex'),
    //   encryptedData: encrypted
    // };

  }
  
function decrypt(encryptedData, ivHex) {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    //return decrypted;
    console.log(decrypted);
}

async function hashPassword(plainPassword) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(plainPassword, saltRounds);
    console.log(hashed);
}

async function comparePasswords(enteredPassword, hashedPasswordFromDB) {
    const match = await bcrypt.compare(enteredPassword, hashedPasswordFromDB);
    return match;
    //console.log(match);
}  
//hashPassword('MyPlainPassword123')
//comparePasswords('MyPlainPassword123', '$2b$10$ZNkOMieY2GCvhNXQBFmwves4bVj5z6Wk.2dajDgJSjHmUAaO9OxLe')
// encrypt('prasath@example.com');
// decrypt('194afa5dc1e3392dbf700b8f439748edd862ebb7490a6b6b6b5626e1399dacc7', '3a73a1ba62419d8ea89c47f6965e3faf')
module.exports = {comparePasswords, hashPassword};
// module.exports = {encrypt, decrypt}