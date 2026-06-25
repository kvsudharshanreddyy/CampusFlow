class Task {
  constructor({ id, user_id, subject_id, title, description, status, due_date, created_at, updated_at }) {
    this.id = id;
    this.user_id = user_id;
    this.subject_id = subject_id || null;
    this.title = title;
    this.description = description || null;
    this.status = status || 'pending';
    this.due_date = due_date || null;
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
  }
}

module.exports = Task;
