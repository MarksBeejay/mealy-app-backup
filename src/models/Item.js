const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true, 
  },
  restaurant: {
    type: String,
    required: true,
    lowercase: true, 
  },
  description: {
    type: String,
    required: true,
    lowercase: true, 
  },
  mainIngredients: [{
    type: String,
    required: true,
    lowercase: true, 
  }],
  category: {
    type: String,
    required: true,
    //default: undefined
    lowercase: true,
  },
  price: {
    type: Number,
    required: true,
  },
  customization: {
    type: String,
    default: undefined,
    lowercase: true,
  },
});

const Item = mongoose.model('Item', itemSchema);

exports.Item = Item;