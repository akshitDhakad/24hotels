const jwt = require('jsonwebtoken');
const { getEnv } = require('../config/env');

function isJwtExempt(req) {
  if (req.method === 'GET' && req.path.startsWith('/api/v1/search')) {
    return true;
  }
  if (req.method === 'GET' && req.path === '/api/v1/notifications/health') {
    return true;
  }
  return false;
}

function requireJwt(req, res, next) {
  if (isJwtExempt(req)) {
    return next();
  }
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      correlationId: req.correlationId,
    });
  }
  try {
    const env = getEnv();
    jwt.verify(auth.slice(7), env.JWT_ACCESS_SECRET);
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      correlationId: req.correlationId,
    });
  }
}

module.exports = { requireJwt };
