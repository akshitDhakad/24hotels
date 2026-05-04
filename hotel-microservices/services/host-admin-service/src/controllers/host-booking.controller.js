const internalHttp = require('../services/internal-http.service');

async function getMyHostBookings(req, res) {
  const data = await internalHttp.getHostBookings(req);
  res.status(200).json(data);
}

async function getHostBookingById(req, res) {
  const data = await internalHttp.getHostBookingById(req, req.params.id);
  res.status(200).json(data);
}

async function putHostBookingComplete(req, res) {
  const data = await internalHttp.putHostBookingComplete(req, req.params.id);
  res.status(200).json(data);
}

module.exports = {
  getMyHostBookings,
  getHostBookingById,
  putHostBookingComplete,
};
