const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const {ValidationError} = require('../utils/errors');
const config = require('../config/auth.config');
const db = require('../models');
const {validatePassword} = require('../utils/validation.utils');
const {ulid} = require('ulid');
const AuthService = require('../services/auth.service');
const ResponseHandler = require('../utils/response.utils');

class AuthController {
    async init(req, res) {
        try {
            console.log('Init method called');
            const {business} = req.body;

            // Find user with associated bot
            const user = await AuthService.findUserByUlid(business);
            console.log('User found:', user);

            // If no bot is associated with the user, create one
            if (!user.Bot) {
                console.log('No bot found, creating new bot');
                user.Bot = await db.Bot.create({
                    userId: user.id,
                    bot_name: `${user.name}'s Bot`,
                });
            }

            // Optional IP check
            // await AuthService.validateIpAddress(user, req.ip);
            // console.log('IP address validated');

            // Create new chat
            const chat = await AuthService.createChat(user.id, user.ulid, user.Bot.id);

            // Generate JWT token
            const token = AuthService.generateToken(user.id);

            return ResponseHandler.success(res, {
                token,
                expires_in: config.jwtExpiration,
                chat,
                bot: user.Bot
            });
        } catch (error) {
            console.error('Error in init method:', error);
            return ResponseHandler.error(res, {
                message: error.message,
                type: error.name,
                stack: error.stack
            });
        }
    }

    async register(req, res) {
        try {
            const {name, email, password, passwordConfirmation} = req.body;

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
            const {email, password} = req.body;

            const user = await db.User.findOne({where: {email}});
            if (!user) {
                throw new ValidationError('Invalid credentials');
            }

            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                throw new ValidationError('Invalid credentials');
            }

            const token = jwt.sign({id: user.id}, config.jwtSecret, {
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
        // No need to do anything here, the token is stateless
        return res.json({success: true});
    }

    async refresh(req, res) {
        try {
            const token = jwt.sign({id: req.user.id}, config.jwtSecret, {
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