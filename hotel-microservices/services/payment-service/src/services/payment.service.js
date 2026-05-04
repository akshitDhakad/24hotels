const crypto = require('crypto');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const { getEnv } = require('../config/env');
const Transaction = require('../models/transaction.model');
const { AppError } = require('../utils/AppError');
const { publishEvent } = require('../events/publisher');

function getClient() {
  const env = getEnv();
  return new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

function verifySignature(orderId, paymentId, signature) {
  const env = getEnv();
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(signature), 'utf8');
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

function assertValidObjectId(id, message = 'Invalid id') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, message);
  }
}

async function recordPaymentCaptured(tx, { razorpayPaymentId, amount, currency }, correlationId) {
  if (tx.status === 'captured') {
    if (String(tx.razorpayPaymentId) === String(razorpayPaymentId)) {
      return { duplicate: true };
    }
    return { duplicate: true, conflict: true };
  }
  if (tx.status === 'refunded') {
    return { duplicate: true, skipped: true };
  }
  tx.razorpayPaymentId = razorpayPaymentId;
  tx.status = 'captured';
  tx.failureReason = null;
  if (amount != null) {
    tx.amount = amount;
  }
  if (currency) {
    tx.currency = String(currency).toUpperCase();
  }
  await tx.save();
  await publishEvent(
    'payment.confirmed',
    {
      bookingId: tx.bookingId,
      razorpayOrderId: tx.razorpayOrderId,
      razorpayPaymentId,
      amount: tx.amount,
      currency: tx.currency,
      contactEmail: tx.contactEmail,
      contactPhone: tx.contactPhone,
      hostNotifyPhone: tx.hostNotifyPhone,
    },
    correlationId
  );
  return { duplicate: false };
}

async function recordPaymentAuthorized(tx, { razorpayPaymentId }) {
  if (tx.status === 'captured') {
    return;
  }
  if (tx.status === 'authorized' && String(tx.razorpayPaymentId) === String(razorpayPaymentId)) {
    return;
  }
  tx.razorpayPaymentId = razorpayPaymentId;
  tx.status = 'authorized';
  tx.failureReason = null;
  await tx.save();
}

async function recordPaymentFailed(tx, { razorpayPaymentId, failureReason }, correlationId) {
  if (tx.status === 'captured' || tx.status === 'refunded') {
    return { skipped: true };
  }
  if (tx.status === 'failed' && String(tx.razorpayPaymentId) === String(razorpayPaymentId)) {
    return { duplicate: true };
  }
  tx.razorpayPaymentId = razorpayPaymentId || tx.razorpayPaymentId;
  tx.status = 'failed';
  if (failureReason) {
    tx.failureReason = failureReason;
  }
  await tx.save();
  await publishEvent(
    'payment.failed',
    {
      bookingId: tx.bookingId,
      razorpayOrderId: tx.razorpayOrderId,
      razorpayPaymentId: tx.razorpayPaymentId,
      contactEmail: tx.contactEmail,
      contactPhone: tx.contactPhone,
    },
    correlationId
  );
  return { duplicate: false };
}

async function recordPaymentRefunded(tx) {
  if (tx.status === 'refunded') {
    return { duplicate: true };
  }
  tx.status = 'refunded';
  await tx.save();
  return { duplicate: false };
}

async function createOrder(userId, body) {
  const { bookingId, amount, currency, receipt, contactEmail, contactPhone, hostNotifyPhone } = body;

  const latest = await Transaction.findOne({ bookingId }).sort({ createdAt: -1 });
  if (latest) {
    if (latest.status === 'captured') {
      throw new AppError(409, 'Booking already paid');
    }
    if (latest.status === 'authorized') {
      if (latest.customerId !== userId) {
        throw new AppError(403, 'Payment in progress for another account');
      }
      throw new AppError(409, 'Payment in progress');
    }
    if (latest.status === 'created' && latest.customerId !== userId) {
      throw new AppError(403, 'An order already exists for this booking under another account');
    }
  }

  await Transaction.deleteMany({ bookingId, customerId: userId, status: 'created' });

  const razorpay = getClient();
  const receiptValue = (receipt || `rcpt_${bookingId}`).toString().slice(0, 40);
  const order = await razorpay.orders.create({
    amount: Math.round(amount),
    currency: currency || 'INR',
    receipt: receiptValue,
    notes: {
      bookingId: String(bookingId),
      userId: String(userId),
    },
  });

  await Transaction.create({
    bookingId,
    customerId: userId,
    razorpayOrderId: order.id,
    amount: order.amount,
    currency: order.currency,
    status: 'created',
    contactEmail: contactEmail || null,
    contactPhone: contactPhone || null,
    hostNotifyPhone: hostNotifyPhone || null,
  });

  const env = getEnv();
  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: env.RAZORPAY_KEY_ID,
  };
}

