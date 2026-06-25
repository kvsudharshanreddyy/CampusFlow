const automationLogRepository = require('../../infrastructure/database/automationLogRepository');
const logger = require('../../utils/logger');
const whatsAppService = require('../../infrastructure/services/whatsapp.service');

class AutomationController {
  async getLogs(req, res, next) {
    try {
      const { limit = 20, status } = req.query;
      const logs = await automationLogRepository.findAll({ limit: Number(limit), status });
      const stats = await automationLogRepository.getStats();
      res.status(200).json({ status: 'success', data: logs, meta: { stats } });
    } catch (error) {
      next(error);
    }
  }

  async logWebhook(req, res, next) {
    try {
      const { workflow_name, status, message } = req.body;
      if (!workflow_name || !status) {
        return res.status(400).json({ status: 'error', message: 'workflow_name and status are required' });
      }

      let log;
      try {
        log = await automationLogRepository.create({
          workflow_name,
          status,
          message
        });
      } catch (dbErr) {
        logger.warn(`Failed to save automation log to database: ${dbErr.message}. Returning mock response.`);
        log = {
          id: `mock_${Date.now()}`,
          workflow_name,
          status,
          message,
          created_at: new Date().toISOString()
        };
      }

      res.status(201).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }

  async dispatchWhatsApp(req, res, next) {
    try {
      const { phone_number, message } = req.body;
      if (!phone_number || !message) {
        return res.status(400).json({ status: 'error', message: 'phone_number and message are required' });
      }

      const log = await whatsAppService.sendMessage(phone_number, message);
      res.status(200).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AutomationController();
