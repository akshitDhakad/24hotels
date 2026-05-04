const express = require('express');
const Joi = require('joi');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireAuth } = require('../middlewares/requireAuth');
const bookingController = require('../controllers/booking.controller');

const router = express.Router();

const slotType = Joi.number().valid(4, 8, 12, 16, 20, 24);

const lockSchema = Joi.object({
  roomId: Joi.string().required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  slotType: slotType.required(),
});

const createBookingSchema = Joi.object({
  roomId: Joi.string().required(),
  hostId: Joi.string().required(),
  slotType: slotType.required(),
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().required(),
  totalAmount: Joi.number().positive().required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().optional(),
  hostNotifyPhone: Joi.string().optional(),
});

const razorpayOrderSchema = Joi.object({
  razorpayOrderId: Joi.string().required(),
});

const cancelBodySchema = Joi.object({
  contactEmail: Joi.string().email().optional(),
});

router.post(
  '/lock',
  requireAuth(['customer']),
  validateRequest(lockSchema),
  asyncWrapper(bookingController.postLock)
);
router.post(
  '/',
  requireAuth(['customer']),
  validateRequest(createBookingSchema),
  asyncWrapper(bookingController.postBooking)
);
router.put(
  '/:id/razorpay-order',
  requireAuth(['customer']),
  validateRequest(razorpayOrderSchema),
  asyncWrapper(bookingController.putRazorpayOrder)
);
router.delete(
  '/:id',
  requireAuth(['customer']),
  validateRequest(cancelBodySchema),
  asyncWrapper(bookingController.deleteBooking)
);
router.get('/me', requireAuth(['customer']), asyncWrapper(bookingController.getMyBookings));

module.exports = router;
