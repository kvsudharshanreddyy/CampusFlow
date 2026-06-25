const supabase = require('./supabase');
const Task = require('../../domain/entities/Task');

class TaskRepository {
  /**
   * Find tasks for a user with optional filtering, sorting, pagination
   */
  async findByUser(userId, { status, search, sortBy = 'created_at', sortDir = 'desc', page = 1, limit = 10 } = {}) {
    let query = supabase
      .from('tasks')
      .select('*, subjects(code, name)', { count: 'exact' })
      .eq('user_id', userId);

    if (status && status !== 'all') query = query.eq('status', status);
    if (search) query = query.ilike('title', `%${search}%`);

    const validSort = ['created_at', 'due_date', 'title', 'status'].includes(sortBy) ? sortBy : 'created_at';
    const ascending = sortDir === 'asc';
    query = query.order(validSort, { ascending });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data || []).map(t => new Task(t)),
      total: count || 0,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async findById(id, userId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, subjects(code, name)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) { if (error.code === 'PGRST116') return null; throw error; }
    return new Task(data);
  }

  async create(taskData) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) throw error;
    return new Task(data);
  }

  async update(id, userId, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) { if (error.code === 'PGRST116') return null; throw error; }
    return new Task(data);
  }

  async delete(id, userId) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  async countByStatus(userId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('status')
      .eq('user_id', userId);

    if (error) throw error;
    const counts = { pending: 0, 'in-progress': 0, completed: 0, total: 0 };
    (data || []).forEach(t => {
      counts[t.status] = (counts[t.status] || 0) + 1;
      counts.total++;
    });
    return counts;
  }

  async getUpcoming(userId, limit = 5) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('tasks')
      .select('*, subjects(code, name)')
      .eq('user_id', userId)
      .neq('status', 'completed')
      .gte('due_date', now)
      .order('due_date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(t => new Task(t));
  }
}

module.exports = new TaskRepository();
