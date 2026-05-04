const Joi = require('joi');

const SLOT_TYPES = [4, 8, 12, 16, 20, 24];

const roomsQuerySchema = Joi.object({
  city: Joi.string().trim().max(120).optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  slotType: Joi.number().valid(...SLOT_TYPES).optional(),
  checkIn: Joi.date().iso().optional(),
  amenities: Joi.alternatives()
    .try(Joi.array().items(Joi.string().trim().max(80)), Joi.string())
    .optional()
    .custom((v) => {
      if (typeof v === 'string') {
        return v
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return v;
    }),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

const citiesQuerySchema = Joi.object({
  prefix: Joi.string().trim().max(120).allow('').optional(),
  limit: Joi.number().integer().min(1).max(200).default(100),
});

const sourceRoomIdParamSchema = Joi.object({
  sourceRoomId: Joi.string()
    .trim()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'sourceRoomId must be a 24-character hex id',
    }),
});

module.exports = {
  roomsQuerySchema,
  citiesQuerySchema,
  sourceRoomIdParamSchema,
  SLOT_TYPES,
};
