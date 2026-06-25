const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

router.get('/', authMiddleware, notificationController.getAll);
router.patch('/read-all', authMiddleware, notificationController.markAllRead);
router.patch('/:id/read', authMiddleware, notificationController.markRead);

// Twilio incoming WhatsApp webhook (no auth - Twilio signs requests)
router.post('/twilio-webhook', notificationController.handleTwilioWebhook);

module.exports = router;
