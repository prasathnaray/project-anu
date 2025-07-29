const mailSender = require('../utils/smtp');
const forgotm = require('../model/forgotm');
const forgotpcontroller = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ipaddress = ip.includes('::ffff:') ? ip.split('::ffff:')[1] : ip;
  const { reset_password_mail } = req.body;
  if (!reset_password_mail) {
    return res.status(400).send({ status: "Field should not be empty" });
  }
  try {
    const dbResponse = await forgotm(reset_password_mail, ipaddress);
    if (dbResponse.status === 'User Not Found') {
      return res.status(404).json(dbResponse);
    }
    const mailResponse = await mailSender(reset_password_mail);
    if (mailResponse && mailResponse.messageId) {
      return res.status(200).json({
        status: 'Success',
        messageId: mailResponse.messageId,
        logResponse: dbResponse
      });
    } else {
      throw new Error("Mail not sent");
    }
  } catch (err) {
    return res.status(500).json({
      status: 'Error',
      code: 500,
      message: err.message
    });
  }
};
module.exports = forgotpcontroller;