const logger = require('../../utils/logger');

class CacheService {
  constructor() {
    this.cache = new Map();
    
    // Periodically evict expired cache entries to prevent memory growth
    setInterval(() => {
      this.evictExpired();
    }, 10 * 60 * 1000).unref(); // every 10 minutes
  }

  /**
   * Retrieve an item from the cache
   * @param {string} key Cache key
   * @returns {*} Cached value or null if not found/expired
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      logger.debug(`Cache expired and evicted for key: ${key}`);
      return null;
    }

    logger.debug(`Cache hit for key: ${key}`);
    return entry.value;
  }

  /**
   * Set an item in the cache
   * @param {string} key Cache key
   * @param {*} value Value to store
   * @param {number} ttlMs Time to live in milliseconds (default: 5 minutes)
   */
  set(key, value, ttlMs = 5 * 60 * 1000) {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
    logger.debug(`Cache set for key: ${key} with TTL: ${ttlMs}ms`);
  }

  /**
   * Delete an item from the cache
   * @param {string} key Cache key
   */
  delete(key) {
    this.cache.delete(key);
    logger.debug(`Cache deleted for key: ${key}`);
  }

  /**
   * Clear all items in the cache
   */
  clear() {
    this.cache.clear();
    logger.debug('Cache cleared completely');
  }

  /**
   * Scan and delete all expired entries
   * @private
   */
  evictExpired() {
    const now = Date.now();
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        count++;
      }
    }
    if (count > 0) {
      logger.info(`Garbage collection evicted ${count} expired cache entries`);
    }
  }
}

module.exports = new CacheService();
