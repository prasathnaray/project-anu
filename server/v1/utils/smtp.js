const path = require('path');
const nodemailerModule = require('nodemailer');
const nodemailer = nodemailerModule.default || nodemailerModule;
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mailSender = async (forgotPassword) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_TRAP_HOST,
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USERNAME,
      pass: process.env.MAIL_TRAP_PASSWORD_SMTP
    }
  });
  try {
    const info = await transport.sendMail({
      from: '"No reply" <no-reply@htic.iitm.ac.in>',
      to: forgotPassword,
      subject: "Forgot Password",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });
    return { messageId: info.messageId };
  } catch (err) {
    throw new Error(err.message || "Mail sending failed");
  }
};
module.exports = mailSender;