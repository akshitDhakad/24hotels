const mongoose = require('mongoose');
const Room = require('../models/room.model');
const { AppError } = require('../utils/AppError');
const { publishEvent } = require('../events/publisher');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mapUploadedImages(files = []) {
  return files.map((f) => ({
    url: f.path,
    publicId: f.filename,
    width: f.width,
    height: f.height,
  }));
}

function serializeRoom(room) {
  const r = room.toObject ? room.toObject() : room;
  return {
    id: (r._id && r._id.toString()) || r.id,
    hostId: r.hostId,
    title: r.title,
    description: r.description,
    city: r.city,
    address: r.address,
    pricePerSlot: r.pricePerSlot,
    availableSlots: r.availableSlots,
    amenities: r.amenities,
    images: r.images || [],
    isActive: r.isActive,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

async function createRoom(hostId, payload, files, correlationId) {
  const uploaded = mapUploadedImages(files || []);
  const images = [...(payload.images || []), ...uploaded];
  const room = await Room.create({
    hostId,
    title: payload.title,
    description: payload.description || '',
    city: payload.city,
    address: payload.address || '',
    pricePerSlot: payload.pricePerSlot,
    availableSlots: payload.availableSlots,
    amenities: payload.amenities || [],
    images,
    isActive: true,
  });
  await publishEvent('room.created', { room: serializeRoom(room) }, correlationId);
  return serializeRoom(room);
}

async function updateRoom(hostId, roomId, payload, files, correlationId) {
  assertValidObjectId(roomId);
  const room = await Room.findById(roomId);
  if (!room) {
    throw new AppError(404, 'Room not found');
  }
  if (room.hostId !== hostId) {
    throw new AppError(403, 'Forbidden');
  }
  const uploaded = mapUploadedImages(files || []);
  const mergedImages = [...(room.images || []), ...uploaded, ...(payload.images || [])];
  room.title = payload.title ?? room.title;
  room.description = payload.description ?? room.description;
  room.city = payload.city ?? room.city;
  room.address = payload.address ?? room.address;
  room.pricePerSlot = payload.pricePerSlot ?? room.pricePerSlot;
  room.availableSlots = payload.availableSlots ?? room.availableSlots;
  room.amenities = payload.amenities ?? room.amenities;
  if (mergedImages.length) {
    room.images = mergedImages;
  }
  await room.save();
  await publishEvent('room.updated', { room: serializeRoom(room) }, correlationId);
  return serializeRoom(room);
}

async function softDeleteRoom(hostId, roomId, correlationId) {
  assertValidObjectId(roomId);
  const room = await Room.findById(roomId);
  if (!room) {
    throw new AppError(404, 'Room not found');
  }
  if (room.hostId !== hostId) {
    throw new AppError(403, 'Forbidden');
  }
  room.isActive = false;
  await room.save();
  await publishEvent('room.updated', { room: serializeRoom(room) }, correlationId);
  return serializeRoom(room);
}

function assertValidObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid room id');
  }
}

async function getRoomForHost(hostId, roomId) {
  assertValidObjectId(roomId);
  const room = await Room.findById(roomId);
  if (!room) {
    throw new AppError(404, 'Room not found');
  }
  if (room.hostId !== hostId) {
    throw new AppError(403, 'Forbidden');
  }
  return serializeRoom(room);
}

async function listMyRooms(hostId) {
  const rooms = await Room.find({ hostId }).sort({ createdAt: -1 });
  return rooms.map((r) => serializeRoom(r));
}

async function listRoomsForAdmin(query) {
  const { page, limit, hostId, city, isActive, search } = query;
  const filter = {};
  if (hostId) {
    filter.hostId = hostId;
  }
  if (city) {
    filter.city = new RegExp(escapeRegex(city), 'i');
  }
  if (typeof isActive === 'boolean') {
    filter.isActive = isActive;
  }
  if (search) {
    filter.title = new RegExp(escapeRegex(search), 'i');
  }
  const skip = (page - 1) * limit;
  const [rooms, total] = await Promise.all([
    Room.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Room.countDocuments(filter),
  ]);
  return { rooms: rooms.map((r) => serializeRoom(r)), page, limit, total };
}

async function getRoomForAdmin(roomId) {
  assertValidObjectId(roomId);
  const room = await Room.findById(roomId);
  if (!room) {
    throw new AppError(404, 'Room not found');
  }
  return serializeRoom(room);
}

async function adminSoftDeleteRoom(roomId, correlationId) {
  assertValidObjectId(roomId);
  const room = await Room.findById(roomId);
  if (!room) {
    throw new AppError(404, 'Room not found');
  }
  room.isActive = false;
  await room.save();
  await publishEvent('room.updated', { room: serializeRoom(room) }, correlationId);
  return serializeRoom(room);
}

module.exports = {
  createRoom,
  updateRoom,
  softDeleteRoom,
  getRoomForHost,
  listMyRooms,
  listRoomsForAdmin,
  getRoomForAdmin,
  adminSoftDeleteRoom,
  serializeRoom,
};
