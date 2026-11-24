const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function sendTestEmail() {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
    });

    let info = await transporter.sendMail({
      from: `"Campus System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: 'Test Email from Smart Campus System ✅',
      text: 'This is a test email sent from your system successfully.',
    });

    console.log('✅ Email sent successfully! Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
}

if (require.main === module) {
  sendTestEmail();
}

module.exports = { sendTestEmail };
