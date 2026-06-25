const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automation.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

const webhookAuth = require('../../middlewares/webhookAuth.middleware');

router.get('/', authMiddleware, automationController.getLogs);
router.post('/webhooks', webhookAuth, automationController.logWebhook);

module.exports = router;
