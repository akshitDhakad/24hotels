const bookingService = require('../services/booking.service');

async function postLock(req, res) {
  const lock = await bookingService.acquireSlotLockForUser(req.user.id, req.body);
  res.status(201).json({ success: true, lock });
}

async function deleteLock(req, res) {
  const result = await bookingService.releaseSlotLockForCustomer(req.user.id, req.body);
  res.status(200).json({ success: true, ...result });
}

async function postBooking(req, res) {
  const booking = await bookingService.createBooking(req.user.id, req.body, req.correlationId);
  res.status(201).json({ success: true, booking });
}

async function putRazorpayOrder(req, res) {
  const booking = await bookingService.attachRazorpayOrder(
    req.user.id,
    req.params.id,
    req.body.razorpayOrderId
  );
  res.status(200).json({ success: true, booking });
}

async function deleteBooking(req, res) {
  await bookingService.cancelBooking(req.user.id, req.params.id, req.correlationId, {
    contactEmail: req.body && req.body.contactEmail,
  });
  res.status(200).json({ success: true, message: 'Booking cancelled' });
}

async function getMyBookings(req, res) {
  const result = await bookingService.listMyBookings(req.user.id, req.query);
  res.status(200).json({ success: true, ...result });
}

async function getBookingById(req, res) {
  const booking = await bookingService.getBookingForCustomer(req.user.id, req.params.id);
  res.status(200).json({ success: true, booking });
}

module.exports = {
  postLock,
  deleteLock,
  postBooking,
  putRazorpayOrder,
  deleteBooking,
  getMyBookings,
  getBookingById,
};
