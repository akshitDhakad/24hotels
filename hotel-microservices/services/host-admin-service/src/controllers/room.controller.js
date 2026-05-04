const roomService = require('../services/room.service');

async function postRoom(req, res) {
  const room = await roomService.createRoom(req.user.id, req.roomPayload, req.files, req.correlationId);
  res.status(201).json({ success: true, room });
}

async function putRoom(req, res) {
  const room = await roomService.updateRoom(req.user.id, req.params.id, req.roomPayload, req.files, req.correlationId);
  res.status(200).json({ success: true, room });
}

async function deleteRoom(req, res) {
  const room = await roomService.softDeleteRoom(req.user.id, req.params.id, req.correlationId);
  res.status(200).json({ success: true, room });
}

async function getMyRooms(req, res) {
  const rooms = await roomService.listMyRooms(req.user.id);
  res.status(200).json({ success: true, rooms });
}

async function getRoomById(req, res) {
  const room = await roomService.getRoomForHost(req.user.id, req.params.id);
  res.status(200).json({ success: true, room });
}

module.exports = {
  postRoom,
  putRoom,
  deleteRoom,
  getMyRooms,
  getRoomById,
};
