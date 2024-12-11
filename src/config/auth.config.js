require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: parseInt(process.env.JWT_EXPIRATION) || 86400, // 24 hours in seconds
  passwordMinLength: 8,
  passwordMaxLength: 100
};