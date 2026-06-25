const supabase = require('../database/supabase');
const logger = require('../../utils/logger');

class WhatsAppService {
  /**
   * Mock WhatsApp dispatch service.
   * Logs notification content to console/winston, and appends records to the WhatsAppLogs table.
   */
  async sendMessage(phoneNumber, message) {
    logger.info(`[WhatsApp Service] Sending message to ${phoneNumber}: "${message}"`);

    const logEntry = {
      phone_number: phoneNumber,
      message_content: message,
      direction: 'outbound',
      status: 'sent',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('whatsapp_logs')
        .insert([logEntry])
        .select()
        .single();

      if (error) {
        // If PGRST116 or database connection fails, skip raising errors to keep execution smooth
        logger.warn(`Failed to insert WhatsApp log in Supabase: ${error.message}`);
      }
      return data || logEntry;
    } catch (err) {
      logger.warn(`Failed to log WhatsApp dispatch: ${err.message}`);
      return logEntry;
    }
  }
}

module.exports = new WhatsAppService();
