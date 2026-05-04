const crypto = require('crypto');
const { getEnv } = require('../config/env');
const { publishEvent } = require('../events/publisher');
const Transaction = require('../models/transaction.model');
const { logger } = require('../utils/logger');

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

  const entity = event.payload && event.payload.payment ? event.payload.payment.entity : null;
  const orderEntity = event.payload && event.payload.order ? event.payload.order.entity : null;

  if (event.event === 'payment.captured' && entity) {
    const paymentId = entity.id;
    const orderId = entity.order_id;
    const amount = entity.amount;
    const currency = entity.currency;
    const bookingId = (entity.notes && entity.notes.bookingId) || (orderEntity && orderEntity.notes && orderEntity.notes.bookingId);

    const tx = await Transaction.findOne({ razorpayOrderId: orderId });
    if (!tx) {
      logger.warn('Webhook for unknown order', { orderId });
      return { ok: true, status: 200, message: 'ignored' };
    }
    if (tx.razorpayPaymentId === paymentId && tx.status === 'captured') {
      return { ok: true, status: 200, message: 'duplicate' };
    }
    tx.razorpayPaymentId = paymentId;
    tx.status = 'captured';
    tx.amount = amount || tx.amount;
    tx.currency = currency || tx.currency;
    await tx.save();

    await publishEvent(
      'payment.confirmed',
      {
        bookingId: tx.bookingId,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        amount: tx.amount,
        currency: tx.currency,
        contactEmail: tx.contactEmail,
        contactPhone: tx.contactPhone,
        hostNotifyPhone: tx.hostNotifyPhone,
      },
      correlationId
    );
    return { ok: true, status: 200, message: 'captured' };
  }

  if (event.event === 'payment.failed' && entity) {
    const orderId = entity.order_id;
    const paymentId = entity.id;
    const tx = await Transaction.findOne({ razorpayOrderId: orderId });
    if (tx) {
      tx.razorpayPaymentId = paymentId;
      tx.status = 'failed';
      await tx.save();
      await publishEvent(
        'payment.failed',
        {
          bookingId: tx.bookingId,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          contactEmail: tx.contactEmail,
          contactPhone: tx.contactPhone,
        },
        correlationId
      );
    }
    return { ok: true, status: 200, message: 'failed handled' };
  }

  return { ok: true, status: 200, message: 'noop' };
}

module.exports = { processWebhook, verifyWebhookSignature };
