const express = require('express');
const bcrypt = require('bcrypt');
const {User} = require('../models/User'); // Assuming you have a User model
const { validateEmail, validateResetToken, validatePassword } = require('../validators/validationMiddleware');
const {sendPasswordResetEmail, sendPasswordResetSuccess} = require('../utils/emailUtils');
const { generateToken } = require('../utils/cryptoToken');

const router = express.Router();


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
    sendPasswordResetEmail(email, resetToken);

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
    const { password, confirmPassword } = req.body;

    // Find the user with the given reset token and check its expiry
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    if(password !== confirmPassword) return res.status(403).send('Password mismatch');
    
    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt); // Generate a hash of the new password
    const hashedConfirmPassword = await bcrypt.hash(req.body.confirmPassword, salt)
    user.password = hashedPassword;
    user.confirmPassword = hashedConfirmPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    // Send password change confirmation email
    sendPasswordResetSuccess(user.email);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;