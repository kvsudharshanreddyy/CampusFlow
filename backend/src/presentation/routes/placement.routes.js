const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placement.controller');
const placementValidation = require('../validators/placement.validator');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');

router.get('/', authMiddleware, placementController.getApplications);
router.get('/companies', authMiddleware, placementController.getCompanies);
router.post('/', authMiddleware, validate(placementValidation.create), placementController.create);
router.patch('/:id', authMiddleware, placementController.update);
router.delete('/:id', authMiddleware, placementController.delete);

module.exports = router;
