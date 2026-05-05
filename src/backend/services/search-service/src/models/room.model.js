const mongoose = require('mongoose');

const SLOT_TYPES = [4, 8, 12, 16, 20, 24];

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    sourceRoomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 64,
    },
    hostId: { type: String, required: true, trim: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
    description: { type: String, default: '', trim: true, maxlength: 5000 },
    city: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
    address: { type: String, default: '', trim: true, maxlength: 500 },
    pricePerSlot: { type: Number, required: true, min: 0 },
    availableSlots: {
      type: [{ type: Number, enum: SLOT_TYPES }],
      validate: {
        validator(arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'availableSlots must be a non-empty array of slot lengths',
      },
    },
    amenities: [{ type: String, trim: true, maxlength: 80 }],
    images: [imageSchema],
    isActive: { type: Boolean, default: true, index: true },
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

roomSchema.index({ city: 1, isActive: 1, pricePerSlot: 1 });
roomSchema.index({ hostId: 1, isActive: 1 });
roomSchema.index({ availableSlots: 1 });

module.exports = mongoose.model('Room', roomSchema);
