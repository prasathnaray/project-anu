const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const refreshToken = async (req, res) => {
  //const { token } = req.body; // or from cookie if you later switch to cookie storage
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

  // ✅ Verify with REFRESH_TOKEN_SECRET
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired refresh token' });

    // ✅ Issue a *new access token* using ACCESS_TOKEN_SECRET
    const newAccessToken = jwt.sign(
      { user_mail: user.user_mail, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '20m' }
    );

    res.json({ accessToken: newAccessToken });
  });
};

module.exports = refreshToken;