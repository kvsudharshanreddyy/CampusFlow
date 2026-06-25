const supabase = require('./supabase');

class ProfileRepository {
  async findById(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Handle case where profile row doesn't exist yet by returning defaults
        return { id: userId, first_name: '', last_name: '', phone_number: '', bio: '', avatar_url: '' };
      }
      throw error;
    }
    return data;
  }

  async upsert(userId, profileData) {
    const record = {
      id: userId,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      phone_number: profileData.phone_number,
      avatar_url: profileData.avatar_url,
      bio: profileData.bio,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert([record])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new ProfileRepository();
