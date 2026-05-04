const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { requireAuth } = require('../middlewares/requireAuth');
const { prepareRoomPayloadForCreate, prepareRoomPayloadForUpdate } = require('../middlewares/roomPayload');
const roomController = require('../controllers/room.controller');
const adminProxyController = require('../controllers/admin-proxy.controller');

const router = express.Router();

router.post('/rooms', requireAuth(['host']), prepareRoomPayloadForCreate, asyncWrapper(roomController.postRoom));
router.put('/rooms/:id', requireAuth(['host']), prepareRoomPayloadForUpdate, asyncWrapper(roomController.putRoom));
router.delete('/rooms/:id', requireAuth(['host']), asyncWrapper(roomController.deleteRoom));
router.get('/rooms/my', requireAuth(['host']), asyncWrapper(roomController.getMyRooms));
router.get('/bookings/my', requireAuth(['host']), asyncWrapper(adminProxyController.getMyHostBookings));

module.exports = router;
