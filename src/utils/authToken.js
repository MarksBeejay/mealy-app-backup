const config = require('../config/index');
const jwt = require('jsonwebtoken');

generateAuthToken = function(user) { 
    const token = jwt.sign({ _id: user._id }, config.jwt_secret);
    return token;
  }

module.exports = {generateAuthToken};