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
    
    // We omit created_at/updated_at to let DB handle it, or we can pass them
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id, // Can be omitted if Supabase generates UUID, but assuming we might pass it
          email,
          password,
          role,
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new User(data);
  }
}

module.exports = new UserRepository();
