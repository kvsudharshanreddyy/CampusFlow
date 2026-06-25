const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const aiValidation = require('../validators/ai.validator');
const validate = require('../../middlewares/validate.middleware');
const { authMiddleware } = require('../../middlewares/auth.middleware');

// History Management
router.get('/history', authMiddleware, aiController.getHistory);
router.post('/history', authMiddleware, aiController.saveHistory);

// Core AI features with wrapped validators
router.post('/chat', authMiddleware, validate(aiValidation.chat), aiController.chat);
router.post('/generate-flashcards', authMiddleware, validate(aiValidation.generateFlashcards), aiController.generateFlashcards);
router.post('/generate-mcqs', authMiddleware, validate(aiValidation.generateMCQs), aiController.generateMCQs);
router.post('/summarize-notice', authMiddleware, validate(aiValidation.summarizeNotice), aiController.summarizeNotice);
router.post('/generate-study-plan', authMiddleware, validate(aiValidation.generateStudyPlan), aiController.generateStudyPlan);
router.post('/prioritize-deadlines', authMiddleware, validate(aiValidation.prioritizeDeadlines), aiController.prioritizeDeadlines);
router.post('/predict-attendance', authMiddleware, validate(aiValidation.predictAttendance), aiController.predictAttendance);
router.post('/interview-questions', authMiddleware, validate(aiValidation.interviewQuestions), aiController.interviewQuestions);
router.post('/resume-suggestions', authMiddleware, validate(aiValidation.resumeSuggestions), aiController.resumeSuggestions);
router.get('/daily-tip', authMiddleware, aiController.getDailyTip);

module.exports = router;
