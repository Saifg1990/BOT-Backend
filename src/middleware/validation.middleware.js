const { ValidationError } = require('../utils/errors');

function validateMessage(req, res, next) {
  const { user_input } = req.body;
  
  if (!user_input || typeof user_input !== 'string' || !user_input.trim()) {
    throw new ValidationError('Message is required', { message: 'Required field' });
  }

  next();
}

function validateAudioUpload(req, res, next) {
  if (!req.file) {
    throw new ValidationError('Audio file is required', { record_file: 'Required field' });
  }

  const allowedMimeTypes = ['audio/wav', 'audio/wave', 'audio/x-wav'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw new ValidationError('Invalid audio format. Only WAV files are allowed', {
      audio: 'Invalid format'
    });
  }

  next();
}

module.exports = {
  validateMessage,
  validateAudioUpload
};