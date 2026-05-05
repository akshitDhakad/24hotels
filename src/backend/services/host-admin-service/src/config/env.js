require('dotenv').config();
const Joi = require('joi');

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  SERVICE_NAME: Joi.string().required(),
  PORT: Joi.number().port().required(),
  MONGO_HOST_URI: Joi.string().required(),
  RABBITMQ_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  CORS_ORIGINS: Joi.string().required(),
  BOOKING_SERVICE_INTERNAL_URL: Joi.string().required(),
  AUTH_SERVICE_INTERNAL_URL: Joi.string().required(),
}).unknown(true);

let validated;

function getEnv() {
  if (!validated) {
    const { error, value } = schema.validate(process.env, { abortEarly: false, stripUnknown: true });
    if (error) {
      // eslint-disable-next-line no-console
      console.error('host-admin-service env validation failed:', error.message);
      process.exit(1);
    }
    validated = value;
  }
  return validated;
}

module.exports = { getEnv };
