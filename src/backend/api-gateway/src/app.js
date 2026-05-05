const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { getEnv } = require('./config/env');
const { correlationIdMiddleware } = require('./middlewares/correlationId');
const { errorHandler } = require('./middlewares/errorHandler');
const { requireJwt } = require('./middlewares/requireJwt');

const env = getEnv();

function parseOrigins(origins) {
  return origins.split(',').map((s) => s.trim()).filter(Boolean);
}

function createServiceProxy(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        proxyReq.setHeader('x-correlation-id', req.correlationId || '');
        if (req.headers.authorization) {
          proxyReq.setHeader('Authorization', req.headers.authorization);
        }
        if (req.headers.cookie) {
          proxyReq.setHeader('Cookie', req.headers.cookie);
        }
      },
    },
  });
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

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: env.SERVICE_NAME, correlationId: req.correlationId });
  });

  app.post(
    '/api/v1/payments/webhook',
    express.raw({ type: '*/*' }),
    createServiceProxy(env.PAYMENT_SERVICE_URL)
  );

  app.use(express.json({ limit: '2mb' }));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/v1/auth', authLimiter, createServiceProxy(env.AUTH_SERVICE_URL));

  app.use(requireJwt);

  app.use('/api/v1/search', createServiceProxy(env.SEARCH_SERVICE_URL));
  app.use('/api/v1/bookings', createServiceProxy(env.BOOKING_SERVICE_URL));
  app.use('/api/v1/payments', createServiceProxy(env.PAYMENT_SERVICE_URL));
  app.use('/api/v1/notifications', createServiceProxy(env.NOTIFICATION_SERVICE_URL));
  app.use('/api/v1/host', createServiceProxy(env.HOST_ADMIN_SERVICE_URL));
  app.use('/api/v1/admin', createServiceProxy(env.HOST_ADMIN_SERVICE_URL));

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Not found', correlationId: req.correlationId });
  });

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
