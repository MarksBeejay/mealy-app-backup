const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true, // Convert the value to lowercase
  },
  category: {
    type: String,
    required: true,
    lowercase: true, // Convert the value to lowercase
  },
  price: {
    type: Number,
    required: true,
  },
  dietaryPreferences: [{
    type: String,
    lowercase: true, // Convert the values to lowercase
    default: undefined
  }],
});

const Item = mongoose.model('Item', itemSchema);

exports.Item = Item;