const mongoose = require('mongoose');

const SLOT_TYPES = [4, 8, 12, 16, 20, 24];

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    hostId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    city: { type: String, required: true, index: true },
    address: { type: String, default: '' },
    pricePerSlot: { type: Number, required: true, index: true },
    availableSlots: [{ type: Number, enum: SLOT_TYPES }],
    amenities: [{ type: String }],
    images: [imageSchema],
    isActive: { type: Boolean, default: true, index: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

roomSchema.index({ hostId: 1, createdAt: -1 });

module.exports = mongoose.model('Room', roomSchema);
