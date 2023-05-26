const { sendConfirmationEmail } = require('../utils/emailUtils');
const auth = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const _ = require('lodash');
const {User, validate, validateConfirmation} = require('../models/User');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const generateToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

router.get('/finduser', auth, async (req, res) => {
  try{
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}
});

router.post('/registeruser', async (req, res) => {
  try{
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const { name, username, email, password } = req.body; // Extract the name property

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name','username', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // user.password = await bcrypt.hash(user.password, salt);
  // await user.save();

  // const token = user.generateAuthToken();
  // res.header('x-auth-token', token).status(201).send({
  //   message: 'Account created successfully',
  //   user: _.pick(user, ['_id', 'name', 'email'])
  // });

      // Create a confirmation token
      const confirmationToken = generateToken(); // Generate a unique token

      // Create the user
      user = new User({
        name,
        username,
        email,
        password: hashedPassword,
        confirmationToken
      });
  
      // Save the user in the database
      await user.save();
  
      // Send confirmation email
      await sendConfirmationEmail(user.email, user.confirmationToken);
  
      res.status(201).json({ message: 'Account created successfully' });

} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}
});


// User account confirmation endpoint
router.post('/confirm-account', async (req, res) => {
  try {
    const { error } = validateConfirmation(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

    const { email, confirmationToken } = req.body;

    // Find the user with the given email and confirmation token
    const user = await User.findOne({ email, confirmationToken });

    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired confirmation token' });
    }

    // Update the user's account status
    user.isConfirmed = true;
    user.confirmationToken = undefined;
    await user.save();

    res.json({ message: 'Account confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router; 
