const express = require('express');
const router = express.Router();
const multer = require('multer');
const { handleTextChat, handleAudioChat } = require('../controllers/ai.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateMessage, validateAudioUpload } = require('../middleware/validation.middleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/chat/text', [validateMessage,authenticate], handleTextChat);
router.post('/chat/audio', upload.single('audio'), [validateAudioUpload,authenticate], handleAudioChat);

module.exports = router;