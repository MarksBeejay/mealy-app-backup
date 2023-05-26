const Joi = require('joi');

// Validate email for password recovery
const validateEmail = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  next();
};

// Validate password for password reset
const validatePassword = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  next();
};

// Validate reset token
const validateResetToken = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().hex().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: 'Invalid token' });
  }

  next();
};

module.exports = { validateEmail, validatePassword, validateResetToken };