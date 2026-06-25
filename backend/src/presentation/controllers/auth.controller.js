const RegisterUser = require('../../application/usecases/RegisterUser');
const LoginUser = require('../../application/usecases/LoginUser');
const userRepository = require('../../infrastructure/database/userRepository');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, name, phone, role } = req.body;
      const registerUser = new RegisterUser(userRepository);
      const user = await registerUser.execute(email, password, name, phone, role);
      
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

  async googleAuthInitiate(req, res, next) {
    try {
      const { google } = require('googleapis');
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/auth/google/callback`
      );

      const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ];

      // We pass the user id in the state param to link the token back
      // Since it's a demo, we can just grab a userId from query or body.
      // But this is a GET redirect, so we need it in query string.
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ status: 'error', message: 'userId query parameter is required to link Google Calendar' });
      }

      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent', // Force to get refresh token
        state: userId
      });

      res.redirect(url);
    } catch (error) {
      next(error);
    }
  }

  async googleAuthCallback(req, res, next) {
    try {
      const { code, state: userId } = req.query;
      
      if (!code) {
        return res.status(400).json({ status: 'error', message: 'Authorization code missing' });
      }

      const { google } = require('googleapis');
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/auth/google/callback`
      );

      const { tokens } = await oauth2Client.getToken(code);
      
      if (!tokens.access_token) {
        return res.status(400).json({ status: 'error', message: 'Failed to retrieve access token' });
      }

      // Save tokens to database using the existing Supabase client
      const supabase = require('../../infrastructure/database/supabase');
      
      const updateData = {
        google_access_token: tokens.access_token
      };
      
      if (tokens.refresh_token) {
        updateData.google_refresh_token = tokens.refresh_token;
      }

      // Warning: this assumes we can update public.users directly via supabase service role
      // In Supabase, usually you update profiles or metadata, but since we altered the schema...
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Redirect back to frontend dashboard
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?gcal_sync=success`);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
