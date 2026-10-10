const client = require('../utils/conn');
const jwt = require('jsonwebtoken');
const { comparePasswords } = require('../utils/hash');
const { normalizeEmail, emailLookup, decryptPii } = require('../utils/userEmailCrypto');
const path = require('path');
const LoginAttemptModel = require('./LoginAttemptModel');
const { createSession } = require('./sessionStore');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const LoginModel = async (user_mail, user_password, deviceInfo, ipAddress) => {
  const normalizedEmail = normalizeEmail(user_mail);
  const result = await client.query(
    `SELECT user_email_enc, user_name_enc, user_password, user_role, people_id,
            centre_id, center_name
     FROM public.user_data
     WHERE user_email_lookup = $1 AND status = $2`,
    [emailLookup(normalizedEmail), 'active']
  );
  if (!result.rows.length) {
    return { status: 'User Not Found or Account Disabled', code: 404 };
  }

  const user = result.rows[0];
  if (!await comparePasswords(user_password, user.user_password)) {
    return { status: 'Invalid_Password', code: 401 };
  }

  // The lookup identifies the row; authenticated decryption recovers the
  // email needed by the current session and token schemas.
  user.user_email = decryptPii(user.user_email_enc, 'user_email');
  if (normalizeEmail(user.user_email) !== normalizedEmail) {
    throw new Error('Encrypted email does not match its lookup value');
  }
  user.user_name = decryptPii(user.user_name_enc, 'user_name');

  const session = await createSession(user, deviceInfo, ipAddress);
  try {
    await LoginAttemptModel(user.user_email);
  } catch (attemptErr) {
    console.error('Failed to log login attempt:', attemptErr);
  }

  const isVR = Boolean(deviceInfo?.isVR);
  const tokenPayload = {
    user_mail: user.user_email,
    role: user.user_role,
    centre_id: user.centre_id || null,
    center_name: user.center_name || null,
    sid: session.id,
    isVR: isVR,
    loginSource: isVR ? 'VR Device' : 'Normal Browser',
    device: deviceInfo?.device || (isVR ? 'VR Headset' : 'browser')
  };
  const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET);
  const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return {
    accessToken, refreshToken, id: user.user_email, role: user.user_role,
    people_id: user.people_id, centre_id: user.centre_id,
    center_name: user.center_name, status: 'Login Authenticated',
    name: user.user_name, code: 200,
    isVr: isVR,
    loginSource: isVR ? 'VR Device' : 'Normal Browser',
    device: deviceInfo?.device || (isVR ? 'VR Headset' : 'browser')
  };
};

module.exports = LoginModel;
