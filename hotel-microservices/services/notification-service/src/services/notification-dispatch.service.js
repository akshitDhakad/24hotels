const NotificationLog = require('../models/notification-log.model');
const { sendMail } = require('./mailer.service');
const { sendSms } = require('./sms.service');
const { logger } = require('../utils/logger');

async function logNotification(recipient, channel, event, status) {
  await NotificationLog.create({
    recipient,
    channel,
    event,
    status,
    sentAt: new Date(),
  });
}

async function dispatchEmail(recipient, event, subject, text) {
  if (!recipient) {
    await logNotification('unknown', 'email', event, 'skipped');
    return;
  }
  try {
    const r = await sendMail({ to: recipient, subject, text });
    await logNotification(recipient, 'email', event, r.skipped ? 'skipped' : 'sent');
  } catch (err) {
    logger.error('Email dispatch failed', { recipient, event, message: err.message });
    await logNotification(recipient, 'email', event, 'failed');
  }
}

async function dispatchSms(phone, event, text) {
  if (!phone) {
    await logNotification('unknown', 'sms', event, 'skipped');
    return;
  }
  try {
    const r = await sendSms(phone, text);
    await logNotification(phone, 'sms', event, r.skipped ? 'skipped' : 'sent');
  } catch (err) {
    logger.error('SMS dispatch failed', { phone, event, message: err.message });
    await logNotification(phone, 'sms', event, 'failed');
  }
}

async function handleBookingConfirmed(payload) {
  const customerEmail = payload.contactEmail;
  const customerPhone = payload.contactPhone;
  const hostPhone = payload.hostNotifyPhone;
  const bookingId = payload.bookingId;
  const textCustomer = `Your booking ${bookingId} is confirmed.`;
  await dispatchEmail(customerEmail, 'booking.confirmed', 'Booking confirmed', textCustomer);
  await dispatchSms(customerPhone, 'booking.confirmed', textCustomer);
  await dispatchSms(hostPhone, 'booking.confirmed', `Booking ${bookingId} confirmed for your listing.`);
}

async function handleBookingCancelled(payload) {
  const customerEmail = payload.contactEmail;
  const bookingId = payload.bookingId;
  const text = `Your booking ${bookingId} has been cancelled.`;
  await dispatchEmail(customerEmail, 'booking.cancelled', 'Booking cancelled', text);
}

async function handlePaymentFailed(payload) {
  const customerEmail = payload.contactEmail;
  const bookingId = payload.bookingId;
  const text = `Payment failed for booking ${bookingId || 'unknown'}.`;
  await dispatchEmail(customerEmail, 'payment.failed', 'Payment failed', text);
}

async function handleBookingCreated(payload) {
  const customerEmail = payload.contactEmail;
  const bookingId = payload.bookingId;
  const text = `We received your booking request ${bookingId}. Complete payment to confirm.`;
  await dispatchEmail(customerEmail, 'booking.created', 'Booking received', text);
}

module.exports = {
  handleBookingConfirmed,
  handleBookingCancelled,
  handlePaymentFailed,
  handleBookingCreated,
};
