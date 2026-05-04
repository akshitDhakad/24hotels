const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { requireAuth } = require('../middlewares/requireAuth');
const { validateRequest } = require('../middlewares/validateRequest');
const { prepareRoomPayloadForCreate, prepareRoomPayloadForUpdate } = require('../middlewares/roomPayload');
const roomController = require('../controllers/room.controller');
const hostBookingController = require('../controllers/host-booking.controller');
const { mongoIdParamSchema, listBookingQuerySchema } = require('../schemas/host-admin.schemas');

const router = express.Router();

router.get('/rooms/my', requireAuth(['host']), asyncWrapper(roomController.getMyRooms));
router.get(
  '/rooms/:id',
  requireAuth(['host']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(roomController.getRoomById)
);
router.post('/rooms', requireAuth(['host']), prepareRoomPayloadForCreate, asyncWrapper(roomController.postRoom));
router.put(
  '/rooms/:id',
  requireAuth(['host']),
  validateRequest(mongoIdParamSchema, 'params'),
  prepareRoomPayloadForUpdate,
  asyncWrapper(roomController.putRoom)
);
router.delete(
  '/rooms/:id',
  requireAuth(['host']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(roomController.deleteRoom)
);

router.get(
  '/bookings/my',
  requireAuth(['host']),
  validateRequest(listBookingQuerySchema, 'query'),
  asyncWrapper(hostBookingController.getMyHostBookings)
);
router.get(
  '/bookings/:id',
  requireAuth(['host']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(hostBookingController.getHostBookingById)
);
router.put(
  '/bookings/:id/complete',
  requireAuth(['host']),
  validateRequest(mongoIdParamSchema, 'params'),
  asyncWrapper(hostBookingController.putHostBookingComplete)
);

module.exports = router;
