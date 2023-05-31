const nodemailer = require('nodemailer');

// Send confirmation email
const sendConfirmationTokenEmail = async (email, token) => {
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

const sendAccountConfirmationSuccess = async (email) => {
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
      subject: 'Account Confirmation Success',
      text: `Your account has been confirmed`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
}

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
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
    subject: 'Password Reset',
    text: `Please click the following link to reset your password: ${token}`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Reset email sent: ' + info.response);
    }
  });
};


// Send password change confirmation email
const sendPasswordResetSuccess = async (email) => {
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
    subject: 'Password Change Confirmation',
    text: 'Your password has been successfully updated.',
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Confirmation email sent: ' + info.response);
    }
  });
};

module.exports = {
  sendConfirmationTokenEmail, sendAccountConfirmationSuccess, sendPasswordResetEmail, sendPasswordResetSuccess
};