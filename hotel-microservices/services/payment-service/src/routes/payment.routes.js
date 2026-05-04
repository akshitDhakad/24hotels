const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireAuth } = require('../middlewares/requireAuth');
const paymentController = require('../controllers/payment.controller');
const {
  createOrderSchema,
  verifySchema,
  mongoIdParamSchema,
  listQuerySchema,
} = require('../schemas/payment.schemas');

const router = express.Router();

router.get(
  '/me',
  requireAuth(['customer']),
  validateRequest(listQuerySchema, 'query'),
  asyncWrapper(paymentController.getMyTransactions)
);
router.get(
  '/:id',
  requireAuth(['customer']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(paymentController.getTransactionById)
);
router.post(
  '/create-order',
  requireAuth(['customer']),
  validateRequest(createOrderSchema),
  asyncWrapper(paymentController.postCreateOrder)
);
router.post('/verify', requireAuth(['customer']), validateRequest(verifySchema), asyncWrapper(paymentController.postVerify));

module.exports = router;
