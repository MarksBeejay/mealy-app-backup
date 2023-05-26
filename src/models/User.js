const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  createdTime: {
    type: Date,
    default: Date.now
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  confirmationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
}

function validateConfirmationToken(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    confirmationToken: Joi.string().required()
  });

 return schema.validate(user);
}


exports.User = User; 
exports.validate = validateUser;
exports.validateConfirmation = validateConfirmationToken;