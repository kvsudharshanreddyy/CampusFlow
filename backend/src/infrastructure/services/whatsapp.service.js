const supabase = require('../database/supabase');
const logger = require('../../utils/logger');

class WhatsAppService {
  /**
   * Mock WhatsApp dispatch service.
   * Logs notification content to console/winston, and appends records to the WhatsAppLogs table.
   */
  async sendMessage(phoneNumber, message) {
    logger.info(`[WhatsApp Service] Sending message to ${phoneNumber}: "${message}"`);
    
    let status = 'sent';
    
    // Add real Twilio execution if env vars are present
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        // Ensure phone number has whatsapp: prefix
        const toPhone = phoneNumber.startsWith('whatsapp:') ? phoneNumber : `whatsapp:${phoneNumber}`;
        const fromPhone = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // default twilio sandbox
        
        const response = await client.messages.create({
          body: message,
          from: fromPhone,
          to: toPhone
        });
        
        logger.info(`[WhatsApp Service] Twilio Message SID: ${response.sid}`);
      } catch (twilioErr) {
        logger.error(`[WhatsApp Service] Twilio Error: ${twilioErr.message}`);
        status = 'failed';
      }
    } else {
      logger.warn(`[WhatsApp Service] Twilio credentials missing. Falling back to log-only mock mode.`);
    }

    const logEntry = {
      phone_number: phoneNumber,
      message_content: message,
      direction: 'outbound',
      status: status,
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
