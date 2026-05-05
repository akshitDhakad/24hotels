const { getEnv } = require('./src/config/env');
const { logger } = require('./src/utils/logger');
const { connectDb } = require('./src/config/db');
const { initSubscriber } = require('./src/events/subscriber');
const { createApp } = require('./src/app');

async function main() {
  const env = getEnv();
  await connectDb();
  await initSubscriber();
  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info('notification-service listening', { port: env.PORT });
  });
}

main().catch((err) => {
  logger.error('Fatal boot error', { message: err.message, stack: err.stack });
  process.exit(1);
});
