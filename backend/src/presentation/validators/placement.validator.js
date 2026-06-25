const { body } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const placementValidation = {
  create: [
    body('company_id').isUUID().withMessage('Valid Company ID is required'),
    body('role_title').notEmpty().withMessage('Role title is required'),
    body('status').optional().isIn(['applied', 'interviewing', 'offered', 'rejected', 'accepted']),
    body('date_applied').optional().isISO8601().withMessage('Date must be valid ISO8601 format'),
    body('notes').optional().isString(),
    validate
  ]
};

module.exports = placementValidation;
