const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireAuth } = require('../middlewares/requireAuth');
const internalPaymentController = require('../controllers/internal-payment.controller');
const { mongoIdParamSchema, adminListQuerySchema } = require('../schemas/payment.schemas');

const router = express.Router();

router.get(
  '/admin/transactions',
  requireAuth(['admin']),
  validateRequest(adminListQuerySchema, 'query'),
  asyncWrapper(internalPaymentController.getAdminTransactions)
);
router.get(
  '/admin/transactions/:id',
  requireAuth(['admin']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(internalPaymentController.getAdminTransactionById)
);

module.exports = router;
