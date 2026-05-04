const internalHttp = require('../services/internal-http.service');

async function getAdminUsers(req, res) {
  const data = await internalHttp.getAdminUsers(req);
  res.status(200).json(data);
}

async function getAdminUserById(req, res) {
  const data = await internalHttp.getAdminUserById(req, req.params.id);
  res.status(200).json(data);
}

async function getAdminBookings(req, res) {
  const data = await internalHttp.getAdminBookings(req);
  res.status(200).json(data);
}

async function getAdminBookingById(req, res) {
  const data = await internalHttp.getAdminBookingById(req, req.params.id);
  res.status(200).json(data);
}

async function putAdminBookingOverride(req, res) {
  const data = await internalHttp.putAdminBookingOverride(req, req.params.id);
  res.status(200).json(data);
}

module.exports = {
  getAdminUsers,
  getAdminUserById,
  getAdminBookings,
  getAdminBookingById,
  putAdminBookingOverride,
};
