const RegisterUser = require('../../application/usecases/RegisterUser');
const LoginUser = require('../../application/usecases/LoginUser');
const userRepository = require('../../infrastructure/database/userRepository');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, role } = req.body;
      const registerUser = new RegisterUser(userRepository);
      const user = await registerUser.execute(email, password, role);
      
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: user.toResponse()
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const loginUser = new LoginUser(userRepository);
      const result = await loginUser.execute(email, password);
      
      res.status(200).json({
        status: 'success',
        message: 'Logged in successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      // req.user is set by the authMiddleware
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      
      res.status(200).json({
        status: 'success',
        data: user.toResponse()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
