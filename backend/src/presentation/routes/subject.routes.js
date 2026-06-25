const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');

router.get('/', authMiddleware, subjectController.getAll);

module.exports = router;
