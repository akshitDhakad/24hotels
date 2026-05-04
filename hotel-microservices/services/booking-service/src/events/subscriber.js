const amqp = require('amqplib');
const { getEnv } = require('../config/env');
const { logger } = require('../utils/logger');
const { handlePaymentConfirmed, handlePaymentFailed } = require('../services/payment-events.service');

const EXCHANGE = 'hotel_events';
const DLX = 'hotel_events_dlx';
const QUEUE = 'q.booking_service';

let connection;
let channel;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleMessage(msg) {
  if (!msg || !channel) return;
  const routingKey = msg.fields.routingKey;
  let parsed;
  try {
    parsed = JSON.parse(msg.content.toString());
  } catch (err) {
    logger.error('Invalid JSON in RabbitMQ message', { routingKey, message: err.message });
    channel.nack(msg, false, false);
    return;
  }
  const correlationId = parsed.correlationId;
  try {
    if (routingKey === 'payment.confirmed') {
      await handlePaymentConfirmed(parsed.payload || {}, correlationId);
    } else if (routingKey === 'payment.failed') {
      await handlePaymentFailed(parsed.payload || {}, correlationId);
    }
    channel.ack(msg);
  } catch (err) {
    logger.error('booking-service consumer error', {
      routingKey,
      message: err.message,
      stack: err.stack,
    });
    channel.nack(msg, false, false);
  }
}

async function initSubscriber() {
  const { RABBITMQ_URL } = getEnv();
  const maxAttempts = 5;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      connection = conn;
      conn.on('error', (err) => logger.error('RabbitMQ subscriber connection error', { message: err.message }));
      conn.on('close', () => {
        logger.warn('RabbitMQ subscriber connection closed');
        channel = null;
        connection = null;
        setTimeout(() => {
          initSubscriber().catch((e) => logger.error('subscriber reconnect failed', { message: e.message }));
        }, 5000);
      });
      const ch = await conn.createChannel();
      channel = ch;
      await ch.assertExchange(EXCHANGE, 'topic', { durable: true });
      await ch.assertExchange(DLX, 'topic', { durable: true });
      await ch.assertQueue('hotel_events_dlq', { durable: true });
      await ch.bindQueue('hotel_events_dlq', DLX, 'dead.#');
      await ch.assertQueue(QUEUE, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': DLX,
          'x-dead-letter-routing-key': 'dead.booking_service',
        },
      });
      await ch.bindQueue(QUEUE, EXCHANGE, 'payment.confirmed');
      await ch.bindQueue(QUEUE, EXCHANGE, 'payment.failed');
      await ch.prefetch(10);
      await ch.consume(QUEUE, handleMessage);
      logger.info('RabbitMQ subscriber ready', { queue: QUEUE, attempt });
      return;
    } catch (err) {
      lastErr = err;
      logger.warn('RabbitMQ subscriber connect failed', { attempt, message: err.message });
      if (attempt === maxAttempts) break;
      await sleep(5000);
    }
  }
  throw lastErr || new Error('RabbitMQ subscriber connection failed');
}

module.exports = { initSubscriber, EXCHANGE, DLX, QUEUE };
