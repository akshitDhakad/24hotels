const Redis = require('ioredis');
const { getEnv } = require('./env');
const { logger } = require('../utils/logger');

let client;

function createRedisClient() {
  if (client) return client;
  const { REDIS_URL } = getEnv();
  client = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 25,
    retryStrategy(times) {
      const delay = Math.min(times * 500, 5000);
      logger.warn('Redis retryStrategy', { times, delay });
      return delay;
    },
  });
  client.on('error', (err) => {
    logger.error('Redis error', { message: err.message });
  });
  client.on('connect', () => {
    logger.info('Redis connected');
  });
  return client;
}

async function connectRedis() {
  const c = createRedisClient();
  await c.ping();
  return c;
}

function getRedis() {
  if (!client) {
    throw new Error('Redis not initialized');
  }
  return client;
}

module.exports = { connectRedis, getRedis, createRedisClient };
