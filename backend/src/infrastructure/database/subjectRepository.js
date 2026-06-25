const supabase = require('./supabase');

class SubjectRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

module.exports = new SubjectRepository();
