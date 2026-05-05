const Transaction = require('../models/transaction.model');
const { logger } = require('../utils/logger');

async function handleBookingCancelled(payload) {
  const orderId = payload.razorpayOrderId;
  if (!orderId) {
    return;
  }
  const tx = await Transaction.findOne({ razorpayOrderId: orderId });
  if (!tx) {
    return;
  }
  if (tx.status === 'captured' || tx.status === 'refunded') {
    return;
  }
  tx.status = 'failed';
  await tx.save();
  logger.info('Transaction marked failed due to booking cancellation', { razorpayOrderId: orderId });
}

module.exports = { handleBookingCancelled };
