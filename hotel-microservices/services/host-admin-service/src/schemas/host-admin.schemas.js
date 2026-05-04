const Joi = require('joi');

const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const mongoIdParamSchema = Joi.object({
  id: Joi.string()
    .trim()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required(),
});

const listBookingQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string()
    .valid(...BOOKING_STATUSES)
    .optional(),
});

const adminUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const overrideSchema = Joi.object({
  action: Joi.string().valid('confirm', 'cancel').required(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().trim().max(20).optional(),
  hostNotifyPhone: Joi.string().trim().max(20).optional(),
});

const adminRoomListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  hostId: Joi.string().trim().min(1).max(64).optional(),
  city: Joi.string().trim().min(1).max(120).optional(),
  isActive: Joi.boolean().optional(),
  search: Joi.string().trim().min(1).max(200).optional(),
});

module.exports = {
  mongoIdParamSchema,
  listBookingQuerySchema,
  adminUsersQuerySchema,
  overrideSchema,
  adminRoomListQuerySchema,
  BOOKING_STATUSES,
};
