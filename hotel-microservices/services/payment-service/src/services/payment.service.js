const crypto = require('crypto');
const Razorpay = require('razorpay');
const { getEnv } = require('../config/env');
const Transaction = require('../models/transaction.model');
const { AppError } = require('../utils/AppError');

function getClient() {
  const env = getEnv();
  return new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

async function createOrder(userId, body) {
  const { bookingId, amount, currency, receipt, contactEmail, contactPhone, hostNotifyPhone } = body;
  const existing = await Transaction.findOne({ bookingId }).sort({ createdAt: -1 });
  if (existing && existing.status === 'captured') {
    throw new AppError(409, 'Booking already paid');
  }

  await Transaction.deleteMany({ bookingId, status: { $in: ['created'] } });

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
    razorpayOrderId: order.id,
    amount: order.amount,
    currency: order.currency,
    status: 'created',
    contactEmail: contactEmail || null,
    contactPhone: contactPhone || null,
    hostNotifyPhone: hostNotifyPhone || null,
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: getEnv().RAZORPAY_KEY_ID,
  };
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

async function verifyPayment(body) {
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body;
  if (!orderId || !paymentId || !signature) {
    throw new AppError(400, 'Missing verification fields');
  }
  if (!verifySignature(orderId, paymentId, signature)) {
    throw new AppError(400, 'Invalid signature');
  }
  const tx = await Transaction.findOne({ razorpayOrderId: orderId });
  if (!tx) {
    throw new AppError(404, 'Order not found');
  }
  tx.razorpayPaymentId = paymentId;
  tx.status = 'authorized';
  await tx.save();
  return { success: true, orderId, paymentId };
}

module.exports = { createOrder, verifyPayment, verifySignature };
