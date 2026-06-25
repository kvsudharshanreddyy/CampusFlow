class User {
  constructor({ id, email, password, role, created_at, updated_at }) {
    this.id = id;
    this.email = email;
    this.password = password; // Hashed password
    this.role = role || 'user';
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
  }

  // Domain logic can go here (e.g., verifying if a user is an admin)
  isAdmin() {
    return this.role === 'admin';
  }

  // Method to return user data without sensitive info
  toResponse() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      created_at: this.created_at,
    };
  }
}

module.exports = User;
