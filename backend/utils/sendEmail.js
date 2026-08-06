const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // We'll create a mock transporter for local development 
  // that uses ethereal email or just logs to console
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_EMAIL || 'mockuser@ethereal.email',
      pass: process.env.SMTP_PASSWORD || 'mockpassword',
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'EventMate'} <${process.env.FROM_EMAIL || 'noreply@eventmate.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Skip actual sending if we're in mock mode and just log the URL
  if (!process.env.SMTP_HOST) {
    console.log(`\n================================`);
    console.log(`MOCK EMAIL SENT TO: ${options.email}`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log(`MESSAGE:\n${options.message}`);
    console.log(`================================\n`);
    return;
  }

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
