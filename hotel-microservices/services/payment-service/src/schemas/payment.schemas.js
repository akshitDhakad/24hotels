const Joi = require('joi');

const TRANSACTION_STATUSES = ['created', 'authorized', 'captured', 'failed', 'refunded'];

const createOrderSchema = Joi.object({
  bookingId: Joi.string()
    .trim()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required(),
  amount: Joi.number().integer().positive().required(),
  currency: Joi.string().trim().length(3).uppercase().default('INR'),
  receipt: Joi.string().trim().max(40).optional(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().trim().max(20).optional(),
  hostNotifyPhone: Joi.string().trim().max(20).optional(),
});

const verifySchema = Joi.object({
  razorpay_order_id: Joi.string().trim().required(),
  razorpay_payment_id: Joi.string().trim().required(),
  razorpay_signature: Joi.string().trim().required(),
});

const mongoIdParamSchema = Joi.object({
  id: Joi.string()
    .trim()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required(),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string()
    .valid(...TRANSACTION_STATUSES)
    .optional(),
});

const adminListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string()
    .valid(...TRANSACTION_STATUSES)
    .optional(),
  bookingId: Joi.string()
    .trim()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .optional(),
  customerId: Joi.string().trim().min(1).max(64).optional(),
});

module.exports = {
  createOrderSchema,
  verifySchema,
  mongoIdParamSchema,
  listQuerySchema,
  adminListQuerySchema,
  TRANSACTION_STATUSES,
};
