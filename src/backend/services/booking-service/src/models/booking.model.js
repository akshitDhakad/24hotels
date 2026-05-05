const mongoose = require('mongoose');

const SLOT_TYPES = [4, 8, 12, 16, 20, 24];

const bookingSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, trim: true, index: true },
    roomId: { type: String, required: true, trim: true, index: true },
    hostId: { type: String, required: true, trim: true, index: true },
    slotType: { type: Number, required: true, enum: SLOT_TYPES, index: true },
    checkIn: { type: Date, required: true, index: true },
    checkOut: { type: Date, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    razorpayOrderId: { type: String, default: null, index: true, trim: true },
    razorpayPaymentId: { type: String, default: null, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

bookingSchema.index({ hostId: 1, status: 1, createdAt: -1 });
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ roomId: 1, slotType: 1, status: 1, checkIn: 1 });
bookingSchema.index({ status: 1, checkIn: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
