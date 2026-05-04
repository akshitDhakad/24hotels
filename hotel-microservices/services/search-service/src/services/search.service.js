const crypto = require('crypto');
const Room = require('../models/room.model');
const { getRedis } = require('../config/redis');
const { AppError } = require('../utils/AppError');
const { escapeRegex, normalizeForCacheKey } = require('./search-query.util');

function mapLeanRoom(doc) {
  if (!doc) return doc;
  const o = { ...doc };
  if (o._id) {
    o.id = o._id.toString();
    delete o._id;
  }
  return o;
}

const CACHE_PREFIX = 'search:';
const CACHE_TTL_SEC = 300;
const CITIES_CACHE_KEY = `${CACHE_PREFIX}meta:cities:v1`;
const CITIES_CACHE_TTL_SEC = 600;
const ROOM_DETAIL_PREFIX = `${CACHE_PREFIX}room:`;

function stableQueryString(query) {
  return JSON.stringify(normalizeForCacheKey(query));
}

function cacheKeyForRooms(query) {
  const hash = crypto.createHash('sha256').update(stableQueryString(query)).digest('hex');
  return `${CACHE_PREFIX}${hash}`;
}

function buildMongoFilter(query) {
  const filter = { isActive: true };
  if (query.city) {
    const safe = escapeRegex(query.city.trim());
    filter.city = new RegExp(safe, 'i');
  }
  if (query.minPrice != null || query.maxPrice != null) {
    filter.pricePerSlot = {};
    if (query.minPrice != null) {
      filter.pricePerSlot.$gte = query.minPrice;
    }
    if (query.maxPrice != null) {
      filter.pricePerSlot.$lte = query.maxPrice;
    }
  }
  if (query.slotType != null) {
    filter.availableSlots = query.slotType;
  }
  if (query.amenities && query.amenities.length) {
    const normalized = query.amenities.map((a) => String(a).trim()).filter(Boolean);
    if (normalized.length) {
      filter.amenities = { $all: normalized };
    }
  }
  return filter;
}

function assertValidPriceRange(query) {
  if (query.minPrice != null && query.maxPrice != null && query.minPrice > query.maxPrice) {
    throw new AppError(400, 'minPrice cannot be greater than maxPrice');
  }
}

/**
 * @param {object} query validated list query
 */
async function searchRooms(query) {
  assertValidPriceRange(query);
  const normalized = normalizeForCacheKey(query);
  const redis = getRedis();
  const key = cacheKeyForRooms(normalized);
  const cached = await redis.get(key);
  if (cached) {
    return { ...JSON.parse(cached), cached: true };
  }

  const page = normalized.page || 1;
  const limit = Math.min(normalized.limit || 10, 50);
  const filter = buildMongoFilter(normalized);
  const skip = (page - 1) * limit;

  const [rawItems, total] = await Promise.all([
    Room.find(filter).sort({ pricePerSlot: 1, title: 1 }).skip(skip).limit(limit).lean(),
    Room.countDocuments(filter),
  ]);
  const items = rawItems.map(mapLeanRoom);

  const result = {
    items,
    page,
    limit,
    total,
    cached: false,
  };
  await redis.set(key, JSON.stringify(result), 'EX', CACHE_TTL_SEC);
  return result;
}

/**
 * @param {string} sourceRoomId
 */
async function getRoomBySourceId(sourceRoomId) {
  const redis = getRedis();
  const detailKey = `${ROOM_DETAIL_PREFIX}${sourceRoomId}`;
  const cached = await redis.get(detailKey);
  if (cached) {
    return { room: JSON.parse(cached), cached: true };
  }
  const roomDoc = await Room.findOne({ sourceRoomId, isActive: true }).lean();
  if (!roomDoc) {
    throw new AppError(404, 'Room not found');
  }
  const room = mapLeanRoom(roomDoc);
  await redis.set(detailKey, JSON.stringify(room), 'EX', CACHE_TTL_SEC);
  return { room, cached: false };
}

/**
 * Distinct cities for filter UI (active rooms only).
 * @param {{ prefix?: string, limit: number }} opts
 */
async function listCities(opts) {
  const redis = getRedis();
  const prefixKey = (opts.prefix || '').toLowerCase();
  const cacheKey = `${CITIES_CACHE_KEY}:${prefixKey}:${opts.limit}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return { cities: JSON.parse(cached), cached: true };
  }

  const match = { isActive: true };
  if (opts.prefix) {
    match.city = new RegExp(`^${escapeRegex(opts.prefix.trim())}`, 'i');
  }
  const rows = await Room.distinct('city', match);
  const cities = rows
    .map((c) => String(c).trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .slice(0, opts.limit);

  await redis.set(cacheKey, JSON.stringify(cities), 'EX', CITIES_CACHE_TTL_SEC);
  return { cities, cached: false };
}

module.exports = {
  searchRooms,
  getRoomBySourceId,
  listCities,
  stableQueryString,
  cacheKeyForRooms,
  buildMongoFilter,
};
