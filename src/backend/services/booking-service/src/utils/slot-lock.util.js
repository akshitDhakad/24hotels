const SlotLock = require('../models/slot-lock.model');
const { getRedis } = require('../config/redis');
const { logger } = require('./logger');

const LOCK_TTL_SEC = 600;

function lockKey(roomId, date, slotType) {
  return `slot-lock:${roomId}:${date}:${slotType}`;
}

function calendarDateFromCheckIn(checkIn) {
  return new Date(checkIn).toISOString().slice(0, 10);
}

async function acquireSlotLock(userId, { roomId, date, slotType }) {
  const redis = getRedis();
  const key = lockKey(roomId, date, slotType);
  const value = JSON.stringify({ lockedBy: userId });
  const result = await redis.set(key, value, 'EX', LOCK_TTL_SEC, 'NX');
  if (result !== 'OK') {
    return { acquired: false };
  }
  const expiresAt = new Date(Date.now() + LOCK_TTL_SEC * 1000);
  await SlotLock.deleteMany({ roomId, date, slotType });
  await SlotLock.create({ roomId, date, slotType, lockedBy: userId, expiresAt });
  return { acquired: true, expiresAt };
}

async function verifyLockHeldByUser(userId, roomId, date, slotType) {
  const redis = getRedis();
  const key = lockKey(roomId, date, slotType);
  const raw = await redis.get(key);
  if (!raw) {
    return { ok: false, reason: 'missing' };
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed.lockedBy !== userId) {
      return { ok: false, reason: 'forbidden' };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: 'invalid' };
  }
}

async function releaseSlotLock(roomId, date, slotType) {
  const redis = getRedis();
  const key = lockKey(roomId, date, slotType);
  await redis.del(key);
  await SlotLock.deleteMany({ roomId, date, slotType });
}

async function releaseSlotLockForBooking(booking) {
  try {
    const dateStr = calendarDateFromCheckIn(booking.checkIn);
    await releaseSlotLock(booking.roomId, dateStr, booking.slotType);
  } catch (err) {
    logger.warn('releaseSlotLockForBooking failed', { message: err.message, bookingId: String(booking._id) });
  }
}

async function releaseLockIfHeldByUser(userId, { roomId, date, slotType }) {
  const check = await verifyLockHeldByUser(userId, roomId, date, slotType);
  if (!check.ok) {
    return { released: false, reason: check.reason };
  }
  await releaseSlotLock(roomId, date, slotType);
  return { released: true };
}

module.exports = {
  LOCK_TTL_SEC,
  lockKey,
  calendarDateFromCheckIn,
  acquireSlotLock,
  verifyLockHeldByUser,
  releaseSlotLock,
  releaseSlotLockForBooking,
  releaseLockIfHeldByUser,
};
