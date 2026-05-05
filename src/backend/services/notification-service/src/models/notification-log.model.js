const mongoose = require('mongoose');

const CHANNELS = ['email', 'sms'];
const STATUSES = ['sent', 'failed', 'skipped'];

const notificationLogSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true, trim: true, index: true },
    channel: { type: String, required: true, enum: CHANNELS, index: true },
    event: { type: String, required: true, trim: true, index: true },
    status: { type: String, required: true, enum: STATUSES, index: true },
    correlationId: { type: String, default: null, trim: true, index: true },
    bookingId: { type: String, default: null, trim: true, index: true },
    customerId: { type: String, default: null, trim: true, index: true },
    hostId: { type: String, default: null, trim: true, index: true },
    subject: { type: String, default: null, trim: true },
    errorMessage: { type: String, default: null, trim: true },
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

notificationLogSchema.index({ event: 1, createdAt: -1 });
notificationLogSchema.index({ customerId: 1, createdAt: -1 });
notificationLogSchema.index({ hostId: 1, createdAt: -1 });
notificationLogSchema.index({ bookingId: 1, createdAt: -1 });

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
