const path = require('path');
const nodemailerModule = require('nodemailer');
const nodemailer = nodemailerModule.default || nodemailerModule;

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const transport = nodemailer.createTransport({
  host: process.env.MAIL_TRAP_HOST,
  port: 2525,
  auth: {
    user: process.env.MAIL_TRAP_USERNAME,
    pass: process.env.MAIL_TRAP_PASSWORD_SMTP
  }
});

(async () => {
  try {
    const info = await transport.sendMail({
      from: '"Maddison Foo Koch" <hell@example.com>',
      to: "abiya@htic.iitm.ac.in",
      subject: "Check",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });

    console.log("Message sent:", info.messageId);
  } catch (err) {
    console.error("SendMail error:", err);
  }
})();