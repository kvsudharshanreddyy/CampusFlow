const placementRepository = require('../../infrastructure/database/placementRepository');
const cacheService = require('../../infrastructure/services/cache.service');

class PlacementController {
  async getApplications(req, res, next) {
    try {
      const apps = await placementRepository.findByUser(req.user.id);
      res.status(200).json({ status: 'success', data: apps });
    } catch (error) {
      next(error);
    }
  }

  async getCompanies(req, res, next) {
    try {
      const cacheKey = 'placement_companies';
      const cachedCompanies = cacheService.get(cacheKey);
      if (cachedCompanies) {
        return res.status(200).json({ status: 'success', data: cachedCompanies });
      }

      const companies = await placementRepository.getCompanies();
      
      // Cache companies for 10 minutes (600000 ms)
      cacheService.set(cacheKey, companies, 10 * 60 * 1000);

      res.status(200).json({ status: 'success', data: companies });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { company_id, role_title, status = 'applied', date_applied, notes } = req.body;
      const app = await placementRepository.create({
        user_id: req.user.id,
        company_id,
        role_title,
        status,
        date_applied: date_applied || new Date().toISOString().split('T')[0],
        notes
      });
      res.status(201).json({ status: 'success', data: app });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const app = await placementRepository.update(id, req.user.id, updates);
      if (!app) {
        return res.status(404).json({ status: 'error', message: 'Application not found' });
      }
      res.status(200).json({ status: 'success', data: app });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await placementRepository.delete(id, req.user.id);
      res.status(200).json({ status: 'success', message: 'Application deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlacementController();
