const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateRegistration, validateLogin } = require('../middleware/validation.middleware');

router.post('/init', authenticate, AuthController.init);
router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.get('/me', authenticate, AuthController.me);
router.post('/logout', authenticate, AuthController.logout);
router.post('/refresh', authenticate, AuthController.refresh);

module.exports = router;