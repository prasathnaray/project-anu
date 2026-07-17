const jwt = require('jsonwebtoken');
const path = require('path');
const client = require('../utils/conn');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired refresh token' });

    try {
      const result = await client.query(
        'SELECT centre_id, center_name FROM public.user_data WHERE user_email = $1',
        [user.user_mail]
      );
      const dbUser = result.rows[0] || {};
      const newAccessToken = jwt.sign(
        {
          user_mail: user.user_mail,
          role: user.role,
          centre_id: user.centre_id || dbUser.centre_id || null,
          center_name: user.center_name || dbUser.center_name || null
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '20m' }
      );

      res.json({ accessToken: newAccessToken });
    } catch (queryErr) {
      res.status(500).json({ error: 'Failed to refresh token context' });
    }
  });
};

module.exports = refreshToken;
