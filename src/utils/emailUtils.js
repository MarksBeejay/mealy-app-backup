const nodemailer = require('nodemailer');

// Send confirmation email
const sendConfirmationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      // Configure nodemailer with your email provider details
      service: 'gmail',
      auth: {
        user: 'makanjuolabolaji9898@gmail.com',
        pass: 'ikotrdfmgxvpanhw',
      },
    });

    const mailOptions = {
      from: 'makanjuolabolaji9898@gmail.com',
      to: email,
      subject: 'Account Confirmation',
      text: `Please click the following link to confirm your account: ${token}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendConfirmationEmail
};