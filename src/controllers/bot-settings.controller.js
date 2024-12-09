const { ValidationError } = require('../utils/errors');
const db = require('../models');
const { validateBotSettings } = require('../utils/validation.utils');

class BotSettingsController {
    async show(req, res) {
        try {
            const bot = await db.Bot.findOrCreate({
                where: { userId: req.user.id }
            });

            if (!bot) {
                throw new ValidationError('Bot not found', 404);
            }

            return res.json(bot);
        } catch (error) {
            return res.status(error.status || 500).json({
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const bot = await db.Bot.findOne({
                where: { userId: req.user.id }
            });

            if (!bot) {
                throw new ValidationError('Bot not found', 404);
            }

            const data = await validateBotSettings(req.body);

            // Update user's IP address
            await req.user.update({
                ipAddress: data.ip_address
            });

            // Update bot settings
            await bot.update(data);

            return res.json(bot);
        } catch (error) {
            return res.status(error.status || 500).json({
                error: error.message
            });
        }
    }
}

module.exports = new BotSettingsController();