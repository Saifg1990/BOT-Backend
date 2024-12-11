const express = require('express');
const router = express.Router();
const BotSettingsController = require('../controllers/bot-settings.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, BotSettingsController.show);
router.put('/', authenticate, BotSettingsController.update);

module.exports = router;