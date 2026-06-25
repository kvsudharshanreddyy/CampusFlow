const { body } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const authValidation = {
  register: [
    body('email').isEmail().withMessage('Provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin')
  ],
  login: [
    body('email').isEmail().withMessage('Provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

module.exports = authValidation;
