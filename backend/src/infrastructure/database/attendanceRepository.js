const supabase = require('./supabase');

class AttendanceRepository {
  async findByUser(userId) {
    const { data, error } = await supabase
      .from('attendance')
      .select('*, subjects(code, name)')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Returns per-subject attendance summary
   */
  async getSummaryByUser(userId) {
    const { data, error } = await supabase
      .from('attendance')
      .select('subject_id, status, subjects(code, name)')
      .eq('user_id', userId);

    if (error) throw error;

    const subjectMap = {};
    (data || []).forEach(record => {
      const key = record.subject_id;
      if (!subjectMap[key]) {
        subjectMap[key] = {
          subject_id: key,
          code: record.subjects?.code || key,
          name: record.subjects?.name || 'Unknown',
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
        };
      }
      subjectMap[key].total++;
      if (record.status === 'present') subjectMap[key].present++;
      else if (record.status === 'absent') subjectMap[key].absent++;
      else if (record.status === 'late') subjectMap[key].late++;
    });

    return Object.values(subjectMap).map(s => ({
      ...s,
      percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
    }));
  }

  async create(attendanceData) {
    const { data, error } = await supabase
      .from('attendance')
      .insert([attendanceData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new AttendanceRepository();
