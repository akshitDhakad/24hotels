const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(120).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  phone: Joi.string().min(8).max(20).trim().required(),
  role: Joi.string().valid('customer', 'host', 'admin').required(),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().min(10).required(),
  password: Joi.string().min(8).max(128).required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(120).trim().optional(),
  phone: Joi.string().min(8).max(20).trim().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one of name or phone must be provided',
  });

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(128).required(),
});

const adminUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  adminUsersQuerySchema,
};
