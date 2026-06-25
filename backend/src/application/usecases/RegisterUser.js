const bcrypt = require('bcrypt');
const User = require('../../domain/entities/User');

class RegisterUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, plainPassword, name, phone, role = 'user') {
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

    // 5. Create profile if we have name or phone
    if (name || phone) {
      const profileRepository = require('../../infrastructure/database/profileRepository');
      
      // Split name into first and last
      const nameParts = (name || '').trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Normalize phone number (ensure it starts with + if provided)
      let phone_number = (phone || '').trim();
      if (phone_number && !phone_number.startsWith('+')) {
        // Simple normalization for Indian/US formats if they missed the +
        if (phone_number.length >= 10 && /^\d+$/.test(phone_number)) {
            // Assume Indian +91 if length is 10, else just add +
            phone_number = phone_number.length === 10 ? `+91${phone_number}` : `+${phone_number}`;
        }
      }

      try {
        await profileRepository.upsert(savedUser.id, {
          first_name,
          last_name,
          phone_number
        });
      } catch (err) {
        console.error('Error creating profile for user:', err);
      }
    }

    return savedUser;
  }
}

module.exports = RegisterUser;
