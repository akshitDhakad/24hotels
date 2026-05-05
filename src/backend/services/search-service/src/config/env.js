require('dotenv').config();
const Joi = require('joi');

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  SERVICE_NAME: Joi.string().required(),
  PORT: Joi.number().port().required(),
  MONGO_SEARCH_URI: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  RABBITMQ_URL: Joi.string().required(),
  CORS_ORIGINS: Joi.string().required(),
}).unknown(true);

let validated;

function getEnv() {
  if (!validated) {
    const { error, value } = schema.validate(process.env, { abortEarly: false, stripUnknown: true });
    if (error) {
      // eslint-disable-next-line no-console
      console.error('search-service env validation failed:', error.message);
      process.exit(1);
    }
    validated = value;
  }
  return validated;
}

module.exports = { getEnv };
