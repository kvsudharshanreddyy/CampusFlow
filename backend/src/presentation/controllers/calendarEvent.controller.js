const calendarEventRepository = require('../../infrastructure/database/calendarEventRepository');
const supabase = require('../../infrastructure/database/supabase');
const { triggerN8NWebhook } = require('../../utils/n8n');

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

      if (event && (event_type === 'class' || title.toLowerCase().includes('study session'))) {
        try {
          let groupName = 'Campus Study Group';
          const match = description ? description.match(/group ID:\s*([a-f0-9-]+)/i) : null;
          const groupId = match ? match[1] : null;
          if (groupId) {
            const { data: group } = await supabase
              .from('study_groups')
              .select('name')
              .eq('id', groupId)
              .single();
            if (group) groupName = group.name;
          }
          
          triggerN8NWebhook('group-session', {
            user_id: req.user.id,
            group_name: groupName,
            topic: title.replace('Study Session: ', ''),
            start_time,
            end_time
          });
        } catch (webhookErr) {
          // ignore
        }
      }

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
