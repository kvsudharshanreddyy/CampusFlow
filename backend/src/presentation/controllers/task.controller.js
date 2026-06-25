const taskRepository = require('../../infrastructure/database/taskRepository');

class TaskController {
  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      const { status, search, sortBy, sortDir, page = 1, limit = 10 } = req.query;

      const result = await taskRepository.findByUser(userId, {
        status,
        search,
        sortBy,
        sortDir,
        page: Number(page),
        limit: Math.min(Number(limit), 50),
      });

      res.status(200).json({
        status: 'success',
        data: result.data,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const task = await taskRepository.findById(req.params.id, req.user.id);
      if (!task) {
        const err = new Error('Task not found'); err.statusCode = 404; throw err;
      }
      res.status(200).json({ status: 'success', data: task });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { title, description, status, due_date, subject_id } = req.body;
      const task = await taskRepository.create({
        user_id: req.user.id,
        title,
        description,
        status: status || 'pending',
        due_date: due_date || null,
        subject_id: subject_id || null,
      });
      res.status(201).json({ status: 'success', message: 'Task created', data: task });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { title, description, status, due_date, subject_id } = req.body;
      const updates = {};
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (status !== undefined) updates.status = status;
      if (due_date !== undefined) updates.due_date = due_date;
      if (subject_id !== undefined) updates.subject_id = subject_id;

      const task = await taskRepository.update(req.params.id, req.user.id, updates);
      if (!task) {
        const err = new Error('Task not found'); err.statusCode = 404; throw err;
      }
      res.status(200).json({ status: 'success', message: 'Task updated', data: task });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await taskRepository.delete(req.params.id, req.user.id);
      res.status(200).json({ status: 'success', message: 'Task deleted' });
    } catch (error) {
      next(error);
    }
  }

  async getUpcoming(req, res, next) {
    try {
      const tasks = await taskRepository.getUpcoming(req.user.id, 10);
      res.status(200).json({ status: 'success', data: tasks });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
