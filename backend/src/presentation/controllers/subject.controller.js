const subjectRepository = require('../../infrastructure/database/subjectRepository');

class SubjectController {
  async getAll(req, res, next) {
    try {
      const subjects = await subjectRepository.findAll();
      res.status(200).json({ status: 'success', data: subjects });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubjectController();
