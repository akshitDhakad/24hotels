const express = require('express');
const Joi = require('joi');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { requireAuth } = require('../middlewares/requireAuth');
const { validateRequest } = require('../middlewares/validateRequest');
const adminProxyController = require('../controllers/admin-proxy.controller');

const router = express.Router();

const overrideSchema = Joi.object({
  action: Joi.string().valid('confirm', 'cancel').required(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().optional(),
  hostNotifyPhone: Joi.string().optional(),
});

router.get('/users', requireAuth(['admin']), asyncWrapper(adminProxyController.getAdminUsers));
router.get('/bookings', requireAuth(['admin']), asyncWrapper(adminProxyController.getAdminBookings));
router.put(
  '/bookings/:id/override',
  requireAuth(['admin']),
  validateRequest(overrideSchema),
  asyncWrapper(adminProxyController.putAdminBookingOverride)
);

module.exports = router;
