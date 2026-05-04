const searchService = require('../services/search.service');

async function getRooms(req, res) {
  const data = await searchService.searchRooms(req.query);
  res.status(200).json({ success: true, ...data });
}

async function getRoomById(req, res) {
  const data = await searchService.getRoomBySourceId(req.params.sourceRoomId);
  res.status(200).json({ success: true, ...data });
}

async function getCities(req, res) {
  const data = await searchService.listCities(req.query);
  res.status(200).json({ success: true, ...data });
}

module.exports = { getRooms, getRoomById, getCities };
