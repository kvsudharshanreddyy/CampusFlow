class CalendarEvent {
  constructor({ id, user_id, provider_event_id, title, description, start_time, end_time, event_type, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.provider_event_id = provider_event_id || null;
    this.title = title;
    this.description = description || null;
    this.start_time = start_time;
    this.end_time = end_time;
    this.event_type = event_type || 'general';
    this.created_at = created_at || new Date();
  }
}

module.exports = CalendarEvent;
