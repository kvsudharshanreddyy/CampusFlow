const supabase = require('./supabase');

class GroupRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('study_groups')
      .select('*, profiles:created_by(first_name, last_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('study_groups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async create(groupData) {
    const { data, error } = await supabase
      .from('study_groups')
      .insert([groupData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMembers(groupId) {
    const { data, error } = await supabase
      .from('group_members')
      .select('*, profiles:user_id(first_name, last_name, avatar_url)')
      .eq('group_id', groupId);

    if (error) throw error;
    return data || [];
  }

  async addMember(groupId, userId, role = 'member') {
    const { data, error } = await supabase
      .from('group_members')
      .insert([{ group_id: groupId, user_id: userId, role }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeMember(groupId, userId) {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  async checkMembership(groupId, userId) {
    const { data, error } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return false;
      throw error;
    }
    return !!data;
  }
}

module.exports = new GroupRepository();
