const supabase = require('./supabase');

class PlacementRepository {
  async findByUser(userId) {
    const { data, error } = await supabase
      .from('placement_tracker')
      .select('*, companies(*)')
      .eq('user_id', userId)
      .order('date_applied', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findById(id, userId) {
    const { data, error } = await supabase
      .from('placement_tracker')
      .select('*, companies(*)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async create(applicationData) {
    const { data, error } = await supabase
      .from('placement_tracker')
      .insert([applicationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id, userId, updates) {
    const { data, error } = await supabase
      .from('placement_tracker')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async delete(id, userId) {
    const { error } = await supabase
      .from('placement_tracker')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  async getCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

module.exports = new PlacementRepository();
