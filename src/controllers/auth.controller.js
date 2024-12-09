const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { ValidationError } = require('../utils/errors');
const config = require('../config/auth.config');
const db = require('../models');
const { validatePassword } = require('../utils/validation.utils');
const { ulid } = require('ulid');

class AuthController {
  async init(req, res) {
    try {
      const { business } = req.body;

      if (!business) {
        throw new ValidationError('Business ID is required');
      }

      const user = await db.User.findOne({
        where: { ulid: business },
        include: [{
          model: db.Bot,
          as: 'Bot'
        }]
      });

      if (!user) {
        throw new ValidationError('User not found', 404);
      }

      // Uncomment to enable IP check
      if (req.ip !== user.ipAddress) {
        throw new ValidationError('Unauthorized IP address', 401);
      }

      const chat = await db.Chat.create({
        userId: user.id,
        botId: user.Bot.id
      });

      const token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: config.jwtExpiration
      });

      return res.json({
        token,
        expires_in: config.jwtExpiration,
        chat,
        bot: user.Bot
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        error: error.message
      });
    }
  }

  async register(req, res) {
    try {
      const { name, email, password, passwordConfirmation } = req.body;

      if (password !== passwordConfirmation) {
        throw new ValidationError('Passwords do not match');
      }

      await validatePassword(password);

      const user = await db.User.create({
        name,
        email,
        password,
        ulid: ulid(),
        ipAddress: req.ip,
        apiKey: uuidv4(),
        apiSecret: uuidv4()
      });

      const userData = user.toJSON();
      delete userData.password;

      return res.status(201).json({
        success: true,
        data: userData
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        throw new ValidationError('Invalid credentials');
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new ValidationError('Invalid credentials');
      }

      const token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: config.jwtExpiration
      });

      const userData = user.toJSON();
      delete userData.password;

      return res.json({
        token: {
          access_token: token,
          token_type: 'Bearer',
          expires_in: config.jwtExpiration
        },
        user: userData
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        error: error.message
      });
    }
  }

  async me(req, res) {
    try {
      const userData = req.user.toJSON();
      delete userData.password;
      return res.json(userData);
    } catch (error) {
      return res.status(error.status || 500).json({
        error: error.message
      });
    }
  }

  async logout(req, res) {
    // In a more complex system, you might want to blacklist the token here
    return res.json({ success: true });
  }

  async refresh(req, res) {
    try {
      const token = jwt.sign({ id: req.user.id }, config.jwtSecret, {
        expiresIn: config.jwtExpiration
      });

      return res.json({
        access_token: token,
        token_type: 'Bearer',
        expires_in: config.jwtExpiration
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();