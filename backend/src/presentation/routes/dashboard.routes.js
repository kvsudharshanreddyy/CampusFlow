const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/v1/dashboard/stats:
 *   get:
 *     summary: Get aggregated dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authMiddleware, dashboardController.getStats);

module.exports = router;
