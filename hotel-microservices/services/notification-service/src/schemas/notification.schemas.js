const Joi = require('joi');

const CHANNELS = ['email', 'sms'];
const STATUSES = ['sent', 'failed', 'skipped'];

const mongoIdParamSchema = Joi.object({
  id: Joi.string()
    .trim()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required(),
});

const listMeQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  channel: Joi.string()
    .valid(...CHANNELS)
    .optional(),
  event: Joi.string().trim().max(120).optional(),
  status: Joi.string()
    .valid(...STATUSES)
    .optional(),
});

const adminListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  channel: Joi.string()
    .valid(...CHANNELS)
    .optional(),
  event: Joi.string().trim().max(120).optional(),
  status: Joi.string()
    .valid(...STATUSES)
    .optional(),
  bookingId: Joi.string()
    .trim()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .optional(),
  customerId: Joi.string().trim().min(1).max(64).optional(),
  hostId: Joi.string().trim().min(1).max(64).optional(),
  recipient: Joi.string().trim().min(1).max(256).optional(),
  correlationId: Joi.string().trim().max(128).optional(),
  createdFrom: Joi.date().iso().optional(),
  createdTo: Joi.date().iso().optional(),
});

module.exports = {
  mongoIdParamSchema,
  listMeQuerySchema,
  adminListQuerySchema,
  CHANNELS,
  STATUSES,
};
