const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireAuth } = require('../middlewares/requireAuth');
const internalController = require('../controllers/internal.controller');
const { adminUsersQuerySchema } = require('../schemas/auth.schemas');

const router = express.Router();

router.get(
  '/admin/users',
  requireAuth(['admin']),
  validateRequest(adminUsersQuerySchema, 'query'),
  asyncWrapper(internalController.getAdminUsers)
);

module.exports = router;
