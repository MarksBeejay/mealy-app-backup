const Joi = require('joi');


//validate body for account creation
const validateUser = (req, res, next) => {
  const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      username: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    });
  
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    next();
}

//validate account confirmation body
const validateConfirmationToken = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    confirmationToken: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  next();
}


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


const validateItemCreation = (req, res, next) => {
  const schema = Joi.object({
      name: Joi.string().required(),
      category: Joi.string().required(),
      price: Joi.number().required(),
      dietaryPreferences: Joi.array(),
    });
  
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    next();
}




const validateItemFilter = (req, res, next) => {

  const schema = Joi.object({
    category: Joi.string().lowercase(),
    price: Joi.number().min(0), //.pattern(/^\d+(\.\d{1,2})?-\d+(\.\d{1,2})?$/)
    dietaryPreferences: Joi.string(), //Joi.array().items(Joi.string().lowercase()
  });
  const { error } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};


const validateItemCategory = (req, res, next) => {
  const schema = Joi.object({
    category: Joi.string().required().trim(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = { validateEmail, validatePassword, validateResetToken, validateUser, 
  validateConfirmationToken, validateItemCreation, validateItemCategory, validateItemFilter };