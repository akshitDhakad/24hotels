require('dotenv').config();
const Joi = require('joi');

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  SERVICE_NAME: Joi.string().required(),
  PORT: Joi.number().port().required(),
  MONGO_AUTH_URI: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().port().required(),
  SMTP_USER: Joi.string().allow('').required(),
  SMTP_PASS: Joi.string().allow('').required(),
  CORS_ORIGINS: Joi.string().required(),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),
  /** Optional absolute URL for password-reset links in emails (e.g. https://app.example.com) */
  PUBLIC_APP_URL: Joi.string().trim().allow('').optional(),
}).unknown(true);

let validated;

function getEnv() {
  if (!validated) {
    const { error, value } = schema.validate(process.env, { abortEarly: false, stripUnknown: true });
    if (error) {
      // eslint-disable-next-line no-console
      console.error('auth-service env validation failed:', error.message);
      process.exit(1);
    }
    validated = value;
  }
  return validated;
}

module.exports = { getEnv };
