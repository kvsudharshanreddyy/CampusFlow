const attendanceRepository = require('../../infrastructure/database/attendanceRepository');

class AttendanceController {
  async getAll(req, res, next) {
    try {
      const records = await attendanceRepository.findByUser(req.user.id);
      res.status(200).json({ status: 'success', data: records });
    } catch (error) {
      next(error);
    }
  }

  async getSummary(req, res, next) {
    try {
      const summary = await attendanceRepository.getSummaryByUser(req.user.id);
      res.status(200).json({ status: 'success', data: summary });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { subject_id, date, status } = req.body;
      const record = await attendanceRepository.create({
        user_id: req.user.id,
        subject_id,
        date,
        status,
      });
      res.status(201).json({ status: 'success', message: 'Attendance recorded', data: record });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AttendanceController();
