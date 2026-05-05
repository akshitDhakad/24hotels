const Room = require('../models/room.model');
const { getRedis } = require('../config/redis');
const { logger } = require('../utils/logger');

const SEARCH_KEY_PREFIX = 'search:';

async function scanAndDeleteSearchKeys() {
  const redis = getRedis();
  const stream = redis.scanStream({ match: `${SEARCH_KEY_PREFIX}*`, count: 100 });
  const keys = [];
  await new Promise((resolve, reject) => {
    stream.on('data', (batch) => {
      keys.push(...batch);
    });
    stream.on('end', resolve);
    stream.on('error', reject);
  });
  if (keys.length) {
    const chunkSize = 500;
    for (let i = 0; i < keys.length; i += chunkSize) {
      const chunk = keys.slice(i, i + chunkSize);
      await redis.del(...chunk);
    }
  }
}

async function invalidateSearchCache() {
  try {
    await scanAndDeleteSearchKeys();
  } catch (err) {
    logger.warn('Failed to invalidate search cache', { message: err.message });
  }
}

async function upsertRoomFromPayload(payload) {
  const room = payload.room;
  if (!room || !room.id) {
    logger.warn('room sync skipped: missing room or id');
    return;
  }
  const doc = {
    sourceRoomId: room.id,
    hostId: String(room.hostId),
    title: room.title,
    description: room.description || '',
    city: room.city,
    address: room.address || '',
    pricePerSlot: Number(room.pricePerSlot),
    availableSlots: Array.isArray(room.availableSlots) && room.availableSlots.length ? room.availableSlots : [],
    amenities: Array.isArray(room.amenities) ? room.amenities.map((a) => String(a).trim()).filter(Boolean) : [],
    images: Array.isArray(room.images) ? room.images : [],
    isActive: room.isActive !== false,
    createdAt: room.createdAt ? new Date(room.createdAt) : new Date(),
  };
  if (!doc.availableSlots.length) {
    logger.warn('room sync skipped: empty availableSlots', { sourceRoomId: doc.sourceRoomId });
    return;
  }
  await Room.findOneAndUpdate({ sourceRoomId: doc.sourceRoomId }, { $set: doc }, { upsert: true });
  try {
    const redis = getRedis();
    await redis.del(`${SEARCH_KEY_PREFIX}room:${doc.sourceRoomId}`);
  } catch (err) {
    logger.warn('Failed to delete room detail cache', { message: err.message });
  }
  await invalidateSearchCache();
}

module.exports = { upsertRoomFromPayload, invalidateSearchCache };
