const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarEvent.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { body } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const eventValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('start_time').isISO8601().withMessage('start_time must be a valid ISO date'),
  body('end_time').isISO8601().withMessage('end_time must be a valid ISO date'),
];

/** @swagger
 * /api/v1/calendar-events:
 *   get:
 *     summary: Get calendar events with optional date range
 *     tags: [Calendar]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authMiddleware, calendarController.getAll);
router.get('/today', authMiddleware, calendarController.getToday);
router.get('/upcoming', authMiddleware, calendarController.getUpcoming);
router.post('/', authMiddleware, validate(eventValidation), calendarController.create);
router.delete('/:id', authMiddleware, calendarController.delete);

module.exports = router;
