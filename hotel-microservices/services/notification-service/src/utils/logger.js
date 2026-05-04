const winston = require('winston');
const { getEnv } = require('../config/env');

const env = getEnv();

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: env.SERVICE_NAME },
  transports: [new winston.transports.Console()],
});

function childLogger(correlationId) {
  return logger.child({ correlationId });
}

module.exports = { logger, childLogger };
