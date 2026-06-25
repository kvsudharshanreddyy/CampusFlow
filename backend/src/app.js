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
const rateLimiter = require('./middlewares/rateLimiter.middleware');

// Routes
const healthRoutes = require('./presentation/routes/health.routes');
const authRoutes = require('./presentation/routes/auth.routes');
const dashboardRoutes = require('./presentation/routes/dashboard.routes');
const taskRoutes = require('./presentation/routes/task.routes');
const calendarEventRoutes = require('./presentation/routes/calendarEvent.routes');
const notificationRoutes = require('./presentation/routes/notification.routes');
const attendanceRoutes = require('./presentation/routes/attendance.routes');
const automationRoutes = require('./presentation/routes/automation.routes');
const aiRoutes = require('./presentation/routes/ai.routes');
const subjectRoutes = require('./presentation/routes/subject.routes');
const placementRoutes = require('./presentation/routes/placement.routes');
const groupRoutes = require('./presentation/routes/group.routes');
const profileRoutes = require('./presentation/routes/profile.routes');

const app = express();

// ==========================================
// Middleware Setup
// ==========================================
// Security headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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

// Global rate limiting fallback for API endpoints
app.use(API_PREFIX, rateLimiter({ windowMs: 15 * 60 * 1000, max: 300 }));

app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/auth`, rateLimiter({ windowMs: 60 * 1000, max: 15, message: 'Too many authentication attempts, please wait a minute.' }), authRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/tasks`, taskRoutes);
app.use(`${API_PREFIX}/calendar-events`, calendarEventRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/attendance`, attendanceRoutes);
app.use(`${API_PREFIX}/automation-logs`, rateLimiter({ windowMs: 60 * 1000, max: 60, message: 'Too many webhook triggers, please wait a minute.' }), automationRoutes);
app.use(`${API_PREFIX}/ai`, rateLimiter({ windowMs: 60 * 1000, max: 100, message: 'Too many AI inquiries, please wait a minute.' }), aiRoutes);
app.use(`${API_PREFIX}/subjects`, subjectRoutes);
app.use(`${API_PREFIX}/placement`, placementRoutes);
app.use(`${API_PREFIX}/groups`, groupRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);

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
