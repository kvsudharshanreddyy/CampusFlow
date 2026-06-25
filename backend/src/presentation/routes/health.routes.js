const express = require('express');
const router = express.Router();
const supabase = require('../../infrastructure/database/supabase');

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Check API Health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *       500:
 *         description: API or Database is unhealthy
 */
router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  
  try {
    // A simple query to check DB connection
    // Note: If using mock supabase, this will fail or not execute properly
    // but it's a good practice for real setups
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (!error) {
      dbStatus = 'connected';
    }
  } catch (error) {
    dbStatus = 'error';
  }

  res.status(200).json({
    status: 'success',
    message: 'CampusFlow API is running',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

module.exports = router;