async function verifyPayment(userId, body, correlationId) {
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body;
  if (!verifySignature(orderId, paymentId, signature)) {
    throw new AppError(400, 'Invalid signature');
  }

  const tx = await Transaction.findOne({ razorpayOrderId: orderId });
  if (!tx) {
    throw new AppError(404, 'Order not found');
  }
  if (tx.customerId !== userId) {
    throw new AppError(403, 'Forbidden');
  }

  const razorpay = getClient();
  let payment;
  try {
    payment = await razorpay.payments.fetch(paymentId);
  } catch {
    throw new AppError(502, 'Unable to verify payment with Razorpay');
  }

  if (String(payment.order_id) !== String(orderId)) {
    throw new AppError(400, 'Payment does not belong to this order');
  }

  const latest = await Transaction.findById(tx._id);
  if (!latest) {
    throw new AppError(404, 'Order not found');
  }
  if (Number(payment.amount) !== Number(latest.amount)) {
    throw new AppError(400, 'Payment amount does not match order');
  }

  if (latest.status === 'captured') {
    if (String(latest.razorpayPaymentId) !== String(paymentId)) {
      throw new AppError(409, 'Order already paid with another payment');
    }
    return { orderId, paymentId, status: 'captured', duplicate: true };
  }

  const status = payment.status;

  if (status === 'captured') {
    const cap = await recordPaymentCaptured(
      latest,
      {
        razorpayPaymentId: paymentId,
        amount: payment.amount,
        currency: payment.currency,
      },
      correlationId
    );
    if (cap.conflict) {
      throw new AppError(409, 'Order already captured with a different payment');
    }
    return { orderId, paymentId, status: 'captured', duplicate: Boolean(cap.duplicate) };
  }

  if (status === 'authorized') {
    await recordPaymentAuthorized(latest, { razorpayPaymentId: paymentId });
    return { orderId, paymentId, status: 'authorized' };
  }

  if (status === 'failed') {
    const reason = (payment.error_description && String(payment.error_description)) || 'payment_failed';
    await recordPaymentFailed(latest, { razorpayPaymentId: paymentId, failureReason: reason }, correlationId);
    return { orderId, paymentId, status: 'failed' };
  }

  return { orderId, paymentId, status };
}

async function listMyTransactions(userId, query) {
  const { page, limit, status } = query;
  const filter = { customerId: userId };
  if (status) {
    filter.status = status;
  }
  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Transaction.countDocuments(filter),
  ]);
  return { transactions: docs.map((d) => d.toJSON()), page, limit, total };
}

async function getTransactionForCustomer(userId, transactionId) {
  assertValidObjectId(transactionId);
  const tx = await Transaction.findById(transactionId);
  if (!tx) {
    throw new AppError(404, 'Transaction not found');
  }
  if (tx.customerId !== userId) {
    throw new AppError(403, 'Forbidden');
  }
  return tx.toJSON();
}

async function listAllTransactionsAdmin(query) {
  const { page, limit, status, bookingId, customerId } = query;
  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (bookingId) {
    filter.bookingId = bookingId;
  }
  if (customerId) {
    filter.customerId = customerId;
  }
  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Transaction.countDocuments(filter),
  ]);
  return { transactions: docs.map((d) => d.toJSON()), page, limit, total };
}

async function getTransactionAdmin(transactionId) {
  assertValidObjectId(transactionId);
  const tx = await Transaction.findById(transactionId);
  if (!tx) {
    throw new AppError(404, 'Transaction not found');
  }
  return tx.toJSON();
}

module.exports = {
  createOrder,
  verifyPayment,
  verifySignature,
  listMyTransactions,
  getTransactionForCustomer,
  listAllTransactionsAdmin,
  getTransactionAdmin,
  recordPaymentCaptured,
  recordPaymentAuthorized,
  recordPaymentFailed,
  recordPaymentRefunded,
};
