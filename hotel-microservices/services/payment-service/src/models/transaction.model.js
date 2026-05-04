const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, index: true },
    razorpayOrderId: { type: String, required: true, unique: true, index: true },
    razorpayPaymentId: { type: String, default: null, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR' },
    status: {
      type: String,
      required: true,
      enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'created',
      index: true,
    },
    contactEmail: { type: String, default: null },
    contactPhone: { type: String, default: null },
    hostNotifyPhone: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

transactionSchema.index({ bookingId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
