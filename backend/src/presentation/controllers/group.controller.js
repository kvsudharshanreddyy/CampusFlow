const groupRepository = require('../../infrastructure/database/groupRepository');

class GroupController {
  async getAll(req, res, next) {
    try {
      const groups = await groupRepository.findAll();
      res.status(200).json({ status: 'success', data: groups });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { name, description } = req.body;
      const group = await groupRepository.create({
        name,
        description,
        created_by: req.user.id
      });
      // Automatically add creator as admin member
      await groupRepository.addMember(group.id, req.user.id, 'admin');
      res.status(201).json({ status: 'success', data: group });
    } catch (error) {
      next(error);
    }
  }

  async join(req, res, next) {
    try {
      const { id } = req.params;
      const isMember = await groupRepository.checkMembership(id, req.user.id);
      if (isMember) {
        return res.status(400).json({ status: 'error', message: 'You are already a member of this group' });
      }

      await groupRepository.addMember(id, req.user.id, 'member');
      res.status(200).json({ status: 'success', message: 'Joined study group successfully' });
    } catch (error) {
      next(error);
    }
  }

  async leave(req, res, next) {
    try {
      const { id } = req.params;
      await groupRepository.removeMember(id, req.user.id);
      res.status(200).json({ status: 'success', message: 'Left study group successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req, res, next) {
    try {
      const { id } = req.params;
      const members = await groupRepository.getMembers(id);
      res.status(200).json({ status: 'success', data: members });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GroupController();
