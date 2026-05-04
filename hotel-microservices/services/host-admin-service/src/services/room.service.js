const Room = require('../models/room.model');
const { AppError } = require('../utils/AppError');
const { publishEvent } = require('../events/publisher');

function mapUploadedImages(files = []) {
  return files.map((f) => ({
    url: f.path,
    publicId: f.filename,
    width: f.width,
    height: f.height,
  }));
}

function serializeRoom(room) {
  return {
    id: room._id.toString(),
    hostId: room.hostId,
    title: room.title,
    description: room.description,
    city: room.city,
    address: room.address,
    pricePerSlot: room.pricePerSlot,
    availableSlots: room.availableSlots,
    amenities: room.amenities,
    images: room.images || [],
    isActive: room.isActive,
    createdAt: room.createdAt,
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
  return room;
}

async function updateRoom(hostId, roomId, payload, files, correlationId) {
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
  return room;
}

async function softDeleteRoom(hostId, roomId, correlationId) {
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
  return room;
}

async function listMyRooms(hostId) {
  return Room.find({ hostId }).sort({ createdAt: -1 }).lean();
}

module.exports = {
  createRoom,
  updateRoom,
  softDeleteRoom,
  listMyRooms,
  serializeRoom,
};
