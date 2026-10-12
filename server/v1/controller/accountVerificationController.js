const { issueAccountVerificationOtp, verifyAccountOtp } = require('../utils/accountVerification');

const requestAccountVerification = async (req, res) => {
  const { email, purpose = 'activation' } = req.body || {};
  if (!email || !['activation', 'reactivation'].includes(purpose)) {
    return res.status(400).json({ message: 'Email and valid verification purpose are required' });
  }
  try {
    const result = await issueAccountVerificationOtp(email, purpose);
    return res.status(result.code || 202).json({
      status: 'Success',
      message: result.sent ? 'Verification OTP sent' : 'If the account exists, an OTP will be sent'
    });
  } catch (error) {
    const statusCode = Number.isInteger(error.code) ? error.code : 500;
    return res.status(statusCode).json({ status: 'Error', message: error.message });
  }
};

const verifyAccount = async (req, res) => {
  const { email, otp, purpose = 'activation' } = req.body || {};
  if (!email || !otp || !['activation', 'reactivation'].includes(purpose)) {
    return res.status(400).json({ message: 'Email, OTP, and valid verification purpose are required' });
  }
  try {
    const result = await verifyAccountOtp(email, otp, purpose);
    return res.status(result.code).json(result);
  } catch (error) {
    return res.status(500).json({ status: 'Error', message: 'Unable to verify account' });
  }
};

module.exports = { requestAccountVerification, verifyAccount };
