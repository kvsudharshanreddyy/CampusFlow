const supabase = require('../database/supabase');
const logger = require('../../utils/logger');

class GoogleCalendarService {
  /**
   * Mock Google Calendar Sync service.
   * Handles importing or synchronizing events with the calendar_events database.
   */
  async syncEvent(userId, eventDetails) {
    const { provider_event_id, title, description, start_time, end_time, event_type = 'general' } = eventDetails;
    
    logger.info(`[Google Calendar Service] Syncing event for user ${userId}: "${title}" (${provider_event_id || 'no-provider-id'})`);

    const eventRecord = {
      user_id: userId,
      provider_event_id: provider_event_id || `gcal_${Date.now()}`,
      title,
      description: description || '',
      start_time: new Date(start_time).toISOString(),
      end_time: new Date(end_time).toISOString(),
      event_type,
      updated_at: new Date().toISOString()
    };

    try {
      let result;
      // If provider_event_id is provided, check if it already exists to update
      if (provider_event_id) {
        const { data: existing } = await supabase
          .from('calendar_events')
          .select('id')
          .eq('provider_event_id', provider_event_id)
          .eq('user_id', userId)
          .single();

        if (existing) {
          const { data, error } = await supabase
            .from('calendar_events')
            .update(eventRecord)
            .eq('id', existing.id)
            .select()
            .single();

          if (error) throw error;
          result = data;
        }
      }

      if (!result) {
        // Insert new event
        const { data, error } = await supabase
          .from('calendar_events')
          .insert([{ ...eventRecord, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return result;
    } catch (err) {
      logger.warn(`Failed to sync calendar event in database: ${err.message}`);
      return eventRecord;
    }
  }
}

module.exports = new GoogleCalendarService();
