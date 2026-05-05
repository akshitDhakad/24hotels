const Booking = require('../models/booking.model');
const { publishEvent } = require('../events/publisher');
const { releaseSlotLockForBooking } = require('../utils/slot-lock.util');

async function handlePaymentConfirmed(message, correlationId) {
  const bookingId = message.bookingId;
  if (!bookingId) {
    return;
  }
  const booking = await Booking.findById(bookingId);
  if (!booking || booking.status !== 'PENDING') {
    return;
  }
  booking.status = 'CONFIRMED';
  if (message.razorpayPaymentId) {
    booking.razorpayPaymentId = message.razorpayPaymentId;
  }
  if (message.razorpayOrderId) {
    booking.razorpayOrderId = message.razorpayOrderId;
  }
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
      contactEmail: message.contactEmail || null,
      contactPhone: message.contactPhone || null,
      hostNotifyPhone: message.hostNotifyPhone || null,
    },
    correlationId
  );
}

async function handlePaymentFailed(message, correlationId) {
  const bookingId = message.bookingId;
  if (!bookingId) {
    return;
  }
  const booking = await Booking.findById(bookingId);
  if (!booking || booking.status === 'CANCELLED') {
    return;
  }
  if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') {
    return;
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
      reason: 'payment_failed',
      contactEmail: message.contactEmail || null,
    },
    correlationId
  );
}

module.exports = { handlePaymentConfirmed, handlePaymentFailed };
