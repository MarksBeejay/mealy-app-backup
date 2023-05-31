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
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: (value) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value),
      message: 'Invalid email format',
  },
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
  authToken: {
    type: String,
    default: null,
},
  confirmationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,
  isAdmin: Boolean
});

const User = mongoose.model('User', userSchema);

exports.User = User; 