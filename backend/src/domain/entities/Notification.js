class Notification {
  constructor({ id, user_id, title, message, type, is_read, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.title = title;
    this.message = message;
    this.type = type || 'system';
    this.is_read = is_read || false;
    this.created_at = created_at || new Date();
  }
}

module.exports = Notification;
