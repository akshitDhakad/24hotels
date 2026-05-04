const mongoose = require('mongoose');

const SLOT_TYPES = [4, 8, 12, 16, 20, 24];

const slotLockSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    slotType: { type: Number, required: true, enum: SLOT_TYPES },
    lockedBy: { type: String, required: true, trim: true },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false }
);

slotLockSchema.index({ roomId: 1, date: 1, slotType: 1 }, { unique: true });
slotLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('SlotLock', slotLockSchema);
