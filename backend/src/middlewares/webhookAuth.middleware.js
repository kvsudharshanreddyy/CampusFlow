const config = require('../config/env');
const logger = require('../utils/logger');

/**
 * Webhook security guard for incoming n8n trigger requests.
 * Verifies the X-Automation-Token header matches the configured secret.
 */
const webhookAuthMiddleware = (req, res, next) => {
  const incomingToken = req.headers['x-automation-token'];
  const expectedToken = config.automation.webhookSecret;

  if (!incomingToken || incomingToken !== expectedToken) {
    logger.warn(`Unauthorized automation webhook access attempt from IP: ${req.ip}`);
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Invalid or missing X-Automation-Token header.'
    });
  }

  next();
};

module.exports = webhookAuthMiddleware;
