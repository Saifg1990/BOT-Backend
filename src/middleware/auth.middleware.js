const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/auth.config');
const { APIError } = require('../utils/errors');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new APIError('No token provided', 401);
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new APIError('Invalid token format', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new APIError('User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new APIError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new APIError('Token expired', 401));
    } else {
      next(error);
    }
  }
}

module.exports = {
  authenticate
};