const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  // Use configured SMTP if available
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    // Dynamically generate a test account if no SMTP provided (Real-time testing)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const message = {
    from: `${process.env.FROM_NAME || 'EventMate'} <${process.env.FROM_EMAIL || 'noreply@eventmate.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  
  if (!process.env.SMTP_HOST) {
    console.log(`\n================================`);
    console.log(`REALTIME EMAIL SENT TO: ${options.email}`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log(`PREVIEW URL: ${nodemailer.getTestMessageUrl(info)}`);
    console.log(`================================\n`);
  } else {
    console.log('Message sent: %s', info.messageId);
  }
  
  return nodemailer.getTestMessageUrl(info);
};

module.exports = sendEmail;
