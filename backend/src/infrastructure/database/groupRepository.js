const supabase = require('./supabase');

class GroupRepository {
  async findAll() {
    const { data: groups, error } = await supabase
      .from('study_groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!groups || groups.length === 0) return [];

    const userIds = [...new Set(groups.map(g => g.created_by))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', userIds);

    const profileMap = (profiles || []).reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    return groups.map(g => ({
      ...g,
      profiles: profileMap[g.created_by] || null
    }));
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
    const { data: members, error } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId);

    if (error) throw error;
    if (!members || members.length === 0) return [];

    const userIds = [...new Set(members.map(m => m.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', userIds);

    const profileMap = (profiles || []).reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    return members.map(m => ({
      ...m,
      profiles: profileMap[m.user_id] || null
    }));
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
