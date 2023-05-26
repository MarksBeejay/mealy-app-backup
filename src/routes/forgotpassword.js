const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const {User} = require('../models/User'); // Assuming you have a User model
const {
  validateEmail,
  validateResetToken,
  validatePassword
} = require('../middlewares/validationMiddleware');

const router = express.Router();

// Generate a random token
const generateToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Send password reset email
const sendResetEmail = (email, token) => {
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Reset email sent: ' + info.response);
    }
  });
};


// Send password change confirmation email
const sendConfirmationEmail = (email) => {
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Confirmation email sent: ' + info.response);
    }
  });
};


// Handle password reset request
router.post('/forgot-password', validateEmail, async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user with the given email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a unique reset token and associate it with the user
    const resetToken = generateToken();
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expiry in 1 hour

    await user.save();

    // Send the password reset email
    sendResetEmail(email, resetToken);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Handle password reset with token
router.post('/reset-password/:token', validateResetToken, validatePassword, async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find the user with the given reset token and check its expiry
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt); // Generate a hash of the new password
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    // Send password change confirmation email
    sendConfirmationEmail(user.email);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;