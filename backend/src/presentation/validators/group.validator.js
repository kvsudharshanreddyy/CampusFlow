const { body } = require('express-validator');

const groupValidation = {
  create: [
    body('name').notEmpty().withMessage('Study Group name is required').isLength({ max: 150 }),
    body('description').optional().isString()
  ]
};

module.exports = groupValidation;
