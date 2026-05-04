const amqp = require('amqplib');
const { getEnv } = require('../config/env');
const { logger } = require('../utils/logger');

const EXCHANGE = 'hotel_events';

let connection;
let channel;
let reconnectTimer;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    ensurePublisher().catch((err) => logger.error('RabbitMQ publisher reconnect failed', { message: err.message }));
  }, 5000);
}

function attachConnectionHandlers(conn) {
  conn.on('error', (err) => {
    logger.error('RabbitMQ publisher connection error', { message: err.message });
  });
  conn.on('close', () => {
    logger.warn('RabbitMQ publisher connection closed; scheduling reconnect');
    channel = null;
    connection = null;
    scheduleReconnect();
  });
}

async function ensurePublisher() {
  if (channel) return channel;
  const { RABBITMQ_URL } = getEnv();
  const maxAttempts = 5;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      connection = conn;
      attachConnectionHandlers(conn);
      const ch = await conn.createChannel();
      await ch.assertExchange(EXCHANGE, 'topic', { durable: true });
      channel = ch;
      logger.info('RabbitMQ publisher ready', { attempt });
      return ch;
    } catch (err) {
      lastErr = err;
      logger.warn('RabbitMQ publisher connect failed', { attempt, message: err.message });
      if (attempt === maxAttempts) break;
      await sleep(5000);
    }
  }
  throw lastErr || new Error('RabbitMQ publisher connection failed');
}

/**
 * @param {string} routingKey
 * @param {object} payload
 * @param {string} [correlationId]
 */
async function publishEvent(routingKey, payload, correlationId) {
  const ch = await ensurePublisher();
  const body = Buffer.from(
    JSON.stringify({
      event: routingKey,
      correlationId: correlationId || null,
      payload,
      occurredAt: new Date().toISOString(),
    })
  );
  ch.publish(EXCHANGE, routingKey, body, {
    persistent: true,
    contentType: 'application/json',
  });
}

async function closePublisher() {
  try {
    if (channel) await channel.close();
  } catch (_) {
    /* ignore */
  }
  try {
    if (connection) await connection.close();
  } catch (_) {
    /* ignore */
  }
  channel = null;
  connection = null;
}

module.exports = { ensurePublisher, publishEvent, closePublisher, EXCHANGE };
