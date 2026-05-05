const { getEnv } = require('./src/config/env');
const { logger } = require('./src/utils/logger');
const { connectDb } = require('./src/config/db');
const { configureCloudinary } = require('./src/config/cloudinary');
const { ensurePublisher } = require('./src/events/publisher');
const { createApp } = require('./src/app');

async function main() {
  const env = getEnv();
  configureCloudinary();
  await connectDb();
  await ensurePublisher();
  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info('host-admin-service listening', { port: env.PORT });
  });
}

main().catch((err) => {
  logger.error('Fatal boot error', { message: err.message, stack: err.stack });
  process.exit(1);
});
