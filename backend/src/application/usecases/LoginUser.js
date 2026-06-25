const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/env');

class LoginUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, plainPassword) {
    // 1. Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      user: user.toResponse(),
      token
    };
  }
}

module.exports = LoginUser;
