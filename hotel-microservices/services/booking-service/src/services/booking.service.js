const Booking = require('../models/booking.model');
const { AppError } = require('../utils/AppError');
const { publishEvent } = require('../events/publisher');
const {
  acquireSlotLock,
  verifyLockHeldByUser,
  releaseSlotLockForBooking,
  releaseLockIfHeldByUser,
} = require('../utils/slot-lock.util');

function utcDayBounds(dateStr) {
  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(`${dateStr}T23:59:59.999Z`);
  return { start, end };
}

function assertCheckoutAfterCheckin(checkIn, checkOut) {
  if (new Date(checkOut) <= new Date(checkIn)) {
    throw new AppError(400, 'checkOut must be after checkIn');
  }
}

function assertDateMatchesLockDay(date, checkIn) {
  const day = new Date(checkIn).toISOString().slice(0, 10);
  if (day !== date) {
    throw new AppError(400, 'date must match the UTC calendar day of checkIn (YYYY-MM-DD)');
  }
}

async function assertNoDuplicateActiveBooking(roomId, slotType, dateStr) {
  const { start, end } = utcDayBounds(dateStr);
  const existing = await Booking.findOne({
    roomId,
    slotType,
    status: { $in: ['PENDING', 'CONFIRMED'] },
    checkIn: { $gte: start, $lte: end },
  })
    .select('_id')
    .lean();
  if (existing) {
    throw new AppError(409, 'This room slot is already booked for that day');
  }
}

async function acquireSlotLockForUser(userId, body) {
  const { acquired, expiresAt } = await acquireSlotLock(userId, body);
  if (!acquired) {
    throw new AppError(409, 'Slot is already locked by another customer');
  }
  return { expiresAt };
}

async function releaseSlotLockForCustomer(userId, body) {
  const result = await releaseLockIfHeldByUser(userId, body);
  if (!result.released) {
    if (result.reason === 'missing') {
      throw new AppError(404, 'No active lock for this slot');
    }
    if (result.reason === 'forbidden') {
      throw new AppError(403, 'This lock belongs to another user');
    }
    throw new AppError(400, 'Invalid lock state');
  }
  return { message: 'Lock released' };
}

async function createBooking(userId, body, correlationId) {
  const {
    roomId,
    hostId,
    slotType,
    checkIn,
    checkOut,
    totalAmount,
    date,
    contactEmail,
    contactPhone,
    hostNotifyPhone,
  } = body;

  assertCheckoutAfterCheckin(checkIn, checkOut);
  assertDateMatchesLockDay(date, checkIn);

  const lock = await verifyLockHeldByUser(userId, roomId, date, slotType);
  if (!lock.ok) {
    if (lock.reason === 'missing') {
      throw new AppError(409, 'No active slot lock; acquire a lock first');
    }
    if (lock.reason === 'forbidden') {
      throw new AppError(403, 'Slot lock is held by another user');
    }
    throw new AppError(400, 'Invalid lock state');
  }

  await assertNoDuplicateActiveBooking(roomId, slotType, date);

  const booking = await Booking.create({
    customerId: userId,
    roomId,
    hostId,
    slotType,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    totalAmount,
    status: 'PENDING',
  });

  await publishEvent(
    'booking.created',
    {
      bookingId: booking._id.toString(),
      customerId: booking.customerId,
      hostId: booking.hostId,
      roomId: booking.roomId,
      slotType: booking.slotType,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalAmount: booking.totalAmount,
      contactEmail: contactEmail || null,
      contactPhone: contactPhone || null,
      hostNotifyPhone: hostNotifyPhone || null,
    },
    correlationId
  );

  return booking;
}

async function attachRazorpayOrder(customerId, bookingId, razorpayOrderId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  if (booking.customerId !== customerId) {
    throw new AppError(403, 'Forbidden');
  }
  if (booking.status !== 'PENDING') {
    throw new AppError(409, 'Booking is not pending');
  }
  booking.razorpayOrderId = razorpayOrderId;
  await booking.save();
  return booking;
}

