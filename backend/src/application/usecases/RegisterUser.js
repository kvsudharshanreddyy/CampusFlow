const bcrypt = require('bcrypt');
const User = require('../../domain/entities/User');

class RegisterUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, plainPassword, role = 'user') {
    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    // 2. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // 3. Create user entity
    const newUser = new User({
      email,
      password: hashedPassword,
      role
    });

    // 4. Save to database
    const savedUser = await this.userRepository.create(newUser);

    return savedUser;
  }
}

module.exports = RegisterUser;
