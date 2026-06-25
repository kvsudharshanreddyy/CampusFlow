const logger = require('../utils/logger');

const rateLimitStore = new Map();

// Periodic cleanup of expired clients every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref(); // .unref() ensures the timer doesn't block process exit

/**
 * Custom in-memory rate limiting middleware
 * @param {Object} options Configuration options
 * @param {number} options.windowMs Time window in milliseconds (default: 1 min)
 * @param {number} options.max Maximum requests per window (default: 100)
 * @param {string} options.message Error message response (default: 'Too many requests, please try again later.')
 */
const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60 * 1000;
  const max = options.max || 100;
  const message = options.message || 'Too many requests, please try again later.';

  return (req, res, next) => {
    // Determine client IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    const now = Date.now();

    let client = rateLimitStore.get(ip);

    if (!client) {
      client = {
        resetTime: now + windowMs,
        count: 0,
      };
      rateLimitStore.set(ip, client);
    }

    // Reset if window has elapsed
    if (now > client.resetTime) {
      client.resetTime = now + windowMs;
      client.count = 0;
    }

    client.count++;

    if (client.count > max) {
      logger.warn(`Rate limit exceeded for IP: ${ip} on route: ${req.originalUrl} (${client.count}/${max})`);
      return res.status(429).json({
        status: 'error',
        statusCode: 429,
        message,
      });
    }

    next();
  };
};

module.exports = rateLimiter;