async function cancelBooking(customerId, bookingId, correlationId, extras = {}) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  if (booking.customerId !== customerId) {
    throw new AppError(403, 'Forbidden');
  }
  if (booking.status !== 'PENDING') {
    throw new AppError(409, 'Only pending bookings can be cancelled by customer');
  }
  booking.status = 'CANCELLED';
  await booking.save();
  await releaseSlotLockForBooking(booking);
  await publishEvent(
    'booking.cancelled',
    {
      bookingId: booking._id.toString(),
      customerId: booking.customerId,
      hostId: booking.hostId,
      razorpayOrderId: booking.razorpayOrderId,
      reason: 'customer_cancelled',
      contactEmail: extras.contactEmail || null,
    },
    correlationId
  );
  return booking;
}

async function getBookingForCustomer(customerId, bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  if (booking.customerId !== customerId) {
    throw new AppError(403, 'Forbidden');
  }
  return booking;
}

async function listMyBookings(customerId, query) {
  const { page, limit, status } = query;
  const filter = { customerId };
  if (status) {
    filter.status = status;
  }
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Booking.countDocuments(filter),
  ]);
  return { bookings: items, page, limit, total };
}

async function listHostBookings(hostId, query) {
  const { page, limit, status } = query;
  const filter = { hostId };
  if (status) {
    filter.status = status;
  }
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Booking.countDocuments(filter),
  ]);
  return { bookings: items, page, limit, total };
}

async function listAllBookings(query) {
  const { page, limit, status } = query;
  const filter = {};
  if (status) {
    filter.status = status;
  }
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Booking.countDocuments(filter),
  ]);
  return { bookings: items, page, limit, total };
}

async function getBookingForHost(hostId, bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  if (booking.hostId !== hostId) {
    throw new AppError(403, 'Forbidden');
  }
  return booking;
}

async function getBookingForAdmin(bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  return booking;
}

async function markHostBookingCompleted(hostId, bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  if (booking.hostId !== hostId) {
    throw new AppError(403, 'Forbidden');
  }
  if (booking.status !== 'CONFIRMED') {
    throw new AppError(409, 'Only confirmed bookings can be marked completed');
  }
  booking.status = 'COMPLETED';
  await booking.save();
  await releaseSlotLockForBooking(booking);
  return booking;
}

async function adminOverrideBooking(bookingId, body, correlationId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  const { action } = body;
  if (action === 'confirm') {
    if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') {
      return booking;
    }
    if (booking.status === 'CANCELLED') {
      throw new AppError(409, 'Cannot confirm a cancelled booking');
    }
    booking.status = 'CONFIRMED';
    await booking.save();
    await releaseSlotLockForBooking(booking);
    await publishEvent(
      'booking.confirmed',
      {
        bookingId: booking._id.toString(),
        customerId: booking.customerId,
        hostId: booking.hostId,
        roomId: booking.roomId,
        slotType: booking.slotType,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalAmount: booking.totalAmount,
        source: 'admin_override',
        contactEmail: body.contactEmail || null,
        contactPhone: body.contactPhone || null,
        hostNotifyPhone: body.hostNotifyPhone || null,
      },
      correlationId
    );
    return booking;
  }
  if (action === 'cancel') {
    if (booking.status === 'CANCELLED') {
      return booking;
    }
    booking.status = 'CANCELLED';
    await booking.save();
    await releaseSlotLockForBooking(booking);
    await publishEvent(
      'booking.cancelled',
      {
        bookingId: booking._id.toString(),
        customerId: booking.customerId,
        hostId: booking.hostId,
        razorpayOrderId: booking.razorpayOrderId,
        reason: 'admin_override',
        contactEmail: body.contactEmail || null,
      },
      correlationId
    );
    return booking;
  }
  throw new AppError(400, 'Invalid action');
}

module.exports = {
  acquireSlotLockForUser,
  releaseSlotLockForCustomer,
  createBooking,
  attachRazorpayOrder,
  cancelBooking,
  getBookingForCustomer,
  listMyBookings,
  listHostBookings,
  listAllBookings,
  getBookingForHost,
  getBookingForAdmin,
  markHostBookingCompleted,
  adminOverrideBooking,
};
