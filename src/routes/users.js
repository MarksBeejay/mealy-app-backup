const passport = require ('passport');

const {validateUser, validateConfirmationToken} = require('../validators/validationMiddleware');
const { sendConfirmationTokenEmail, sendAccountConfirmationSuccess } = require('../utils/emailUtils');
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/cryptoToken')
const _ = require('lodash');
const {User} = require('../models/User');
const express = require('express');
const router = express.Router();



//register new user account
router.post('/registeruser', validateUser, async (req, res) => {
  try{

  const { name, username, email, password, confirmPassword } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).send('User already registered.');

  if(password !== confirmPassword) return res.status(403).send('Password mismatch');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt)

      // Create a confirmation token
      const confirmationToken = generateToken(); // Generate a unique token

      // Create the user
      user = new User({
        name,
        username,
        email,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
        confirmationToken
      });

      // Save the user in the database
      await user.save();
  
      // Send confirmation email
      await sendConfirmationTokenEmail(user.email, user.confirmationToken);
  
      res.status(201).json({ message: 'Account created successfully and confirmation email sent' });

    } catch (error) {
     if (error.code === 11000 && error.keyPattern && error.keyPattern.username === 1) {
  // Duplicate key error for the username field
  res.status(400).json({ error: 'Username already taken.' });
      } else {
        // Other database errors
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
    }
  });


// User account confirmation endpoint
router.post('/confirm-account', validateConfirmationToken, async (req, res) => {
  try {

    const { email, confirmationToken } = req.body;

    // Find the user with the given email and confirmation token
    const user = await User.findOne({ email, confirmationToken});

    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired confirmation token' });
    }

    // Update the user's account status
    user.isConfirmed = true;
    user.confirmationToken = undefined;
    await user.save();

    await sendAccountConfirmationSuccess(user.email);

    res.json({ message: 'Account confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Google authentication route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login'}),
  (req, res) => {
    try{
    // Generate and send authentication token
    const token = generateAuthToken(req.user);

    // Store the token in the user document
    req.user.authToken = token;
    req.user.save();

    res.send({message: "logged in successfully",
    authenticationtoken: token});

    // res.redirect('/dashboard');// redirect to homepage of the app
  } catch (error) {
          console.error('Error handling Google authentication callback:', error);
          res.redirect('http://localhost:3000/login'); // Redirect to login page on error
        }
  }
);


module.exports = router; 
