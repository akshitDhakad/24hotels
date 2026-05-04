const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true, index: true },
    channel: { type: String, required: true, enum: ['email', 'sms'], index: true },
    event: { type: String, required: true, index: true },
    status: { type: String, required: true, enum: ['sent', 'failed', 'skipped'], index: true },
    sentAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

notificationLogSchema.index({ event: 1, sentAt: -1 });

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
