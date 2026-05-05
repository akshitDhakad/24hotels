require('dotenv').config();
const Joi = require('joi');

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  SERVICE_NAME: Joi.string().required(),
  PORT: Joi.number().port().required(),
  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  CORS_ORIGINS: Joi.string().required(),
  AUTH_SERVICE_URL: Joi.string().required(),
  SEARCH_SERVICE_URL: Joi.string().required(),
  BOOKING_SERVICE_URL: Joi.string().required(),
  PAYMENT_SERVICE_URL: Joi.string().required(),
  NOTIFICATION_SERVICE_URL: Joi.string().required(),
  HOST_ADMIN_SERVICE_URL: Joi.string().required(),
}).unknown(true);

let validated;

function getEnv() {
  if (!validated) {
    const { error, value } = schema.validate(process.env, { abortEarly: false, stripUnknown: true });
    if (error) {
      // eslint-disable-next-line no-console
      console.error('api-gateway env validation failed:', error.message);
      process.exit(1);
    }
    validated = value;
  }
  return validated;
}

module.exports = { getEnv };
