const axios = require('axios');
const { getEnv } = require('../config/env');
const { logger } = require('../utils/logger');

/**
 * MSG91 HTTP API (transactional route).
 * @param {string} phoneDigits mobile without country code prefix (10 digits for India)
 * @param {string} message
 */
async function sendSms(phoneDigits, message) {
  const env = getEnv();
  if (!env.MSG91_AUTH_KEY || !env.MSG91_SENDER_ID) {
    logger.warn('MSG91 not configured; skipping SMS', { phoneDigits });
    return { skipped: true };
  }
  const cleaned = String(phoneDigits).replace(/\D/g, '');
  const mobiles = cleaned.length === 12 && cleaned.startsWith('91') ? cleaned : `91${cleaned.slice(-10)}`;
  const url = 'https://api.msg91.com/api/sendhttp.php';
  const params = new URLSearchParams({
    authkey: env.MSG91_AUTH_KEY,
    mobiles,
    message,
    sender: env.MSG91_SENDER_ID,
    route: '4',
    country: '91',
  });
  await axios.get(`${url}?${params.toString()}`, { timeout: 15000 });
  return { skipped: false };
}

module.exports = { sendSms };
