const supabase = require('./supabase');
const CalendarEvent = require('../../domain/entities/CalendarEvent');

class CalendarEventRepository {
  async findByUser(userId, { from, to } = {}) {
    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (from) query = query.gte('start_time', from);
    if (to) query = query.lte('start_time', to);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(e => new CalendarEvent(e));
  }

  async getTodayEvents(userId) {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
    return this.findByUser(userId, { from: start, to: end });
  }

  async getUpcoming(userId, days = 7) {
    const from = new Date().toISOString();
    const to = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    return this.findByUser(userId, { from, to });
  }

  async create(eventData) {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    return new CalendarEvent(data);
  }

  async delete(id, userId) {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}

module.exports = new CalendarEventRepository();
