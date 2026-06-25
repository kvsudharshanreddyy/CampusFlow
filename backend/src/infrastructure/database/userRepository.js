const supabase = require('./supabase');
const User = require('../../domain/entities/User');

class UserRepository {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "The result contains 0 rows" which is expected if not found
      throw error;
    }

    if (!data) return null;
    return new User(data);
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return new User(data);
  }

  async create(userEntity) {
    const { id, email, password, role } = userEntity;
    
    const payload = { email, password, role };
    if (id) {
      payload.id = id;
    }

    const { data, error } = await supabase
      .from('users')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new User(data);
  }
}

module.exports = new UserRepository();
