const supabase = require('./supabase');

class AIHistoryRepository {
  async findByUser(userId, limit = 20) {
    const { data, error } = await supabase
      .from('ai_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async create(historyData) {
    const { data, error } = await supabase
      .from('ai_history')
      .insert([historyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new AIHistoryRepository();
