const mongoose = require('mongoose');
const { getEnv } = require('./env');
const { logger } = require('../utils/logger');

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 5000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectDb() {
  const { MONGO_NOTIFY_URI } = getEnv();
  let lastErr;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await mongoose.connect(MONGO_NOTIFY_URI);
      logger.info('MongoDB connected', { attempt });
      return;
    } catch (err) {
      lastErr = err;
      logger.warn('MongoDB connect failed', { attempt, message: err.message });
      if (attempt === MAX_ATTEMPTS) break;
      await sleep(RETRY_DELAY_MS);
    }
  }
  logger.error('MongoDB connection exhausted retries', { message: lastErr && lastErr.message });
  throw lastErr;
}

module.exports = { connectDb };
