const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
const users = require('./src/routes/users');
const login = require('./src/routes/login');
// const routes = require('./routes');
const forgotPassword = require('./src/routes/forgotpassword')

// Initialize Express app
const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect('mongodb+srv://makanjuolabolaji9898:5WIEySfq1D5yZcOR@cluster0.oikzkpv.mongodb.net/mealy-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(express.json());

// Routes
app.use('/password', forgotPassword);
app.use('/login', login);
app.use('/users', users);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});