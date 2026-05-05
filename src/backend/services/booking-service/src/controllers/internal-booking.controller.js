const bookingService = require('../services/booking.service');

async function getInternalHostBookings(req, res) {
  const result = await bookingService.listHostBookings(req.user.id, req.query);
  res.status(200).json({ success: true, ...result });
}

async function getInternalHostBookingById(req, res) {
  const booking = await bookingService.getBookingForHost(req.user.id, req.params.id);
  res.status(200).json({ success: true, booking });
}

async function putInternalHostBookingComplete(req, res) {
  const booking = await bookingService.markHostBookingCompleted(req.user.id, req.params.id);
  res.status(200).json({ success: true, booking });
}

async function getInternalAdminBookings(req, res) {
  const result = await bookingService.listAllBookings(req.query);
  res.status(200).json({ success: true, ...result });
}

async function getInternalAdminBookingById(req, res) {
  const booking = await bookingService.getBookingForAdmin(req.params.id);
  res.status(200).json({ success: true, booking });
}

async function putInternalAdminOverride(req, res) {
  const booking = await bookingService.adminOverrideBooking(req.params.id, req.body, req.correlationId);
  res.status(200).json({ success: true, booking });
}

module.exports = {
  getInternalHostBookings,
  getInternalHostBookingById,
  putInternalHostBookingComplete,
  getInternalAdminBookings,
  getInternalAdminBookingById,
  putInternalAdminOverride,
};
