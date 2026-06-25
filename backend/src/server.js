const app = require('./app');
const config = require('./config/env');
const logger = require('./utils/logger');

const startServer = () => {
  try {
    const port = config.port;
    const server = app.listen(port, () => {
      logger.info(`Server is running on port ${port} in ${config.env} mode`);
      logger.info(`Swagger docs available at http://localhost:${port}/api-docs`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! Shutting down...');
      logger.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('UNCAUGHT EXCEPTION! Shutting down...');
      logger.error(err.name, err.message);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
