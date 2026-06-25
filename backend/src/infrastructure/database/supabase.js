const { createClient } = require('@supabase/supabase-js');
const config = require('../../config/env');
const logger = require('../../utils/logger');

// Check if credentials exist
if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  logger.warn('Supabase URL or Service Role Key is missing. Database operations will fail.');
}

const supabase = createClient(
  config.supabase.url || 'https://mock.supabase.co', 
  config.supabase.serviceRoleKey || 'mock-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

module.exports = supabase;
