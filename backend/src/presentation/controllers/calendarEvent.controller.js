const calendarEventRepository = require('../../infrastructure/database/calendarEventRepository');

class CalendarEventController {
  async getAll(req, res, next) {
    try {
      const { from, to } = req.query;
      const events = await calendarEventRepository.findByUser(req.user.id, { from, to });
      res.status(200).json({ status: 'success', data: events });
    } catch (error) {
      next(error);
    }
  }

  async getToday(req, res, next) {
    try {
      const events = await calendarEventRepository.getTodayEvents(req.user.id);
      res.status(200).json({ status: 'success', data: events });
    } catch (error) {
      next(error);
    }
  }

  async getUpcoming(req, res, next) {
    try {
      const days = Number(req.query.days) || 7;
      const events = await calendarEventRepository.getUpcoming(req.user.id, days);
      res.status(200).json({ status: 'success', data: events });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { title, description, start_time, end_time, event_type } = req.body;
      const event = await calendarEventRepository.create({
        user_id: req.user.id,
        title,
        description,
        start_time,
        end_time,
        event_type: event_type || 'general',
      });
      res.status(201).json({ status: 'success', message: 'Event created', data: event });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await calendarEventRepository.delete(req.params.id, req.user.id);
      res.status(200).json({ status: 'success', message: 'Event deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CalendarEventController();
