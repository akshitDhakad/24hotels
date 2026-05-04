const express = require('express');
const { asyncWrapper } = require('../middlewares/asyncWrapper');
const { validateRequest } = require('../middlewares/validateRequest');
const searchController = require('../controllers/search.controller');
const {
  roomsQuerySchema,
  citiesQuerySchema,
  sourceRoomIdParamSchema,
} = require('../schemas/search.schemas');

const router = express.Router();

router.get('/meta/cities', validateRequest(citiesQuerySchema, 'query'), asyncWrapper(searchController.getCities));
router.get('/rooms', validateRequest(roomsQuerySchema, 'query'), asyncWrapper(searchController.getRooms));
router.get(
  '/rooms/:sourceRoomId',
  validateRequest(sourceRoomIdParamSchema, 'params'),
  asyncWrapper(searchController.getRoomById)
);

module.exports = router;
