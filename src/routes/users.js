const auth = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/User');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

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

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).status(201).send({
    message: 'Account created successfully',
    user: _.pick(user, ['_id', 'name', 'email'])
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}
});

module.exports = router; 
