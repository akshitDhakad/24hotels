const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireAuth } = require('../middlewares/requireAuth');
const notificationController = require('../controllers/notification.controller');
const { mongoIdParamSchema, listMeQuerySchema, adminListQuerySchema } = require('../schemas/notification.schemas');

const router = express.Router();

router.get('/health', (req, res) => notificationController.getHealth(req, res));

router.get(
  '/me',
  requireAuth(['customer', 'host', 'admin']),
  validateRequest(listMeQuerySchema, 'query'),
  asyncWrapper(notificationController.getMyLogs)
);
router.get(
  '/me/:id',
  requireAuth(['customer', 'host', 'admin']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(notificationController.getMyLogById)
);

router.get(
  '/admin/logs',
  requireAuth(['admin']),
  validateRequest(adminListQuerySchema, 'query'),
  asyncWrapper(notificationController.getAdminLogs)
);
router.get(
  '/admin/logs/:id',
  requireAuth(['admin']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(notificationController.getAdminLogById)
);

module.exports = router;
