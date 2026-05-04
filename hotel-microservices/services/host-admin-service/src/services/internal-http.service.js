const axios = require('axios');
const { getEnv } = require('../config/env');
const { AppError } = require('../utils/AppError');

function forwardHeaders(req) {
  return {
    Authorization: req.headers.authorization || '',
    'X-Correlation-Id': req.correlationId,
  };
}

async function getHostBookings(req) {
  const env = getEnv();
  const url = `${env.BOOKING_SERVICE_INTERNAL_URL}/api/v1/internal/host/bookings`;
  try {
    const { data } = await axios.get(url, { headers: forwardHeaders(req), timeout: 30000 });
    return data;
  } catch (err) {
    const status = err.response && err.response.status ? err.response.status : 502;
    const message = err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Upstream booking service error';
    throw new AppError(status, message);
  }
}

async function getAdminBookings(req) {
  const env = getEnv();
  const url = `${env.BOOKING_SERVICE_INTERNAL_URL}/api/v1/internal/admin/bookings`;
  try {
    const { data } = await axios.get(url, { headers: forwardHeaders(req), timeout: 30000 });
    return data;
  } catch (err) {
    const status = err.response && err.response.status ? err.response.status : 502;
    const message = err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Upstream booking service error';
    throw new AppError(status, message);
  }
}

async function putAdminBookingOverride(req, id) {
  const env = getEnv();
  const url = `${env.BOOKING_SERVICE_INTERNAL_URL}/api/v1/internal/admin/bookings/${id}/override`;
  try {
    const { data } = await axios.put(url, req.body, {
      headers: { ...forwardHeaders(req), 'Content-Type': 'application/json' },
      timeout: 30000,
    });
    return data;
  } catch (err) {
    const status = err.response && err.response.status ? err.response.status : 502;
    const message = err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Upstream booking service error';
    throw new AppError(status, message);
  }
}

async function getAdminUsers(req) {
  const env = getEnv();
  const url = `${env.AUTH_SERVICE_INTERNAL_URL}/api/v1/internal/admin/users`;
  try {
    const { data } = await axios.get(url, { headers: forwardHeaders(req), timeout: 30000 });
    return data;
  } catch (err) {
    const status = err.response && err.response.status ? err.response.status : 502;
    const message = err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Upstream auth service error';
    throw new AppError(status, message);
  }
}

module.exports = {
  getHostBookings,
  getAdminBookings,
  putAdminBookingOverride,
  getAdminUsers,
};
