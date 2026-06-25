const profileRepository = require('../../infrastructure/database/profileRepository');

class ProfileController {
  async getProfile(req, res, next) {
    try {
      const profile = await profileRepository.findById(req.user.id);
      res.status(200).json({ status: 'success', data: profile });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { first_name, last_name, phone_number, avatar_url, bio } = req.body;
      const profile = await profileRepository.upsert(req.user.id, {
        first_name,
        last_name,
        phone_number,
        avatar_url,
        bio
      });
      res.status(200).json({ status: 'success', data: profile });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
