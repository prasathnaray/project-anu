const jwt = require('jsonwebtoken');
const path = require('path');
const client = require('../utils/conn');
const { getActiveSession, touchSession } = require('./sessionStore');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Authenticate = async (req, res, next) => {
  const token = /^Bearer (.+)$/i.exec(req.headers.authorization || '')?.[1];
  if (!token) return res.status(401).json({ status: 'Unauthorized: No token' });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (_) {
    return res.status(401).json({ status: 'Unauthorized: Invalid or expired token' });
  }
  if (!decoded.sid || !decoded.user_mail) {
    return res.status(401).json({ status: 'Unauthorized: Please sign in again' });
  }

  try {
    const session = await getActiveSession(decoded.sid, decoded.user_mail);
    if (!session) return res.status(401).json({ status: 'Unauthorized: Session ended' });

    const result = await client.query(
      `SELECT user_role, status, centre_id, center_name FROM public.user_data
       WHERE user_email = $1`,
      [decoded.user_mail]
    );
    const dbUser = result.rows[0];
    if (!dbUser || String(dbUser.status).toLowerCase() !== 'active') {
      return res.status(401).json({ status: 'Unauthorized: Account is not active' });
    }
    req.user = {
      ...decoded, role: dbUser.user_role,
      centre_id: dbUser.centre_id || null,
      center_name: dbUser.center_name || null
    };
    await touchSession(decoded.sid);
    next();
  } catch (queryErr) {
    next(queryErr);
  }
};

module.exports = Authenticate;
