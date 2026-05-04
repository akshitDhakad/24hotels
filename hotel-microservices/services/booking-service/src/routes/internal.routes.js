const express = require('express');
const Joi = require('joi');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const { requireAuth } = require('../middlewares/requireAuth');
const bookingController = require('../controllers/booking.controller');

const router = express.Router();

const overrideSchema = Joi.object({
  action: Joi.string().valid('confirm', 'cancel').required(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().optional(),
  hostNotifyPhone: Joi.string().optional(),
});

router.get('/host/bookings', requireAuth(['host']), asyncWrapper(bookingController.getInternalHostBookings));
router.get('/admin/bookings', requireAuth(['admin']), asyncWrapper(bookingController.getInternalAdminBookings));
router.put(
  '/admin/bookings/:id/override',
  requireAuth(['admin']),
  validateRequest(overrideSchema),
  asyncWrapper(bookingController.putInternalAdminOverride)
);

module.exports = router;
