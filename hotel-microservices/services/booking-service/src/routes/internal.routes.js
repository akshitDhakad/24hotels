const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireAuth } = require('../middlewares/requireAuth');
const internalBookingController = require('../controllers/internal-booking.controller');
const { mongoIdParamSchema, listQuerySchema, overrideSchema } = require('../schemas/booking.schemas');

const router = express.Router();

router.get(
  '/host/bookings',
  requireAuth(['host']),
  validateRequest(listQuerySchema, 'query'),
  asyncWrapper(internalBookingController.getInternalHostBookings)
);
router.get(
  '/host/bookings/:id',
  requireAuth(['host']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(internalBookingController.getInternalHostBookingById)
);
router.put(
  '/host/bookings/:id/complete',
  requireAuth(['host']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(internalBookingController.putInternalHostBookingComplete)
);

router.get(
  '/admin/bookings',
  requireAuth(['admin']),
  validateRequest(listQuerySchema, 'query'),
  asyncWrapper(internalBookingController.getInternalAdminBookings)
);
router.get(
  '/admin/bookings/:id',
  requireAuth(['admin']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(internalBookingController.getInternalAdminBookingById)
);
router.put(
  '/admin/bookings/:id/override',
  requireAuth(['admin']),
  validateRequest(mongoIdParamSchema, 'params'),
  validateRequest(overrideSchema),
  asyncWrapper(internalBookingController.putInternalAdminOverride)
);

module.exports = router;
