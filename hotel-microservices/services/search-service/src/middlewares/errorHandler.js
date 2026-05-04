const { AppError } = require('../utils/AppError');
const { getEnv } = require('../config/env');
const { logger } = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const correlationId = req.correlationId || req.get('x-correlation-id');
  const env = getEnv();

  if (err instanceof AppError) {
    logger.warn('Operational error', {
      correlationId,
      statusCode: err.statusCode,
      message: err.message,
    });
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      correlationId,
    });
  }

  logger.error('Unhandled error', {
    correlationId,
    message: err.message,
    stack: env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const body = {
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    correlationId,
  };
  if (env.NODE_ENV !== 'production' && err.stack) {
    body.stack = err.stack;
  }
  return res.status(statusCode).json(body);
}

module.exports = { errorHandler };
