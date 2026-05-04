const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { requireAuth } = require('../middlewares/requireAuth');
const { validateRequest } = require('../middlewares/validateRequest');
const adminProxyController = require('../controllers/admin-proxy.controller');
const adminRoomController = require('../controllers/admin-room.controller');
const {
  mongoIdParamSchema,
  listBookingQuerySchema,
  adminUsersQuerySchema,
  overrideSchema,
  adminRoomListQuerySchema,
} = require('../schemas/host-admin.schemas');

const router = express.Router();

router.get(
  '/users',
  requireAuth(['admin']),
  validateRequest(adminUsersQuerySchema, 'query'),
  asyncWrapper(adminProxyController.getAdminUsers)
);
router.get(
  '/users/:id',
  requireAuth(['admin']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(adminProxyController.getAdminUserById)
);

router.get(
  '/rooms',
  requireAuth(['admin']),
  validateRequest(adminRoomListQuerySchema, 'query'),
  asyncWrapper(adminRoomController.getAdminRooms)
);
router.get(
  '/rooms/:id',
  requireAuth(['admin']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(adminRoomController.getAdminRoomById)
);
router.delete(
  '/rooms/:id',
  requireAuth(['admin']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(adminRoomController.deleteAdminRoom)
);

router.get(
  '/bookings',
  requireAuth(['admin']),
  validateRequest(listBookingQuerySchema, 'query'),
  asyncWrapper(adminProxyController.getAdminBookings)
);
router.get(
  '/bookings/:id',
  requireAuth(['admin']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(adminProxyController.getAdminBookingById)
);
router.put(
  '/bookings/:id/override',
  requireAuth(['admin']),
  validateRequest(mongoIdParamSchema, 'params'),
  validateRequest(overrideSchema),
  asyncWrapper(adminProxyController.putAdminBookingOverride)
);

module.exports = router;
