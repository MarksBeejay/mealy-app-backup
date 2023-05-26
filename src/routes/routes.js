// const express = require('express');
// const router = express.Router();
// const { forgotPassword, resetPassword } = require('./controllers/passwordController');
// const { validateEmail, validateResetToken, validatePassword } = require('./middlewares/validationMiddleware');

// // Handle password reset request
// router.post('/forgot-password', validateEmail, forgotPassword);

// // Handle password reset with token
// router.post('/reset-password/:token', validateResetToken, validatePassword, resetPassword);

// module.exports = router;