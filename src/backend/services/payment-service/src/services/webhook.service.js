const crypto = require('crypto');
const { getEnv } = require('../config/env');
const Transaction = require('../models/transaction.model');
const { logger } = require('../utils/logger');
const {
  recordPaymentCaptured,
  recordPaymentAuthorized,
  recordPaymentFailed,
  recordPaymentRefunded,
} = require('./payment.service');

function verifyWebhookSignature(rawBody, signatureHeader) {
  const env = getEnv();
  const expected = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');
  if (!signatureHeader) {
    return false;
  }
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(signatureHeader), 'utf8');
  if (a.length !== b.length) {
    return false;
  }
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function paymentEntity(event) {
  return event.payload && event.payload.payment ? event.payload.payment.entity : null;
}

async function processWebhook(rawBody, signatureHeader, correlationId) {
  if (!verifyWebhookSignature(rawBody, signatureHeader)) {
    return { ok: false, status: 400, message: 'Invalid webhook signature' };
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch (err) {
    logger.warn('Webhook JSON parse failed', { message: err.message });
    return { ok: false, status: 400, message: 'Invalid JSON' };
  }

  const entity = paymentEntity(event);

  if (event.event === 'payment.captured' && entity) {
    const paymentId = entity.id;
    const orderId = entity.order_id;
    const amount = entity.amount;
    const currency = entity.currency;

    const tx = await Transaction.findOne({ razorpayOrderId: orderId });
    if (!tx) {
      logger.warn('Webhook for unknown order', { orderId });
      return { ok: true, status: 200, message: 'ignored' };
    }

    const result = await recordPaymentCaptured(
      tx,
      { razorpayPaymentId: paymentId, amount, currency },
      correlationId
    );
    if (result.conflict) {
      logger.warn('Webhook capture conflict', { orderId, paymentId });
    }
    return { ok: true, status: 200, message: result.duplicate ? 'duplicate' : 'captured' };
  }

  if (event.event === 'payment.authorized' && entity) {
    const paymentId = entity.id;
    const orderId = entity.order_id;
    const tx = await Transaction.findOne({ razorpayOrderId: orderId });
    if (!tx) {
      return { ok: true, status: 200, message: 'ignored' };
    }
    await recordPaymentAuthorized(tx, { razorpayPaymentId: paymentId });
    return { ok: true, status: 200, message: 'authorized' };
  }

  if (event.event === 'payment.failed' && entity) {
    const orderId = entity.order_id;
    const paymentId = entity.id;
    const reason =
      (entity.error_description && String(entity.error_description)) ||
      (entity.error_code && String(entity.error_code)) ||
      'payment_failed';
    const tx = await Transaction.findOne({ razorpayOrderId: orderId });
    if (tx) {
      await recordPaymentFailed(tx, { razorpayPaymentId: paymentId, failureReason: reason }, correlationId);
    }
    return { ok: true, status: 200, message: 'failed handled' };
  }

  if (event.event === 'refund.processed' && event.payload && event.payload.refund) {
    const refund = event.payload.refund.entity;
    const paymentId = refund && refund.payment_id;
    if (paymentId) {
      const tx = await Transaction.findOne({ razorpayPaymentId: paymentId });
      if (tx) {
        await recordPaymentRefunded(tx);
      }
    }
    return { ok: true, status: 200, message: 'refund handled' };
  }

  return { ok: true, status: 200, message: 'noop' };
}

module.exports = { processWebhook, verifyWebhookSignature };
