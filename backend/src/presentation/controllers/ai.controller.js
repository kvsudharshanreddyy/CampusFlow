const aiHistoryRepository = require('../../infrastructure/database/aiHistoryRepository');
const aiService = require('../../infrastructure/ai/aiService');
const promptTemplates = require('../../infrastructure/ai/promptTemplates');
const logger = require('../../utils/logger');
const cacheService = require('../../infrastructure/services/cache.service');

// Robust JSON parser helper
function parseJsonResponse(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  
  try {
    return JSON.parse(cleaned.trim());
  } catch (e) {
    logger.error('Failed to parse AI JSON response. Raw response: ' + text);
    throw new Error('AI returned invalid JSON format. Please try again.');
  }
}

class AIController {
  /**
   * Fetch chat history for current user.
   */
  async getHistory(req, res, next) {
    try {
      const { limit = 20 } = req.query;
      const history = await aiHistoryRepository.findByUser(req.user.id, Number(limit));
      res.status(200).json({ status: 'success', data: history });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Save a chat message manually if required.
   */
  async saveHistory(req, res, next) {
    try {
      const { prompt, response, context } = req.body;
      const record = await aiHistoryRepository.create({
        user_id: req.user.id,
        prompt,
        response,
        context: context || null,
      });
      res.status(201).json({ status: 'success', data: record });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 1. Interactive AI Chat Assistant (Streaming SSE)
   */
  async chat(req, res, next) {
    try {
      const { message, subject = 'General Study', history = [], context = '' } = req.body;
      const userId = req.user.id;

      // Construct system prompt
      const sysPrompt = promptTemplates.studyBuddy(subject, context);
      
      // Build conversation messages array
      const messages = [
        { role: 'system', content: sysPrompt.system },
        ...history.slice(-10), // Take last 10 exchanges to keep context clean
        { role: 'user', content: message }
      ];

      // Stream the response to client
      const fullReply = await aiService.generateStream(messages, res);

      // Async write to database history logs when streaming ends successfully
      if (fullReply && fullReply.trim()) {
        try {
          await aiHistoryRepository.create({
            user_id: userId,
            prompt: message,
            response: fullReply,
            context: { subject, contextCount: context.length }
          });
        } catch (dbErr) {
          logger.error(`Failed to log streamed AI chat history to database: ${dbErr.message}`);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * 2. Flashcard Generator (JSON payload response)
   */
  async generateFlashcards(req, res, next) {
    try {
      const { text, count = 5 } = req.body;
      if (!text) {
        return res.status(400).json({ status: 'error', message: 'Text input is required' });
      }

      const templates = promptTemplates.flashcardGenerator();
      const messages = [
        { role: 'system', content: templates.system },
        { role: 'user', content: templates.user(text, count) }
      ];

      const rawResponse = await aiService.generateCompletion(messages, { jsonMode: true });
      const flashcards = parseJsonResponse(rawResponse);

      res.status(200).json({
        status: 'success',
        data: flashcards
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 3. MCQ Generator (JSON payload response)
   */
  async generateMCQs(req, res, next) {
    try {
      const { text, count = 3 } = req.body;
      if (!text) {
        return res.status(400).json({ status: 'error', message: 'Text input is required' });
      }

      const templates = promptTemplates.mcqGenerator();
      const messages = [
        { role: 'system', content: templates.system },
        { role: 'user', content: templates.user(text, count) }
      ];

      const rawResponse = await aiService.generateCompletion(messages, { jsonMode: true });
      const mcqs = parseJsonResponse(rawResponse);

      res.status(200).json({
        status: 'success',
        data: mcqs
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 4. Notice Summarizer
   */
  async summarizeNotice(req, res, next) {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ status: 'error', message: 'Notice text is required' });
      }

      const templates = promptTemplates.noticeSummarizer();
      const messages = [
        { role: 'system', content: templates.system },
        { role: 'user', content: templates.user(text) }
      ];

      const summary = await aiService.generateCompletion(messages);
      res.status(200).json({
        status: 'success',
        data: { summary }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 5. Study Planner
   */
  async generateStudyPlan(req, res, next) {
    try {
      const { subjects, goals, hoursPerDay = 4 } = req.body;
      if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Subjects array is required' });
      }

      const templates = promptTemplates.studyPlanner();
      const messages = [
        { role: 'system', content: templates.system },
        { role: 'user', content: templates.user(subjects, goals || 'General Revision', hoursPerDay) }
      ];

      const plan = await aiService.generateCompletion(messages);
      res.status(200).json({
        status: 'success',
        data: { plan }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 6. Deadline Prioritizer
   */
  async prioritizeDeadlines(req, res, next) {
    try {
      const { tasks } = req.body;
      if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ status: 'error', message: 'Tasks array is required' });
      }

      const templates = promptTemplates.deadlinePrioritizer();
      const messages = [
        { role: 'system', content: templates.system },
        { role: 'user', content: templates.user(tasks) }
      ];

      const priorityReport = await aiService.generateCompletion(messages);
      res.status(200).json({
        status: 'success',
        data: { priorityReport }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 7. Attendance Predictor
   */
  async predictAttendance(req, res, next) {
    try {
      const { subjectCode, attended, total, remaining = 15 } = req.body;
      if (!subjectCode || attended === undefined || total === undefined) {
        return res.status(400).json({ status: 'error', message: 'subjectCode, attended, and total are required' });
      }

      const templates = promptTemplates.attendancePredictor();
      const messages = [
        { role: 'system', content: templates.system },
        { role: 'user', content: templates.user(subjectCode, Number(attended), Number(total), Number(remaining)) }
      ];

      const prediction = await aiService.generateCompletion(messages);
      res.status(200).json({
        status: 'success',
        data: { prediction }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 8. Interview Question Generator
   */
  async interviewQuestions(req, res, next) {
    try {
      const { company, role, industry } = req.body;
      if (!company || !role) {
        return res.status(400).json({ status: 'error', message: 'Company and Role are required' });
      }

      const templates = promptTemplates.interviewQuestionGenerator();
      const messages = [
        { role: 'system', content: templates.system },
        { role: 'user', content: templates.user(company, role, industry) }
      ];

      const questions = await aiService.generateCompletion(messages);
      res.status(200).json({
        status: 'success',
        data: { questions }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 9. Resume Suggestions
   */
  async resumeSuggestions(req, res, next) {
    try {
      const { resumeText, targetRole } = req.body;
      if (!resumeText || !targetRole) {
        return res.status(400).json({ status: 'error', message: 'resumeText and targetRole are required' });
      }

      const templates = promptTemplates.resumeSuggestions();
      const messages = [
        { role: 'system', content: templates.system },
        { role: 'user', content: templates.user(resumeText, targetRole) }
      ];

      const suggestions = await aiService.generateCompletion(messages);
      res.status(200).json({
        status: 'success',
        data: { suggestions }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 10. Daily AI Tips
   */
  async getDailyTip(req, res, next) {
    try {
      const cacheKey = 'daily_tip';
      const cachedTip = cacheService.get(cacheKey);
      if (cachedTip) {
        return res.status(200).json({
          status: 'success',
          data: { tip: cachedTip }
        });
      }

      const templates = promptTemplates.dailyTip();
      const messages = [
        { role: 'system', content: templates.system },
        { role: 'user', content: templates.user() }
      ];

      const tip = await aiService.generateCompletion(messages);
      
      // Cache tip for 1 hour (3600000 ms)
      cacheService.set(cacheKey, tip, 60 * 60 * 1000);

      res.status(200).json({
        status: 'success',
        data: { tip }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
