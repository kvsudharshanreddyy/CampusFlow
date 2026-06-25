const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

router.get('/', authMiddleware, attendanceController.getAll);
router.get('/summary', authMiddleware, attendanceController.getSummary);
router.post('/', authMiddleware, attendanceController.create);

module.exports = router;
