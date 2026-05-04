const Joi = require('joi');
const { AppError } = require('../utils/AppError');
const { createRoomImageUpload } = require('../config/cloudinary');

const upload = createRoomImageUpload();

const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  publicId: Joi.string().required(),
  width: Joi.number().optional(),
  height: Joi.number().optional(),
});

const createRoomSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().allow('').max(5000).default(''),
  city: Joi.string().min(2).max(120).required(),
  address: Joi.string().allow('').max(500).default(''),
  pricePerSlot: Joi.number().positive().required(),
  availableSlots: Joi.array().items(Joi.number().valid(4, 8, 12, 16, 20, 24)).min(1).required(),
  amenities: Joi.array().items(Joi.string()).default([]),
  images: Joi.array().items(imageSchema).default([]),
});

const updateRoomSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().allow('').max(5000).optional(),
  city: Joi.string().min(2).max(120).optional(),
  address: Joi.string().allow('').max(500).optional(),
  pricePerSlot: Joi.number().positive().optional(),
  availableSlots: Joi.array().items(Joi.number().valid(4, 8, 12, 16, 20, 24)).min(1).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(imageSchema).optional(),
}).min(1);

function parseMultipartRoomPayload(req, res, next) {
  let raw = req.body && req.body.data;
  if (typeof raw !== 'string') {
    raw = '{}';
  }
  try {
    req.roomPayload = JSON.parse(raw);
    return next();
  } catch {
    return next(new AppError(400, 'Invalid JSON in data field'));
  }
}

function validateCreateRoomPayload(req, res, next) {
  const { error, value } = createRoomSchema.validate(req.roomPayload, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      details: error.details.map((d) => d.message),
      correlationId: req.correlationId,
    });
  }
  req.roomPayload = value;
  return next();
}

function validateUpdateRoomPayload(req, res, next) {
  const { error, value } = updateRoomSchema.validate(req.roomPayload, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      details: error.details.map((d) => d.message),
      correlationId: req.correlationId,
    });
  }
  req.roomPayload = value;
  return next();
}

function prepareRoomPayloadForCreate(req, res, next) {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    req.roomPayload = req.body;
    req.files = [];
    return validateCreateRoomPayload(req, res, next);
  }
  return upload.array('images', 10)(req, res, (err) => {
    if (err) return next(err);
    return parseMultipartRoomPayload(req, res, (e) => {
      if (e) return next(e);
      return validateCreateRoomPayload(req, res, next);
    });
  });
}

function prepareRoomPayloadForUpdate(req, res, next) {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    req.roomPayload = req.body;
    req.files = [];
    return validateUpdateRoomPayload(req, res, next);
  }
  return upload.array('images', 10)(req, res, (err) => {
    if (err) return next(err);
    return parseMultipartRoomPayload(req, res, (e) => {
      if (e) return next(e);
      return validateUpdateRoomPayload(req, res, next);
    });
  });
}

module.exports = {
  prepareRoomPayloadForCreate,
  prepareRoomPayloadForUpdate,
};
