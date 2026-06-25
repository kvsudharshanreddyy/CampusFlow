const supabase = require('../database/supabase');
const logger = require('../../utils/logger');

class GoogleCalendarService {
  /**
   * Mock Google Calendar Sync service.
   * Handles importing or synchronizing events with the calendar_events database.
   */
  async syncEvent(userId, eventDetails) {
    const { provider_event_id, title, description, start_time, end_time, event_type = 'general' } = eventDetails;
    
    logger.info(`[Google Calendar Service] Syncing event for user ${userId}: "${title}"`);

    let user = null;
    try {
      const result = await supabase
        .from('users')
        .select('google_access_token, google_refresh_token')
        .eq('id', userId)
        .single();
      user = result.data;
    } catch (e) {
      // Ignore schema errors (like missing columns)
    }

    if (!user) {
      user = {};
    }

    if (!user.google_access_token) {
      logger.warn(`User ${userId} does not have Google Calendar connected. Skipping real sync.`);
      // Fallback to storing locally only if disconnected
    }

    let actualProviderId = provider_event_id;

    if (user.google_access_token) {
      try {
        const { google } = require('googleapis');
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );

        oauth2Client.setCredentials({
          access_token: user.google_access_token,
          refresh_token: user.google_refresh_token
        });

        // Setup automatic token refresh if we have a refresh token
        oauth2Client.on('tokens', async (tokens) => {
          if (tokens.access_token) {
            const updates = { google_access_token: tokens.access_token };
            if (tokens.refresh_token) updates.google_refresh_token = tokens.refresh_token;
            await supabase.from('users').update(updates).eq('id', userId);
          }
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const eventBody = {
          summary: title,
          description: description || 'Created by CampusFlow',
          start: { dateTime: new Date(start_time).toISOString() },
          end: { dateTime: new Date(end_time).toISOString() }
        };

        if (provider_event_id && !provider_event_id.startsWith('gcal_')) {
          // Update existing event on Google Calendar
          const res = await calendar.events.update({
            calendarId: 'primary',
            eventId: provider_event_id,
            requestBody: eventBody
          });
          actualProviderId = res.data.id;
        } else {
          // Insert new event
          const res = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: eventBody
          });
          actualProviderId = res.data.id;
        }
      } catch (gcalError) {
        logger.error(`Google Calendar API Error: ${gcalError.message}`);
        // Decide whether to throw or continue to save locally. We'll continue so app doesn't break,
        // but log heavily.
      }
    }

    const eventRecord = {
      user_id: userId,
      provider_event_id: actualProviderId || `gcal_${Date.now()}`,
      title,
      description: description || '',
      start_time: new Date(start_time).toISOString(),
      end_time: new Date(end_time).toISOString(),
      event_type
    };

    try {
      let result;
      // If provider_event_id is provided, check if it already exists to update
      if (actualProviderId && !actualProviderId.startsWith('gcal_')) {
        const { data: existing } = await supabase
          .from('calendar_events')
          .select('id')
          .eq('provider_event_id', actualProviderId)
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
