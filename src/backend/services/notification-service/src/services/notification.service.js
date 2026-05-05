const mongoose = require('mongoose');
const NotificationLog = require('../models/notification-log.model');
const { AppError } = require('../utils/AppError');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assertValidObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid id');
  }
}

function userAccessFilter(user) {
  const email = (user.email && String(user.email).toLowerCase().trim()) || '';
  const clauses = [{ customerId: user.id }, { hostId: user.id }];
  if (email) {
    clauses.push({ recipient: new RegExp(`^${escapeRegex(email)}$`, 'i') });
  }
  return { $or: clauses };
}

async function listLogsForCurrentUser(user, query) {
  const { page, limit, channel, event, status } = query;
  const filter = userAccessFilter(user);
  if (channel) {
    filter.channel = channel;
  }
  if (event) {
    filter.event = event;
  }
  if (status) {
    filter.status = status;
  }
  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    NotificationLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    NotificationLog.countDocuments(filter),
  ]);
  return { logs: docs.map((d) => d.toJSON()), page, limit, total };
}

async function getLogForCurrentUser(user, logId) {
  assertValidObjectId(logId);
  const doc = await NotificationLog.findOne({ _id: logId, ...userAccessFilter(user) });
  if (!doc) {
    throw new AppError(404, 'Notification log not found');
  }
  return doc.toJSON();
}

async function listLogsAdmin(query) {
  const { page, limit, channel, event, status, bookingId, customerId, hostId, recipient, correlationId, createdFrom, createdTo } =
    query;
  const filter = {};
  if (channel) {
    filter.channel = channel;
  }
  if (event) {
    filter.event = event;
  }
  if (status) {
    filter.status = status;
  }
  if (bookingId) {
    filter.bookingId = bookingId;
  }
  if (customerId) {
    filter.customerId = customerId;
  }
  if (hostId) {
    filter.hostId = hostId;
  }
  if (correlationId) {
    filter.correlationId = correlationId;
  }
  if (recipient) {
    filter.recipient = new RegExp(escapeRegex(String(recipient)), 'i');
  }
  if (createdFrom || createdTo) {
    filter.createdAt = {};
    if (createdFrom) {
      filter.createdAt.$gte = new Date(createdFrom);
    }
    if (createdTo) {
      filter.createdAt.$lte = new Date(createdTo);
    }
  }
  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    NotificationLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    NotificationLog.countDocuments(filter),
  ]);
  return { logs: docs.map((d) => d.toJSON()), page, limit, total };
}

async function getLogAdmin(logId) {
  assertValidObjectId(logId);
  const doc = await NotificationLog.findById(logId);
  if (!doc) {
    throw new AppError(404, 'Notification log not found');
  }
  return doc.toJSON();
}

module.exports = {
  listLogsForCurrentUser,
  getLogForCurrentUser,
  listLogsAdmin,
  getLogAdmin,
};
