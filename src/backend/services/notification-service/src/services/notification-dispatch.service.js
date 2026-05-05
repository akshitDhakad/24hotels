const NotificationLog = require('../models/notification-log.model');
const { sendMail } = require('./mailer.service');
const { sendSms } = require('./sms.service');
const { logger } = require('../utils/logger');

async function logNotification({
  recipient,
  channel,
  event,
  status,
  correlationId = null,
  bookingId = null,
  customerId = null,
  hostId = null,
  subject = null,
  errorMessage = null,
}) {
  const rec =
    channel === 'email' && recipient && recipient !== 'unknown'
      ? String(recipient).toLowerCase().trim()
      : String(recipient || 'unknown');
  await NotificationLog.create({
    recipient: rec,
    channel,
    event,
    status,
    correlationId,
    bookingId,
    customerId,
    hostId,
    subject,
    errorMessage,
  });
}

async function dispatchEmail(recipient, event, subject, text, meta = {}) {
  if (!recipient) {
    await logNotification({
      recipient: 'unknown',
      channel: 'email',
      event,
      status: 'skipped',
      ...meta,
    });
    return;
  }
  try {
    const r = await sendMail({ to: recipient, subject, text });
    await logNotification({
      recipient,
      channel: 'email',
      event,
      status: r.skipped ? 'skipped' : 'sent',
      subject,
      ...meta,
    });
  } catch (err) {
    logger.error('Email dispatch failed', { recipient, event, message: err.message });
    await logNotification({
      recipient,
      channel: 'email',
      event,
      status: 'failed',
      subject,
      errorMessage: err.message,
      ...meta,
    });
  }
}

async function dispatchSms(phone, event, text, meta = {}) {
  if (!phone) {
    await logNotification({
      recipient: 'unknown',
      channel: 'sms',
      event,
      status: 'skipped',
      ...meta,
    });
    return;
  }
  try {
    const r = await sendSms(phone, text);
    await logNotification({
      recipient: String(phone).trim(),
      channel: 'sms',
      event,
      status: r.skipped ? 'skipped' : 'sent',
      ...meta,
    });
  } catch (err) {
    logger.error('SMS dispatch failed', { phone, event, message: err.message });
    await logNotification({
      recipient: String(phone).trim(),
      channel: 'sms',
      event,
      status: 'failed',
      errorMessage: err.message,
      ...meta,
    });
  }
}

async function handleBookingConfirmed(payload, correlationId) {
  const customerEmail = payload.contactEmail;
  const customerPhone = payload.contactPhone;
  const hostPhone = payload.hostNotifyPhone;
  const bookingId = payload.bookingId || null;
  const customerId = payload.customerId || null;
  const hostId = payload.hostId || null;
  const textCustomer = `Your booking ${bookingId} is confirmed.`;
  const baseMeta = { correlationId, bookingId, customerId };
  await dispatchEmail(customerEmail, 'booking.confirmed', 'Booking confirmed', textCustomer, {
    ...baseMeta,
    subject: 'Booking confirmed',
  });
  await dispatchSms(customerPhone, 'booking.confirmed', textCustomer, baseMeta);
  await dispatchSms(hostPhone, 'booking.confirmed', `Booking ${bookingId} confirmed for your listing.`, {
    correlationId,
    bookingId,
    hostId,
  });
}

async function handleBookingCancelled(payload, correlationId) {
  const customerEmail = payload.contactEmail;
  const bookingId = payload.bookingId || null;
  const customerId = payload.customerId || null;
  const hostId = payload.hostId || null;
  const text = `Your booking ${bookingId} has been cancelled.`;
  await dispatchEmail(customerEmail, 'booking.cancelled', 'Booking cancelled', text, {
    correlationId,
    bookingId,
    customerId,
    hostId,
    subject: 'Booking cancelled',
  });
}

async function handlePaymentFailed(payload, correlationId) {
  const customerEmail = payload.contactEmail;
  const bookingId = payload.bookingId || null;
  const customerId = payload.customerId || null;
  const text = `Payment failed for booking ${bookingId || 'unknown'}.`;
  await dispatchEmail(customerEmail, 'payment.failed', 'Payment failed', text, {
    correlationId,
    bookingId,
    customerId,
    subject: 'Payment failed',
  });
}

async function handleBookingCreated(payload, correlationId) {
  const customerEmail = payload.contactEmail;
  const bookingId = payload.bookingId || null;
  const customerId = payload.customerId || null;
  const text = `We received your booking request ${bookingId}. Complete payment to confirm.`;
  await dispatchEmail(customerEmail, 'booking.created', 'Booking received', text, {
    correlationId,
    bookingId,
    customerId,
    subject: 'Booking received',
  });
}

module.exports = {
  handleBookingConfirmed,
  handleBookingCancelled,
  handlePaymentFailed,
  handleBookingCreated,
};
