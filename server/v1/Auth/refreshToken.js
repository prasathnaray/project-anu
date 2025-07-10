const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });
    const newAccessToken = jwt.sign(
      { user_mail: user.user_mail, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ accessToken: newAccessToken });
  });
};
module.exports = refreshToken;