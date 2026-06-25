const { body } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const groupValidation = {
  create: [
    body('name').notEmpty().withMessage('Study Group name is required').isLength({ max: 150 }),
    body('description').optional().isString(),
    validate
  ]
};

module.exports = groupValidation;
