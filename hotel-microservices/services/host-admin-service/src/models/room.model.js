const mongoose = require('mongoose');

const SLOT_TYPES = [4, 8, 12, 16, 20, 24];

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    hostId: { type: String, required: true, trim: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', trim: true, maxlength: 5000 },
    city: { type: String, required: true, trim: true, maxlength: 120, index: true },
    address: { type: String, default: '', trim: true, maxlength: 500 },
    pricePerSlot: { type: Number, required: true, min: 0, index: true },
    availableSlots: [{ type: Number, enum: SLOT_TYPES }],
    amenities: [{ type: String, trim: true }],
    images: [imageSchema],
    isActive: { type: Boolean, default: true, index: true },
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

roomSchema.index({ hostId: 1, createdAt: -1 });
roomSchema.index({ city: 1, isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Room', roomSchema);
