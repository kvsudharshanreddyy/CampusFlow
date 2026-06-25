const supabase = require('./supabase');
const Notification = require('../../domain/entities/Notification');

class NotificationRepository {
  async findByUser(userId, { unreadOnly = false, limit = 20 } = {}) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) query = query.eq('is_read', false);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(n => new Notification(n));
  }

  async markRead(id, userId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) { if (error.code === 'PGRST116') return null; throw error; }
    return new Notification(data);
  }

  async markAllRead(userId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return true;
  }

  async create(notifData) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notifData])
      .select()
      .single();

    if (error) throw error;
    return new Notification(data);
  }

  async countUnread(userId) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }
}

module.exports = new NotificationRepository();
