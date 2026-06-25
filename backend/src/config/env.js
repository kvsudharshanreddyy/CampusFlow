const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Path to the .env file
const envPath = path.resolve(__dirname, '../../.env');

// Check if .env file exists, otherwise load defaults or throw error in production
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('.env file not found, falling back to process.env variables');
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  supabase: {
    url: (() => {
      let url = process.env.SUPABASE_URL || '';
      if (url.endsWith('/rest/v1/')) {
        url = url.slice(0, -9);
      } else if (url.endsWith('/rest/v1')) {
        url = url.slice(0, -8);
      }
      if (url.endsWith('/')) {
        url = url.slice(0, -1);
      }
      return url || undefined;
    })(),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  automation: {
    webhookSecret: process.env.AUTOMATION_WEBHOOK_SECRET || 'dev_automation_secret_123',
  },
};
