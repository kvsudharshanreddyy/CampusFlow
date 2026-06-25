const notificationRepository = require('../../infrastructure/database/notificationRepository');

class NotificationController {
  async getAll(req, res, next) {
    try {
      const { unread_only, limit = 20 } = req.query;
      const notifications = await notificationRepository.findByUser(req.user.id, {
        unreadOnly: unread_only === 'true',
        limit: Math.min(Number(limit), 100),
      });
      const unreadCount = await notificationRepository.countUnread(req.user.id);
      res.status(200).json({
        status: 'success',
        data: notifications,
        meta: { unread_count: unreadCount },
      });
    } catch (error) {
      next(error);
    }
  }

  async markRead(req, res, next) {
    try {
      const notif = await notificationRepository.markRead(req.params.id, req.user.id);
      if (!notif) {
        const err = new Error('Notification not found'); err.statusCode = 404; throw err;
      }
      res.status(200).json({ status: 'success', message: 'Marked as read', data: notif });
    } catch (error) {
      next(error);
    }
  }

  async markAllRead(req, res, next) {
    try {
      await notificationRepository.markAllRead(req.user.id);
      res.status(200).json({ status: 'success', message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
