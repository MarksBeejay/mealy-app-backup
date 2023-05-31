const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/User');
const{generateAuthToken} = require('../utils/authToken')
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();


//login user
router.post('/', async (req, res) => {
  try{
    //request validation
  const { error } = validateUser(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  //find the user by email
  let user = await User.findOne({ email: req.body.email});
  if (!user) return res.status(400).send('Invalid email or password.');

  // Compare passwords
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

   // Generate and send authentication token
  const token = generateAuthToken(user);

   // Store the token in the user document
   user.authToken = token;
   await user.save()

  res.send({message: "logged in successfully",
    authenticationtoken: token});
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
}


//Get user information
router.get('/finduser', auth, async (req, res) => {
  try{
  const userId = req.user._id;
  const user = await User.findById(userId).select('-password -authToken');

  res.json({
    data: user
  });

    // Clear or invalidate the accessToken field in the user document
    user.authToken = undefined;
    await user.save();
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}
});


module.exports = router; 
