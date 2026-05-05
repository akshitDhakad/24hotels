const mongoose = require('mongoose');

const TRANSACTION_STATUSES = ['created', 'authorized', 'captured', 'failed', 'refunded'];

const transactionSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, trim: true, index: true },
    customerId: { type: String, required: true, trim: true, index: true },
    razorpayOrderId: { type: String, required: true, unique: true, trim: true, index: true },
    razorpayPaymentId: { type: String, default: null, trim: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR', trim: true, uppercase: true },
    status: {
      type: String,
      required: true,
      enum: TRANSACTION_STATUSES,
      default: 'created',
      index: true,
    },
    failureReason: { type: String, default: null, trim: true },
    contactEmail: { type: String, default: null, trim: true },
    contactPhone: { type: String, default: null, trim: true },
    hostNotifyPhone: { type: String, default: null, trim: true },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

transactionSchema.index({ bookingId: 1, createdAt: -1 });
transactionSchema.index({ customerId: 1, createdAt: -1 });
transactionSchema.index({ customerId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
