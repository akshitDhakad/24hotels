const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireAuth } = require('../middlewares/requireAuth');
const internalController = require('../controllers/internal.controller');
const { adminUsersQuerySchema, mongoIdParamSchema } = require('../schemas/auth.schemas');

const router = express.Router();

router.get(
  '/admin/users',
  requireAuth(['admin']),
  validateRequest(adminUsersQuerySchema, 'query'),
  asyncWrapper(internalController.getAdminUsers)
);
router.get(
  '/admin/users/:id',
  requireAuth(['admin']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(internalController.getAdminUserById)
);

module.exports = router;
