const jwt = require('jsonwebtoken');
const path = require('path');
const client = require('../utils/conn');
const { getActiveSession, touchSession } = require('./sessionStore');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token provided' });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
  if (!decoded.sid || !decoded.user_mail) {
    return res.status(401).json({ error: 'Please sign in again' });
  }

  try {
    const session = await getActiveSession(decoded.sid, decoded.user_mail);
    if (!session) return res.status(401).json({ error: 'Session ended' });
    const result = await client.query(
      `SELECT user_role, status, centre_id, center_name FROM public.user_data
       WHERE user_email = $1`,
      [decoded.user_mail]
    );
    const user = result.rows[0];
    if (!user || String(user.status).toLowerCase() !== 'active') {
      return res.status(401).json({ error: 'Account is not active' });
    }

    await touchSession(decoded.sid);
    const accessToken = jwt.sign({
      user_mail: decoded.user_mail,
      role: user.user_role,
      centre_id: user.centre_id || null,
      center_name: user.center_name || null,
      sid: decoded.sid
    }, process.env.ACCESS_TOKEN_SECRET);
    return res.json({ accessToken });
  } catch (queryErr) {
    return res.status(500).json({ error: 'Failed to refresh token context' });
  }
};

module.exports = refreshToken;
