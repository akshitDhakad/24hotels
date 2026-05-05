const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { getEnv } = require('./config/env');
const { correlationIdMiddleware } = require('./middlewares/correlationId');
const { errorHandler } = require('./middlewares/errorHandler');
const hostRoutes = require('./routes/host.routes');
const adminRoutes = require('./routes/admin.routes');

const env = getEnv();

function parseOrigins(origins) {
  return origins.split(',').map((s) => s.trim()).filter(Boolean);
}

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: parseOrigins(env.CORS_ORIGINS),
      credentials: true,
    })
  );
  app.use(correlationIdMiddleware);
  app.use(express.json({ limit: '2mb' }));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: env.SERVICE_NAME, correlationId: req.correlationId });
  });

  app.use('/api/v1/host', hostRoutes);
  app.use('/api/v1/admin', adminRoutes);

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Not found', correlationId: req.correlationId });
  });

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
