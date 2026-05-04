const jwt = require('jsonwebtoken');
const { getEnv } = require('../config/env');
const { AppError } = require('../utils/AppError');

/**
 * @param {import('express').Request} req
 * @param {string[]} roles
 */
function requireAuth(roles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(new AppError(401, 'Missing or invalid authorization'));
    }
    const token = header.slice(7);
    try {
      const env = getEnv();
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
      req.user = {
        id: payload.sub,
        role: payload.role,
        email: payload.email,
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return next(new AppError(403, 'Forbidden'));
      }
      return next();
    } catch {
      return next(new AppError(401, 'Invalid or expired token'));
    }
  };
}

module.exports = { requireAuth };
