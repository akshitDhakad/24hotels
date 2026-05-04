const axios = require('axios');
const { getEnv } = require('../config/env');
const { AppError } = require('../utils/AppError');

function forwardHeaders(req) {
  return {
    Authorization: req.headers.authorization || '',
    'X-Correlation-Id': req.correlationId || '',
  };
}

function mapUpstreamError(err, fallbackMessage) {
  const status = err.response && err.response.status ? err.response.status : 502;
  const body = err.response && err.response.data;
  const message =
    body && typeof body.message === 'string'
      ? body.message
      : body && typeof body.error === 'string'
        ? body.error
        : fallbackMessage;
  throw new AppError(status, message);
}

async function getHostBookings(req) {
  const env = getEnv();
  const url = `${env.BOOKING_SERVICE_INTERNAL_URL}/api/v1/internal/host/bookings`;
  try {
    const { data } = await axios.get(url, {
      headers: forwardHeaders(req),
      params: req.query,
      timeout: 30000,
    });
    return data;
  } catch (err) {
    mapUpstreamError(err, 'Upstream booking service error');
  }
}

async function getHostBookingById(req, id) {
  const env = getEnv();
  const url = `${env.BOOKING_SERVICE_INTERNAL_URL}/api/v1/internal/host/bookings/${id}`;
  try {
    const { data } = await axios.get(url, { headers: forwardHeaders(req), timeout: 30000 });
    return data;
  } catch (err) {
    mapUpstreamError(err, 'Upstream booking service error');
  }
}

async function putHostBookingComplete(req, id) {
  const env = getEnv();
  const url = `${env.BOOKING_SERVICE_INTERNAL_URL}/api/v1/internal/host/bookings/${id}/complete`;
  try {
    const { data } = await axios.put(url, {}, { headers: forwardHeaders(req), timeout: 30000 });
    return data;
  } catch (err) {
    mapUpstreamError(err, 'Upstream booking service error');
  }
}

async function getAdminBookings(req) {
  const env = getEnv();
  const url = `${env.BOOKING_SERVICE_INTERNAL_URL}/api/v1/internal/admin/bookings`;
  try {
    const { data } = await axios.get(url, {
      headers: forwardHeaders(req),
      params: req.query,
      timeout: 30000,
    });
    return data;
  } catch (err) {
    mapUpstreamError(err, 'Upstream booking service error');
  }
}

async function getAdminBookingById(req, id) {
  const env = getEnv();
  const url = `${env.BOOKING_SERVICE_INTERNAL_URL}/api/v1/internal/admin/bookings/${id}`;
  try {
    const { data } = await axios.get(url, { headers: forwardHeaders(req), timeout: 30000 });
    return data;
  } catch (err) {
    mapUpstreamError(err, 'Upstream booking service error');
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
    mapUpstreamError(err, 'Upstream booking service error');
  }
}

async function getAdminUsers(req) {
  const env = getEnv();
  const url = `${env.AUTH_SERVICE_INTERNAL_URL}/api/v1/internal/admin/users`;
  try {
    const { data } = await axios.get(url, {
      headers: forwardHeaders(req),
      params: req.query,
      timeout: 30000,
    });
    return data;
  } catch (err) {
    mapUpstreamError(err, 'Upstream auth service error');
  }
}

async function getAdminUserById(req, id) {
  const env = getEnv();
  const url = `${env.AUTH_SERVICE_INTERNAL_URL}/api/v1/internal/admin/users/${id}`;
  try {
    const { data } = await axios.get(url, { headers: forwardHeaders(req), timeout: 30000 });
    return data;
  } catch (err) {
    mapUpstreamError(err, 'Upstream auth service error');
  }
}

module.exports = {
  getHostBookings,
  getHostBookingById,
  putHostBookingComplete,
  getAdminBookings,
  getAdminBookingById,
  putAdminBookingOverride,
  getAdminUsers,
  getAdminUserById,
};
