const express = require('express');
const Joi = require('joi');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireAuth } = require('../middlewares/requireAuth');
const paymentController = require('../controllers/payment.controller');

const router = express.Router();

const createOrderSchema = Joi.object({
  bookingId: Joi.string().required(),
  amount: Joi.number().integer().positive().required(),
  currency: Joi.string().default('INR'),
  receipt: Joi.string().max(40).optional(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().optional(),
  hostNotifyPhone: Joi.string().optional(),
});

const verifySchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
});

router.post(
  '/create-order',
  requireAuth(['customer']),
  validateRequest(createOrderSchema),
  asyncWrapper(paymentController.postCreateOrder)
);
router.post('/verify', requireAuth(['customer']), validateRequest(verifySchema), asyncWrapper(paymentController.postVerify));

module.exports = router;
