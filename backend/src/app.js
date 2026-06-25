const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

// Configs & Utils
const config = require('./config/env');
const logger = require('./utils/logger');
const swaggerSpecs = require('./config/swagger');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');

// Routes
const healthRoutes = require('./presentation/routes/health.routes');
const authRoutes = require('./presentation/routes/auth.routes');

const app = express();

// ==========================================
// Middleware Setup
// ==========================================
// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON payload
app.use(express.json());

// Parse URL-encoded payload
app.use(express.urlencoded({ extended: true }));

// Compress responses
app.use(compression());

// HTTP request logger
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

// ==========================================
// Swagger Documentation
// ==========================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// ==========================================
// API Routes
// ==========================================
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);

// Handle unknown routes
app.use((req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// ==========================================
// Global Error Handler
// ==========================================
app.use(errorHandler);

module.exports = app;
