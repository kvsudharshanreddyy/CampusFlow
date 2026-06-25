const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const groupValidation = require('../validators/group.validator');
const { authMiddleware } = require('../../middlewares/auth.middleware');

router.get('/', authMiddleware, groupController.getAll);
router.post('/', authMiddleware, groupValidation.create, groupController.create);
router.post('/:id/join', authMiddleware, groupController.join);
router.delete('/:id/leave', authMiddleware, groupController.leave);
router.get('/:id/members', authMiddleware, groupController.getMembers);

module.exports = router;
