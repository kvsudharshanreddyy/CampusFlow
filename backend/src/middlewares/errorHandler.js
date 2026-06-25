const logger = require('../utils/logger');
const config = require('../config/env');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method}] ${req.originalUrl} >> StatusCode:: ${statusCode}, Message:: ${message}`);
  
  if (err.stack && config.env !== 'production') {
    logger.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
