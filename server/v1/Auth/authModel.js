const client = require('../utils/conn');
const jwt = require('jsonwebtoken');
const { comparePasswords } = require('../utils/hash');
const path = require('path');
const LoginAttemptModel = require('./LoginAttemptModel');
const { createSession } = require('./sessionStore');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const LoginModel = async (user_mail, user_password, deviceInfo, ipAddress) => {
  const result = await client.query(
    'SELECT * FROM public.user_data WHERE user_email = $1 AND status = $2',
    [user_mail, 'active']
  );
  if (!result.rows.length) {
    return { status: 'User Not Found or Account Disabled', code: 404 };
  }

  const user = result.rows[0];
  if (!await comparePasswords(user_password, user.user_password)) {
    return { status: 'Invalid_Password', code: 401 };
  }

  const session = await createSession(user, deviceInfo, ipAddress);
  try {
    await LoginAttemptModel(user_mail);
  } catch (attemptErr) {
    console.error('Failed to log login attempt:', attemptErr);
  }

  const tokenPayload = {
    user_mail: user.user_email,
    role: user.user_role,
    centre_id: user.centre_id || null,
    center_name: user.center_name || null,
    sid: session.id
  };
  const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET);
  const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return {
    accessToken, refreshToken, id: user.user_email, role: user.user_role,
    people_id: user.people_id, centre_id: user.centre_id,
    center_name: user.center_name, status: 'Login Authenticated',
    name: user.user_name, code: 200
  };
};

module.exports = LoginModel;
