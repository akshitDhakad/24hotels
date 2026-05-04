const amqp = require('amqplib');
const { getEnv } = require('../config/env');
const { logger } = require('../utils/logger');
const dispatch = require('../services/notification-dispatch.service');

const EXCHANGE = 'hotel_events';
const DLX = 'hotel_events_dlx';
const QUEUE = 'q.notification_service';

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
  const payload = parsed.payload || {};
  const correlationId = parsed.correlationId || null;
  try {
    if (routingKey === 'booking.created') {
      await dispatch.handleBookingCreated(payload, correlationId);
    } else if (routingKey === 'booking.confirmed') {
      await dispatch.handleBookingConfirmed(payload, correlationId);
    } else if (routingKey === 'booking.cancelled') {
      await dispatch.handleBookingCancelled(payload, correlationId);
    } else if (routingKey === 'payment.failed') {
      await dispatch.handlePaymentFailed(payload, correlationId);
    }
    channel.ack(msg);
  } catch (err) {
    logger.error('notification-service consumer error', { routingKey, message: err.message, stack: err.stack });
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
          'x-dead-letter-routing-key': 'dead.notification_service',
        },
      });
      await ch.bindQueue(QUEUE, EXCHANGE, 'booking.created');
      await ch.bindQueue(QUEUE, EXCHANGE, 'booking.confirmed');
      await ch.bindQueue(QUEUE, EXCHANGE, 'booking.cancelled');
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

module.exports = { initSubscriber };
