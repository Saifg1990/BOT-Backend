const { ValidationError } = require('../utils/errors');
const db = require('../models');
const { validateBotSettings } = require('../utils/validation.utils');

class BotSettingsController {
    async show(req, res) {
        try {
            const bot = await db.Bot.findOrCreate({
                where: {userId: req.user?.id},
                raw: true // Prevent recursion by returning plain object
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
                where: {userId: req.user?.id},
                raw: true // Prevent recursion by returning plain object
            });

            if (!bot) {
                throw new ValidationError('Bot not found', 404);
            }

            const data = await validateBotSettings(req.body);

            // Update user's IP address only if it exists in the data
        if (data.ip_address) {
            await req.user.update({
                ipAddress: data.ip_address
            });
        }

            await db.Bot.update(data, {where: {id: bot.id}});
            const updatedBot = await db.Bot.findOne({where: {id: bot.id}, raw: true});
            return res.json(updatedBot);
        } catch (error) {
            return res.status(error.status || 500).json({
                error: error.message,
                details: error.fields || error.stack
            });
        }
    }
}

module.exports = new BotSettingsController();