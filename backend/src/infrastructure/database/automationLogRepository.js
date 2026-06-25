const supabase = require('./supabase');

class AutomationLogRepository {
  async findAll({ limit = 20, status } = {}) {
    let query = supabase
      .from('automation_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getStats() {
    const { data, error } = await supabase
      .from('automation_logs')
      .select('status');

    if (error) throw error;
    const stats = { success: 0, failed: 0, pending: 0, total: 0 };
    (data || []).forEach(r => {
      stats[r.status] = (stats[r.status] || 0) + 1;
      stats.total++;
    });
    return stats;
  }

  async create(logData) {
    const { data, error } = await supabase
      .from('automation_logs')
      .insert([
        {
          workflow_name: logData.workflow_name,
          status: logData.status,
          message: logData.message || null,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new AutomationLogRepository();
