const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/auth.config');
const { ValidationError } = require('../utils/errors');

class AuthService {
    async findUserByUlid(ulid) {
        const user = await User.findOne({
            where: { ulid },
            include: [{
                model: User.sequelize.models.Bot,
                as: 'Bot'
            }]
        });

        if (!user) {
            throw new ValidationError('User not found', 404);
        }

        return user;
    }

    async createChat(userId,userUlId, botId) {
        const { Chat } = require('../models');
        return await Chat.create({
            userId,
            userUlId,
            botId
        });
    }

    generateToken(userId) {
        return jwt.sign({ id: userId }, config.jwtSecret, {
            expiresIn: config.jwtExpiration
        });
    }

    async validateIpAddress(user, requestIp) {
        if (user.ipAddress && requestIp !== user.ipAddress) {
            throw new ValidationError('Unauthorized IP address', 401);
        }
    }
}

module.exports = new AuthService();