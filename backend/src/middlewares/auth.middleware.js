const jwt = require('jsonwebtoken');
const config = require('../config/env');
const supabase = require('../infrastructure/database/supabase');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const automationToken = req.headers['x-automation-token'] || req.headers['x-webhook-token'];

  // n8n Webhook / Dev token bypass
  if (automationToken === config.automation.webhookSecret || 
      (authHeader === 'Bearer dev_token' && config.env === 'development')) {
    try {
      const { data: users } = await supabase
        .from('users')
        .select('id, role')
        .limit(1);
      
      if (users && users.length > 0) {
        req.user = { id: users[0].id, role: users[0].role };
      } else {
        req.user = { id: '00000000-0000-0000-0000-000000000000', role: 'admin' };
      }
    } catch (e) {
      req.user = { id: '00000000-0000-0000-0000-000000000000', role: 'admin' };
    }
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
