const { ValidationError } = require('../utils/errors');
const validator = require('validator');
const config = require('../config/auth.config');

function validateMessage(req, res, next) {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new ValidationError('Message is required', { message: 'Required field' });
  }

  next();
}

function validateAudioUpload(req, res, next) {
  if (!req.file) {
    throw new ValidationError('Audio file is required', { audio: 'Required field' });
  }

  const allowedMimeTypes = ['audio/wav', 'audio/wave', 'audio/x-wav'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw new ValidationError('Invalid audio format. Only WAV files are allowed', {
      audio: 'Invalid format'
    });
  }

  next();
}

function validateRegistration(req, res, next) {
  const { name, email, password, passwordConfirmation } = req.body;
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Name is required';
  }

  if (!email || !validator.isEmail(email)) {
    errors.email = 'Valid email is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < config.passwordMinLength) {
    errors.password = `Password must be at least ${config.passwordMinLength} characters`;
  } else if (password.length > config.passwordMaxLength) {
    errors.password = `Password must be less than ${config.passwordMaxLength} characters`;
  } else if (!validator.isStrongPassword(password)) {
    errors.password = 'Password must contain uppercase, lowercase, number, and symbol';
  }

  if (password !== passwordConfirmation) {
    errors.passwordConfirmation = 'Passwords do not match';
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = {};

  if (!email || !validator.isEmail(email)) {
    errors.email = 'Valid email is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }

  next();
}

module.exports = {
  validateMessage,
  validateAudioUpload,
  validateRegistration,
  validateLogin
};