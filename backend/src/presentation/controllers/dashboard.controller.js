const taskRepository = require('../../infrastructure/database/taskRepository');
const attendanceRepository = require('../../infrastructure/database/attendanceRepository');
const notificationRepository = require('../../infrastructure/database/notificationRepository');
const calendarEventRepository = require('../../infrastructure/database/calendarEventRepository');

class DashboardController {
  async getStats(req, res, next) {
    try {
      const userId = req.user.id;

      // Run all queries in parallel
      const [taskCounts, attendanceSummary, notifications, upcomingTasks, todayEvents] = await Promise.all([
        taskRepository.countByStatus(userId),
        attendanceRepository.getSummaryByUser(userId),
        notificationRepository.countUnread(userId),
        taskRepository.getUpcoming(userId, 5),
        calendarEventRepository.getTodayEvents(userId),
      ]);

      // Calculate average attendance
      const avgAttendance = attendanceSummary.length
        ? Math.round(attendanceSummary.reduce((a, s) => a + s.percentage, 0) / attendanceSummary.length)
        : 0;

      // Attendance at-risk count (below 75%)
      const atRiskCount = attendanceSummary.filter(s => s.percentage < 75).length;

      res.status(200).json({
        status: 'success',
        data: {
          tasks: taskCounts,
          attendance: {
            average_percentage: avgAttendance,
            at_risk_subjects: atRiskCount,
            subjects: attendanceSummary,
          },
          unread_notifications: notifications,
          upcoming_tasks: upcomingTasks,
          today_events: todayEvents,
          today_events_count: todayEvents.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
