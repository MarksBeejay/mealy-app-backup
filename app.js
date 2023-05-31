require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const config = require('./src/config/index')

const users = require('./src/routes/users');
const login = require('./src/routes/login');
const forgotPassword = require('./src/routes/forgotpassword')
const items = require('./src/routes/items');



// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodbConnectionUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));


// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/password', forgotPassword);
app.use('/login', login);
app.use('/users', users);
app.use('/items', items);


//for route that is not implemented
app.use((req, res, next)=>{
  const err = new Error('not found');
  err.status = 404;
  err.message = 'route not found';
  next(err)
  return res.status(err.status).send({message:err.message})
});


// Start the server
const port = config.port || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = app;