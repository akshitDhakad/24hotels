const Joi = require('joi');

const SLOT_TYPES = [4, 8, 12, 16, 20, 24];
const slotType = Joi.number().valid(...SLOT_TYPES);
const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const dateStr = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/);

const lockAcquireSchema = Joi.object({
  roomId: Joi.string().trim().min(1).max(64).required(),
  date: dateStr.required(),
  slotType: slotType.required(),
});

const lockReleaseSchema = Joi.object({
  roomId: Joi.string().trim().min(1).max(64).required(),
  date: dateStr.required(),
  slotType: slotType.required(),
});

const createBookingSchema = Joi.object({
  roomId: Joi.string().trim().min(1).max(64).required(),
  hostId: Joi.string().trim().min(1).max(64).required(),
  slotType: slotType.required(),
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().required(),
  totalAmount: Joi.number().positive().required(),
  date: dateStr.required(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().trim().max(20).optional(),
  hostNotifyPhone: Joi.string().trim().max(20).optional(),
});

const razorpayOrderSchema = Joi.object({
  razorpayOrderId: Joi.string().trim().required(),
});

const cancelBodySchema = Joi.object({
  contactEmail: Joi.string().email().optional(),
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
    .valid(...BOOKING_STATUSES)
    .optional(),
});

const overrideSchema = Joi.object({
  action: Joi.string().valid('confirm', 'cancel').required(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().trim().max(20).optional(),
  hostNotifyPhone: Joi.string().trim().max(20).optional(),
});

module.exports = {
  lockAcquireSchema,
  lockReleaseSchema,
  createBookingSchema,
  razorpayOrderSchema,
  cancelBodySchema,
  mongoIdParamSchema,
  listQuerySchema,
  overrideSchema,
  SLOT_TYPES,
  BOOKING_STATUSES,
};
