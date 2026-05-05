require('dotenv').config();
const Joi = require('joi');

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  SERVICE_NAME: Joi.string().required(),
  PORT: Joi.number().port().required(),
  MONGO_NOTIFY_URI: Joi.string().required(),
  RABBITMQ_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().port().required(),
  SMTP_USER: Joi.string().allow('').required(),
  SMTP_PASS: Joi.string().allow('').required(),
  MSG91_AUTH_KEY: Joi.string().allow('').required(),
  MSG91_SENDER_ID: Joi.string().allow('').required(),
  CORS_ORIGINS: Joi.string().required(),
}).unknown(true);

let validated;

function getEnv() {
  if (!validated) {
    const { error, value } = schema.validate(process.env, { abortEarly: false, stripUnknown: true });
    if (error) {
      // eslint-disable-next-line no-console
      console.error('notification-service env validation failed:', error.message);
      process.exit(1);
    }
    validated = value;
  }
  return validated;
}

module.exports = { getEnv };
