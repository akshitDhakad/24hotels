const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireAuth } = require('../middlewares/requireAuth');
const bookingController = require('../controllers/booking.controller');
const {
  lockAcquireSchema,
  lockReleaseSchema,
  createBookingSchema,
  razorpayOrderSchema,
  cancelBodySchema,
  mongoIdParamSchema,
  listQuerySchema,
} = require('../schemas/booking.schemas');

const router = express.Router();

router.post(
  '/lock',
  requireAuth(['customer']),
  validateRequest(lockAcquireSchema),
  asyncWrapper(bookingController.postLock)
);
router.delete(
  '/lock',
  requireAuth(['customer']),
  validateRequest(lockReleaseSchema),
  asyncWrapper(bookingController.deleteLock)
);
router.get(
  '/me',
  requireAuth(['customer']),
  validateRequest(listQuerySchema, 'query'),
  asyncWrapper(bookingController.getMyBookings)
);
router.get(
  '/:id',
  requireAuth(['customer']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(bookingController.getBookingById)
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
  validateRequest(mongoIdParamSchema, 'params'),
  validateRequest(razorpayOrderSchema),
  asyncWrapper(bookingController.putRazorpayOrder)
);
router.delete(
  '/:id',
  requireAuth(['customer']),
  validateRequest(mongoIdParamSchema, 'params'),
  validateRequest(cancelBodySchema),
  asyncWrapper(bookingController.deleteBooking)
);

module.exports = router;
