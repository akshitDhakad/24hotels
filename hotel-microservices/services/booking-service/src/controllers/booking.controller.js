const bookingService = require('../services/booking.service');

async function postLock(req, res) {
  const result = await bookingService.acquireSlotLock(req.user.id, req.body, req.correlationId);
  res.status(201).json({ success: true, lock: result });
}

async function postBooking(req, res) {
  const booking = await bookingService.createBooking(req.user.id, req.body, req.correlationId);
  res.status(201).json({ success: true, booking });
}

async function putRazorpayOrder(req, res) {
  const booking = await bookingService.attachRazorpayOrder(req.user.id, req.params.id, req.body.razorpayOrderId);
  res.status(200).json({ success: true, booking });
}

async function deleteBooking(req, res) {
  await bookingService.cancelBooking(req.user.id, req.params.id, req.correlationId, {
    contactEmail: req.body && req.body.contactEmail,
  });
  res.status(200).json({ success: true, message: 'Booking cancelled' });
}

async function getMyBookings(req, res) {
  const bookings = await bookingService.listMyBookings(req.user.id);
  res.status(200).json({ success: true, bookings });
}

async function getInternalHostBookings(req, res) {
  const bookings = await bookingService.listHostBookings(req.user.id);
  res.status(200).json({ success: true, bookings });
}

async function getInternalAdminBookings(req, res) {
  const bookings = await bookingService.listAllBookings();
  res.status(200).json({ success: true, bookings });
}

async function putInternalAdminOverride(req, res) {
  const booking = await bookingService.adminOverrideBooking(req.params.id, req.body, req.correlationId);
  res.status(200).json({ success: true, booking });
}

module.exports = {
  postLock,
  postBooking,
  putRazorpayOrder,
  deleteBooking,
  getMyBookings,
  getInternalHostBookings,
  getInternalAdminBookings,
  putInternalAdminOverride,
};
