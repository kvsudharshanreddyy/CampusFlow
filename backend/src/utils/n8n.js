const logger = require('./logger');

/**
 * Triggers an n8n webhook asynchronously and handles errors gracefully.
 * @param {string} path - The n8n webhook path (e.g., 'placement-update').
 * @param {object} payload - The request body payload.
 */
async function triggerN8NWebhook(path, payload) {
  const n8nBaseUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';
  const url = `${n8nBaseUrl}/${path}`;

  logger.info(`[n8n Linker] Dispatching webhook to ${url}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      logger.warn(`[n8n Linker] Webhook ${path} returned status ${response.status}`);
    } else {
      logger.info(`[n8n Linker] Webhook ${path} triggered successfully.`);
    }
  } catch (err) {
    logger.warn(`[n8n Linker] Failed to connect to n8n webhook at ${url}: ${err.message}`);
  }
}

module.exports = { triggerN8NWebhook };
