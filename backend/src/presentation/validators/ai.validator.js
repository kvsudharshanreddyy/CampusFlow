const { body } = require('express-validator');

const aiValidation = {
  chat: [
    body('message').notEmpty().withMessage('Chat message is required'),
    body('subject').optional().isString(),
    body('history').optional().isArray(),
    body('context').optional().isString()
  ],
  generateFlashcards: [
    body('text').notEmpty().withMessage('Text content is required'),
    body('count').optional().isInt({ min: 1, max: 20 }).withMessage('Count must be between 1 and 20')
  ],
  generateMCQs: [
    body('text').notEmpty().withMessage('Text content is required'),
    body('count').optional().isInt({ min: 1, max: 10 }).withMessage('Count must be between 1 and 10')
  ],
  summarizeNotice: [
    body('text').notEmpty().withMessage('Notice text content is required')
  ],
  generateStudyPlan: [
    body('subjects').isArray({ min: 1 }).withMessage('Subjects array must contain at least one subject'),
    body('goals').optional().isString(),
    body('hoursPerDay').optional().isInt({ min: 1, max: 16 }).withMessage('Hours per day must be between 1 and 16')
  ],
  prioritizeDeadlines: [
    body('tasks').isArray().withMessage('Tasks must be an array of task items')
  ],
  predictAttendance: [
    body('subjectCode').notEmpty().withMessage('Subject code is required'),
    body('attended').isInt({ min: 0 }).withMessage('Attended count must be a positive integer'),
    body('total').isInt({ min: 0 }).withMessage('Total conducted count must be a positive integer'),
    body('remaining').optional().isInt({ min: 0 })
  ],
  interviewQuestions: [
    body('company').notEmpty().withMessage('Company name is required'),
    body('role').notEmpty().withMessage('Role title is required'),
    body('industry').optional().isString()
  ],
  resumeSuggestions: [
    body('resumeText').notEmpty().withMessage('Resume text content is required'),
    body('targetRole').notEmpty().withMessage('Target role is required')
  ]
};

module.exports = aiValidation;
